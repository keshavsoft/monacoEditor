/**
 * @file sidebar.js
 * @description Manages left explorer sidebar toggling and activity bar state.
 * Toggles the 'collapsed' class on the sidebar, updates the activity bar button
 * highlight, and triggers layoutEditor to adapt Monaco editor width smoothly.
 */

import { $ } from "../state/dom.js";
import { layoutEditor } from "../editor/editorOptions.js";

export function toggleExplorer() {
  const explorer = $("explorer");
  const activityBtn = $("activityExplorer");
  if (!explorer) return;

  const isCollapsed = explorer.classList.toggle("collapsed");

  if (activityBtn) {
    activityBtn.classList.toggle("active", !isCollapsed);
  }

  layoutEditor();
}
