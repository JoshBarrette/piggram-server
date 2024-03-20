import { Injectable, UnauthorizedException } from "@nestjs/common";
import { CommentDto } from "./schemas/comment.dto";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Comment } from "./schemas/comment.schema";
import { UsersService } from "src/users/users.service";
import { PostsService } from "src/posts/posts.service";
import { Request } from "express";

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  async handleGetPostComments(postID: string) {
    return await this.commentModel
      .find({ post: postID })
      .populate("commenter", "firstName lastName picture _id");
  }

  async handleCommentDelete(commentID: string, req: Request) {
    try {
      const comment = await this.commentModel.findById(commentID);

      if (comment.commenter._id.toString() !== req.user.userId) {
        throw new UnauthorizedException();
      }

      await this.commentModel.deleteOne({ _id: commentID });
      await this.postsService.incrementCommentCount(-1, comment.post._id);
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  }

  async addComment(comment: CommentDto) {
    if (!CommentDto.safeParse(comment).success) {
      return { success: false, error: "Invalid comment." };
    }

    await this.commentModel.create({ ...comment });
    await this.postsService.incrementCommentCount(1, comment.post);

    return { success: true };
  }
}
