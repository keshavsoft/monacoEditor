import { jVarState } from "../state/jVarState.js";
import { jFToast } from "../state/Toast.js";

export function jFFormatCode() {
  if (jVarState.editor) {
    const jVarAction = jVarState.editor.getAction("editor.action.formatDocument");
    if (jVarAction) {
      jVarAction.run();
      jFToast("Document formatted");
    } else {
      jFToast("Formatting is not available for this language.");
    }
  } else {
    const jVarFallback = $("fallbackEditor");
    if (jVarFallback) {
      try {
        const jVarParsed = JSON.parse(jVarFallback.value);
        jVarFallback.value = JSON.stringify(jVarParsed, null, 2);
        jFToast("JSON formatted");
      } catch (jVarErr) {
        jFToast("Could not format: " + jVarErr.message);
      }
    }
  }
}
