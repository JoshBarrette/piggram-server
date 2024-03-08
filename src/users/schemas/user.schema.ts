import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  get _id(): string {
    return this._id;
  }

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ required: true })
  picture: string;

  @Prop({ default: 0 })
  followingCount: number;

  @Prop({ default: 0 })
  followersCount: number;

  @Prop({ maxlength: 255, default: null })
  bio: string | null;

  @Prop({ default: false })
  admin: boolean;

  @Prop({ default: false })
  banned: boolean;

  get createdAt(): Date {
    return this.createdAt;
  }

  get updatedAt(): Date {
    return this.updatedAt;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
