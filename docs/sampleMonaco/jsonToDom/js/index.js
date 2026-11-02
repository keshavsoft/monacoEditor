const state = {
    editor: null,
    currentModel: null,
    currentFileName: null
};

function renderTabs() {
    const tabs = document.getElementById("tabsContainer");
    if (!tabs) return;

    tabs.innerHTML = "";

    if (!state.currentFileName) return;

    const tab = document.createElement("div");
    tab.className = "tab active";
    tab.textContent = state.currentFileName;
    tabs.appendChild(tab);
}

function ensureMonacoLoaded() {
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

async function loadFileIntoEditor(fileName, content) {
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
    renderTabs();
}

function bindUpload() {
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
        await loadFileIntoEditor(file.name, content);
        fileInput.value = "";
    });
}

function initEditor() {
    const editorEl = document.getElementById("jsonEditor");
    if (editorEl) {
        editorEl.style.display = "none";
    }

    renderTabs();
    bindUpload();
}

initEditor();