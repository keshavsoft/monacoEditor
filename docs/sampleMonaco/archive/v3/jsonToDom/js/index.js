import "https://keshavsoft.github.io/json-to-dom/dist/v42/min.js";

import { updateFileLabel } from "./state.js";
import { bindUpload } from "./upload.js";

function renderJsonToDom() {
    const editorEl = document.getElementById("jsonEditor");
    if (!editorEl || editorEl.style.display === "none") {
        preview.innerHTML = "<p>Upload a JSON file first.</p>";
        return;
    }

    const value = monaco.editor.getEditors().length > 0
        ? monaco.editor.getEditors()[0].getValue()
        : "";
    console.log("value : ", value);

    try {
        const parsed = JSON.parse(value);

        window.ks.jsonToDom.appendToDom({
            jsonSpec: parsed,
            targetHtmlId: "domPreview",
            options: {},
            classToApply: "",
            appendPosition: "append",
        });


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