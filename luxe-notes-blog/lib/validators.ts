import { z } from "zod";

export const postInputSchema = z.object({
  title: z.string().min(3).max(120),
  slug: z
    .string()
    .min(3)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
  excerpt: z.string().min(12).max(240),
  content: z.string().min(30),
  coverImage: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  published: z.boolean().default(true)
});

export type PostInput = z.infer<typeof postInputSchema>;
