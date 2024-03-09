import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { User } from "src/users/schemas/user.schema";

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  get _id(): string {
    return this._id;
  }

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  })
  posterId: User;

  @Prop({ required: true, maxlength: 9 })
  imageUrls: string[];

  @Prop({ maxlength: 255 })
  caption: string;

  get createdAt(): Date {
    return this.createdAt;
  }

  get updatedAt(): Date {
    return this.updatedAt;
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);
