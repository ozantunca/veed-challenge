import { z } from "zod";

export const videoSortSchema = z.enum(["newest", "oldest"]);

const tagListSchema = z
  .array(z.string().trim().min(1).max(64))
  .max(32);

export const createVideoBodySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(500, "Title is too long"),
  description: z.preprocess(
    (val) => (val === undefined || val === null ? "" : val),
    z.string().max(10_000, "Description is too long"),
  ),
  tags: z.preprocess(
    (val) => (Array.isArray(val) ? val : []),
    tagListSchema,
  ),
});

export type CreateVideoBody = z.infer<typeof createVideoBodySchema>;

export const createVideoFormSchema = createVideoBodySchema;

export const updateVideoBodySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(500, "Title is too long"),
  description: z.preprocess(
    (val) => (val === undefined || val === null ? "" : val),
    z.string().max(10_000, "Description is too long"),
  ),
  tags: z.preprocess(
    (val) => (Array.isArray(val) ? val : []),
    tagListSchema,
  ),
});

export type UpdateVideoBody = z.infer<typeof updateVideoBodySchema>;

export const updateVideoFormSchema = updateVideoBodySchema;

export const videoIdParamSchema = z.coerce.number().int().positive();
