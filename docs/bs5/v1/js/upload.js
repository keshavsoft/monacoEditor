import { state, switchTab } from "./state.js";

export function ensureMonacoLoaded() {
    return new Promise((resolve, reject) => {
        if (window.monaco && window.monaco.editor) {
            resolve();
            return;
        }

        require.config({
            paths: {
                vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs"
            }
        });

        require(["vs/editor/editor.main"], () => resolve(), (error) => reject(error));
    });
}

export async function initMonacoModels(initialColumns = [], initialData = []) {
    await ensureMonacoLoaded();

    const editorEl = document.getElementById("jsonEditor");
    if (!editorEl) return;

    const colStr = typeof initialColumns === "string" ? initialColumns : JSON.stringify(initialColumns, null, 2);
    const dataStr = typeof initialData === "string" ? initialData : JSON.stringify(initialData, null, 2);

    if (!state.columnsModel) {
        state.columnsModel = monaco.editor.createModel(colStr, "json");
    } else {
        state.columnsModel.setValue(colStr);
    }

    if (!state.dataModel) {
        state.dataModel = monaco.editor.createModel(dataStr, "json");
    } else {
        state.dataModel.setValue(dataStr);
    }

    if (!state.editor) {
        state.editor = monaco.editor.create(editorEl, {
            theme: "vs-dark",
            model: state.columnsModel,
            automaticLayout: true,
            tabSize: 2,
            minimap: { enabled: false },
            fontSize: 13,
            scrollBeyondLastLine: false
        });
    }

    editorEl.style.display = "block";
    switchTab("columns");
}
