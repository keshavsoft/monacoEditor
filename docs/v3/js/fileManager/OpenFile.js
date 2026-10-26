import { jVarState } from "../state/jVarState.js";
import { jVarLanguageNames } from "../state/jVarConstants.js";
import { jFUpdateCursor } from "../editor/UpdateCursor.js";
import { jFUpdateTitleBar } from "../ui/UpdateTitleBar.js";
import { jFNotifyFileChange } from "./OnFileChange.js";

export function jFOpenFile(jVarFileName) {
  if (!jVarState.files.has(jVarFileName)) return;

  if (jVarState.editor && jVarState.files.has(jVarState.activeFile)) {
    jVarState.files.get(jVarState.activeFile).value = jVarState.editor.getValue();
  } else if (jVarState.files.has(jVarState.activeFile)) {
    const jVarFallback = $("fallbackEditor");
    if (jVarFallback) jVarState.files.get(jVarState.activeFile).value = jVarFallback.value;
  }

  jVarState.activeFile = jVarFileName;
  const jVarFileObj = jVarState.files.get(jVarFileName);

  if (jVarState.editor && window.monaco) {
    const jVarModel = jVarState.editor.getModel();
    if (jVarModel) {
      window.monaco.editor.setModelLanguage(jVarModel, jVarFileObj.language);
    }
    jVarState.editor.setValue(jVarFileObj.value);
  } else {
    const jVarFallback = $("fallbackEditor");
    if (jVarFallback) jVarFallback.value = jVarFileObj.value;
  }

  const jVarCrumbName = $("crumbName");
  if (jVarCrumbName) jVarCrumbName.textContent = jVarFileName;

  const jVarLangLabel = jVarLanguageNames[jVarFileObj.language] || jVarFileObj.language;
  const jVarCrumbType = $("crumbType");
  if (jVarCrumbType) jVarCrumbType.textContent = jVarLangLabel;

  const jVarLangStatus = $("languageStatus");
  if (jVarLangStatus) jVarLangStatus.textContent = jVarLangLabel;

  const jVarCrumbIcon = $("crumbIcon");
  if (jVarCrumbIcon) {
    const jVarIconMap = {
      json: "bi-filetype-json",
      javascript: "bi-filetype-js",
      typescript: "bi-filetype-tsx",
      html: "bi-filetype-html",
      css: "bi-filetype-css"
    };
    const jVarIconClass = jVarIconMap[jVarFileObj.language] || "bi-file-earmark-code";
    jVarCrumbIcon.className = `bi ${jVarIconClass}`;
  }

  jFUpdateTitleBar();
  jFUpdateCursor();
  jFNotifyFileChange();
}
