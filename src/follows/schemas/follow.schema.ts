import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { User } from "src/users/schemas/user.schema";

export type FollowDocument = HydratedDocument<Follow>;

@Schema({ timestamps: true })
export class Follow {
  get _id(): string {
    return this._id;
  }

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  })
  followerId: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  })
  followingId: User;

  get createdAt(): Date {
    return this.createdAt;
  }

  get updatedAt(): Date {
    return this.updatedAt;
  }
}

export const FollowSchema = SchemaFactory.createForClass(Follow);
