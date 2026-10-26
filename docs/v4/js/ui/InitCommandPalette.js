import { jFShowCommands } from "./ShowCommands.js";
import { jFHideCommands } from "./HideCommands.js";

export function jFInitCommandPalette() {
  const jVarSearchInput = $("commandSearch");
  const jVarBackdrop = $("commandBackdrop");

  if (jVarSearchInput) {
    jVarSearchInput.addEventListener("input", (jVarEvent) => {
      jFShowCommands(jVarEvent.target.value);
    });

    jVarSearchInput.addEventListener("keydown", (jVarEvent) => {
      if (jVarEvent.key === "Escape") {
        jFHideCommands();
      }
      if (jVarEvent.key === "Enter") {
        const jVarFirstItem = $("commandList")?.querySelector(".command-item");
        jVarFirstItem?.click();
      }
    });
  }

  if (jVarBackdrop) {
    jVarBackdrop.addEventListener("click", (jVarEvent) => {
      if (jVarEvent.target === jVarBackdrop) {
        jFHideCommands();
      }
    });
  }
}
