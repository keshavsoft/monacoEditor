import { jVarState } from "../state/jVarState.js";
import { jFInitEditor } from "../editor/InitEditor.js";
import { jFUpdateCursor } from "../editor/UpdateCursor.js";
import { jFValidateAndRun } from "../editor/ValidateAndRun.js";
import { jFRenderTree } from "../fileManager/RenderTree.js";
import { jFSetTreeDownloadHandler } from "../fileManager/SetTreeDownloadHandler.js";
import { jFRenderTabs } from "../fileManager/RenderTabs.js";
import { jFSetNewFileHandler } from "../fileManager/SetNewFileHandler.js";
import { jFCreateNewFilePrompt } from "../fileManager/OpenDirectory.js";
import { jFDownloadFile } from "../fileManager/DownloadFile.js";
import { jFSaveCurrentFile } from "../fileManager/SaveFile.js";
import { jFOnFileChange } from "../fileManager/OnFileChange.js";
import { jFInitTerminalUI } from "../terminal/InitTerminalUI.js";
import { jFUpdateTitleBar } from "../ui/UpdateTitleBar.js";
import { jFSetPanel } from "../ui/SetPanel.js";
import { jFInitCommandPalette } from "../ui/InitCommandPalette.js";
import { jFInitDropdownMenus } from "../ui/InitDropdownMenus.js";
import { jFSetupEventListeners } from "./SetupEventListeners.js";

export function jFInitApp() {
  const jVarCurrent = jVarState.files.get(jVarState.activeFile);
  const jVarFallback = $("fallbackEditor");
  if (jVarFallback && jVarCurrent) {
    jVarFallback.value = jVarCurrent.value;
  }

  jFSetNewFileHandler(jFCreateNewFilePrompt);
  jFSetTreeDownloadHandler((jVarName) => jFDownloadFile(jVarName));
  jFOnFileChange(() => {
    jFRenderTree();
    jFRenderTabs();
  });

  jFUpdateTitleBar();
  jFRenderTree();
  jFRenderTabs();
  jFUpdateCursor();
  jFInitTerminalUI();
  jFInitCommandPalette();
  jFInitDropdownMenus();
  jFSetupEventListeners();

  jFSetPanel("terminal");

  jFInitEditor(
    () => jFSaveCurrentFile(),
    () => jFValidateAndRun(jFSetPanel)
  );
}
