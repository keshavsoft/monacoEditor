/**
 * @file tabBar.js
 * @description Renders editor file tabs and handles tab interaction events.
 * Creates tabs for all workspace files, highlights the active document tab,
 * supports tab close and tab add operations, and updates the titlebar.
 */

import { $ } from "../state/dom.js";
import { state } from "../state/state.js";
import { escapeHtml, toast } from "../state/helpers.js";
import { openFile, closeFile } from "./fileStore.js";
import { updateTitleBar } from "../ui/titleBar.js";

let _onNewFileRequested = null;

export function setNewFileHandler(fn) {
  _onNewFileRequested = fn;
}

export function renderTabs() {
  const bar = $("tabbar");
  if (!bar) return;

  bar.innerHTML = "";

  for (const name of state.files.keys()) {
    const file = state.files.get(name);
    const tab = document.createElement("div");
    tab.className = "tab" + (name === state.activeFile ? " active" : "");

    const icon = {
      json: "bi-filetype-json",
      javascript: "bi-filetype-js",
      typescript: "bi-filetype-tsx",
      html: "bi-filetype-html",
      css: "bi-filetype-css"
    }[file.language] || "bi-file-earmark-code";

    tab.innerHTML = `<i class="bi ${icon}"></i><span class="tab-name">${escapeHtml(name)}</span><button class="close-tab" title="Close ${escapeHtml(name)}"><i class="bi bi-x"></i></button>`;

    tab.addEventListener("click", (e) => {
      if (e.target.closest(".close-tab")) {
        e.stopPropagation();
        const closed = closeFile(name);
        if (!closed) {
          toast("Keep at least one file open.");
        }
        return;
      }
      openFile(name);
    });

    bar.appendChild(tab);
  }

  // Add "+" new file tab button
  const addBtn = document.createElement("button");
  addBtn.className = "tab-add";
  addBtn.id = "tabAdd";
  addBtn.title = "New file";
  addBtn.textContent = "+";
  addBtn.onclick = () => {
    if (_onNewFileRequested) _onNewFileRequested();
  };
  bar.appendChild(addBtn);

  // Keep center title strictly updated to active filename
  updateTitleBar();
}
