export const models = {
    columnsModel: null,
    dataModel: null
};

export function initModels(monaco) {
    models.columnsModel = monaco.editor.createModel("[]\n", "json");
    models.dataModel = monaco.editor.createModel("[]\n", "json");
    return models;
}

export function setColumnsContent(text) {
    if (models.columnsModel) {
        const val = typeof text === "string" ? text : JSON.stringify(text, null, 2);
        models.columnsModel.setValue(val);
    }
}

export function setDataContent(text) {
    if (models.dataModel) {
        const val = typeof text === "string" ? text : JSON.stringify(text, null, 2);
        models.dataModel.setValue(val);
    }
}

