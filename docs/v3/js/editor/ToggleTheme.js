import { jVarState } from "../state/jVarState.js";
import { jVarThemeDarkVars, jVarThemeLightVars } from "../state/jVarConstants.js";

export function jFToggleTheme() {
  jVarState.dark = !jVarState.dark;
  document.documentElement.style.colorScheme = jVarState.dark ? "dark" : "light";
  const jVarVars = jVarState.dark ? jVarThemeDarkVars : jVarThemeLightVars;

  for (const [jVarKey, jVarValue] of Object.entries(jVarVars)) {
    document.documentElement.style.setProperty(jVarKey, jVarValue);
  }

  if (jVarState.editor && window.monaco) {
    window.monaco.editor.setTheme(jVarState.dark ? "vs-dark" : "vs");
  }

  const jVarThemeBtn = $("themeBtn");
  if (jVarThemeBtn) {
    jVarThemeBtn.innerHTML = `<i class="bi ${jVarState.dark ? "bi-sun" : "bi-moon-stars"}"></i>`;
  }
}
