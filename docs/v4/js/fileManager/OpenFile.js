import { jVarState } from "../state/jVarState.js";
import { jVarLanguageNames, jFGetFileIconInfo } from "../state/jVarConstants.js";
import { jFUpdateCursor } from "../editor/UpdateCursor.js";
import { jFUpdateTitleBar } from "../ui/UpdateTitleBar.js";
import { jFNotifyFileChange } from "./OnFileChange.js";

export function jFOpenFile(jVarFileName) {
  if (!jVarState.files.has(jVarFileName)) return;

  // Save current editor content into current active file before switching
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

  // Update Breadcrumbs
  const jVarParts = jVarFileName.split("/");
  const jVarBaseName = jVarParts[jVarParts.length - 1];

  const jVarCrumbName = $("crumbName");
  if (jVarCrumbName) jVarCrumbName.textContent = jVarBaseName;

  const jVarCrumbRoot = $("crumbRoot");
  const jVarCrumbDivider = $("crumbDivider");
  if (jVarCrumbRoot && jVarCrumbDivider) {
    if (jVarParts.length > 1) {
      jVarCrumbRoot.textContent = jVarParts.slice(0, -1).join(" › ");
      jVarCrumbRoot.style.display = "inline";
      jVarCrumbDivider.style.display = "inline";
    } else {
      jVarCrumbRoot.style.display = "none";
      jVarCrumbDivider.style.display = "none";
    }
  }

  const jVarLangLabel = jVarLanguageNames[jVarFileObj.language] || jVarFileObj.language;
  const jVarCrumbType = $("crumbType");
  if (jVarCrumbType) jVarCrumbType.textContent = jVarLangLabel;

  const jVarLangStatus = $("languageStatus");
  if (jVarLangStatus) jVarLangStatus.textContent = jVarLangLabel;

  const jVarCrumbIcon = $("crumbIcon");
  if (jVarCrumbIcon) {
    const jVarIconInfo = jFGetFileIconInfo(jVarBaseName, jVarFileObj.language);
    jVarCrumbIcon.className = `bi ${jVarIconInfo.icon}`;
    jVarCrumbIcon.style.color = jVarIconInfo.color;
  }

  jFUpdateTitleBar();
  jFUpdateCursor();
  jFNotifyFileChange();
}
