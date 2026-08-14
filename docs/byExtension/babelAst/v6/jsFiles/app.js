import { exec } from "child_process";
import dotenv from "dotenv";
import express from "express";

import { router as routerFromapi } from "./api/routes.js";
import setupRoutes from "./routes.js";
import startServer from "./server.js";

dotenv.config({ path: ".env" });

const app = express();

setupRoutes(app);

const { port } = startServer(app);

app.use(
    "/api",
    routerFromapi
);

if (process.env.OPEN_BROWSER === "true") {
    // exec(
    //     `start http://localhost:${port}/v28/quotations/index.html`
    // );
};