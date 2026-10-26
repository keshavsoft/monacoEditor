import { jVarState } from "../state/jVarState.js";
import { jFFormatCode } from "../editor/FormatCode.js";
import { jFToggleWrap } from "../editor/ToggleWrap.js";
import { jFToggleTheme } from "../editor/ToggleTheme.js";
import { jFValidateAndRun } from "../editor/ValidateAndRun.js";
import {
  jFOpenDirectory,
  jFOpenFiles,
  jFCreateNewFilePrompt,
  jFCreateNewFolderPrompt,
  jFCollapseAllFolders,
  jFRefreshExplorer,
  jFCloseFolder
} from "../fileManager/OpenDirectory.js";
import { jFSaveCurrentFile } from "../fileManager/SaveFile.js";
import { jFDownloadFile } from "../fileManager/DownloadFile.js";
import { jFToggleExplorer } from "./ToggleExplorer.js";
import { jFTogglePanel } from "./TogglePanel.js";
import { jFSetPanel } from "./SetPanel.js";

export function jFGetCommandsList() {
  return [
    ["File: Open Folder…", "Ctrl+Shift+O", jFOpenDirectory],
    ["File: Open File…", "Ctrl+O", jFOpenFiles],
    ["File: New File", "Ctrl+N", jFCreateNewFilePrompt],
    ["File: New Folder", "", jFCreateNewFolderPrompt],
    ["File: Save (Direct to Disk)", "Ctrl+S", jFSaveCurrentFile],
    ["File: Save As / Download File", "", () => jFDownloadFile()],
    ["File: Close Folder", "", jFCloseFolder],
    ["View: Refresh Explorer", "", jFRefreshExplorer],
    ["View: Collapse All Folders", "", jFCollapseAllFolders],
    ["Run: Run Code / Validate", "F5", () => jFValidateAndRun(jFSetPanel)],
    ["Edit: Format Document", "Shift+Alt+F", jFFormatCode],
    ["Edit: Find", "Ctrl+F", () => jVarState.editor ? jVarState.editor.getAction("actions.find")?.run() : null],
    ["View: Toggle Word Wrap", "Alt+Z", jFToggleWrap],
    ["View: Toggle Theme (Dark/Light)", "", jFToggleTheme],
    ["View: Toggle Bottom Panel", "Ctrl+J", jFTogglePanel],
    ["View: Toggle Explorer Sidebar", "Ctrl+B", jFToggleExplorer],
    ["View: Switch to Terminal", "", () => jFSetPanel("terminal")],
    ["View: Switch to Problems Panel", "", () => jFSetPanel("problems")],
    ["Go to Line…", "Ctrl+G", () => jVarState.editor && jVarState.editor.getAction("editor.action.gotoLine")?.run()]
  ];
}
