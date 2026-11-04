import dotenv from "dotenv";
import express from "express";
import { router as apiRouter } from "./api/routes.js";

dotenv.config({ path: ".env" });

const app = express();

app.use("/api", apiRouter);

export { app };
