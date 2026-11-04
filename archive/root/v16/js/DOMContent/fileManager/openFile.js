import { appState } from "../Monaco/state.js";
import { log } from "../Monaco/terminal.js";
import { renderExplorer } from "./explorer.js";
import { renderTabs } from "../tabs/render.js";
import { closeFile } from "./closeFile.js";

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