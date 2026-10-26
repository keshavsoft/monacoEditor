import { jVarState } from "../state/jVarState.js";

export function jFGetValue() {
  return jVarState.editor ? jVarState.editor.getValue() : ($("fallbackEditor")?.value || "");
}
