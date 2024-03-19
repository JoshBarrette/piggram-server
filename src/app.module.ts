import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "./users/users.module";
import { MongooseModule } from "@nestjs/mongoose";
import { PostsModule } from "./posts/posts.module";
import { FollowsModule } from "./follows/follows.module";
import { LikesModule } from "./likes/likes.module";
import { UploadService } from "./upload/upload.service";
import { UploadModule } from "./upload/upload.module";
import { SharedModule } from './shared/shared.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "12h" },
    }),
    AuthModule,
    UsersModule,
    MongooseModule.forRoot(process.env.MONGO_DB_URL),
    PostsModule,
    FollowsModule,
    LikesModule,
    UploadModule,
    SharedModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [UploadService],
})
export class AppModule {}
