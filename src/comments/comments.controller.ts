import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { CommentDto } from "./schemas/comment.dto";

@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post("/new")
  @UseInterceptors(AnyFilesInterceptor())
  async handleNewComment(@Body() comment: CommentDto) {
    return this.commentsService.addComment({ ...comment });
  }
}
