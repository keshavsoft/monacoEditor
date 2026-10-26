import { jFToast } from "../state/Toast.js";
import { jFLanguageFor } from "../state/LanguageFor.js";
import { jFEnsureFile } from "./EnsureFile.js";

export function jFOpenLocalFile(jVarFile) {
  if (!jVarFile) return;
  const jVarReader = new FileReader();
  jVarReader.onload = () => {
    jFEnsureFile(jVarFile.name, jFLanguageFor(jVarFile.name), String(jVarReader.result || ""));
    jFToast("Opened " + jVarFile.name);
  };
  jVarReader.readAsText(jVarFile);
}
