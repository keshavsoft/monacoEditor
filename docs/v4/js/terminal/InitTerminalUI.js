import { jVarState } from "../state/jVarState.js";
import { jFGetProfilePrompt } from "./jVarTerminalProfiles.js";
import { jVarTerminalHistory } from "./jVarTerminalHistory.js";
import { jFGetTerminalOutputEl, jFPrintTerminalLine } from "./PrintTerminalLine.js";
import { jFPrintPromptLine } from "./PrintPromptLine.js";
import { jFClearTerminal } from "./ClearTerminal.js";
import { jFSetTerminalProfile } from "./SetTerminalProfile.js";
import { jFResetTerminalSession } from "./ResetTerminalSession.js";
import { jFHandleTerminalCommand } from "./HandleTerminalCommand.js";

export const jVarTerminalHistoryInstance = new jVarTerminalHistory();

export function jFInitTerminalUI() {
  const jVarInput = $("terminalInput");
  const jVarContainer = jFGetTerminalOutputEl();
  const jVarProfileSelect = $("terminalProfileSelect");
  const jVarNewTerminalBtn = $("newTerminalBtn");
  const jVarKillTerminalBtn = $("killTerminalBtn");

  if (jVarContainer) {
    jVarContainer.addEventListener("click", () => {
      jVarInput?.focus();
    });
  }

  if (jVarProfileSelect) {
    jVarProfileSelect.value = jVarState.terminalProfile || "cmd";
    jVarProfileSelect.addEventListener("change", (jVarEvent) => {
      jFSetTerminalProfile(jVarEvent.target.value);
    });
  }

  if (jVarNewTerminalBtn) {
    jVarNewTerminalBtn.addEventListener("click", (jVarEvent) => {
      jVarEvent.stopPropagation();
      jFResetTerminalSession();
    });
  }

  if (jVarKillTerminalBtn) {
    jVarKillTerminalBtn.addEventListener("click", (jVarEvent) => {
      jVarEvent.stopPropagation();
      jFClearTerminal();
      jFPrintTerminalLine("Terminal cleared.", "muted");
    });
  }

  const jVarPromptSpan = $("terminalPromptSpan");
  if (jVarPromptSpan) {
    jVarPromptSpan.textContent = jFGetProfilePrompt(jVarState.terminalProfile);
  }

  if (jVarInput) {
    jVarInput.addEventListener("keydown", (jVarEvent) => {
      if (jVarEvent.key === "Enter") {
        const jVarVal = jVarInput.value;
        jVarInput.value = "";
        jVarTerminalHistoryInstance.resetPointer();
        if (jVarVal.trim()) {
          jFPrintPromptLine(jVarVal);
          jVarTerminalHistoryInstance.add(jVarVal);
          jFHandleTerminalCommand(jVarVal, jFPrintTerminalLine, jFClearTerminal);
        }
      } else if (jVarEvent.key === "ArrowUp") {
        jVarEvent.preventDefault();
        const jVarPrev = jVarTerminalHistoryInstance.getPrevious();
        if (jVarPrev !== null) {
          jVarInput.value = jVarPrev;
        }
      } else if (jVarEvent.key === "ArrowDown") {
        jVarEvent.preventDefault();
        const jVarNext = jVarTerminalHistoryInstance.getNext();
        if (jVarNext !== null) {
          jVarInput.value = jVarNext;
        }
      }
    });
  }
}
