// Main Application Entry Point Module
import { $, state } from "./state.js";
import {
  initMonaco,
  getValue,
  updateCursor,
  formatCode,
  toggleWrap,
  toggleTheme,
  validate,
  layoutEditor
} from "./editor.js";
import {
  renderTree,
  renderTabs,
  newFile,
  downloadFile,
  openLocal
} from "./fileManager.js";
import {
  toggleExplorer,
  togglePanel,
  setPanel,
  initTerminal,
  initCommandPalette,
  showCommandPalette,
  hideCommands
} from "./ui.js";

function setupEventListeners() {
  // Toolbar and header buttons
  $("newFileBtn")?.addEventListener("click", newFile);
  $("openBtn")?.addEventListener("click", () => $("fileInput")?.click());
  $("uploadBtn")?.addEventListener("click", () => $("fileInput")?.click());

  $("fileInput")?.addEventListener("change", e => {
    if (e.target.files) {
      [...e.target.files].forEach(openLocal);
      e.target.value = "";
    }
  });

  $("saveBtn")?.addEventListener("click", () => downloadFile());
  $("formatBtn")?.addEventListener("click", formatCode);
  $("runBtn")?.addEventListener("click", () => validate(setPanel));
  $("themeBtn")?.addEventListener("click", toggleTheme);
  $("wrapBtn")?.addEventListener("click", toggleWrap);

  $("findBtn")?.addEventListener("click", () => {
    if (state.editor) {
      state.editor.getAction("actions.find")?.run();
    }
  });

  // Sidebar / explorer toggles
  $("activityExplorer")?.addEventListener("click", toggleExplorer);
  $("collapseExplorer")?.addEventListener("click", toggleExplorer);
  $("togglePanel")?.addEventListener("click", togglePanel);
  $("settingsBtn")?.addEventListener("click", showCommandPalette);

  // Panel tab switching
  document.querySelectorAll(".panel-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const panelName = tab.getAttribute("data-panel");
      if (panelName) setPanel(panelName);
    });
  });

  // Top menus
  document.querySelectorAll("[data-command]").forEach(btn => {
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
  window.addEventListener("keydown", e => {
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === "s") {
      e.preventDefault();
      downloadFile();
    } else if (mod && e.key.toLowerCase() === "o") {
      e.preventDefault();
      $("fileInput")?.click();
    } else if (mod && e.key.toLowerCase() === "n") {
      e.preventDefault();
      newFile();
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
      validate(setPanel);
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

  renderTree();
  renderTabs();
  updateCursor();
  initTerminal();
  initCommandPalette();
  setupEventListeners();

  // Initialize Monaco Editor
  if (typeof window.require !== "undefined") {
    initMonaco(() => downloadFile(), () => validate(setPanel));
  } else {
    const interval = setInterval(() => {
      if (typeof window.require !== "undefined") {
        clearInterval(interval);
        initMonaco(() => downloadFile(), () => validate(setPanel));
      }
    }, 50);
    setTimeout(() => clearInterval(interval), 3500);
  }
}

// Run on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
