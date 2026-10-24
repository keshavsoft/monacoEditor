/**
 * @file editorTheme.js
 * @description Manages light and dark theme switching for the workspace.
 * Synchronizes CSS variables, document color-scheme, Monaco Editor themes
 * (vs-dark vs vs), and toggles the sun/moon toolbar icon appropriately.
 */

import { $ } from "../state/dom.js";
import { state } from "../state/state.js";
import { THEME_DARK_VARS, THEME_LIGHT_VARS } from "../state/constants.js";

export function toggleTheme() {
  state.dark = !state.dark;
  document.documentElement.style.colorScheme = state.dark ? "dark" : "light";
  const vars = state.dark ? THEME_DARK_VARS : THEME_LIGHT_VARS;

  for (const [k, v] of Object.entries(vars)) {
    document.documentElement.style.setProperty(k, v);
  }

  if (state.editor && window.monaco) {
    window.monaco.editor.setTheme(state.dark ? "vs-dark" : "vs");
  }

  const themeBtn = $("themeBtn");
  if (themeBtn) {
    themeBtn.innerHTML = `<i class="bi ${state.dark ? "bi-sun" : "bi-moon-stars"}"></i>`;
  }
}
