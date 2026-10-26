import { jVarState } from "../state/jVarState.js";
import { jFToast } from "../state/Toast.js";

export function jFToggleWrap() {
  jVarState.wrap = !jVarState.wrap;
  if (jVarState.editor) {
    jVarState.editor.updateOptions({ wordWrap: jVarState.wrap ? "on" : "off" });
  }
  const jVarBtn = $("wrapBtn");
  if (jVarBtn) {
    jVarBtn.style.color = jVarState.wrap ? "#3794ff" : "";
  }
  jFToast("Word wrap " + (jVarState.wrap ? "on" : "off"));
}
