import { appState } from "../Monaco/state.js";
import { openFile } from "./openFile.js";
import { log } from "../Monaco/terminal.js";

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