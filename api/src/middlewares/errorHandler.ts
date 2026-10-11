import type { ErrorRequestHandler } from "express";
import { Prisma } from "../generated/prisma/client.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // Prisma: record to update/delete does not exist
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
    return res.status(404).json({ error: "Not found" });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
  return res.status(409).json({ error: "Already exists" });
}
};