import { jVarState } from "../state/jVarState.js";
import { jFToast } from "../state/Toast.js";

export function jFDownloadFile(jVarName = jVarState.activeFile) {
  if (jVarState.editor && jVarName === jVarState.activeFile) {
    const jVarFileObj = jVarState.files.get(jVarName);
    if (jVarFileObj) jVarFileObj.value = jVarState.editor.getValue();
  }

  const jVarFile = jVarState.files.get(jVarName);
  if (!jVarFile) return;

  const jVarBlob = new Blob([jVarFile.value], { type: "text/plain;charset=utf-8" });
  const jVarUrl = URL.createObjectURL(jVarBlob);
  const jVarAnchor = document.createElement("a");
  jVarAnchor.href = jVarUrl;
  jVarAnchor.download = jVarName;
  jVarAnchor.click();
  URL.revokeObjectURL(jVarUrl);
  jFToast("Downloaded " + jVarName);
}
