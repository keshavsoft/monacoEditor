import { jVarState } from "../state/jVarState.js";
import {
  jFOpenDirectory,
  jFOpenFiles,
  jFLoadFileList,
  jFCreateNewFilePrompt,
  jFCreateNewFolderPrompt,
  jFCollapseAllFolders,
  jFRefreshExplorer
} from "../fileManager/OpenDirectory.js";
import { jFOpenLocalFile } from "../fileManager/OpenLocalFile.js";
import { jFSaveCurrentFile } from "../fileManager/SaveFile.js";
import { jFCloseFile } from "../fileManager/CloseFile.js";
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
import { jFCloseAllMenus } from "../ui/InitDropdownMenus.js";

export function jFSetupEventListeners() {
  // Folder & File opening operations
  $("openFolderBtn")?.addEventListener("click", jFOpenDirectory);
  $("openFolderBtnExplorer")?.addEventListener("click", jFOpenDirectory);
  $("openBtn")?.addEventListener("click", jFOpenFiles);
  $("uploadBtn")?.addEventListener("click", jFOpenDirectory);

  $("newFileBtn")?.addEventListener("click", jFCreateNewFilePrompt);
  $("newFolderBtn")?.addEventListener("click", jFCreateNewFolderPrompt);
  $("refreshTreeBtn")?.addEventListener("click", jFRefreshExplorer);
  $("collapseAllBtn")?.addEventListener("click", jFCollapseAllFolders);

  // Hidden folder directory input fallback
  $("folderInput")?.addEventListener("change", (jVarEvent) => {
    if (jVarEvent.target.files && jVarEvent.target.files.length > 0) {
      jFLoadFileList(jVarEvent.target.files);
      jVarEvent.target.value = "";
    }
  });

  // Hidden file input fallback
  $("fileInput")?.addEventListener("change", (jVarEvent) => {
    if (jVarEvent.target.files) {
      [...jVarEvent.target.files].forEach(jFOpenLocalFile);
      jVarEvent.target.value = "";
    }
  });

  // Toolbar Actions
  $("saveBtn")?.addEventListener("click", () => jFSaveCurrentFile());
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

  // Track Ctrl+K chord for VS Code shortcuts
  let jVarCtrlKPressed = false;
  let jVarCtrlKTimeout = null;

  // Global keyboard shortcuts
  window.addEventListener("keydown", (jVarEvent) => {
    const jVarMod = jVarEvent.ctrlKey || jVarEvent.metaKey;

    if (jVarMod && jVarEvent.key.toLowerCase() === "k") {
      jVarCtrlKPressed = true;
      clearTimeout(jVarCtrlKTimeout);
      jVarCtrlKTimeout = setTimeout(() => { jVarCtrlKPressed = false; }, 1500);
      return;
    }

    if (jVarCtrlKPressed && jVarMod && jVarEvent.key.toLowerCase() === "o") {
      jVarEvent.preventDefault();
      jVarCtrlKPressed = false;
      jFOpenDirectory();
      return;
    }

    if (jVarMod && jVarEvent.shiftKey && jVarEvent.key.toLowerCase() === "o") {
      jVarEvent.preventDefault();
      jFOpenDirectory();
      return;
    }

    if (jVarMod && jVarEvent.key.toLowerCase() === "s") {
      jVarEvent.preventDefault();
      jFSaveCurrentFile();
    } else if (jVarMod && jVarEvent.key.toLowerCase() === "o") {
      jVarEvent.preventDefault();
      jFOpenFiles();
    } else if (jVarMod && jVarEvent.key.toLowerCase() === "n") {
      jVarEvent.preventDefault();
      jFCreateNewFilePrompt();
    } else if (jVarMod && jVarEvent.key.toLowerCase() === "w") {
      jVarEvent.preventDefault();
      jFCloseFile(jVarState.activeFile);
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
      jFCloseAllMenus();
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
