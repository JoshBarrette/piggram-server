import { z } from "zod";

export const PostDto = z.object({
  poster: z.string(),
  caption: z.optional(z.string().max(255)),
});

export type PostDto = z.infer<typeof PostDto>;
