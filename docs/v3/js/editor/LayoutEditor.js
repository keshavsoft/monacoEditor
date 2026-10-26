import { jVarState } from "../state/jVarState.js";

export function jFLayoutEditor() {
  if (jVarState.editor) {
    requestAnimationFrame(() => {
      jVarState.editor.layout();
      setTimeout(() => jVarState.editor?.layout(), 50);
      setTimeout(() => jVarState.editor?.layout(), 150);
    });
  }
}
