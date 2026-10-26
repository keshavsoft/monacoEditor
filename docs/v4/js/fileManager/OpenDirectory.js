import { jVarState } from "../state/jVarState.js";
import { jFToast } from "../state/Toast.js";
import { jFLanguageFor } from "../state/LanguageFor.js";
import { jFRenderTree } from "./RenderTree.js";
import { jFRenderTabs } from "./RenderTabs.js";
import { jFOpenFile } from "./OpenFile.js";
import { jFUpdateTitleBar } from "../ui/UpdateTitleBar.js";

// Build nested tree from FileSystemDirectoryHandle (File System Access API)
export async function jFBuildTreeFromDirHandle(jVarDirHandle, jVarBasePath = "") {
  const jVarNodes = [];
  try {
    for await (const [jVarName, jVarHandle] of jVarDirHandle.entries()) {
      const jVarRelPath = jVarBasePath ? `${jVarBasePath}/${jVarName}` : jVarName;
      if (jVarHandle.kind === "directory") {
        let jVarChildren = [];
        // Skip recursing deeply into huge hidden metadata directories on initial load
        if (jVarName !== ".git" && jVarName !== "node_modules") {
          jVarChildren = await jFBuildTreeFromDirHandle(jVarHandle, jVarRelPath);
        }
        jVarNodes.push({
          id: jVarRelPath,
          name: jVarName,
          path: jVarRelPath,
          type: "folder",
          handle: jVarHandle,
          expanded: false,
          children: jVarChildren
        });
      } else {
        jVarNodes.push({
          id: jVarRelPath,
          name: jVarName,
          path: jVarRelPath,
          type: "file",
          handle: jVarHandle,
          language: jFLanguageFor(jVarName)
        });
      }
    }
  } catch (jVarErr) {
    console.warn("Error reading directory handle entries:", jVarErr);
  }

  // Sort folders first, then alphabetical (like VS Code)
  jVarNodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });

  return jVarNodes;
}

// Build nested tree from FileList (<input type="file" webkitdirectory>)
export function jFBuildTreeFromFileList(jVarFileList) {
  if (!jVarFileList || jVarFileList.length === 0) {
    return { rootName: "WORKSPACE", tree: [] };
  }

  const jVarFirstRel = jVarFileList[0].webkitRelativePath || jVarFileList[0].name;
  const jVarRootName = jVarFirstRel.split("/")[0] || "WORKSPACE";

  const jVarRootObj = { children: {} };

  for (const jVarFile of jVarFileList) {
    const jVarFullPath = jVarFile.webkitRelativePath || jVarFile.name;
    const jVarParts = jVarFullPath.split("/");
    const jVarRelParts = jVarParts.length > 1 ? jVarParts.slice(1) : jVarParts;
    let jVarCurr = jVarRootObj;

    for (let i = 0; i < jVarRelParts.length; i++) {
      const jVarPart = jVarRelParts[i];
      const jVarIsFile = (i === jVarRelParts.length - 1);
      const jVarCurrPath = jVarRelParts.slice(0, i + 1).join("/");

      if (jVarIsFile) {
        jVarCurr.children[jVarPart] = {
          id: jVarCurrPath,
          name: jVarPart,
          path: jVarCurrPath,
          type: "file",
          file: jVarFile,
          language: jFLanguageFor(jVarPart)
        };
      } else {
        if (!jVarCurr.children[jVarPart]) {
          jVarCurr.children[jVarPart] = {
            id: jVarCurrPath,
            name: jVarPart,
            path: jVarCurrPath,
            type: "folder",
            expanded: false,
            children: {}
          };
        }
        jVarCurr = jVarCurr.children[jVarPart];
      }
    }
  }

  function jFConvertToArray(jVarNode) {
    const jVarList = Object.values(jVarNode.children).map((jVarItem) => {
      if (jVarItem.type === "folder") {
        return {
          ...jVarItem,
          children: jFConvertToArray(jVarItem)
        };
      }
      return jVarItem;
    });

    jVarList.sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    });

    return jVarList;
  }

  return { rootName: jVarRootName, tree: jFConvertToArray(jVarRootObj) };
}

// Find a prioritized entry file to open on folder load
export function jFFindFirstFile(jVarNodes) {
  const jVarPriority = ["index.html", "index.js", "main.js", "app.js", "package.json", "sample.js"];

  for (const jVarNode of jVarNodes) {
    if (jVarNode.type === "file" && jVarPriority.includes(jVarNode.name.toLowerCase())) {
      return jVarNode;
    }
    if (jVarNode.type === "folder" && jVarNode.children && jVarNode.children.length > 0) {
      const jVarFound = jFFindFirstFile(jVarNode.children);
      if (jVarFound) return jVarFound;
    }
  }

  for (const jVarNode of jVarNodes) {
    if (jVarNode.type === "file") return jVarNode;
    if (jVarNode.type === "folder" && jVarNode.children && jVarNode.children.length > 0) {
      const jVarFound = jFFindFirstFile(jVarNode.children);
      if (jVarFound) return jVarFound;
    }
  }
  return null;
}

// Load directory via FileSystemDirectoryHandle
export async function jFLoadDirectoryHandle(jVarDirHandle) {
  jVarState.rootFolderName = jVarDirHandle.name;
  jVarState.rootDirectoryHandle = jVarDirHandle;
  jFToast(`Opening folder: ${jVarDirHandle.name}...`);

  const jVarNodes = await jFBuildTreeFromDirHandle(jVarDirHandle);
  jVarState.treeNodes = jVarNodes;
  jVarState.files.clear();

  const jVarFirst = jFFindFirstFile(jVarNodes);
  if (jVarFirst && jVarFirst.handle) {
    try {
      const jVarFile = await jVarFirst.handle.getFile();
      const jVarContent = await jVarFile.text();
      jVarState.files.set(jVarFirst.path, {
        name: jVarFirst.name,
        path: jVarFirst.path,
        language: jVarFirst.language,
        value: jVarContent,
        handle: jVarFirst.handle
      });
      jFOpenFile(jVarFirst.path);
    } catch (jVarErr) {
      console.warn("Could not read initial file:", jVarErr);
    }
  }

  const jVarPromptEl = $("terminalPromptSpan");
  if (jVarPromptEl) {
    jVarPromptEl.textContent = `D:\\${jVarState.rootFolderName}>`;
  }

  jFRenderTree();
  jFRenderTabs();
  jFUpdateTitleBar();
  jFToast(`Folder opened: ${jVarDirHandle.name}`);
}

// Load directory via FileList
export async function jFLoadFileList(jVarFileList) {
  const { rootName, tree } = jFBuildTreeFromFileList(jVarFileList);
  jVarState.rootFolderName = rootName;
  jVarState.rootDirectoryHandle = null;
  jVarState.treeNodes = tree;
  jVarState.files.clear();

  const jVarFirst = jFFindFirstFile(tree);
  if (jVarFirst && jVarFirst.file) {
    try {
      const jVarContent = await jVarFirst.file.text();
      jVarState.files.set(jVarFirst.path, {
        name: jVarFirst.name,
        path: jVarFirst.path,
        language: jVarFirst.language,
        value: jVarContent,
        file: jVarFirst.file
      });
      jFOpenFile(jVarFirst.path);
    } catch (jVarErr) {
      console.warn("Could not read initial file from file list:", jVarErr);
    }
  }

  const jVarPromptEl = $("terminalPromptSpan");
  if (jVarPromptEl) {
    jVarPromptEl.textContent = `D:\\${jVarState.rootFolderName}>`;
  }

  jFRenderTree();
  jFRenderTabs();
  jFUpdateTitleBar();
  jFToast(`Folder opened: ${rootName}`);
}

// Prompt and open directory from local computer
export async function jFOpenDirectory() {
  if (typeof window.showDirectoryPicker === "function") {
    try {
      const jVarDirHandle = await window.showDirectoryPicker({ mode: "readwrite" });
      await jFLoadDirectoryHandle(jVarDirHandle);
      return;
    } catch (jVarErr) {
      if (jVarErr.name === "AbortError") return;
      console.warn("showDirectoryPicker failed, using input fallback:", jVarErr);
    }
  }

  const jVarFolderInput = $("folderInput");
  if (jVarFolderInput) {
    jVarFolderInput.click();
  }
}

// Prompt and open single or multiple local files
export async function jFOpenFiles() {
  if (typeof window.showOpenFilePicker === "function") {
    try {
      const jVarHandles = await window.showOpenFilePicker({ multiple: true });
      for (const jVarHandle of jVarHandles) {
        const jVarFile = await jVarHandle.getFile();
        const jVarContent = await jVarFile.text();
        const jVarLang = jFLanguageFor(jVarFile.name);

        jVarState.files.set(jVarFile.name, {
          name: jVarFile.name,
          path: jVarFile.name,
          language: jVarLang,
          value: jVarContent,
          handle: jVarHandle
        });

        if (!jVarState.treeNodes.some((n) => n.path === jVarFile.name)) {
          jVarState.treeNodes.push({
            id: jVarFile.name,
            name: jVarFile.name,
            path: jVarFile.name,
            type: "file",
            language: jVarLang,
            handle: jVarHandle
          });
        }
      }

      if (jVarHandles.length > 0) {
        const jVarLast = jVarHandles[jVarHandles.length - 1];
        jFOpenFile(jVarLast.name);
        jFRenderTree();
        jFRenderTabs();
        jFToast(`Opened ${jVarHandles.length} file(s)`);
      }
      return;
    } catch (jVarErr) {
      if (jVarErr.name === "AbortError") return;
      console.warn("showOpenFilePicker failed, falling back to input:", jVarErr);
    }
  }

  $("fileInput")?.click();
}

// Create new file prompt
export async function jFCreateNewFilePrompt() {
  const jVarName = prompt("New file name (e.g. app.js, index.html, style.css):", "untitled.js");
  if (!jVarName || !jVarName.trim()) return;
  const jVarTrimmed = jVarName.trim();

  let jVarHandle = null;
  if (jVarState.rootDirectoryHandle && !jVarTrimmed.includes("/")) {
    try {
      jVarHandle = await jVarState.rootDirectoryHandle.getFileHandle(jVarTrimmed, { create: true });
    } catch (jVarErr) {
      console.warn("Could not create file on disk handle:", jVarErr);
    }
  }

  const jVarLang = jFLanguageFor(jVarTrimmed);
  const jVarNewNode = {
    id: jVarTrimmed,
    name: jVarTrimmed,
    path: jVarTrimmed,
    type: "file",
    language: jVarLang,
    handle: jVarHandle
  };

  jVarState.treeNodes.push(jVarNewNode);
  jVarState.files.set(jVarTrimmed, {
    name: jVarTrimmed,
    path: jVarTrimmed,
    language: jVarLang,
    value: "",
    handle: jVarHandle
  });

  jFOpenFile(jVarTrimmed);
  jFRenderTree();
  jFRenderTabs();
  jFToast(`Created ${jVarTrimmed}`);
}

// Create new folder prompt
export async function jFCreateNewFolderPrompt() {
  const jVarName = prompt("New folder name (e.g. src, components, assets):", "new-folder");
  if (!jVarName || !jVarName.trim()) return;
  const jVarTrimmed = jVarName.trim();

  let jVarHandle = null;
  if (jVarState.rootDirectoryHandle && !jVarTrimmed.includes("/")) {
    try {
      jVarHandle = await jVarState.rootDirectoryHandle.getDirectoryHandle(jVarTrimmed, { create: true });
    } catch (jVarErr) {
      console.warn("Could not create folder on disk handle:", jVarErr);
    }
  }

  const jVarNewNode = {
    id: jVarTrimmed,
    name: jVarTrimmed,
    path: jVarTrimmed,
    type: "folder",
    expanded: true,
    children: [],
    handle: jVarHandle
  };

  jVarState.treeNodes.push(jVarNewNode);
  jVarState.treeNodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });

  jFRenderTree();
  jFToast(`Created folder ${jVarTrimmed}`);
}

// Collapse all folders in explorer tree
export function jFCollapseAllFolders() {
  function jFCollapseRecursive(jVarNodes) {
    for (const jVarNode of jVarNodes) {
      if (jVarNode.type === "folder") {
        jVarNode.expanded = false;
        if (jVarNode.children) jFCollapseRecursive(jVarNode.children);
      }
    }
  }
  jFCollapseRecursive(jVarState.treeNodes);
  jFRenderTree();
}

// Refresh explorer tree
export async function jFRefreshExplorer() {
  if (jVarState.rootDirectoryHandle) {
    jFToast("Refreshing folder...");
    const jVarNodes = await jFBuildTreeFromDirHandle(jVarState.rootDirectoryHandle);
    jVarState.treeNodes = jVarNodes;
    jFRenderTree();
    jFToast("Folder refreshed");
  } else {
    jFRenderTree();
    jFToast("Explorer refreshed");
  }
}

// Close opened folder and restore default workspace
export function jFCloseFolder() {
  jVarState.rootFolderName = "WORKSPACE";
  jVarState.rootDirectoryHandle = null;
  jVarState.treeNodes = [
    {
      id: "spec.json",
      name: "spec.json",
      path: "spec.json",
      type: "file",
      language: "json"
    },
    {
      id: "sample.js",
      name: "sample.js",
      path: "sample.js",
      type: "file",
      language: "javascript"
    }
  ];
  jVarState.files.clear();
  jVarState.files.set("spec.json", {
    name: "spec.json",
    path: "spec.json",
    language: "json",
    value: JSON.stringify({
      name: "keshavsoft-app",
      version: "1.0.0",
      description: "Monaco editor workspace sample",
      main: "sample.js"
    }, null, 2)
  });
  jVarState.files.set("sample.js", {
    name: "sample.js",
    path: "sample.js",
    language: "javascript",
    value: `console.log("Hello world");\n`
  });

  const jVarPromptEl = $("terminalPromptSpan");
  if (jVarPromptEl) {
    jVarPromptEl.textContent = `C:\\workspace>`;
  }

  jFOpenFile("sample.js");
  jFRenderTree();
  jFRenderTabs();
  jFUpdateTitleBar();
  jFToast("Folder closed");
}
