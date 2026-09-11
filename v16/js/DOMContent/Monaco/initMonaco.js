import { appState } from "./state.js";
import { log } from "./terminal.js";

const MONACO_PATH =
    "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs";

function loadMonaco() {
    require(["vs/editor/editor.main"], initializeEditor, handleError);
};

function checkLoader() {
    if (typeof require === "undefined") {
        throw new Error("Monaco loader is not available.");
    }
};

function configureLoader() {
    require.config({
        paths: {
            vs: MONACO_PATH
        }
    });
};

function initializeEditor() {
    const element = document.getElementById("editor");

    if (!element) {
        throw new Error("Editor element not found.");
    }

    appState.editor = monaco.editor.create(element, {
        value: "// Upload a JavaScript file",
        language: "javascript",
        theme: "vs-dark",
        automaticLayout: true
    });

    log("Monaco Editor loaded", "ok");
};

function handleError(error) {
    log(`Monaco Editor failed: ${error.message}`, "error");
};

export async function initMonaco() {
    try {
        checkLoader();
        configureLoader();
        loadMonaco();
    } catch (error) {
        handleError(error);
    }
};