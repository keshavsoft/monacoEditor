import { jVarState } from "../state/jVarState.js";
import { jFLanguageFor } from "../state/LanguageFor.js";
import { jFOpenFile } from "./OpenFile.js";

export function jFEnsureFile(jVarFileName, jVarLanguage, jVarContent = "") {
  const jVarDetectedLang = jVarLanguage || jFLanguageFor(jVarFileName);
  jVarState.files.set(jVarFileName, {
    language: jVarDetectedLang,
    value: jVarContent
  });
  jFOpenFile(jVarFileName);
}
