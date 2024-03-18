import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { AuthedGuard } from "src/auth/guards/authed/authed.guard";
import { PostsService } from "./posts.service";

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * Get all posts from the DB.
   * @returns All posts.
   */
  @Get("/all")
  async handleGetAllPosts() {
    return this.postsService.handleGetAllPosts();
  }

  /**
   * Gets a post given its ID.
   * @param id The ID of the post to get.
   * @returns The post.
   */
  @Get(":id")
  async handleGetPost(@Param("id") id: string) {
    try {
      return this.postsService.handleGetPost(id);
    } catch (e) {
      return {
        error: e,
      };
    }
  }

  /**
   * Delete a single post.
   * @param id The id of the post to delete.
   * @param req The request.
   * @returns JSON with success flag.
   */
  @Delete("delete/:id")
  @UseGuards(AuthedGuard)
  async handleDeletePost(@Param("id") id: string, @Req() req: Request) {
    return this.postsService.handleDeletePost(id, req);
  }

  /**
   * Gets all posts from a user given their ID.
   * @param id The ID of the user posts we want.
   * @returns Their posts.
   */
  @Get("/user/:id")
  async handleGetPostsByUser(@Param("id") id: string) {
    try {
      return this.postsService.handleGetPostsByUser(id);
    } catch (e) {
      return {
        error: e,
      };
    }
  }

  /**
   * Handles creating a new post.
   * @param files The images to upload.
   * @param req The request.
   * @param caption The caption for the post.
   * @returns JSON with success flag and the post of successful.
   */
  @Post("new")
  @UseGuards(AuthedGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async handleNewPost(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
    @Body("caption") caption?: string,
  ) {
    try {
      return {
        success: true,
        newPost: await this.postsService.handleNewPost(
          files,
          req.user.userId,
          caption,
        ),
      };
    } catch (e) {
      return {
        success: false,
        error: e,
      };
    }
  }
}
