import { Module } from "@nestjs/common";
import { FollowsService } from "./follows.service";
import { FollowsController } from "./follows.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Follow, FollowSchema } from "./schemas/follow.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Follow.name, schema: FollowSchema }]),
  ],
  providers: [FollowsService],
  controllers: [FollowsController],
})
export class FollowsModule {}
