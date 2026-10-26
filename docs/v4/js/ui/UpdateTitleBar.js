import { jVarState } from "../state/jVarState.js";

export function jFUpdateTitleBar() {
  const jVarTitleEl = $("windowTitle");
  if (jVarTitleEl) {
    const jVarActiveName = jVarState.activeFile ? jVarState.activeFile.split("/").pop() : "untitled";
    const jVarFolder = jVarState.rootFolderName || "WORKSPACE";
    jVarTitleEl.textContent = `${jVarActiveName} — ${jVarFolder} — keshavsoft editor`;
  }
}
