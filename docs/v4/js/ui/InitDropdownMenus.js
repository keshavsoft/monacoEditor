import { jVarState } from "../state/jVarState.js";
import { jFFormatCode } from "../editor/FormatCode.js";
import { jFToggleWrap } from "../editor/ToggleWrap.js";
import { jFToggleTheme } from "../editor/ToggleTheme.js";
import { jFValidateAndRun } from "../editor/ValidateAndRun.js";
import { jFToggleExplorer } from "./ToggleExplorer.js";
import { jFTogglePanel } from "./TogglePanel.js";
import { jFSetPanel } from "./SetPanel.js";
import { jFShowCommandPalette } from "./ShowCommandPalette.js";
import {
  jFOpenDirectory,
  jFOpenFiles,
  jFCreateNewFilePrompt,
  jFCreateNewFolderPrompt,
  jFCloseFolder
} from "../fileManager/OpenDirectory.js";
import { jFSaveCurrentFile } from "../fileManager/SaveFile.js";
import { jFDownloadFile } from "../fileManager/DownloadFile.js";
import { jFCloseFile } from "../fileManager/CloseFile.js";

let jVarIsMenuOpen = false;

export function jFCloseAllMenus() {
  $$(".menu-dropdown").forEach((el) => el.classList.add("hidden"));
  $$(".menu-btn").forEach((el) => el.classList.remove("active"));
  jVarIsMenuOpen = false;
}

export function jFInitDropdownMenus() {
  const jVarMenuBindings = [
    {
      btnId: "menuFileBtn",
      dropdownId: "menuFileDropdown",
      items: [
        { id: "menuNewFile", action: jFCreateNewFilePrompt },
        { id: "menuNewFolder", action: jFCreateNewFolderPrompt },
        { id: "menuOpenFile", action: jFOpenFiles },
        { id: "menuOpenFolder", action: jFOpenDirectory },
        { id: "menuSaveFile", action: jFSaveCurrentFile },
        { id: "menuDownloadFile", action: () => jFDownloadFile() },
        { id: "menuCloseFile", action: () => jFCloseFile(jVarState.activeFile) },
        { id: "menuCloseFolder", action: jFCloseFolder }
      ]
    },
    {
      btnId: "menuEditBtn",
      dropdownId: "menuEditDropdown",
      items: [
        { id: "menuFormat", action: jFFormatCode },
        { id: "menuFind", action: () => jVarState.editor?.getAction("actions.find")?.run() },
        { id: "menuWrap", action: jFToggleWrap }
      ]
    },
    {
      btnId: "menuSelectionBtn",
      dropdownId: "menuSelectionDropdown",
      items: [
        { id: "menuSelectAll", action: () => jVarState.editor?.getAction("editor.action.selectAll")?.run() }
      ]
    },
    {
      btnId: "menuViewBtn",
      dropdownId: "menuViewDropdown",
      items: [
        { id: "menuCommandPalette", action: jFShowCommandPalette },
        { id: "menuToggleExplorer", action: jFToggleExplorer },
        { id: "menuTogglePanel", action: jFTogglePanel },
        { id: "menuToggleTheme", action: jFToggleTheme }
      ]
    },
    {
      btnId: "menuRunBtn",
      dropdownId: "menuRunDropdown",
      items: [
        { id: "menuStartRun", action: () => jFValidateAndRun(jFSetPanel) }
      ]
    }
  ];

  jVarMenuBindings.forEach(({ btnId, dropdownId, items }) => {
    const jVarBtn = $(btnId);
    const jVarDropdown = $(dropdownId);
    if (!jVarBtn || !jVarDropdown) return;

    jVarBtn.addEventListener("click", (jVarEvent) => {
      jVarEvent.stopPropagation();
      const jVarWasOpen = !jVarDropdown.classList.contains("hidden");
      jFCloseAllMenus();
      if (!jVarWasOpen) {
        jVarDropdown.classList.remove("hidden");
        jVarBtn.classList.add("active");
        jVarIsMenuOpen = true;
      }
    });

    jVarBtn.addEventListener("mouseenter", () => {
      if (jVarIsMenuOpen) {
        jFCloseAllMenus();
        jVarDropdown.classList.remove("hidden");
        jVarBtn.classList.add("active");
        jVarIsMenuOpen = true;
      }
    });

    items.forEach(({ id, action }) => {
      const jVarItem = $(id);
      if (jVarItem) {
        jVarItem.addEventListener("click", (jVarEvent) => {
          jVarEvent.stopPropagation();
          jFCloseAllMenus();
          if (action) action();
        });
      }
    });
  });

  // Close menus on outside click
  document.addEventListener("click", (jVarEvent) => {
    if (!jVarEvent.target.closest(".menu-item")) {
      jFCloseAllMenus();
    }
  });

  // Close menus on Escape key
  window.addEventListener("keydown", (jVarEvent) => {
    if (jVarEvent.key === "Escape" && jVarIsMenuOpen) {
      jFCloseAllMenus();
    }
  });
}
