import { jVarState } from "../state/jVarState.js";
import { jFOpenFile } from "./OpenFile.js";
import { jFNotifyFileChange } from "./OnFileChange.js";

export function jFCloseFile(jVarFileName) {
  if (jVarState.files.size <= 1) {
    return false;
  }

  const jVarKeys = [...jVarState.files.keys()];
  const jVarIdx = jVarKeys.indexOf(jVarFileName);
  jVarState.files.delete(jVarFileName);

  if (jVarState.activeFile === jVarFileName) {
    const jVarNextFile = jVarKeys[Math.max(0, jVarIdx - 1)] === jVarFileName ? jVarKeys[0] : jVarKeys[Math.max(0, jVarIdx - 1)];
    jFOpenFile(jVarNextFile);
  } else {
    jFNotifyFileChange();
  }
  return true;
}
