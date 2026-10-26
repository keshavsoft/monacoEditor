import { jVarState } from "../state/jVarState.js";
import { jFLoadMonaco } from "./LoadMonaco.js";
import { jFUpdateCursor } from "./UpdateCursor.js";
import { jFLayoutEditor } from "./LayoutEditor.js";
import { jFSetupResizeObserver } from "./SetupResizeObserver.js";

export function jFInitEditor(jVarOnDownload, jVarOnValidate) {
  const jVarContainer = $("monacoContainer");
  const jVarFallback = $("fallbackEditor");

  jFLoadMonaco()
    .then((jVarMonaco) => {
      if (jVarFallback) jVarFallback.style.display = "none";
      if (jVarContainer) jVarContainer.style.display = "block";

      const jVarCurrent = jVarState.files.get(jVarState.activeFile) || { value: "", language: "plaintext" };

      jVarState.editor = jVarMonaco.editor.create(jVarContainer, {
        value: jVarCurrent.value,
        language: jVarCurrent.language,
        theme: jVarState.dark ? "vs-dark" : "vs",
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
        wordWrap: jVarState.wrap ? "on" : "off",
        padding: { top: 12, bottom: 12 },
        renderLineHighlight: "all",
        smoothScrolling: true,
        bracketPairColorization: { enabled: true }
      });

      jVarState.editor.onDidChangeModelContent(() => {
        if (jVarState.files.has(jVarState.activeFile)) {
          jVarState.files.get(jVarState.activeFile).value = jVarState.editor.getValue();
        }
        jFUpdateCursor();
      });

      jVarState.editor.onDidChangeCursorPosition(jFUpdateCursor);

      jVarState.editor.addCommand(jVarMonaco.KeyMod.CtrlCmd | jVarMonaco.KeyCode.KeyS, () => {
        if (jVarOnDownload) jVarOnDownload();
      });

      jVarState.editor.addCommand(jVarMonaco.KeyCode.F5, () => {
        if (jVarOnValidate) jVarOnValidate();
      });

      jVarState.editor.focus();
      jFUpdateCursor();
      jFSetupResizeObserver();
      jFLayoutEditor();
    })
    .catch((jVarErr) => {
      console.warn("Monaco initialization warning, falling back to textarea:", jVarErr);
      if (jVarFallback) jVarFallback.style.display = "block";
      if (jVarContainer) jVarContainer.style.display = "none";
      const jVarCurrent = jVarState.files.get(jVarState.activeFile);
      if (jVarFallback && jVarCurrent) jVarFallback.value = jVarCurrent.value;
    });
}
