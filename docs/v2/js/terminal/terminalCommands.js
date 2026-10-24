/**
 * @file terminalCommands.js
 * @description Command dispatcher and interpreter for the terminal interface.
 * Parses user input lines, resolves commands such as 'node <file>', 'run',
 * 'clear', 'cls', 'dir', 'files', 'cat', 'echo', and evaluates raw JS expressions.
 * Directly addresses the user's issue where 'node sample.js' showed 'Command not found'.
 */

import { state } from "../state/state.js";
import { executeJsSandbox } from "./terminalRunner.js";

export function handleTerminalCommand(rawCommand, printLine, clearTerminal) {
  const trimmed = rawCommand.trim();
  if (!trimmed) return;

  const parts = trimmed.split(/\s+/);
  const mainCmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (mainCmd) {
    case "help":
    case "?":
      printLine("Available KeshavSoft Editor Terminal Commands:", "info");
      printLine("  node <file>    - Run a JavaScript file (e.g. node sample.js)");
      printLine("  run [file]     - Run current active or specified file");
      printLine("  files | dir    - List workspace files and languages");
      printLine("  cat <file>     - Display content of a file");
      printLine("  echo <text>    - Print text to terminal");
      printLine("  clear | cls    - Clear terminal screen");
      printLine("  date           - Show current system date and time");
      printLine("  <js-expr>      - Directly evaluate JS (e.g. Math.sqrt(16), 1+1)");
      break;

    case "clear":
    case "cls":
      clearTerminal();
      break;

    case "node":
      if (args.length === 0) {
        printLine("Welcome to Node.js v20.11.0 (Browser Sandbox).", "info");
        printLine("Type an expression to evaluate, or 'node <file>' to execute a file.", "muted");
      } else {
        const targetName = args[0];
        runFileByName(targetName, printLine);
      }
      break;

    case "run":
      const runTarget = args[0] || state.activeFile;
      runFileByName(runTarget, printLine);
      break;

    case "files":
    case "dir":
    case "ls":
      printLine("Directory of C:\\workspace:", "info");
      for (const [name, file] of state.files) {
        const lines = file.value.split("\n").length;
        const size = file.value.length;
        printLine(`  ${name.padEnd(20)}  ${String(size).padStart(6)} bytes  [${file.language}] (${lines} lines)`);
      }
      break;

    case "cat":
    case "type":
      if (args.length === 0) {
        printLine("Usage: cat <filename>", "error");
      } else {
        const fileObj = state.files.get(args[0]);
        if (fileObj) {
          printLine(fileObj.value);
        } else {
          printLine(`cat: ${args[0]}: No such file in workspace`, "error");
        }
      }
      break;

    case "echo":
      printLine(args.join(" "));
      break;

    case "date":
      printLine(new Date().toString(), "info");
      break;

    default:
      // Try evaluating as a direct JavaScript expression or code snippet
      try {
        let loggedAny = false;
        executeJsSandbox(
          trimmed,
          (msg, type) => {
            loggedAny = true;
            printLine(msg, type);
          },
          (err) => {
            loggedAny = true;
            printLine(err, "error");
          }
        );
        if (!loggedAny) {
          printLine(`'${mainCmd}' is not recognized as an internal or external command. Type 'help' for commands.`, "error");
        }
      } catch (err) {
        printLine(`Command error: ${err.message}`, "error");
      }
      break;
  }
}

export function runFileByName(fileName, printLine) {
  // Sync latest editor content if this file is active in Monaco
  if (state.editor && state.activeFile === fileName) {
    const activeObj = state.files.get(fileName);
    if (activeObj) activeObj.value = state.editor.getValue();
  }

  const file = state.files.get(fileName);
  if (!file) {
    printLine(`Cannot find module '${fileName}' in workspace. Available files: ${[...state.files.keys()].join(", ")}`, "error");
    return;
  }

  if (file.language === "javascript" || fileName.endsWith(".js") || fileName.endsWith(".mjs")) {
    executeJsSandbox(
      file.value,
      (msg, type) => printLine(msg, type),
      (err) => printLine(err, "error")
    );
  } else if (file.language === "json" || fileName.endsWith(".json")) {
    try {
      JSON.parse(file.value);
      printLine(`[JSON OK] ${fileName} syntax is valid.`, "success");
    } catch (e) {
      printLine(`[JSON Syntax Error] ${e.message}`, "error");
    }
  } else {
    printLine(`Executed ${fileName} (${file.language}).`, "info");
  }
}
