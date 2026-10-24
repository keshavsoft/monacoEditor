// Monaco Editor and Code Operations Module
import { $, state, toast } from "./state.js";

const VS_PATH = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs";

export function getValue() {
  return state.editor ? state.editor.getValue() : $("fallbackEditor").value;
}

export function setValue(v) {
  if (state.editor) {
    state.editor.setValue(v);
  } else {
    $("fallbackEditor").value = v;
  }
  updateCursor();
}

export function updateCursor() {
  let pos = { lineNumber: 1, column: 1 };
  if (state.editor) {
    pos = state.editor.getPosition() || pos;
  } else {
    const t = $("fallbackEditor");
    if (t) {
      const before = t.value.slice(0, t.selectionStart || 0);
      pos = {
        lineNumber: before.split("\n").length,
        column: before.length - (before.lastIndexOf("\n") + 1) + 1
      };
    }
  }
  const cursorEl = $("cursorStatus");
  if (cursorEl) {
    cursorEl.textContent = `Ln ${pos.lineNumber}, Col ${pos.column}`;
  }
}

export function layoutEditor() {
  if (state.editor) {
    requestAnimationFrame(() => {
      state.editor.layout();
      setTimeout(() => state.editor?.layout(), 50);
      setTimeout(() => state.editor?.layout(), 150);
    });
  }
}

export function setupResizeObserver() {
  const container = $("monacoContainer");
  if (window.ResizeObserver && container) {
    const observer = new ResizeObserver(() => {
      if (state.editor) {
        state.editor.layout();
      }
    });
    observer.observe(container);
  }
}

export function formatCode() {
  if (state.editor) {
    const action = state.editor.getAction("editor.action.formatDocument");
    if (action) {
      action.run();
    } else {
      toast("Formatting is not available for this language.");
    }
  } else {
    try {
      const parsed = JSON.parse(getValue());
      setValue(JSON.stringify(parsed, null, 2));
    } catch (e) {
      toast("Could not format: " + e.message);
    }
  }
}

export function validate(onPanelChange) {
  const content = getValue();
  const current = state.files.get(state.activeFile);
  const lang = current ? current.language : "plaintext";
  let msg = "Run completed. No runtime is attached to this browser editor.";

  if (lang === "json") {
    try {
      JSON.parse(content);
      msg = "JSON validation passed. No syntax errors found.";
      $("problemCount").textContent = "0";
      $("statusProblems").innerHTML = '<i class="bi bi-x-circle"></i> 0 <i class="bi bi-exclamation-triangle"></i> 0';
      if (onPanelChange) onPanelChange("output");
      $("panel-output").textContent = msg;
      toast("JSON is valid");
      return;
    } catch (e) {
      msg = "JSON validation error: " + e.message;
      $("problemCount").textContent = "1";
      $("statusProblems").innerHTML = '<i class="bi bi-x-circle"></i> 1 <i class="bi bi-exclamation-triangle"></i> 0';
      if (onPanelChange) onPanelChange("problems");
      $("panel-problems").textContent = msg;
      toast("JSON validation failed");
      return;
    }
  }

  if (onPanelChange) onPanelChange("output");
  $("panel-output").textContent = msg;
  toast("Run completed");
}

export function toggleWrap() {
  state.wrap = !state.wrap;
  if (state.editor) {
    state.editor.updateOptions({ wordWrap: state.wrap ? "on" : "off" });
  }
  const btn = $("wrapBtn");
  if (btn) btn.style.color = state.wrap ? "#3794ff" : "";
  toast("Word wrap " + (state.wrap ? "on" : "off"));
}

export function toggleTheme() {
  state.dark = !state.dark;
  document.documentElement.style.colorScheme = state.dark ? "dark" : "light";
  const vars = state.dark ? {
    "--bg": "#1e1e1e",
    "--panel": "#252526",
    "--panel2": "#2d2d30",
    "--border": "#3c3c3c",
    "--text": "#cccccc",
    "--muted": "#858585",
    "--hover": "#2a2d2e",
    "--active": "#37373d"
  } : {
    "--bg": "#ffffff",
    "--panel": "#f3f3f3",
    "--panel2": "#e8e8e8",
    "--border": "#d4d4d4",
    "--text": "#333333",
    "--muted": "#666666",
    "--hover": "#e8e8e8",
    "--active": "#d6ebff"
  };

  for (const [k, v] of Object.entries(vars)) {
    document.documentElement.style.setProperty(k, v);
  }

  if (state.editor && window.monaco) {
    window.monaco.editor.setTheme(state.dark ? "vs-dark" : "vs");
  }

  const themeBtn = $("themeBtn");
  if (themeBtn) {
    themeBtn.innerHTML = `<i class="bi ${state.dark ? "bi-sun" : "bi-moon-stars"}"></i>`;
  }
}

export function initMonaco(onDownload, onValidate) {
  if (typeof window.require !== "undefined") {
    window.require.config({
      paths: { vs: VS_PATH }
    });

    window.require(["vs/editor/editor.main"], function () {
      try {
        const fallback = $("fallbackEditor");
        const container = $("monacoContainer");
        if (fallback) fallback.style.display = "none";
        if (container) container.style.display = "block";

        const current = state.files.get(state.activeFile) || { value: "", language: "plaintext" };

        state.editor = window.monaco.editor.create(container, {
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

        state.editor.onDidChangeModelContent(() => {
          if (state.files.has(state.activeFile)) {
            state.files.get(state.activeFile).value = state.editor.getValue();
          }
          updateCursor();
        });

        state.editor.onDidChangeCursorPosition(updateCursor);
        state.editor.addCommand(window.monaco.KeyMod.CtrlCmd | window.monaco.KeyCode.KeyS, () => {
          if (onDownload) onDownload();
        });
        state.editor.addCommand(window.monaco.KeyCode.F5, () => {
          if (onValidate) onValidate();
        });

        state.editor.focus();
        updateCursor();
        setupResizeObserver();
        layoutEditor();
      } catch (err) {
        console.error("Monaco create error, using fallback editor:", err);
        const fallback = $("fallbackEditor");
        const container = $("monacoContainer");
        if (fallback) fallback.style.display = "block";
        if (container) container.style.display = "none";
      }
    }, function (loadErr) {
      console.error("Monaco load error, using fallback editor:", loadErr);
      const fallback = $("fallbackEditor");
      const container = $("monacoContainer");
      if (fallback) fallback.style.display = "block";
      if (container) container.style.display = "none";
    });
  } else {
    const fallback = $("fallbackEditor");
    const container = $("monacoContainer");
    if (fallback) fallback.style.display = "block";
    if (container) container.style.display = "none";
  }
}
