import { jVarState } from "../state/jVarState.js";

export function jFUpdateTitleBar() {
  const jVarTitleEl = $("windowTitle");
  if (jVarTitleEl) {
    jVarTitleEl.textContent = jVarState.activeFile || "untitled";
  }
}
