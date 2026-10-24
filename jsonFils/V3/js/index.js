/**
 * @file index.js
 * @description Main application bootstrap and orchestrator for KeshavSoft Editor.
 * Integrates modular sub-systems: state, editor, fileManager, terminal, and UI.
 * Configures global event listeners, keyboard shortcuts, and initializes workspace.
 */

import { $ } from "./state/dom.js";
import { state } from "./state/state.js";
import { initEditor, getValue } from "./editor/editorService.js";
import { updateCursor } from "./editor/cursorStatus.js";
import { formatCode } from "./editor/codeFormatter.js";
import { toggleWrap, layoutEditor } from "./editor/editorOptions.js";
import { toggleTheme } from "./editor/editorTheme.js";
import { validateAndRun } from "./editor/codeValidator.js";

import { renderTree, setTreeDownloadHandler } from "./fileManager/fileTree.js";
import { renderTabs, setNewFileHandler } from "./fileManager/tabBar.js";
import { newFilePrompt, downloadFile, openLocalFile } from "./fileManager/fileIo.js";
import { onFileChange } from "./fileManager/fileStore.js";

import { initTerminalUI } from "./terminal/terminalUI.js";
import { updateTitleBar } from "./ui/titleBar.js";
import { toggleExplorer } from "./ui/sidebar.js";
import { togglePanel, setPanel } from "./ui/panels.js";
import { initCommandPalette, showCommandPalette, hideCommands } from "./ui/commandPalette.js";

function setupEventListeners() {
  // File operations
  $("newFileBtn")?.addEventListener("click", newFilePrompt);
  $("openBtn")?.addEventListener("click", () => $("fileInput")?.click());
  $("uploadBtn")?.addEventListener("click", () => $("fileInput")?.click());

  $("fileInput")?.addEventListener("change", (e) => {
    if (e.target.files) {
      [...e.target.files].forEach(openLocalFile);
      e.target.value = "";
    }
  });

  $("saveBtn")?.addEventListener("click", () => downloadFile());
  $("formatBtn")?.addEventListener("click", formatCode);
  $("runBtn")?.addEventListener("click", () => validateAndRun(setPanel));
  $("themeBtn")?.addEventListener("click", toggleTheme);
  $("wrapBtn")?.addEventListener("click", toggleWrap);

  $("findBtn")?.addEventListener("click", () => {
    if (state.editor) {
      state.editor.getAction("actions.find")?.run();
    }
  });

  // Sidebar / panel toggles
  $("activityExplorer")?.addEventListener("click", toggleExplorer);
  $("collapseExplorer")?.addEventListener("click", toggleExplorer);
  $("togglePanel")?.addEventListener("click", togglePanel);
  $("settingsBtn")?.addEventListener("click", showCommandPalette);

  // Panel tab switching
  document.querySelectorAll(".panel-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const panelName = tab.getAttribute("data-panel");
      if (panelName) setPanel(panelName);
    });
  });

  // Top menus open command palette
  document.querySelectorAll("[data-command]").forEach((btn) => {
    btn.addEventListener("click", showCommandPalette);
  });

  $("activitySearch")?.addEventListener("click", () => {
    if (state.editor) {
      state.editor.getAction("actions.find")?.run();
    } else {
      showCommandPalette();
    }
  });

  // Fallback textarea event listeners
  const fallback = $("fallbackEditor");
  if (fallback) {
    fallback.addEventListener("input", () => {
      if (state.files.has(state.activeFile)) {
        state.files.get(state.activeFile).value = getValue();
      }
      updateCursor();
    });
    fallback.addEventListener("click", updateCursor);
    fallback.addEventListener("keyup", updateCursor);
  }

  // Global keyboard shortcuts
  window.addEventListener("keydown", (e) => {
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === "s") {
      e.preventDefault();
      downloadFile();
    } else if (mod && e.key.toLowerCase() === "o") {
      e.preventDefault();
      $("fileInput")?.click();
    } else if (mod && e.key.toLowerCase() === "n") {
      e.preventDefault();
      newFilePrompt();
    } else if (mod && e.shiftKey && e.key.toLowerCase() === "p") {
      e.preventDefault();
      showCommandPalette();
    } else if (mod && e.key.toLowerCase() === "b") {
      e.preventDefault();
      toggleExplorer();
    } else if (mod && e.key.toLowerCase() === "j") {
      e.preventDefault();
      togglePanel();
    } else if (e.key === "F5") {
      e.preventDefault();
      validateAndRun(setPanel);
    } else if (e.key === "Escape") {
      hideCommands();
    }
  });

  window.addEventListener("resize", () => {
    layoutEditor();
  });

  window.addEventListener("beforeunload", () => {
    if (state.editor && state.files.has(state.activeFile)) {
      state.files.get(state.activeFile).value = state.editor.getValue();
    }
  });
}

// Initial bootstrap
function initApp() {
  const current = state.files.get(state.activeFile);
  const fallback = $("fallbackEditor");
  if (fallback && current) {
    fallback.value = current.value;
  }

  // Register delegate handlers
  setNewFileHandler(newFilePrompt);
  setTreeDownloadHandler((name) => downloadFile(name));
  onFileChange(() => {
    renderTree();
    renderTabs();
  });

  // Initialize UI components
  updateTitleBar();
  renderTree();
  renderTabs();
  updateCursor();
  initTerminalUI(setPanel);
  initCommandPalette();
  setupEventListeners();

  // Switch to terminal tab initially or problems tab
  setPanel("terminal");

  // Initialize Monaco Editor
  initEditor(
    () => downloadFile(),
    () => validateAndRun(setPanel)
  );
}

// Run on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
