import { appState } from "./state.js";
import { log } from "./terminal.js";

function checkMonacoLoader() {
    if (typeof require === "undefined") {
        throw new Error("Monaco loader is not available.");
    }
}

function configureMonaco() {
    require.config({
        paths: {
            vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs"
        }
    });
}

function createEditor(element) {
    appState.editor = monaco.editor.create(element, {
        value: "// Upload a JavaScript file",
        language: "javascript",
        theme: "vs-dark",
        automaticLayout: true
    });

    log("Monaco Editor loaded", "ok");
}



export async function initMonaco() {
    try {
        checkMonacoLoader();
        configureMonaco();

        require(
            ["vs/editor/editor.main"],
            () => {
                try {
                    const element = document.getElementById("editor");

                    if (!element) {
                        throw new Error("Editor element not found.");
                    }
                    createEditor(element);
                } catch (error) {
                    log(`Monaco Editor failed: ${error.message}`, "error");

                }
            },
        );
    } catch (error) {
        log(`Monaco Editor failed: ${error.message}`, "error");
    }
}