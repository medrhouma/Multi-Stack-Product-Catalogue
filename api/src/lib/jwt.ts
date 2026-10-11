import jwt from "jsonwebtoken";

export interface AuthUser {
  id: number;
  email: string;
}

const EXPIRES_IN_SECONDS = 60 * 60; // 1 heure

function secret(): string {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET is not set");
  return s;
}

export function signToken(user: AuthUser): string {
  return jwt.sign({ email: user.email }, secret(), {
    subject: String(user.id),
    expiresIn: EXPIRES_IN_SECONDS,
    algorithm: "HS256",
  });
}

export function verifyToken(token: string): AuthUser {
  const payload = jwt.verify(token, secret(), { algorithms: ["HS256"] });
  if (typeof payload === "string" || !payload.sub || typeof payload.email !== "string") {
    throw new Error("Invalid token payload");
  }
  return { id: Number(payload.sub), email: payload.email };
}