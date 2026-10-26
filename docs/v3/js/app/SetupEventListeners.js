import { jVarState } from "../state/jVarState.js";
import { jFNewFilePrompt } from "../fileManager/NewFilePrompt.js";
import { jFOpenLocalFile } from "../fileManager/OpenLocalFile.js";
import { jFDownloadFile } from "../fileManager/DownloadFile.js";
import { jFFormatCode } from "../editor/FormatCode.js";
import { jFValidateAndRun } from "../editor/ValidateAndRun.js";
import { jFToggleTheme } from "../editor/ToggleTheme.js";
import { jFToggleWrap } from "../editor/ToggleWrap.js";
import { jFLayoutEditor } from "../editor/LayoutEditor.js";
import { jFGetValue } from "../editor/GetValue.js";
import { jFUpdateCursor } from "../editor/UpdateCursor.js";
import { jFToggleExplorer } from "../ui/ToggleExplorer.js";
import { jFTogglePanel } from "../ui/TogglePanel.js";
import { jFSetPanel } from "../ui/SetPanel.js";
import { jFShowCommandPalette } from "../ui/ShowCommandPalette.js";
import { jFHideCommands } from "../ui/HideCommands.js";

export function jFSetupEventListeners() {
  // File operations buttons
  $("newFileBtn")?.addEventListener("click", jFNewFilePrompt);
  $("openBtn")?.addEventListener("click", () => $("fileInput")?.click());
  $("uploadBtn")?.addEventListener("click", () => $("fileInput")?.click());

  $("fileInput")?.addEventListener("change", (jVarEvent) => {
    if (jVarEvent.target.files) {
      [...jVarEvent.target.files].forEach(jFOpenLocalFile);
      jVarEvent.target.value = "";
    }
  });

  $("saveBtn")?.addEventListener("click", () => jFDownloadFile());
  $("formatBtn")?.addEventListener("click", jFFormatCode);
  $("runBtn")?.addEventListener("click", () => jFValidateAndRun(jFSetPanel));
  $("themeBtn")?.addEventListener("click", jFToggleTheme);
  $("wrapBtn")?.addEventListener("click", jFToggleWrap);

  $("findBtn")?.addEventListener("click", () => {
    if (jVarState.editor) {
      jVarState.editor.getAction("actions.find")?.run();
    }
  });

  // Sidebar / panel toggles
  $("activityExplorer")?.addEventListener("click", jFToggleExplorer);
  $("collapseExplorer")?.addEventListener("click", jFToggleExplorer);
  $("togglePanel")?.addEventListener("click", jFTogglePanel);
  $("settingsBtn")?.addEventListener("click", jFShowCommandPalette);

  // Panel tab switching
  $$(".panel-tab").forEach((jVarTab) => {
    jVarTab.addEventListener("click", () => {
      const jVarPanelName = jVarTab.getAttribute("data-panel");
      if (jVarPanelName) jFSetPanel(jVarPanelName);
    });
  });

  // Top menus open command palette
  $$("[data-command]").forEach((jVarBtn) => {
    jVarBtn.addEventListener("click", jFShowCommandPalette);
  });

  $("activitySearch")?.addEventListener("click", () => {
    if (jVarState.editor) {
      jVarState.editor.getAction("actions.find")?.run();
    } else {
      jFShowCommandPalette();
    }
  });

  // Fallback textarea event listeners
  const jVarFallback = $("fallbackEditor");
  if (jVarFallback) {
    jVarFallback.addEventListener("input", () => {
      if (jVarState.files.has(jVarState.activeFile)) {
        jVarState.files.get(jVarState.activeFile).value = jFGetValue();
      }
      jFUpdateCursor();
    });
    jVarFallback.addEventListener("click", jFUpdateCursor);
    jVarFallback.addEventListener("keyup", jFUpdateCursor);
  }

  // Global keyboard shortcuts
  window.addEventListener("keydown", (jVarEvent) => {
    const jVarMod = jVarEvent.ctrlKey || jVarEvent.metaKey;
    if (jVarMod && jVarEvent.key.toLowerCase() === "s") {
      jVarEvent.preventDefault();
      jFDownloadFile();
    } else if (jVarMod && jVarEvent.key.toLowerCase() === "o") {
      jVarEvent.preventDefault();
      $("fileInput")?.click();
    } else if (jVarMod && jVarEvent.key.toLowerCase() === "n") {
      jVarEvent.preventDefault();
      jFNewFilePrompt();
    } else if (jVarMod && jVarEvent.shiftKey && jVarEvent.key.toLowerCase() === "p") {
      jVarEvent.preventDefault();
      jFShowCommandPalette();
    } else if (jVarMod && jVarEvent.key.toLowerCase() === "b") {
      jVarEvent.preventDefault();
      jFToggleExplorer();
    } else if (jVarMod && jVarEvent.key.toLowerCase() === "j") {
      jVarEvent.preventDefault();
      jFTogglePanel();
    } else if (jVarEvent.key === "F5") {
      jVarEvent.preventDefault();
      jFValidateAndRun(jFSetPanel);
    } else if (jVarEvent.key === "Escape") {
      jFHideCommands();
    }
  });

  window.addEventListener("resize", () => {
    jFLayoutEditor();
  });

  window.addEventListener("beforeunload", () => {
    if (jVarState.editor && jVarState.files.has(jVarState.activeFile)) {
      jVarState.files.get(jVarState.activeFile).value = jVarState.editor.getValue();
    }
  });
}
