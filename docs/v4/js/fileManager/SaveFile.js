import { jVarState } from "../state/jVarState.js";
import { jFToast } from "../state/Toast.js";
import { jFDownloadFile } from "./DownloadFile.js";

export async function jFSaveCurrentFile() {
  const jVarActiveKey = jVarState.activeFile;
  const jVarFileObj = jVarState.files.get(jVarActiveKey);
  if (!jVarFileObj) return;

  const jVarCurrentValue = jVarState.editor
    ? jVarState.editor.getValue()
    : ($("fallbackEditor")?.value || jVarFileObj.value);
  jVarFileObj.value = jVarCurrentValue;

  // If we have a FileSystemFileHandle, write directly to user's computer disk
  if (jVarFileObj.handle && typeof jVarFileObj.handle.createWritable === "function") {
    try {
      const jVarWritable = await jVarFileObj.handle.createWritable();
      await jVarWritable.write(jVarCurrentValue);
      await jVarWritable.close();
      jFToast(`Saved to disk: ${jVarFileObj.name || jVarActiveKey}`);
      return;
    } catch (jVarErr) {
      console.warn("Direct disk write failed or permission denied, falling back to download:", jVarErr);
    }
  }

  // Fallback: download the file
  jFDownloadFile(jVarActiveKey);
}
