/**
 * @file fileIo.js
 * @description File creation, download, and local disk import operations.
 * Prompts user for new file names, triggers browser downloads of workspace
 * files as blobs, and parses local files via FileReader API to load them.
 */

import { state } from "../state/state.js";
import { toast, languageFor } from "../state/helpers.js";
import { ensureFile } from "./fileStore.js";

export function newFilePrompt() {
  const name = prompt("New file name (e.g. app.js or data.json):", "untitled.js");
  if (!name) return;
  const trimmed = name.trim();
  if (!trimmed) return;

  if (state.files.has(trimmed)) {
    toast("That file is already open.");
    return;
  }
  ensureFile(trimmed, languageFor(trimmed), "");
  toast(`Created ${trimmed}`);
}

export function downloadFile(name = state.activeFile) {
  if (state.editor && name === state.activeFile) {
    const fileObj = state.files.get(name);
    if (fileObj) fileObj.value = state.editor.getValue();
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

export function openLocalFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    ensureFile(file.name, languageFor(file.name), String(reader.result || ""));
    toast("Opened " + file.name);
  };
  reader.readAsText(file);
}
