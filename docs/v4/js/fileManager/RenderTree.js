import { jVarState } from "../state/jVarState.js";
import { jFEscapeHtml } from "../state/EscapeHtml.js";
import { jFGetFileIconInfo } from "../state/jVarConstants.js";
import { jFOpenFile } from "./OpenFile.js";
import { jFRenderTabs } from "./RenderTabs.js";
import { jFDownloadFile } from "./DownloadFile.js";
import { jFOpenDirectory, jFOpenFiles } from "./OpenDirectory.js";

export async function jFOpenFileFromTree(jVarNode) {
  if (jVarState.files.has(jVarNode.path)) {
    jFOpenFile(jVarNode.path);
    jFRenderTabs();
    jFRenderTree();
    return;
  }

  let jVarContent = "";
  try {
    if (jVarNode.handle && typeof jVarNode.handle.getFile === "function") {
      const jVarFile = await jVarNode.handle.getFile();
      jVarContent = await jVarFile.text();
    } else if (jVarNode.file && typeof jVarNode.file.text === "function") {
      jVarContent = await jVarNode.file.text();
    } else if (jVarNode.value !== undefined) {
      jVarContent = jVarNode.value;
    }
  } catch (jVarErr) {
    console.error("Failed to read file:", jVarErr);
    jVarContent = "";
  }

  jVarState.files.set(jVarNode.path, {
    name: jVarNode.name,
    path: jVarNode.path,
    language: jVarNode.language,
    value: jVarContent,
    handle: jVarNode.handle,
    file: jVarNode.file
  });

  jFOpenFile(jVarNode.path);
  jFRenderTabs();
  jFRenderTree();
}

export function jFRenderTree() {
  const jVarTreeEl = $("fileTree");
  if (!jVarTreeEl) return;

  const jVarFolderNameEl = $("workspaceFolderName");
  if (jVarFolderNameEl) {
    jVarFolderNameEl.textContent = (jVarState.rootFolderName || "WORKSPACE").toUpperCase();
  }

  jVarTreeEl.innerHTML = "";

  if (!jVarState.treeNodes || jVarState.treeNodes.length === 0) {
    const jVarEmptyBox = document.createElement("div");
    jVarEmptyBox.className = "empty-folder-box";
    jVarEmptyBox.innerHTML = `
      <i class="bi bi-folder2 empty-icon"></i>
      <p class="empty-text">You have not yet opened a folder.</p>
      <button class="empty-btn primary" id="openFolderEmptyBtn"><i class="bi bi-folder2-open"></i> Open Folder</button>
      <button class="empty-btn" id="openFileEmptyBtn"><i class="bi bi-file-earmark"></i> Open File</button>
    `;

    jVarEmptyBox.querySelector("#openFolderEmptyBtn")?.addEventListener("click", jFOpenDirectory);
    jVarEmptyBox.querySelector("#openFileEmptyBtn")?.addEventListener("click", jFOpenFiles);

    jVarTreeEl.appendChild(jVarEmptyBox);
    return;
  }

  function jFRenderNodes(jVarNodes, jVarContainer, jVarLevel = 0) {
    for (const jVarNode of jVarNodes) {
      if (jVarNode.type === "folder") {
        const jVarFolderRow = document.createElement("div");
        jVarFolderRow.className = `tree-row folder-row ${jVarNode.expanded ? "expanded" : ""}`;
        jVarFolderRow.dataset.path = jVarNode.path;
        jVarFolderRow.style.paddingLeft = `${10 + jVarLevel * 14}px`;

        jVarFolderRow.innerHTML = `
          <i class="bi ${jVarNode.expanded ? "bi-chevron-down" : "bi-chevron-right"} chevron"></i>
          <i class="bi ${jVarNode.expanded ? "bi-folder2-open" : "bi-folder"} folder-icon"></i>
          <span class="tree-label">${jFEscapeHtml(jVarNode.name)}</span>
        `;

        jVarFolderRow.addEventListener("click", () => {
          jVarNode.expanded = !jVarNode.expanded;
          jFRenderTree();
        });

        jVarContainer.appendChild(jVarFolderRow);

        if (jVarNode.expanded && jVarNode.children && jVarNode.children.length > 0) {
          jFRenderNodes(jVarNode.children, jVarContainer, jVarLevel + 1);
        } else if (jVarNode.expanded && (!jVarNode.children || jVarNode.children.length === 0)) {
          const jVarEmptySub = document.createElement("div");
          jVarEmptySub.className = "tree-row empty-subfolder";
          jVarEmptySub.style.paddingLeft = `${26 + jVarLevel * 14}px`;
          jVarEmptySub.style.color = "#777";
          jVarEmptySub.style.fontStyle = "italic";
          jVarEmptySub.style.fontSize = "11px";
          jVarEmptySub.textContent = "(empty folder)";
          jVarContainer.appendChild(jVarEmptySub);
        }
      } else {
        const jVarFileRow = document.createElement("div");
        const jVarIsSelected = (jVarNode.path === jVarState.activeFile);
        jVarFileRow.className = `tree-row file-row ${jVarIsSelected ? "selected" : ""}`;
        jVarFileRow.dataset.path = jVarNode.path;
        jVarFileRow.style.paddingLeft = `${24 + jVarLevel * 14}px`;

        const jVarIconInfo = jFGetFileIconInfo(jVarNode.name, jVarNode.language);

        jVarFileRow.innerHTML = `
          <i class="bi ${jVarIconInfo.icon} file-icon" style="color:${jVarIconInfo.color}"></i>
          <span class="tree-label" title="${jFEscapeHtml(jVarNode.path)}">${jFEscapeHtml(jVarNode.name)}</span>
          <span class="tree-actions">
            <button data-action="download" title="Save / Download"><i class="bi bi-download"></i></button>
          </span>
        `;

        jVarFileRow.addEventListener("click", (jVarEvent) => {
          if (jVarEvent.target.closest("[data-action=download]")) {
            jVarEvent.stopPropagation();
            jFDownloadFile(jVarNode.path);
            return;
          }
          jFOpenFileFromTree(jVarNode);
        });

        jVarContainer.appendChild(jVarFileRow);
      }
    }
  }

  jFRenderNodes(jVarState.treeNodes, jVarTreeEl, 0);
}
