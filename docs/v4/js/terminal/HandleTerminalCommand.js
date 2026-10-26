import { jVarState } from "../state/jVarState.js";
import { jFExecuteJsSandbox } from "./ExecuteJsSandbox.js";
import { jFRunFileByName } from "./RunFileByName.js";

export function jFHandleTerminalCommand(jVarRawCommand, jVarPrintLine, jVarClearTerminal) {
  const jVarTrimmed = jVarRawCommand.trim();
  if (!jVarTrimmed) return;

  const jVarParts = jVarTrimmed.split(/\s+/);
  const jVarMainCmd = jVarParts[0].toLowerCase();
  const jVarArgs = jVarParts.slice(1);

  switch (jVarMainCmd) {
    case "help":
    case "?":
      jVarPrintLine("Available KeshavSoft Editor Terminal Commands:", "info");
      jVarPrintLine("  node <file>    - Run a JavaScript file (e.g. node sample.js)");
      jVarPrintLine("  run [file]     - Run current active or specified file");
      jVarPrintLine("  files | dir    - List workspace files and languages");
      jVarPrintLine("  cat <file>     - Display content of a file");
      jVarPrintLine("  echo <text>    - Print text to terminal");
      jVarPrintLine("  clear | cls    - Clear terminal screen");
      jVarPrintLine("  date           - Show current system date and time");
      jVarPrintLine("  <js-expr>      - Directly evaluate JS (e.g. Math.sqrt(16), 1+1)");
      break;

    case "clear":
    case "cls":
      jVarClearTerminal();
      break;

    case "node":
      if (jVarArgs.length === 0) {
        jVarPrintLine("Welcome to Node.js v20.11.0 (Browser Sandbox).", "info");
        jVarPrintLine("Type an expression to evaluate, or 'node <file>' to execute a file.", "muted");
      } else {
        jFRunFileByName(jVarArgs[0], jVarPrintLine);
      }
      break;

    case "run":
      const jVarRunTarget = jVarArgs[0] || jVarState.activeFile;
      jFRunFileByName(jVarRunTarget, jVarPrintLine);
      break;

    case "files":
    case "dir":
    case "ls":
      jVarPrintLine("Directory of C:\\workspace:", "info");
      for (const [jVarName, jVarFile] of jVarState.files) {
        const jVarLines = jVarFile.value.split("\n").length;
        const jVarSize = jVarFile.value.length;
        jVarPrintLine(`  ${jVarName.padEnd(20)}  ${String(jVarSize).padStart(6)} bytes  [${jVarFile.language}] (${jVarLines} lines)`);
      }
      break;

    case "cat":
    case "type":
      if (jVarArgs.length === 0) {
        jVarPrintLine("Usage: cat <filename>", "error");
      } else {
        const jVarFileObj = jVarState.files.get(jVarArgs[0]);
        if (jVarFileObj) {
          jVarPrintLine(jVarFileObj.value);
        } else {
          jVarPrintLine(`cat: ${jVarArgs[0]}: No such file in workspace`, "error");
        }
      }
      break;

    case "echo":
      jVarPrintLine(jVarArgs.join(" "));
      break;

    case "date":
      jVarPrintLine(new Date().toString(), "info");
      break;

    default:
      try {
        let jVarLoggedAny = false;
        jFExecuteJsSandbox(
          jVarTrimmed,
          (jVarMsg, jVarType) => {
            jVarLoggedAny = true;
            jVarPrintLine(jVarMsg, jVarType);
          },
          (jVarErr) => {
            jVarLoggedAny = true;
            jVarPrintLine(jVarErr, "error");
          }
        );
        if (!jVarLoggedAny) {
          jVarPrintLine(`'${jVarMainCmd}' is not recognized as an internal or external command. Type 'help' for commands.`, "error");
        }
      } catch (jVarErr) {
        jVarPrintLine(`Command error: ${jVarErr.message}`, "error");
      }
      break;
  }
}
