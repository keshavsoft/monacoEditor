import { jFEscapeHtml } from "../state/EscapeHtml.js";
import { jVarState } from "../state/jVarState.js";
import { jFGetProfilePrompt } from "./jVarTerminalProfiles.js";
import { jFGetTerminalOutputEl } from "./PrintTerminalLine.js";

export function jFPrintPromptLine(jVarCommandText) {
  const jVarContainer = jFGetTerminalOutputEl();
  if (!jVarContainer) return;

  const jVarLine = document.createElement("div");
  jVarLine.className = "terminal-line terminal-prompt-echo";
  const jVarPrefix = jFGetProfilePrompt(jVarState.terminalProfile);

  jVarLine.innerHTML = `<span style="color:#89d185">${jFEscapeHtml(jVarPrefix)}</span> <span style="color:#ffffff">${jFEscapeHtml(jVarCommandText)}</span>`;

  const jVarInputRow = jVarContainer.querySelector(".terminal-input");
  if (jVarInputRow) {
    jVarContainer.insertBefore(jVarLine, jVarInputRow);
  } else {
    jVarContainer.appendChild(jVarLine);
  }

  jVarContainer.scrollTop = jVarContainer.scrollHeight;
}
