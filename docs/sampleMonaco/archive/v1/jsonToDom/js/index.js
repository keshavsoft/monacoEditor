import { updateFileLabel } from "./state.js";
import { bindUpload } from "./upload.js";

function initEditor() {
    const editorEl = document.getElementById("jsonEditor");
    if (editorEl) {
        editorEl.style.display = "none";
    }

    updateFileLabel("No file selected");
    bindUpload();
}

initEditor();