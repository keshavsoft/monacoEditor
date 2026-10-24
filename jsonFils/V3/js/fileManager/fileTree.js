/**
 * @file fileTree.js
 * @description Workspace explorer tree view rendering and interaction.
 * Displays all files in the virtual workspace with corresponding language
 * icons and colors, manages selection highlights, and binds click-to-open actions.
 */

import { $ } from "../state/dom.js";
import { state } from "../state/state.js";
import { escapeHtml } from "../state/helpers.js";
import { openFile } from "./fileStore.js";

let _onDownloadRequested = null;

export function setTreeDownloadHandler(fn) {
  _onDownloadRequested = fn;
}

export function renderTree() {
  const tree = $("fileTree");
  if (!tree) return;

  tree.innerHTML =
    '<div class="tree-row"><i class="bi bi-chevron-down chevron"></i><i class="bi bi-folder2-open folder-icon"></i><span class="tree-label">WORKSPACE</span></div>';

  for (const [name, f] of state.files) {
    const row = document.createElement("div");
    row.className = "tree-row indent-1" + (name === state.activeFile ? " selected" : "");
    row.dataset.file = name;

    const icon = {
      json: "bi-filetype-json",
      javascript: "bi-filetype-js",
      typescript: "bi-filetype-tsx",
      html: "bi-filetype-html",
      css: "bi-filetype-css",
      markdown: "bi-filetype-md"
    }[f.language] || "bi-file-earmark-code";

    const color = {
      json: "#75beff",
      javascript: "#e8d44d",
      typescript: "#519aba",
      html: "#e37933",
      css: "#519aba"
    }[f.language] || "#aaa";

    row.innerHTML = `<i class="bi ${icon} file-icon" style="color:${color}"></i><span class="tree-label">${escapeHtml(name)}</span><span class="tree-actions"><button data-action="download" title="Download"><i class="bi bi-download"></i></button></span>`;

    row.addEventListener("click", (e) => {
      if (e.target.closest("[data-action=download]")) {
        if (_onDownloadRequested) _onDownloadRequested(name);
        return;
      }
      openFile(name);
    });

    tree.appendChild(row);
  }
}
