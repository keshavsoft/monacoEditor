import { updateFileLabel } from "./state.js";
import { bindUpload } from "./upload.js";

function buildDomFromData(data, parent) {
    if (Array.isArray(data)) {
        const list = document.createElement("div");
        data.forEach((item) => {
            const row = document.createElement("div");
            row.style.margin = "6px 0";
            row.appendChild(buildDomFromData(item, row));
            list.appendChild(row);
        });
        return list;
    }

    if (data && typeof data === "object") {
        const wrapper = document.createElement("div");
        Object.entries(data).forEach(([key, value]) => {
            const row = document.createElement("div");
            row.style.margin = "6px 0";
            const label = document.createElement("strong");
            label.textContent = `${key}: `;
            row.appendChild(label);
            row.appendChild(buildDomFromData(value, row));
            wrapper.appendChild(row);
        });
        return wrapper;
    }

    const text = document.createElement("span");
    text.textContent = String(data);
    parent.appendChild(text);
    return parent;
}

function renderJsonToDom() {
    const preview = document.getElementById("domPreview");
    if (!preview) return;

    preview.innerHTML = "";

    const editorEl = document.getElementById("jsonEditor");
    if (!editorEl || editorEl.style.display === "none") {
        preview.innerHTML = "<p>Upload a JSON file first.</p>";
        return;
    }

    const value = monaco.editor.getEditors().length > 0
        ? monaco.editor.getEditors()[0].getValue()
        : "";

    try {
        const parsed = JSON.parse(value);
        const result = buildDomFromData(parsed, preview);
        preview.innerHTML = "";
        preview.appendChild(result);
    } catch (error) {
        preview.innerHTML = "<p>Invalid JSON. Please upload a valid JSON file.</p>";
    }
}

function initEditor() {
    const editorEl = document.getElementById("jsonEditor");
    if (editorEl) {
        editorEl.style.display = "none";
    }

    const renderBtn = document.getElementById("renderBtn");
    if (renderBtn) {
        renderBtn.addEventListener("click", renderJsonToDom);
    }

    updateFileLabel("No file selected");
    bindUpload();
}

initEditor();