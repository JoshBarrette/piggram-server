import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { CommentDto } from "./schemas/comment.dto";
import { AuthedGuard } from "src/auth/guards/authed/authed.guard";
import { Request } from "express";

@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(":postID")
  async handleGetPostComments(@Param("postID") postID: string) {
    return await this.commentsService.handleGetPostComments(postID);
  }

  @Delete("delete/:commentID")
  @UseGuards(AuthedGuard)
  async handleCommentDelete(
    @Param("commentID") commentID: string,
    @Req() req: Request,
  ) {
    return await this.commentsService.handleCommentDelete(commentID, req);
  }

  @Post("/new")
  @UseInterceptors(AnyFilesInterceptor())
  async handleNewComment(@Body() comment: CommentDto) {
    return this.commentsService.addComment({ ...comment });
  }
}
