import { z } from "zod";

export const MAX_FILE_SIZE = 5000000; //5MB
export const VALID_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const ImageSchema = z.object({
  image: z
    .any()
    .refine((file: Express.Multer.File) => file?.size !== 0, "File is required")
    .refine(
      (file: Express.Multer.File) => file.size < MAX_FILE_SIZE,
      "Max image size is 5MB.",
    )
    .refine(
      (file: Express.Multer.File) => VALID_FILE_TYPES.includes(file.mimetype),
      "Invalid image type",
    ),
});
