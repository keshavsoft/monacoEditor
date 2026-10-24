/**
 * @file titleBar.js
 * @description Manages top application title bar display and updates.
 * Renders ONLY the active file name (e.g., 'sample.js' or 'spec.json') in the
 * center title element, without repeating 'keshavsoft editor' which is already
 * on the top-left brand bar. Solves the user's second reported problem.
 */

import { $ } from "../state/dom.js";
import { state } from "../state/state.js";

export function updateTitleBar() {
  const titleEl = $("windowTitle");
  if (titleEl) {
    // Show strictly the active file name in the center
    titleEl.textContent = state.activeFile || "untitled";
  }
}
