export const state = {
    editor: null,
    columnsModel: null,
    dataModel: null,
    activeTab: "columns"
};

export function switchTab(tabName) {
    if (!state.editor) return;

    state.activeTab = tabName;

    if (tabName === "columns" && state.columnsModel) {
        state.editor.setModel(state.columnsModel);
    } else if (tabName === "data" && state.dataModel) {
        state.editor.setModel(state.dataModel);
    }

    const tabColEl = document.getElementById("tabColumns");
    const tabDataEl = document.getElementById("tabData");

    if (tabColEl) tabColEl.classList.toggle("active", tabName === "columns");
    if (tabDataEl) tabDataEl.classList.toggle("active", tabName === "data");
}

export function setColumns(content) {
    const text = typeof content === "string" ? content : JSON.stringify(content, null, 2);
    if (state.columnsModel) {
        state.columnsModel.setValue(text);
    }
    switchTab("columns");
}

export function setData(content) {
    const text = typeof content === "string" ? content : JSON.stringify(content, null, 2);
    if (state.dataModel) {
        state.dataModel.setValue(text);
    }
    switchTab("data");
}
