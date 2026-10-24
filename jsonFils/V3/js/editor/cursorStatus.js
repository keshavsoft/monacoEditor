/**
 * @file cursorStatus.js
 * @description Tracks and displays active cursor position (line and column) in status bar.
 * Reads positions from Monaco Editor cursor selection or fallback textarea
 * and updates the #cursorStatus element on every selection or keystroke.
 */

import { $ } from "../state/dom.js";
import { state } from "../state/state.js";

export function updateCursor() {
  let pos = { lineNumber: 1, column: 1 };

  if (state.editor) {
    pos = state.editor.getPosition() || pos;
  } else {
    const fallback = $("fallbackEditor");
    if (fallback) {
      const before = fallback.value.slice(0, fallback.selectionStart || 0);
      pos = {
        lineNumber: before.split("\n").length,
        column: before.length - (before.lastIndexOf("\n") + 1) + 1
      };
    }
  }

  const cursorEl = $("cursorStatus");
  if (cursorEl) {
    cursorEl.textContent = `Ln ${pos.lineNumber}, Col ${pos.column}`;
  }
}
