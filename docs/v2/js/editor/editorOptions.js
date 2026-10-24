/**
 * @file editorOptions.js
 * @description Manages editor layout dimensions and presentation options.
 * Handles Monaco layout recalculations on sidebar/panel toggling, window resize,
 * and word wrap toggling with visual state indicator on the wrap toolbar button.
 */

import { $ } from "../state/dom.js";
import { state } from "../state/state.js";
import { toast } from "../state/helpers.js";

export function layoutEditor() {
  if (state.editor) {
    requestAnimationFrame(() => {
      state.editor.layout();
      setTimeout(() => state.editor?.layout(), 50);
      setTimeout(() => state.editor?.layout(), 150);
    });
  }
}

export function setupResizeObserver() {
  const container = $("monacoContainer");
  if (window.ResizeObserver && container) {
    const observer = new ResizeObserver(() => {
      if (state.editor) {
        state.editor.layout();
      }
    });
    observer.observe(container);
  }
}

export function toggleWrap() {
  state.wrap = !state.wrap;
  if (state.editor) {
    state.editor.updateOptions({ wordWrap: state.wrap ? "on" : "off" });
  }
  const btn = $("wrapBtn");
  if (btn) btn.style.color = state.wrap ? "#3794ff" : "";
  toast("Word wrap " + (state.wrap ? "on" : "off"));
}
