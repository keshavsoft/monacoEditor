/**
 * @file codeValidator.js
 * @description Code execution, validation, and runner dispatcher.
 * When user clicks 'Run' or presses F5, executes JavaScript files directly
 * inside the bottom Terminal with live console logs, and validates JSON syntax.
 * Directly resolves the user's primary requirement to run JS code from the Run button.
 */

import { $ } from "../state/dom.js";
import { state } from "../state/state.js";
import { toast } from "../state/helpers.js";
import { runActiveFileInTerminal } from "../terminal/terminalUI.js";

export function validateAndRun(onPanelChange) {
  const current = state.files.get(state.activeFile);
  const lang = current ? current.language : "plaintext";
  const fileName = state.activeFile;

  // Make sure bottom panel is visible
  state.panelVisible = true;
  const panel = $("bottomPanel");
  if (panel) panel.style.display = "block";

  if (lang === "javascript" || fileName.endsWith(".js") || fileName.endsWith(".mjs")) {
    // Run directly inside the integrated terminal
    runActiveFileInTerminal(onPanelChange);
    toast(`Running ${fileName} in terminal`);
    return;
  }

  if (lang === "json" || fileName.endsWith(".json")) {
    const content = state.editor ? state.editor.getValue() : ($("fallbackEditor")?.value || "");
    try {
      JSON.parse(content);
      const msg = `JSON validation passed for ${fileName}. No syntax errors found.`;
      if ($("problemCount")) $("problemCount").textContent = "0";
      if ($("statusProblems")) {
        $("statusProblems").innerHTML = '<i class="bi bi-x-circle"></i> 0 <i class="bi bi-exclamation-triangle"></i> 0';
      }
      if (onPanelChange) onPanelChange("output");
      if ($("panel-output")) $("panel-output").textContent = msg;
      toast("JSON is valid");
      return;
    } catch (e) {
      const msg = `JSON validation error in ${fileName}: ${e.message}`;
      if ($("problemCount")) $("problemCount").textContent = "1";
      if ($("statusProblems")) {
        $("statusProblems").innerHTML = '<i class="bi bi-x-circle"></i> 1 <i class="bi bi-exclamation-triangle"></i> 0';
      }
      if (onPanelChange) onPanelChange("problems");
      if ($("panel-problems")) $("panel-problems").textContent = msg;
      toast("JSON validation failed");
      return;
    }
  }

  // Other languages: run in terminal or notify
  runActiveFileInTerminal(onPanelChange);
  toast(`Executed ${fileName}`);
}
