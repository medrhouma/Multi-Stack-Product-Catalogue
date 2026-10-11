import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { authRouter } from "./routes/auth.js";

import { categoriesRouter } from "./routes/categories.js";
import { productsRouter } from "./routes/products.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export const app = express();

app.use(helmet());                                        // security headers
app.use(cors({ origin: ["http://localhost:4200", "http://localhost:3000"] })); // allowed front-ends
app.use(morgan("dev"));                                   // request log
app.use(express.json());                                  // parse JSON bodies
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use(errorHandler);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});