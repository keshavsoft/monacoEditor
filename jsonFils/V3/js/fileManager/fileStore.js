/**
 * @file fileStore.js
 * @description State store operations for opening, creating, and switching files.
 * Synchronizes Monaco editor models and values with state.files, updates breadcrumbs,
 * language status badges, and invokes titlebar updates with the active file name.
 */

import { $ } from "../state/dom.js";
import { state } from "../state/state.js";
import { languageFor } from "../state/helpers.js";
import { LANGUAGE_NAMES } from "../state/constants.js";
import { updateCursor } from "../editor/cursorStatus.js";
import { updateTitleBar } from "../ui/titleBar.js";

let _onFileChangeListeners = [];

export function onFileChange(listener) {
  _onFileChangeListeners.push(listener);
}

function notifyFileChange() {
  _onFileChangeListeners.forEach((fn) => fn());
}

export function openFile(fileName) {
  if (!state.files.has(fileName)) return;

  // Save current active buffer before switching
  if (state.editor && state.files.has(state.activeFile)) {
    state.files.get(state.activeFile).value = state.editor.getValue();
  } else if (state.files.has(state.activeFile)) {
    const fallback = $("fallbackEditor");
    if (fallback) state.files.get(state.activeFile).value = fallback.value;
  }

  state.activeFile = fileName;
  const fileObj = state.files.get(fileName);

  // Update Monaco or fallback editor content
  if (state.editor && window.monaco) {
    const model = state.editor.getModel();
    if (model) {
      window.monaco.editor.setModelLanguage(model, fileObj.language);
    }
    state.editor.setValue(fileObj.value);
  } else {
    const fallback = $("fallbackEditor");
    if (fallback) fallback.value = fileObj.value;
  }

  // Update breadcrumbs
  const crumbName = $("crumbName");
  if (crumbName) crumbName.textContent = fileName;

  const langLabel = LANGUAGE_NAMES[fileObj.language] || fileObj.language;
  const crumbType = $("crumbType");
  if (crumbType) crumbType.textContent = langLabel;

  const langStatus = $("languageStatus");
  if (langStatus) langStatus.textContent = langLabel;

  const crumbIcon = $("crumbIcon");
  if (crumbIcon) {
    const iconClass = {
      json: "bi-filetype-json",
      javascript: "bi-filetype-js",
      typescript: "bi-filetype-tsx",
      html: "bi-filetype-html",
      css: "bi-filetype-css"
    }[fileObj.language] || "bi-file-earmark-code";
    crumbIcon.className = `bi ${iconClass}`;
  }

  // Update titlebar center with strictly the filename
  updateTitleBar();
  updateCursor();
  notifyFileChange();
}

export function ensureFile(fileName, language, content = "") {
  const detectedLang = language || languageFor(fileName);
  state.files.set(fileName, {
    language: detectedLang,
    value: content
  });
  openFile(fileName);
}

export function closeFile(fileName) {
  if (state.files.size <= 1) {
    return false;
  }

  const keys = [...state.files.keys()];
  const idx = keys.indexOf(fileName);
  state.files.delete(fileName);

  if (state.activeFile === fileName) {
    const nextFile = keys[Math.max(0, idx - 1)] === fileName ? keys[0] : keys[Math.max(0, idx - 1)];
    openFile(nextFile);
  } else {
    notifyFileChange();
  }
  return true;
}
