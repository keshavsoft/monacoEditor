import { jVarState } from "../state/jVarState.js";
import { jFExecuteJsSandbox } from "./ExecuteJsSandbox.js";

export function jFRunFileByName(jVarFileName, jVarPrintLine) {
  if (jVarState.editor && jVarState.activeFile === jVarFileName) {
    const jVarActiveObj = jVarState.files.get(jVarFileName);
    if (jVarActiveObj) jVarActiveObj.value = jVarState.editor.getValue();
  }

  const jVarFile = jVarState.files.get(jVarFileName);
  if (!jVarFile) {
    jVarPrintLine(`Cannot find module '${jVarFileName}' in workspace. Available files: ${[...jVarState.files.keys()].join(", ")}`, "error");
    return;
  }

  if (jVarFile.language === "javascript" || jVarFileName.endsWith(".js") || jVarFileName.endsWith(".mjs")) {
    jFExecuteJsSandbox(
      jVarFile.value,
      (jVarMsg, jVarType) => jVarPrintLine(jVarMsg, jVarType),
      (jVarErr) => jVarPrintLine(jVarErr, "error")
    );
  } else if (jVarFile.language === "json" || jVarFileName.endsWith(".json")) {
    try {
      JSON.parse(jVarFile.value);
      jVarPrintLine(`[JSON OK] ${jVarFileName} syntax is valid.`, "success");
    } catch (jVarErr) {
      jVarPrintLine(`[JSON Syntax Error] ${jVarErr.message}`, "error");
    }
  } else {
    jVarPrintLine(`Executed ${jVarFileName} (${jVarFile.language}).`, "info");
  }
}
