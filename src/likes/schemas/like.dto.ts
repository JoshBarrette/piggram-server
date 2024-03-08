import { z } from "zod";

export const LikeDto = z.object({
  likerId: z.string(),
  postId: z.string(),
});

export type LikeDto = z.infer<typeof LikeDto>;
