// File management module.
// Handles reading JS files, opening, closing and creating files.

import { appState } from "./state.js";
import { log } from "./terminal.js";
import { renderExplorer } from "./explorer.js";
import { renderTabs } from "./tabs.js";

export function openFile(name) {
    const file = appState.files[name];

    if (!file || !appState.editor) {
        return;
    }

    appState.currentFile = name;
    appState.editor.setValue(file.content);

    renderExplorer(openFile);
    renderTabs(openFile, closeFile);

    log("Opened " + name);
}

export function readJSFile() {
    document.getElementById("jsInput").click();
}

export function handleFileInput(event) {
    const file = event.target.files[0];

    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = (loadEvent) => {
        appState.files[file.name] = {
            name: file.name,
            type: "js",
            content: loadEvent.target.result
        };

        openFile(file.name);
        log("Read " + file.name, "ok");
    };

    reader.onerror = () => {
        log("Failed to read " + file.name);
    };

    reader.readAsText(file);

    // Allow selecting the same file again.
    event.target.value = "";
}

export function newFile() {
    let name = "new-file.js";
    let number = 1;

    while (appState.files[name]) {
        number++;
        name = "new-file-" + number + ".js";
    }

    appState.files[name] = {
        name,
        type: "js",
        content: "// New JavaScript file\n"
    };

    openFile(name);
    log("Created " + name, "ok");
}

export function closeFile(name) {
    delete appState.files[name];

    if (appState.currentFile === name) {
        const files = Object.keys(appState.files);

        appState.currentFile = files[0] || "";

        if (appState.editor) {
            appState.editor.setValue(
                appState.currentFile
                    ? appState.files[appState.currentFile].content
                    : ""
            );
        }
    }

    renderExplorer(openFile);
    renderTabs(openFile, closeFile);

    log("Closed " + name);
}
