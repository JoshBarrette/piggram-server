import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from './users/users.module';
import { MongooseModule } from "@nestjs/mongoose";
import { AuthService } from "./auth/auth.service";
import { PostsModule } from './posts/posts.module';
import { FollowsModule } from './follows/follows.module';
import { LikesModule } from './likes/likes.module';

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
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
