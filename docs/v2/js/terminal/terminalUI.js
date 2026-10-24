/**
 * @file terminalUI.js
 * @description Renders and coordinates terminal DOM elements, profile switcher,
 * command history navigation, autoscrolling, and code execution output.
 * Provides the interactive VS Code-like experience requested by the user.
 */

import { $ } from "../state/dom.js";
import { state } from "../state/state.js";
import { escapeHtml } from "../state/helpers.js";
import { TERMINAL_PROFILES, getProfilePrompt } from "./terminalProfiles.js";
import { TerminalHistory } from "./terminalHistory.js";
import { handleTerminalCommand, runFileByName } from "./terminalCommands.js";

const history = new TerminalHistory();

export function getTerminalOutputEl() {
  return $("panel-terminal");
}

export function printTerminalLine(text, type = "normal") {
  const container = getTerminalOutputEl();
  if (!container) return;

  const line = document.createElement("div");
  line.className = `terminal-line terminal-${type}`;

  const colors = {
    normal: "#cccccc",
    error: "#f48771",
    success: "#89d185",
    warn: "#cca700",
    info: "#75beff",
    muted: "#858585"
  };

  line.style.color = colors[type] || colors.normal;
  line.style.whiteSpace = "pre-wrap";
  line.style.wordBreak = "break-all";
  line.textContent = text;

  // Insert before input container if present
  const inputRow = container.querySelector(".terminal-input");
  if (inputRow) {
    container.insertBefore(line, inputRow);
  } else {
    container.appendChild(line);
  }

  container.scrollTop = container.scrollHeight;
}

export function printPromptLine(commandText) {
  const container = getTerminalOutputEl();
  if (!container) return;

  const line = document.createElement("div");
  line.className = "terminal-line terminal-prompt-echo";
  const prefix = getProfilePrompt(state.terminalProfile);

  line.innerHTML = `<span style="color:#89d185">${escapeHtml(prefix)}</span> <span style="color:#ffffff">${escapeHtml(commandText)}</span>`;

  const inputRow = container.querySelector(".terminal-input");
  if (inputRow) {
    container.insertBefore(line, inputRow);
  } else {
    container.appendChild(line);
  }

  container.scrollTop = container.scrollHeight;
}

export function clearTerminal() {
  const container = getTerminalOutputEl();
  if (!container) return;

  const inputRow = container.querySelector(".terminal-input");
  container.innerHTML = "";
  if (inputRow) {
    container.appendChild(inputRow);
  }
}

export function setTerminalProfile(profileKey) {
  if (!TERMINAL_PROFILES[profileKey]) return;
  state.terminalProfile = profileKey;

  const promptSpan = $("terminalPromptSpan");
  if (promptSpan) {
    promptSpan.textContent = getProfilePrompt(profileKey);
  }

  const select = $("terminalProfileSelect");
  if (select && select.value !== profileKey) {
    select.value = profileKey;
  }

  printTerminalLine(`\n--- Switched to ${TERMINAL_PROFILES[profileKey].name} profile ---`, "muted");
  printTerminalLine(TERMINAL_PROFILES[profileKey].banner, "info");
}

export function resetTerminalSession() {
  clearTerminal();
  const profile = TERMINAL_PROFILES[state.terminalProfile] || TERMINAL_PROFILES.cmd;
  printTerminalLine(profile.banner, "info");
  printTerminalLine("Type 'help' to view available commands.", "muted");
}

export function runActiveFileInTerminal(onActivateTerminalTab) {
  if (onActivateTerminalTab) {
    onActivateTerminalTab("terminal");
  }

  const prompt = getProfilePrompt(state.terminalProfile);
  const cmd = `node ${state.activeFile}`;

  printPromptLine(cmd);
  history.add(cmd);
  runFileByName(state.activeFile, printTerminalLine);

  const input = $("terminalInput");
  if (input) {
    input.focus();
  }
}

export function initTerminalUI(onActivateTab) {
  const input = $("terminalInput");
  const container = getTerminalOutputEl();
  const profileSelect = $("terminalProfileSelect");
  const newTerminalBtn = $("newTerminalBtn");
  const killTerminalBtn = $("killTerminalBtn");

  // Click on container focuses the input
  if (container) {
    container.addEventListener("click", () => {
      input?.focus();
    });
  }

  // Handle Profile switching from dropdown
  if (profileSelect) {
    profileSelect.value = state.terminalProfile || "cmd";
    profileSelect.addEventListener("change", (e) => {
      setTerminalProfile(e.target.value);
    });
  }

  // Handle + (New / Restart terminal)
  if (newTerminalBtn) {
    newTerminalBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      resetTerminalSession();
    });
  }

  // Handle Trash (Kill / Clear terminal)
  if (killTerminalBtn) {
    killTerminalBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      clearTerminal();
      printTerminalLine("Terminal cleared.", "muted");
    });
  }

  // Update prompt prefix span
  const promptSpan = $("terminalPromptSpan");
  if (promptSpan) {
    promptSpan.textContent = getProfilePrompt(state.terminalProfile);
  }

  // Handle command input
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const val = input.value;
        input.value = "";
        history.resetPointer();
        if (val.trim()) {
          printPromptLine(val);
          history.add(val);
          handleTerminalCommand(val, printTerminalLine, clearTerminal);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = history.getPrevious();
        if (prev !== null) {
          input.value = prev;
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = history.getNext();
        if (next !== null) {
          input.value = next;
        }
      }
    });
  }
}
