// UI Panels, Explorer Toggling, Terminal Sandbox, and Command Palette Module
import { $, state, escapeHtml } from "./state.js";
import { layoutEditor, formatCode, toggleWrap, toggleTheme, validate } from "./editor.js";
import { newFile, downloadFile } from "./fileManager.js";

export function toggleExplorer() {
  const ex = $("explorer");
  const actBtn = $("activityExplorer");
  if (!ex) return;

  const isCollapsed = ex.classList.toggle("collapsed");

  if (actBtn) {
    actBtn.classList.toggle("active", !isCollapsed);
  }

  // Trigger smooth, immediate Monaco layout recalculation
  layoutEditor();
}

export function togglePanel() {
  state.panelVisible = !state.panelVisible;
  const panel = $("bottomPanel");
  if (panel) {
    panel.style.display = state.panelVisible ? "block" : "none";
  }
  layoutEditor();
}

export function setPanel(name) {
  document.querySelectorAll(".panel-tab").forEach(x => {
    x.classList.toggle("active", x.dataset.panel === name);
  });
  document.querySelectorAll(".panel-content").forEach(x => {
    x.classList.toggle("hidden", x.id !== "panel-" + name);
  });
}

export function initTerminal() {
  const input = $("terminalInput");
  if (!input) return;

  input.addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    const cmd = input.value.trim();
    const out = $("panel-terminal");
    if (!out) return;

    const line = document.createElement("div");
    line.innerHTML = '<span style="color:#89d185">❯</span> ' + escapeHtml(cmd);
    out.insertBefore(line, out.lastElementChild);

    const result = document.createElement("div");
    if (cmd === "help") {
      result.textContent = "Available commands: help, clear, files, date";
    } else if (cmd === "clear") {
      out.innerHTML = '<div class="terminal-line">Terminal cleared.</div>';
      input.value = "";
      return;
    } else if (cmd === "files") {
      result.textContent = [...state.files.keys()].join(", ");
    } else if (cmd === "date") {
      result.textContent = new Date().toString();
    } else if (cmd) {
      result.textContent = "Command not found. Type help for available commands.";
    }

    out.insertBefore(result, out.lastElementChild);
    input.value = "";
    out.scrollTop = out.scrollHeight;
    setPanel("terminal");
  });
}

export function getCommandsList() {
  return [
    ["New File", "Ctrl+N", newFile],
    ["Open File…", "Ctrl+O", () => $("fileInput")?.click()],
    ["Save / Download File", "Ctrl+S", () => downloadFile()],
    ["Format Document", "Shift+Alt+F", formatCode],
    ["Find", "Ctrl+F", () => state.editor ? state.editor.getAction("actions.find").run() : alert("Monaco editor is loading...")],
    ["Toggle Word Wrap", "Alt+Z", toggleWrap],
    ["Toggle Theme", "", toggleTheme],
    ["Run / Validate", "F5", () => validate(setPanel)],
    ["Toggle Panel", "Ctrl+J", togglePanel],
    ["Toggle Explorer", "Ctrl+B", toggleExplorer],
    ["Go to Line…", "Ctrl+G", () => state.editor && state.editor.getAction("editor.action.gotoLine")?.run()]
  ];
}

export function showCommands(filter = "") {
  const list = $("commandList");
  if (!list) return;

  list.innerHTML = "";
  const commands = getCommandsList();

  commands
    .filter(c => c[0].toLowerCase().includes(filter.toLowerCase()))
    .forEach(c => {
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
    searchInput.addEventListener("input", e => showCommands(e.target.value));
    searchInput.addEventListener("keydown", e => {
      if (e.key === "Escape") hideCommands();
      if (e.key === "Enter") $("commandList")?.querySelector(".command-item")?.click();
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", e => {
      if (e.target === backdrop) hideCommands();
    });
  }
}
