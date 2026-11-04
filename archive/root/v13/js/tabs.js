// File tabs rendering module.

import { appState } from "./state.js";

export function renderTabs(openFile, closeFile) {
    const tabs = document.getElementById("tabs");
    tabs.innerHTML = "";

    Object.keys(appState.files).forEach((name) => {
        const tab = document.createElement("div");
        tab.className = "tab";

        if (name === appState.currentFile) {
            tab.classList.add("active");
        }

        tab.textContent = "📄 " + name;

        const close = document.createElement("span");
        close.className = "close";
        close.textContent = "×";

        close.addEventListener("click", (event) => {
            event.stopPropagation();
            closeFile(name);
        });

        tab.appendChild(close);

        tab.addEventListener("click", () => {
            openFile(name);
        });

        tabs.appendChild(tab);
    });
}
