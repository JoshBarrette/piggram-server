import { Module } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Post, PostSchema } from "./schemas/post.schema";
import { AuthModule } from "src/auth/auth.module";
import { UploadModule } from "src/upload/upload.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    AuthModule,
    UploadModule,
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
