/**
 * @file commandPalette.js
 * @description Quick open command palette modal and keyboard shortcut registry.
 * Provides fuzzy-like search across editor actions (Save, Format, Run, Find,
 * Toggle Theme, New File), keyboard navigation, and modal dismissal.
 */

import { $ } from "../state/dom.js";
import { state } from "../state/state.js";
import { escapeHtml } from "../state/helpers.js";
import { formatCode } from "../editor/codeFormatter.js";
import { toggleWrap } from "../editor/editorOptions.js";
import { toggleTheme } from "../editor/editorTheme.js";
import { validateAndRun } from "../editor/codeValidator.js";
import { newFilePrompt, downloadFile } from "../fileManager/fileIo.js";
import { toggleExplorer } from "./sidebar.js";
import { togglePanel, setPanel } from "./panels.js";

export function getCommandsList() {
  return [
    ["Run Code / Validate", "F5", () => validateAndRun(setPanel)],
    ["New File", "Ctrl+N", newFilePrompt],
    ["Open File…", "Ctrl+O", () => $("fileInput")?.click()],
    ["Save / Download File", "Ctrl+S", () => downloadFile()],
    ["Format Document", "Shift+Alt+F", formatCode],
    ["Find", "Ctrl+F", () => state.editor ? state.editor.getAction("actions.find")?.run() : null],
    ["Toggle Word Wrap", "Alt+Z", toggleWrap],
    ["Toggle Theme (Dark/Light)", "", toggleTheme],
    ["Toggle Bottom Panel", "Ctrl+J", togglePanel],
    ["Toggle Explorer Sidebar", "Ctrl+B", toggleExplorer],
    ["Switch to Terminal", "", () => setPanel("terminal")],
    ["Switch to Problems Panel", "", () => setPanel("problems")],
    ["Go to Line…", "Ctrl+G", () => state.editor && state.editor.getAction("editor.action.gotoLine")?.run()]
  ];
}

export function showCommands(filter = "") {
  const list = $("commandList");
  if (!list) return;

  list.innerHTML = "";
  const commands = getCommandsList();

  commands
    .filter((c) => c[0].toLowerCase().includes(filter.toLowerCase()))
    .forEach((c) => {
      const el = document.createElement("div");
      el.className = "command-item";
      el.innerHTML = `<span>${escapeHtml(c[0])}</span><small>${escapeHtml(c[1])}</small>`;
      el.onclick = () => {
        hideCommands();
        c[2]();
      };
      list.appendChild(el);
    });
}

export function showCommandPalette() {
  const backdrop = $("commandBackdrop");
  const searchInput = $("commandSearch");
  if (!backdrop || !searchInput) return;

  backdrop.classList.add("open");
  searchInput.value = "";
  showCommands();
  searchInput.focus();
}

export function hideCommands() {
  const backdrop = $("commandBackdrop");
  if (backdrop) backdrop.classList.remove("open");
}

export function initCommandPalette() {
  const searchInput = $("commandSearch");
  const backdrop = $("commandBackdrop");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => showCommands(e.target.value));
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") hideCommands();
      if (e.key === "Enter") $("commandList")?.querySelector(".command-item")?.click();
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) hideCommands();
    });
  }
}
