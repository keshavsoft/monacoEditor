// Download module.

import { appState } from "./state.js";
import { log } from "./terminal.js";

export function downloadFile() {
    if (!appState.currentFile || !appState.editor) {
        alert("Please open a file first");
        return;
    }

    const content = appState.editor.getValue();

    // Keep the latest editor content in application state.
    appState.files[appState.currentFile].content = content;

    const blob = new Blob(
        [content],
        { type: "text/javascript" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = appState.currentFile;

    link.click();

    URL.revokeObjectURL(url);

    log("Downloaded " + appState.currentFile, "ok");
}
