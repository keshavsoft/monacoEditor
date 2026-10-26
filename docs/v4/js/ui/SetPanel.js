import { jVarState } from "../state/jVarState.js";
import { jFLayoutEditor } from "../editor/LayoutEditor.js";

export function jFSetPanel(jVarName) {
  jVarState.activePanel = jVarName;

  // Ensure bottom panel is visible
  if (!jVarState.panelVisible) {
    jVarState.panelVisible = true;
    const jVarPanel = $("bottomPanel");
    if (jVarPanel) jVarPanel.style.display = "block";
  }

  // Update panel tabs active highlight
  $$(".panel-tab").forEach((jVarTab) => {
    jVarTab.classList.toggle("active", jVarTab.dataset.panel === jVarName);
  });

  // Update panel content view
  $$(".panel-content").forEach((jVarContent) => {
    jVarContent.classList.toggle("hidden", jVarContent.id !== "panel-" + jVarName);
  });

  // Focus terminal input if terminal panel
  if (jVarName === "terminal") {
    const jVarTermInput = $("terminalInput");
    if (jVarTermInput) {
      setTimeout(() => jVarTermInput.focus(), 50);
    }
  }

  jFLayoutEditor();
}
