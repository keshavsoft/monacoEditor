import { jFShowCommands } from "./ShowCommands.js";

export function jFShowCommandPalette() {
  const jVarBackdrop = $("commandBackdrop");
  const jVarSearchInput = $("commandSearch");
  if (!jVarBackdrop || !jVarSearchInput) return;

  jVarBackdrop.classList.add("open");
  jVarSearchInput.value = "";
  jFShowCommands();
  jVarSearchInput.focus();
}
