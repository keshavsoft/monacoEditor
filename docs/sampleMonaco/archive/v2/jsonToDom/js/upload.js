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
    updateFileLabel(fileName || "No file selected");
}

export function bindUpload() {
    const uploadBtn = document.getElementById("uploadBtn");

    if (!uploadBtn) return;

    uploadBtn.addEventListener("click", async () => {
        if (!window.showOpenFilePicker) {
            alert("This browser does not support the File System Access API. Use a modern Chromium-based browser.");
            return;
        }

        try {
            const [fileHandle] = await window.showOpenFilePicker({
                types: [
                    {
                        description: "JSON Files",
                        accept: {
                            "application/json": [".json"],
                            "text/json": [".json"]
                        }
                    }
                ],
                multiple: false
            });

            const file = await fileHandle.getFile();
            const content = await file.text();
            await loadFileIntoEditor(file.name, content);
        } catch (error) {
            if (error && error.name !== "AbortError") {
                console.error("File picker failed:", error);
                alert("Unable to open the selected JSON file.");
            }
        }
    });
}
