import { jVarState } from "../state/jVarState.js";
import { jVarTerminalProfiles } from "./jVarTerminalProfiles.js";
import { jFClearTerminal } from "./ClearTerminal.js";
import { jFPrintTerminalLine } from "./PrintTerminalLine.js";

export function jFResetTerminalSession() {
  jFClearTerminal();
  const jVarProfile = jVarTerminalProfiles[jVarState.terminalProfile] || jVarTerminalProfiles.cmd;
  jFPrintTerminalLine(jVarProfile.banner, "info");
  jFPrintTerminalLine("Type 'help' to view available commands.", "muted");
}
