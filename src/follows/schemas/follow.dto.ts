import { z } from "zod";

export const FollowDto = z.object({
  followerId: z.string(),
  followingId: z.string(),
});

export type FollowDto = z.infer<typeof FollowDto>;
