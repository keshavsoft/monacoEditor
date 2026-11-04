import { getEditor } from "../editor/editorInstance.js";
import { models } from "../editor/models.js";

let currentTab = "columns";

export function switchTab(tabName) {
    const editor = getEditor();
    if (!editor) return;

    currentTab = tabName;

    if (tabName === "columns" && models.columnsModel) {
        editor.setModel(models.columnsModel);
    } else if (tabName === "data" && models.dataModel) {
        editor.setModel(models.dataModel);
    }

    const tabColEl = document.getElementById("tabColumns");
    const tabDataEl = document.getElementById("tabData");

    if (tabColEl) tabColEl.classList.toggle("active", tabName === "columns");
    if (tabDataEl) tabDataEl.classList.toggle("active", tabName === "data");
}

export function getActiveTab() {
    return currentTab;
}

