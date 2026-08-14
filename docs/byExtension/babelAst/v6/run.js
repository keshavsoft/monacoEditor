import fs from "node:fs";
import { parse } from "@babel/parser";

import { processAst } from "./astHandlers.js";

const filePath = "./jsFiles/app.js";

const source = fs.readFileSync(filePath, "utf8");

const ast = parse(source, {
    sourceType: "module"
});

const results = processAst(ast, source);

fs.writeFileSync(
    "./run-output.json",
    JSON.stringify(results, null, 2),
    "utf8"
);

console.log("AST processing completed.");