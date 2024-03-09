import {
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

@Controller("posts")
export class PostsController {
  constructor(
    @InjectModel(PostSchema.name) private postModel: Model<PostSchema>,
  ) {}

  @Post("new")
  @UseGuards(AuthedGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async handleNewPost(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    return { user: req.user, files };
  }
}
