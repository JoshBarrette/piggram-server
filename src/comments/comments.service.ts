import { Injectable } from "@nestjs/common";
import { CommentDto } from "./schemas/comment.dto";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Comment } from "./schemas/comment.schema";
import { UsersService } from "src/users/users.service";
import { PostsService } from "src/posts/posts.service";

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  async addComment(comment: CommentDto) {
    console.log(comment);
    if (!CommentDto.safeParse(comment).success) {
      return { success: false, error: "Invalid comment." };
    }

    await this.commentModel.create({ ...comment });
    await this.postsService.incrementCommentCount(1, comment.post);

    return { success: true };
  }
}
