import { z } from "zod";

export const idParam = z.object({ id: z.coerce.number().int().positive() });

export const listQuery = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(12),
  skip: z.coerce.number().int().min(0).default(0),
  q: z.string().trim().optional(),
  category: z.string().optional(),
});

export const productBody = z.object({
  title: z.string().min(2),
  description: z.string().min(1),
  price: z.number().positive(),
  thumbnail: z.url(),
  stock: z.number().int().min(0).default(0),
  category: z.string().min(1),          // category name, created if missing
});

export const productPatch = productBody.partial(); // every field optional for PATCH