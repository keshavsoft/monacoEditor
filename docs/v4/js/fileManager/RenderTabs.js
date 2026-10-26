import { jVarState } from "../state/jVarState.js";
import { jFEscapeHtml } from "../state/EscapeHtml.js";
import { jFToast } from "../state/Toast.js";
import { jFGetFileIconInfo } from "../state/jVarConstants.js";
import { jFOpenFile } from "./OpenFile.js";
import { jFCloseFile } from "./CloseFile.js";
import { jFUpdateTitleBar } from "../ui/UpdateTitleBar.js";
import { jFCreateNewFilePrompt } from "./OpenDirectory.js";

export function jFRenderTabs() {
  const jVarBar = $("tabbar");
  if (!jVarBar) return;

  jVarBar.innerHTML = "";

  for (const jVarPath of jVarState.files.keys()) {
    const jVarFile = jVarState.files.get(jVarPath);
    const jVarIsActive = (jVarPath === jVarState.activeFile);
    const jVarTab = document.createElement("div");
    jVarTab.className = "tab" + (jVarIsActive ? " active" : "");
    jVarTab.title = jVarPath;

    const jVarBaseName = jVarFile.name || jVarPath.split("/").pop();
    const jVarIconInfo = jFGetFileIconInfo(jVarBaseName, jVarFile.language);

    jVarTab.innerHTML = `
      <i class="bi ${jVarIconInfo.icon}" style="color:${jVarIconInfo.color}; font-size:13px; margin-right:6px;"></i>
      <span class="tab-name">${jFEscapeHtml(jVarBaseName)}</span>
      <button class="close-tab" title="Close ${jFEscapeHtml(jVarBaseName)}"><i class="bi bi-x"></i></button>
    `;

    jVarTab.addEventListener("click", (jVarEvent) => {
      if (jVarEvent.target.closest(".close-tab")) {
        jVarEvent.stopPropagation();
        const jVarClosed = jFCloseFile(jVarPath);
        if (!jVarClosed) {
          jFToast("Keep at least one file open.");
        }
        return;
      }
      jFOpenFile(jVarPath);
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
    jFCreateNewFilePrompt();
  };
  jVarBar.appendChild(jVarAddBtn);

  jFUpdateTitleBar();
}
