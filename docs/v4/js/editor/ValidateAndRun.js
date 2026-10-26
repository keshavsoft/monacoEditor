import { jVarState } from "../state/jVarState.js";
import { jFToast } from "../state/Toast.js";
import { jFRunActiveFileInTerminal } from "../terminal/RunActiveFileInTerminal.js";

export function jFValidateAndRun(jVarOnPanelChange) {
  const jVarCurrent = jVarState.files.get(jVarState.activeFile);
  const jVarLang = jVarCurrent ? jVarCurrent.language : "plaintext";
  const jVarFileName = jVarState.activeFile;

  jVarState.panelVisible = true;
  const jVarPanel = $("bottomPanel");
  if (jVarPanel) jVarPanel.style.display = "block";

  if (jVarLang === "javascript" || jVarFileName.endsWith(".js") || jVarFileName.endsWith(".mjs")) {
    jFRunActiveFileInTerminal(jVarOnPanelChange);
    jFToast(`Running ${jVarFileName} in terminal`);
    return;
  }

  if (jVarLang === "json" || jVarFileName.endsWith(".json")) {
    const jVarContent = jVarState.editor ? jVarState.editor.getValue() : ($("fallbackEditor")?.value || "");
    try {
      JSON.parse(jVarContent);
      const jVarMsg = `JSON validation passed for ${jVarFileName}. No syntax errors found.`;
      if ($("problemCount")) $("problemCount").textContent = "0";
      if ($("statusProblems")) {
        $("statusProblems").innerHTML = '<i class="bi bi-x-circle"></i> 0 <i class="bi bi-exclamation-triangle"></i> 0';
      }
      if (jVarOnPanelChange) jVarOnPanelChange("output");
      if ($("panel-output")) $("panel-output").textContent = jVarMsg;
      jFToast("JSON is valid");
      return;
    } catch (jVarErr) {
      const jVarMsg = `JSON validation error in ${jVarFileName}: ${jVarErr.message}`;
      if ($("problemCount")) $("problemCount").textContent = "1";
      if ($("statusProblems")) {
        $("statusProblems").innerHTML = '<i class="bi bi-x-circle"></i> 1 <i class="bi bi-exclamation-triangle"></i> 0';
      }
      if (jVarOnPanelChange) jVarOnPanelChange("problems");
      if ($("panel-problems")) $("panel-problems").textContent = jVarMsg;
      jFToast("JSON validation failed");
      return;
    }
  }

  jFRunActiveFileInTerminal(jVarOnPanelChange);
  jFToast(`Executed ${jVarFileName}`);
}
