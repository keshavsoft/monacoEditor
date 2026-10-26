import { jVarState } from "../state/jVarState.js";
import { jFFormatCode } from "../editor/FormatCode.js";
import { jFToggleWrap } from "../editor/ToggleWrap.js";
import { jFToggleTheme } from "../editor/ToggleTheme.js";
import { jFValidateAndRun } from "../editor/ValidateAndRun.js";
import { jFNewFilePrompt } from "../fileManager/NewFilePrompt.js";
import { jFDownloadFile } from "../fileManager/DownloadFile.js";
import { jFToggleExplorer } from "./ToggleExplorer.js";
import { jFTogglePanel } from "./TogglePanel.js";
import { jFSetPanel } from "./SetPanel.js";

export function jFGetCommandsList() {
  return [
    ["Run Code / Validate", "F5", () => jFValidateAndRun(jFSetPanel)],
    ["New File", "Ctrl+N", jFNewFilePrompt],
    ["Open File…", "Ctrl+O", () => $("fileInput")?.click()],
    ["Save / Download File", "Ctrl+S", () => jFDownloadFile()],
    ["Format Document", "Shift+Alt+F", jFFormatCode],
    ["Find", "Ctrl+F", () => jVarState.editor ? jVarState.editor.getAction("actions.find")?.run() : null],
    ["Toggle Word Wrap", "Alt+Z", jFToggleWrap],
    ["Toggle Theme (Dark/Light)", "", jFToggleTheme],
    ["Toggle Bottom Panel", "Ctrl+J", jFTogglePanel],
    ["Toggle Explorer Sidebar", "Ctrl+B", jFToggleExplorer],
    ["Switch to Terminal", "", () => jFSetPanel("terminal")],
    ["Switch to Problems Panel", "", () => jFSetPanel("problems")],
    ["Go to Line…", "Ctrl+G", () => jVarState.editor && jVarState.editor.getAction("editor.action.gotoLine")?.run()]
  ];
}
