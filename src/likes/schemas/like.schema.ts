import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { User } from "src/users/schemas/user.schema";
import { Post } from "src/posts/schemas/post.schema";

export type LikeDocument = HydratedDocument<Like>;

@Schema({ timestamps: true })
export class Like {
  get _id(): string {
    return this._id;
  }

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  })
  likerId: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
    index: true,
  })
  postId: Post;

  get createdAt(): Date {
    return this.createdAt;
  }

  get updatedAt(): Date {
    return this.updatedAt;
  }
}

export const LikeSchema = SchemaFactory.createForClass(Like);
