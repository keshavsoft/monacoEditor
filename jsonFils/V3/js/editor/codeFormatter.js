/**
 * @file codeFormatter.js
 * @description Code formatting service for active documents.
 * Dispatches Monaco's built-in formatDocument action when available,
 * or formats JSON structure safely via JSON.parse/stringify formatting.
 * Triggered by the Format toolbar button or Shift+Alt+F shortcut.
 */

import { state } from "../state/state.js";
import { toast } from "../state/helpers.js";
import { $ } from "../state/dom.js";

export function formatCode() {
  if (state.editor) {
    const action = state.editor.getAction("editor.action.formatDocument");
    if (action) {
      action.run();
      toast("Document formatted");
    } else {
      toast("Formatting is not available for this language.");
    }
  } else {
    const fallback = $("fallbackEditor");
    if (fallback) {
      try {
        const parsed = JSON.parse(fallback.value);
        fallback.value = JSON.stringify(parsed, null, 2);
        toast("JSON formatted");
      } catch (e) {
        toast("Could not format: " + e.message);
      }
    }
  }
}
