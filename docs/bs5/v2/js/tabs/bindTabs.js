import { switchTab } from "./tabSwitcher.js";

export function bindTabs() {
    const tabCol = document.getElementById("tabColumns");
    const tabData = document.getElementById("tabData");

    if (tabCol) {
        tabCol.addEventListener("click", () => switchTab("columns"));
    }

    if (tabData) {
        tabData.addEventListener("click", () => switchTab("data"));
    }
}

