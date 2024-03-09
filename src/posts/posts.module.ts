import { Module, Post } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { PostSchema } from "./schemas/post.schema";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    AuthModule,
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
