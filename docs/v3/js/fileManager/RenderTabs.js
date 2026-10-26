import { jVarState } from "../state/jVarState.js";
import { jFEscapeHtml } from "../state/EscapeHtml.js";
import { jFToast } from "../state/Toast.js";
import { jFOpenFile } from "./OpenFile.js";
import { jFCloseFile } from "./CloseFile.js";
import { jFUpdateTitleBar } from "../ui/UpdateTitleBar.js";
import { jFGetNewFileHandler } from "./SetNewFileHandler.js";

export function jFRenderTabs() {
  const jVarBar = $("tabbar");
  if (!jVarBar) return;

  jVarBar.innerHTML = "";

  for (const jVarName of jVarState.files.keys()) {
    const jVarFile = jVarState.files.get(jVarName);
    const jVarTab = document.createElement("div");
    jVarTab.className = "tab" + (jVarName === jVarState.activeFile ? " active" : "");

    const jVarIconMap = {
      json: "bi-filetype-json",
      javascript: "bi-filetype-js",
      typescript: "bi-filetype-tsx",
      html: "bi-filetype-html",
      css: "bi-filetype-css"
    };
    const jVarIcon = jVarIconMap[jVarFile.language] || "bi-file-earmark-code";

    jVarTab.innerHTML = `<i class="bi ${jVarIcon}"></i><span class="tab-name">${jFEscapeHtml(jVarName)}</span><button class="close-tab" title="Close ${jFEscapeHtml(jVarName)}"><i class="bi bi-x"></i></button>`;

    jVarTab.addEventListener("click", (jVarEvent) => {
      if (jVarEvent.target.closest(".close-tab")) {
        jVarEvent.stopPropagation();
        const jVarClosed = jFCloseFile(jVarName);
        if (!jVarClosed) {
          jFToast("Keep at least one file open.");
        }
        return;
      }
      jFOpenFile(jVarName);
    });

    jVarBar.appendChild(jVarTab);
  }

  // Add "+" new file tab button
  const jVarAddBtn = document.createElement("button");
  jVarAddBtn.className = "tab-add";
  jVarAddBtn.id = "tabAdd";
  jVarAddBtn.title = "New file";
  jVarAddBtn.textContent = "+";
  jVarAddBtn.onclick = () => {
    const jVarHandler = jFGetNewFileHandler();
    if (jVarHandler) jVarHandler();
  };
  jVarBar.appendChild(jVarAddBtn);

  jFUpdateTitleBar();
}
