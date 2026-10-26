import { jVarState } from "../state/jVarState.js";
import { jFLanguageFor } from "../state/LanguageFor.js";
import { jFOpenFile } from "./OpenFile.js";
import { jFRenderTree } from "./RenderTree.js";
import { jFRenderTabs } from "./RenderTabs.js";

export function jFEnsureFile(jVarFileName, jVarLanguage, jVarContent = "") {
  const jVarDetectedLang = jVarLanguage || jFLanguageFor(jVarFileName);
  jVarState.files.set(jVarFileName, {
    name: jVarFileName,
    path: jVarFileName,
    language: jVarDetectedLang,
    value: jVarContent
  });

  if (!jVarState.treeNodes.some((n) => n.path === jVarFileName)) {
    jVarState.treeNodes.push({
      id: jVarFileName,
      name: jVarFileName,
      path: jVarFileName,
      type: "file",
      language: jVarDetectedLang
    });
  }

  jFOpenFile(jVarFileName);
  jFRenderTree();
  jFRenderTabs();
}
