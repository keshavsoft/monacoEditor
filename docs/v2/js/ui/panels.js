/**
 * @file panels.js
 * @description Controls bottom panel tabs (Problems, Output, Debug, Terminal) and visibility.
 * Synchronizes active tab states, shows/hides terminal header controls when Terminal tab
 * is active, and triggers Monaco editor relayout on panel state changes.
 */

import { $, $$ } from "../state/dom.js";
import { state } from "../state/state.js";
import { layoutEditor } from "../editor/editorOptions.js";

export function togglePanel() {
  state.panelVisible = !state.panelVisible;
  const panel = $("bottomPanel");
  if (panel) {
    panel.style.display = state.panelVisible ? "block" : "none";
  }
  layoutEditor();
}

export function setPanel(name) {
  state.activePanel = name;

  // Make sure panel is open
  if (!state.panelVisible) {
    state.panelVisible = true;
    const panel = $("bottomPanel");
    if (panel) panel.style.display = "block";
  }

  // Update tab highlights
  $$(".panel-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.panel === name);
  });

  // Update content visibility
  $$(".panel-content").forEach((content) => {
    content.classList.toggle("hidden", content.id !== "panel-" + name);
  });

  // If terminal tab is activated, focus input
  if (name === "terminal") {
    const termInput = $("terminalInput");
    if (termInput) {
      setTimeout(() => termInput.focus(), 50);
    }
  }

  layoutEditor();
}
