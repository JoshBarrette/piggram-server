import {
  Controller,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { AuthedGuard } from "src/auth/guards/authed/authed.guard";

@Controller("posts")
export class PostsController {
  @Post("new")
  @UseGuards(AuthedGuard)
  @UseInterceptors(AnyFilesInterceptor())
  handleNewPost(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    return { user: req.user, files };
  }
}
