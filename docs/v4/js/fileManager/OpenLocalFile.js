import { jVarState } from "../state/jVarState.js";
import { jFToast } from "../state/Toast.js";
import { jFLanguageFor } from "../state/LanguageFor.js";
import { jFOpenFile } from "./OpenFile.js";
import { jFRenderTree } from "./RenderTree.js";
import { jFRenderTabs } from "./RenderTabs.js";

export function jFOpenLocalFile(jVarFile) {
  if (!jVarFile) return;
  const jVarReader = new FileReader();
  jVarReader.onload = () => {
    const jVarContent = String(jVarReader.result || "");
    const jVarLang = jFLanguageFor(jVarFile.name);

    jVarState.files.set(jVarFile.name, {
      name: jVarFile.name,
      path: jVarFile.name,
      language: jVarLang,
      value: jVarContent,
      file: jVarFile
    });

    if (!jVarState.treeNodes.some((n) => n.path === jVarFile.name)) {
      jVarState.treeNodes.push({
        id: jVarFile.name,
        name: jVarFile.name,
        path: jVarFile.name,
        type: "file",
        language: jVarLang,
        file: jVarFile
      });
    }

    jFOpenFile(jVarFile.name);
    jFRenderTree();
    jFRenderTabs();
    jFToast("Opened " + jVarFile.name);
  };
  jVarReader.readAsText(jVarFile);
}
