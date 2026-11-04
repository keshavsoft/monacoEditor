import { loadMonaco } from "./monacoLoader.js";
import { initModels, models } from "./models.js";

let editor = null;

export async function createEditor() {
    const monaco = await loadMonaco();
    initModels(monaco);

    const container = document.getElementById("jsonEditor");
    if (!container) return null;

    editor = monaco.editor.create(container, {
        theme: "vs-dark",
        model: models.columnsModel,
        automaticLayout: true,
        tabSize: 2,
        minimap: { enabled: false },
        fontSize: 13,
        scrollBeyondLastLine: false
    });

    return editor;
}

export function getEditor() {
    return editor;
}

