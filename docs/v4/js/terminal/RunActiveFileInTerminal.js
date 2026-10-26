import { jVarState } from "../state/jVarState.js";
import { jFGetProfilePrompt } from "./jVarTerminalProfiles.js";
import { jFPrintPromptLine } from "./PrintPromptLine.js";
import { jFPrintTerminalLine } from "./PrintTerminalLine.js";
import { jFRunFileByName } from "./RunFileByName.js";
import { jVarTerminalHistoryInstance } from "./InitTerminalUI.js";

export function jFRunActiveFileInTerminal(jVarOnActivateTerminalTab) {
  if (jVarOnActivateTerminalTab) {
    jVarOnActivateTerminalTab("terminal");
  }

  const jVarCmd = `node ${jVarState.activeFile}`;

  jFPrintPromptLine(jVarCmd);
  jVarTerminalHistoryInstance.add(jVarCmd);
  jFRunFileByName(jVarState.activeFile, jFPrintTerminalLine);

  const jVarInput = $("terminalInput");
  if (jVarInput) {
    jVarInput.focus();
  }
}
