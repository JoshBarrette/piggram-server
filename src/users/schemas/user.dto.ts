import { z } from "zod";

export const UserDto = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string().optional(),
  picture: z.string(),
  bio: z.optional(z.string().max(255)),
});

export type UserDto = z.infer<typeof UserDto>;
