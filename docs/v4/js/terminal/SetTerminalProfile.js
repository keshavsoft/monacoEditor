import { jVarState } from "../state/jVarState.js";
import { jVarTerminalProfiles, jFGetProfilePrompt } from "./jVarTerminalProfiles.js";
import { jFPrintTerminalLine } from "./PrintTerminalLine.js";

export function jFSetTerminalProfile(jVarProfileKey) {
  if (!jVarTerminalProfiles[jVarProfileKey]) return;
  jVarState.terminalProfile = jVarProfileKey;

  const jVarPromptSpan = $("terminalPromptSpan");
  if (jVarPromptSpan) {
    jVarPromptSpan.textContent = jFGetProfilePrompt(jVarProfileKey);
  }

  const jVarSelect = $("terminalProfileSelect");
  if (jVarSelect && jVarSelect.value !== jVarProfileKey) {
    jVarSelect.value = jVarProfileKey;
  }

  jFPrintTerminalLine(`\n--- Switched to ${jVarTerminalProfiles[jVarProfileKey].name} profile ---`, "muted");
  jFPrintTerminalLine(jVarTerminalProfiles[jVarProfileKey].banner, "info");
}
