import { jVarState } from "../state/jVarState.js";
import { jFLayoutEditor } from "../editor/LayoutEditor.js";

export function jFTogglePanel() {
  jVarState.panelVisible = !jVarState.panelVisible;
  const jVarPanel = $("bottomPanel");
  if (jVarPanel) {
    jVarPanel.style.display = jVarState.panelVisible ? "block" : "none";
  }
  jFLayoutEditor();
}
