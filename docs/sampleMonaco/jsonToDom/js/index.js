import { updateFileLabel } from "./state.js";
import { bindUpload } from "./upload.js";
import renderJsonToDom from "./renderJsonToDom.js";

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
};

initEditor();