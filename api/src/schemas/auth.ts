import { z } from "zod";

export const registerBody = z.object({
  email: z.email(),
  password: z.string().min(8).max(72), // 72 = limite pratique pour bcrypt, bonne borne aussi pour argon2
});

export const loginBody = z.object({
  email: z.email(),
  password: z.string().min(1),
});