// File Management, Tabs, and Tree Explorer Module
import { $, state, languageFor, languageNames, escapeHtml, toast } from "./state.js";
import { updateCursor } from "./editor.js";

export function ensureFile(name, language, content = "") {
  state.files.set(name, { language: language || languageFor(name), value: content });
  renderTree();
  renderTabs();
  openFile(name);
}

export function renderTree() {
  const tree = $("fileTree");
  if (!tree) return;

  tree.innerHTML = '<div class="tree-row"><i class="bi bi-chevron-down chevron"></i><i class="bi bi-folder2-open folder-icon"></i><span class="tree-label">WORKSPACE</span></div>';

  for (const [name, f] of state.files) {
    const row = document.createElement("div");
    row.className = "tree-row indent-1" + (name === state.activeFile ? " selected" : "");
    row.dataset.file = name;

    const icon = ({
      json: "bi-filetype-json",
      javascript: "bi-filetype-js",
      typescript: "bi-filetype-tsx",
      html: "bi-filetype-html",
      css: "bi-filetype-css",
      markdown: "bi-filetype-md"
    })[f.language] || "bi-file-earmark-code";

    const color = ({
      json: "#75beff",
      javascript: "#e8d44d",
      typescript: "#519aba",
      html: "#e37933",
      css: "#519aba"
    })[f.language] || "#aaa";

    row.innerHTML = `<i class="bi ${icon} file-icon" style="color:${color}"></i><span class="tree-label">${escapeHtml(name)}</span><span class="tree-actions"><button data-action="download" title="Download"><i class="bi bi-download"></i></button></span>`;

    row.addEventListener("click", e => {
      if (e.target.closest("[data-action=download]")) {
        downloadFile(name);
        return;
      }
      openFile(name);
    });

    tree.appendChild(row);
  }
}

export function renderTabs() {
  const bar = $("tabbar");
  if (!bar) return;

  bar.innerHTML = "";

  for (const name of state.files.keys()) {
    const f = state.files.get(name);
    const tab = document.createElement("div");
    tab.className = "tab" + (name === state.activeFile ? " active" : "");

    const icon = ({
      json: "bi-filetype-json",
      javascript: "bi-filetype-js",
      html: "bi-filetype-html",
      css: "bi-filetype-css"
    })[f.language] || "bi-file-earmark-code";

    tab.innerHTML = `<i class="bi ${icon}"></i><span class="tab-name">${escapeHtml(name)}</span><button class="close-tab" title="Close ${escapeHtml(name)}"><i class="bi bi-x"></i></button>`;

    tab.addEventListener("click", e => {
      if (e.target.closest(".close-tab")) {
        e.stopPropagation();
        closeFile(name);
        return;
      }
      openFile(name);
    });

    bar.appendChild(tab);
  }

  const add = document.createElement("button");
  add.className = "tab-add";
  add.id = "tabAdd";
  add.title = "New file";
  add.textContent = "+";
  add.onclick = newFile;
  bar.appendChild(add);

  const titleEl = $("windowTitle");
  if (titleEl) {
    titleEl.textContent = state.activeFile + " — keshavsoft editor";
  }
}

export function openFile(name) {
  if (!state.files.has(name)) return;

  // Save current open file content
  if (state.editor && state.files.has(state.activeFile)) {
    state.files.get(state.activeFile).value = state.editor.getValue();
  } else if (state.files.has(state.activeFile)) {
    const fallback = $("fallbackEditor");
    if (fallback) state.files.get(state.activeFile).value = fallback.value;
  }

  state.activeFile = name;
  const f = state.files.get(name);

  if (state.editor && window.monaco) {
    const model = state.editor.getModel();
    if (model) {
      window.monaco.editor.setModelLanguage(model, f.language);
    }
    state.editor.setValue(f.value);
  } else {
    const fallback = $("fallbackEditor");
    if (fallback) fallback.value = f.value;
  }

  const crumbName = $("crumbName");
  if (crumbName) crumbName.textContent = name;

  const crumbType = $("crumbType");
  if (crumbType) crumbType.textContent = languageNames[f.language] || f.language;

  const langStatus = $("languageStatus");
  if (langStatus) langStatus.textContent = languageNames[f.language] || f.language;

  const crumbIcon = $("crumbIcon");
  if (crumbIcon) {
    crumbIcon.className = "bi " + (({
      json: "bi-filetype-json",
      javascript: "bi-filetype-js",
      html: "bi-filetype-html",
      css: "bi-filetype-css"
    })[f.language] || "bi-file-earmark-code");
  }

  renderTree();
  renderTabs();
  updateCursor();
}

export function closeFile(name) {
  if (state.files.size === 1) {
    toast("Keep at least one file open.");
    return;
  }
  const names = [...state.files.keys()];
  const idx = names.indexOf(name);
  state.files.delete(name);

  if (state.activeFile === name) {
    state.activeFile = names[Math.max(0, idx - 1)] === name ? names[0] : names[Math.max(0, idx - 1)];
  }

  renderTree();
  renderTabs();
  openFile(state.activeFile);
}

export function newFile() {
  const name = prompt("New file name (for example: component.js):", "untitled.js");
  if (!name) return;
  if (state.files.has(name)) {
    toast("That file is already open.");
    return;
  }
  ensureFile(name, languageFor(name), "");
}

export function downloadFile(name = state.activeFile) {
  if (state.editor && name === state.activeFile) {
    state.files.get(name).value = state.editor.getValue();
  }
  const f = state.files.get(name);
  if (!f) return;

  const blob = new Blob([f.value], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
  toast("Downloaded " + name);
}

export function openLocal(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    ensureFile(file.name, languageFor(file.name), String(reader.result || ""));
    toast("Opened " + file.name);
  };
  reader.readAsText(file);
}
