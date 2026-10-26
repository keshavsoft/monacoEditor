import { jFLayoutEditor } from "../editor/LayoutEditor.js";

export function jFToggleExplorer() {
  const jVarExplorer = $("explorer");
  const jVarActivityBtn = $("activityExplorer");
  if (!jVarExplorer) return;

  const jVarIsCollapsed = jVarExplorer.classList.toggle("collapsed");

  if (jVarActivityBtn) {
    jVarActivityBtn.classList.toggle("active", !jVarIsCollapsed);
  }

  jFLayoutEditor();
}
