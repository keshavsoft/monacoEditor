import { jFGetTerminalOutputEl } from "./PrintTerminalLine.js";

export function jFClearTerminal() {
  const jVarContainer = jFGetTerminalOutputEl();
  if (!jVarContainer) return;

  const jVarInputRow = jVarContainer.querySelector(".terminal-input");
  jVarContainer.innerHTML = "";
  if (jVarInputRow) {
    jVarContainer.appendChild(jVarInputRow);
  }
}
