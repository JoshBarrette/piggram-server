import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Post } from "src/posts/schemas/post.schema";
import { User } from "src/users/schemas/user.schema";

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  get _id(): string {
    return this._id;
  }

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
    index: true,
  })
  post: Post;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  })
  commenter: User;

  @Prop({ required: true, maxlength: 255 })
  content: string;

  get createdAt(): Date {
    return this.createdAt;
  }

  get updatedAt(): Date {
    return this.updatedAt;
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
