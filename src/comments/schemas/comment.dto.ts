import { z } from "zod";

export const CommentDto = z.object({
  content: z.string().max(255),
  commenter: z.string(),
  post: z.string(),
});

export type CommentDto = z.infer<typeof CommentDto>;
