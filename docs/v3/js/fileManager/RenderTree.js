import { jVarState } from "../state/jVarState.js";
import { jFEscapeHtml } from "../state/EscapeHtml.js";
import { jFOpenFile } from "./OpenFile.js";
import { jFGetTreeDownloadHandler } from "./SetTreeDownloadHandler.js";

export function jFRenderTree() {
  const jVarTree = $("fileTree");
  if (!jVarTree) return;

  jVarTree.innerHTML =
    '<div class="tree-row"><i class="bi bi-chevron-down chevron"></i><i class="bi bi-folder2-open folder-icon"></i><span class="tree-label">WORKSPACE</span></div>';

  for (const [jVarName, jVarFile] of jVarState.files) {
    const jVarRow = document.createElement("div");
    jVarRow.className = "tree-row indent-1" + (jVarName === jVarState.activeFile ? " selected" : "");
    jVarRow.dataset.file = jVarName;

    const jVarIconMap = {
      json: "bi-filetype-json",
      javascript: "bi-filetype-js",
      typescript: "bi-filetype-tsx",
      html: "bi-filetype-html",
      css: "bi-filetype-css",
      markdown: "bi-filetype-md"
    };
    const jVarIcon = jVarIconMap[jVarFile.language] || "bi-file-earmark-code";

    const jVarColorMap = {
      json: "#75beff",
      javascript: "#e8d44d",
      typescript: "#519aba",
      html: "#e37933",
      css: "#519aba"
    };
    const jVarColor = jVarColorMap[jVarFile.language] || "#aaa";

    jVarRow.innerHTML = `<i class="bi ${jVarIcon} file-icon" style="color:${jVarColor}"></i><span class="tree-label">${jFEscapeHtml(jVarName)}</span><span class="tree-actions"><button data-action="download" title="Download"><i class="bi bi-download"></i></button></span>`;

    jVarRow.addEventListener("click", (jVarEvent) => {
      if (jVarEvent.target.closest("[data-action=download]")) {
        const jVarHandler = jFGetTreeDownloadHandler();
        if (jVarHandler) jVarHandler(jVarName);
        return;
      }
      jFOpenFile(jVarName);
    });

    jVarTree.appendChild(jVarRow);
  }
}
