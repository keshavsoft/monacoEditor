// ============================================================
// index.js - Main Application Entry Point
// ============================================================

import { initMonaco } from "./monaco.js";
import {
    readJSFile,
    handleFileInput,
    newFile
} from "./file-manager.js";
import { downloadFile } from "./download.js";

// ------------------------------------------------------------
// DOM events
// ------------------------------------------------------------

function bindEvents() {
    document
        .getElementById("uploadJsBtn")
        .addEventListener("click", readJSFile);

    document
        .getElementById("newFileBtn")
        .addEventListener("click", newFile);

    document
        .getElementById("downloadBtn")
        .addEventListener("click", downloadFile);

    document
        .getElementById("jsInput")
        .addEventListener("change", handleFileInput);
}

// ------------------------------------------------------------
// Application startup
// ------------------------------------------------------------

async function initApp() {
    bindEvents();

    try {
        await initMonaco();
    } catch (error) {
        console.error("Monaco initialization failed:", error);
    }
}

document.addEventListener("DOMContentLoaded", initApp);
