import type { RequestHandler } from "express";
import type { ZodType } from "zod";

export const validate =
  (schema: ZodType, source: "body" | "params" | "query" = "body"): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return res.status(400).json({ error: "Validation failed", details: result.error.issues });
    }
    // Express 5: req.query is read-only, so keep the parsed values elsewhere
    res.locals[source] = result.data;
    next();
  };