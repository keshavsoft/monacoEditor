import { jVarState } from "../state/jVarState.js";

export function jFUpdateCursor() {
  let jVarPos = { lineNumber: 1, column: 1 };

  if (jVarState.editor) {
    jVarPos = jVarState.editor.getPosition() || jVarPos;
  } else {
    const jVarFallback = $("fallbackEditor");
    if (jVarFallback) {
      const jVarBefore = jVarFallback.value.slice(0, jVarFallback.selectionStart || 0);
      jVarPos = {
        lineNumber: jVarBefore.split("\n").length,
        column: jVarBefore.length - (jVarBefore.lastIndexOf("\n") + 1) + 1
      };
    }
  }

  const jVarCursorEl = $("cursorStatus");
  if (jVarCursorEl) {
    jVarCursorEl.textContent = `Ln ${jVarPos.lineNumber}, Col ${jVarPos.column}`;
  }
}
