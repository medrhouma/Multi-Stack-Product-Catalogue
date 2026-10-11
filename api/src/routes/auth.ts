import { Router } from "express";
import { hash, verify } from "argon2";
import { prisma } from "../lib/prisma.js";
import { signToken } from "../lib/jwt.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { validate } from "../middlewares/validate.js";
import { loginBody, registerBody } from "../schemas/auth.js";

export const authRouter = Router();

authRouter.post("/register", validate(registerBody), async (_req, res) => {
  const { email, password } = res.locals.body;
  const user = await prisma.user.create({
    data: { email: email.toLowerCase(), passwordHash: await hash(password) },
    select: { id: true, email: true, createdAt: true }, // jamais le hash
  });
  res.status(201).json(user);
});

authRouter.post("/login", validate(loginBody), async (_req, res) => {
  const { email, password } = res.locals.body;
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  const valid = user !== null && (await verify(user.passwordHash, password));

  if (!user || !valid) {
    // même message dans les deux cas : on ne révèle pas si l'e-mail existe
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  res.json({ token: signToken({ id: user.id, email: user.email }), user: { id: user.id, email: user.email } });
});

authRouter.get("/me", requireAuth, (_req, res) => {
  res.json(res.locals.user);
});