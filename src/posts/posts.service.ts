import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Post as PostSchema } from "./schemas/post.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UploadService } from "src/upload/upload.service";
import { ImageSchema } from "./schemas/image.schema";
import { SharedService } from "src/shared/shared.service";
import { Request } from "express";

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(PostSchema.name) private readonly postModel: Model<PostSchema>,
    private readonly uploadService: UploadService,
    private readonly sharedService: SharedService,
  ) {}

  /**
   * Get all posts from the DB.
   * @returns All posts.
   */
  async handleGetAllPosts() {
    return await this.postModel
      .find()
      .populate("poster", "_id firstName lastName picture")
      .sort({ _id: -1 });
  }

  /**
   * Delete a single post.
   * @param id The id of the post to delete.
   * @param req The request.
   * @returns JSON with success flag.
   */
  async handleDeletePost(id: string, req: Request) {
    const idIsValid = this.sharedService.verifyMongooseID(id);
    if (!idIsValid) {
      throw new BadRequestException();
    }

    const post = await this.postModel.findById(id);
    if (post.poster._id.toString() !== req.user.userId) {
      throw new UnauthorizedException();
    }

    post.imageUrls.forEach(async (image) => {
      await this.uploadService.deleteFile(image.split("/")[1]);
    });

    await this.postModel.deleteOne({ _id: post._id });
    return { success: true };
  }

  /**
   * Handles the /posts/new endpoint and creates a new post.
   * @param files The images files to upload.
   * @param posterId The ID of the poster.
   * @param caption The caption for the post.
   * @returns The new post.
   */
  async handleNewPost(
    files: Express.Multer.File[],
    posterId: string,
    caption?: string,
  ) {
    const filesAreValid = this.verifyImages(files);
    const idIsValid = this.sharedService.verifyMongooseID(posterId);
    if (!filesAreValid.success) {
      return filesAreValid.error;
    } else if (!idIsValid) {
      return { error: "Invalid posterId" };
    }

    const newPost = await this.createBlankPost(posterId, caption);
    try {
      const imageURLs = await this.uploadService.uploadFiles(
        files,
        newPost._id,
      );
      return await this.updatePostImages(imageURLs, newPost._id);
    } catch (e) {
      await this.postModel.deleteOne({ _id: newPost._id });
      throw e;
    }
  }

  /**
   * Gets a post given its ID.
   * @param id The ID of the post to get.
   * @returns The post.
   */
  async handleGetPost(id: string): Promise<PostSchema> {
    if (!this.sharedService.verifyMongooseID(id)) {
      throw new BadRequestException("Invalid post id");
    }

    return await this.postModel
      .findById(id)
      .populate("poster", "_id firstName lastName picture");
  }

  /**
   * Gets all posts from a user given their ID.
   * @param id The ID of the user posts we want.
   * @returns Their posts.
   */
  async handleGetPostsByUser(id: string): Promise<PostSchema[]> {
    if (!this.sharedService.verifyMongooseID(id)) {
      throw new BadRequestException("Invalid user id");
    }

    // TODO: pagination
    return await this.postModel.find({ posterId: id });
  }

  /**
   * Validates all image files with zod.
   * @param files The images to validate.
   * @returns JSON with success flag. If false, error field that
   * contains zod error message.
   */
  verifyImages(files: Express.Multer.File[]): {
    success: boolean;
    error?: string;
  } {
    for (let i = 0; i < files.length; i++) {
      const im = ImageSchema.safeParse({ image: files[i] });
      if (im.success === false) {
        return { success: false, error: im.error.errors[0].message };
      }
    }

    return { success: true };
  }

  /**
   * Creates a new blank post with no images attached to it.
   * @param poster The ID of the poser.
   * @param caption The caption/description of the post.
   * @returns The newly created post.
   */
  async createBlankPost(poster: string, caption?: string): Promise<PostSchema> {
    return await this.postModel.create({ poster, caption });
  }

  /**
   * Updates the images on a post via replacement.
   * @param imageURLs The new image URLs.
   * @param postId The ID the post to update.
   * @returns The updated post from mongoose.
   */
  async updatePostImages(
    imageURLs: string[],
    postId: string,
  ): Promise<PostSchema> {
    await this.postModel.findOneAndUpdate(
      { _id: postId },
      { $set: { imageUrls: imageURLs } },
    );

    return await this.postModel.findById(postId);
  }

  async incrementCommentCount(inc: number, postId: string) {
    await this.postModel.updateOne(
      { _id: postId },
      { $inc: { comments: inc } },
    );
  }
}
