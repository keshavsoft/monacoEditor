import dotenv from "dotenv";
import express from "express";
import dotenv from "dotenv";
import express from "express";

dotenv.config({ path: ".env" });

const app = express();
const app = express();
const app = express();

app.use("/api", routerFromapi);

if (process.env.OPEN_BROWSER === "true") {
    // exec("start http://localhost:3000");
}
