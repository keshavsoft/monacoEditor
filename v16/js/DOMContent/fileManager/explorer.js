// Explorer rendering module.

import { appState } from "../Monaco/state.js";

export function renderExplorer(openFile) {
    const tree = document.getElementById("tree");
    tree.innerHTML = "";

    Object.keys(appState.files).forEach((name) => {
        const item = document.createElement("div");

        item.className = "tree-item";

        if (name === appState.currentFile) {
            item.classList.add("active");
        }

        item.textContent = "📄 " + name;

        item.addEventListener("click", () => {
            openFile(name);
        });

        tree.appendChild(item);
    });
}
