import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { Model } from "mongoose";
import { AuthedGuard } from "src/auth/guards/authed/authed.guard";
import { Post as PostSchema } from "./schemas/post.schema";
import { UploadService } from "src/upload/upload.service";

@Controller("posts")
export class PostsController {
  constructor(
    @InjectModel(PostSchema.name) private readonly postModel: Model<PostSchema>,
    private readonly uploadService: UploadService,
  ) {}

  @Post("new")
  @UseGuards(AuthedGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async handleNewPost(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
    @Body("caption") caption?: string,
  ) {
    return {
      res: await this.uploadService.uploadFile(
        req.user.userId + "-0",
        files[0],
      ),
      caption: caption ?? "no caption",
    };
  }
}
