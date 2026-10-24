/**
 * @file editorService.js
 * @description Core Monaco Editor instance lifecycle and document buffer service.
 * Manages editor creation, setting models, getting/setting document values,
 * binding shortcut commands, and graceful fallback to textarea when offline.
 */

import { $ } from "../state/dom.js";
import { state } from "../state/state.js";
import { updateCursor } from "./cursorStatus.js";
import { setupResizeObserver, layoutEditor } from "./editorOptions.js";
import { loadMonaco } from "./monacoLoader.js";

export function getValue() {
  return state.editor ? state.editor.getValue() : ($("fallbackEditor")?.value || "");
}

export function setValue(val) {
  if (state.editor) {
    state.editor.setValue(val);
  } else {
    const fallback = $("fallbackEditor");
    if (fallback) fallback.value = val;
  }
  updateCursor();
}

export function initEditor(onDownload, onValidate) {
  const container = $("monacoContainer");
  const fallback = $("fallbackEditor");

  loadMonaco()
    .then((monaco) => {
      if (fallback) fallback.style.display = "none";
      if (container) container.style.display = "block";

      const current = state.files.get(state.activeFile) || { value: "", language: "plaintext" };

      state.editor = monaco.editor.create(container, {
        value: current.value,
        language: current.language,
        theme: state.dark ? "vs-dark" : "vs",
        automaticLayout: true,
        fontSize: 13,
        fontFamily: "'JetBrains Mono', Consolas, monospace",
        lineNumbers: "on",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        folding: true,
        formatOnPaste: true,
        formatOnType: true,
        tabSize: 2,
        insertSpaces: true,
        wordWrap: state.wrap ? "on" : "off",
        padding: { top: 12, bottom: 12 },
        renderLineHighlight: "all",
        smoothScrolling: true,
        bracketPairColorization: { enabled: true }
      });

      // Synchronize editor changes into state
      state.editor.onDidChangeModelContent(() => {
        if (state.files.has(state.activeFile)) {
          state.files.get(state.activeFile).value = state.editor.getValue();
        }
        updateCursor();
      });

      state.editor.onDidChangeCursorPosition(updateCursor);

      // Keyboard bindings inside Monaco
      state.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        if (onDownload) onDownload();
      });

      state.editor.addCommand(monaco.KeyCode.F5, () => {
        if (onValidate) onValidate();
      });

      state.editor.focus();
      updateCursor();
      setupResizeObserver();
      layoutEditor();
    })
    .catch((err) => {
      console.warn("Monaco initialization warning, falling back to textarea:", err);
      if (fallback) fallback.style.display = "block";
      if (container) container.style.display = "none";
      const current = state.files.get(state.activeFile);
      if (fallback && current) fallback.value = current.value;
    });
}
