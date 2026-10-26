import { jVarState } from "../state/jVarState.js";

export function jFSetupResizeObserver() {
  const jVarContainer = $("monacoContainer");
  if (window.ResizeObserver && jVarContainer) {
    const jVarObserver = new ResizeObserver(() => {
      if (jVarState.editor) {
        jVarState.editor.layout();
      }
    });
    jVarObserver.observe(jVarContainer);
  }
}
