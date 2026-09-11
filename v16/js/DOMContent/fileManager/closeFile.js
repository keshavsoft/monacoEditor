import { appState } from "../Monaco/state.js";
import { openFile } from "./openFile.js";
import { renderExplorer } from "./explorer.js";
import { renderTabs } from "../tabs/render.js";
import { log } from "../Monaco/terminal.js";

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