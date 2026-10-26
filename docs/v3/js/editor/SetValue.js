import { jVarState } from "../state/jVarState.js";
import { jFUpdateCursor } from "./UpdateCursor.js";

export function jFSetValue(jVarVal) {
  if (jVarState.editor) {
    jVarState.editor.setValue(jVarVal);
  } else {
    const jVarFallback = $("fallbackEditor");
    if (jVarFallback) jVarFallback.value = jVarVal;
  }
  jFUpdateCursor();
}
