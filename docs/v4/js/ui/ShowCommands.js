import { jFEscapeHtml } from "../state/EscapeHtml.js";
import { jFGetCommandsList } from "./GetCommandsList.js";
import { jFHideCommands } from "./HideCommands.js";

export function jFShowCommands(jVarFilter = "") {
  const jVarList = $("commandList");
  if (!jVarList) return;

  jVarList.innerHTML = "";
  const jVarCommands = jFGetCommandsList();

  jVarCommands
    .filter((jVarCmd) => jVarCmd[0].toLowerCase().includes(jVarFilter.toLowerCase()))
    .forEach((jVarCmd) => {
      const jVarEl = document.createElement("div");
      jVarEl.className = "command-item";
      jVarEl.innerHTML = `<span>${jFEscapeHtml(jVarCmd[0])}</span><small>${jFEscapeHtml(jVarCmd[1])}</small>`;
      jVarEl.onclick = () => {
        jFHideCommands();
        jVarCmd[2]();
      };
      jVarList.appendChild(jVarEl);
    });
}
