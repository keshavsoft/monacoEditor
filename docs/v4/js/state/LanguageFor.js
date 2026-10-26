import { jVarExtensionMap } from "./jVarConstants.js";

export function jFLanguageFor(jVarFileName) {
  const jVarExt = (jVarFileName.split(".").pop() || "").toLowerCase();
  return jVarExtensionMap[jVarExt] || "plaintext";
}
