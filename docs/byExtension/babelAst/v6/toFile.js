import fs from "node:fs";
import { parse } from "@babel/parser";

const filePath = "./jsFiles/app.js";

const source = fs.readFileSync(filePath, "utf8");

const ast = parse(source, {
    sourceType: "module"
});

fs.writeFileSync(
    "./ast-output.json",
    JSON.stringify(ast, null, 2),
    "utf8"
);