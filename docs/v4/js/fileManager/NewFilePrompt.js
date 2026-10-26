import { jVarState } from "../state/jVarState.js";
import { jFToast } from "../state/Toast.js";
import { jFLanguageFor } from "../state/LanguageFor.js";
import { jFEnsureFile } from "./EnsureFile.js";

export function jFNewFilePrompt() {
  const jVarName = prompt("New file name (e.g. app.js or data.json):", "untitled.js");
  if (!jVarName) return;
  const jVarTrimmed = jVarName.trim();
  if (!jVarTrimmed) return;

  if (jVarState.files.has(jVarTrimmed)) {
    jFToast("That file is already open.");
    return;
  }
  jFEnsureFile(jVarTrimmed, jFLanguageFor(jVarTrimmed), "");
  jFToast(`Created ${jVarTrimmed}`);
}
