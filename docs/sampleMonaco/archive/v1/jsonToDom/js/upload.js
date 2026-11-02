import { state, updateFileLabel } from "./state.js";

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

export async function loadFileIntoEditor(fileName, content) {
    await ensureMonacoLoaded();

    const editorEl = document.getElementById("jsonEditor");
    if (!editorEl) return;

    if (!state.editor) {
        state.editor = monaco.editor.create(editorEl, {
            theme: "vs-dark",
            automaticLayout: true,
            minimap: { enabled: false }
        });
    }

    if (state.currentModel) {
        state.currentModel.dispose();
    }

    const model = monaco.editor.createModel(content, "json");
    state.currentModel = model;
    state.currentFileName = fileName;
    state.editor.setModel(model);

    editorEl.style.display = "block";
    updateFileLabel(file.name || fileName || "No file selected");
}

export function bindUpload() {
    const uploadBtn = document.getElementById("uploadBtn");
    const fileInput = document.getElementById("fileInput");

    if (!uploadBtn || !fileInput) return;

    uploadBtn.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.name.toLowerCase().endsWith(".json")) {
            alert("Please select a JSON (.json) file.");
            fileInput.value = "";
            return;
        }

        const content = await file.text();
        const fullPath = file.name || "No file selected";
        await loadFileIntoEditor(fullPath, content);
        fileInput.value = "";
    });
}
