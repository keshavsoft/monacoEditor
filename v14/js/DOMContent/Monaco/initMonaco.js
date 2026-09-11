// Monaco Editor initialization.

import { appState } from "./state.js";
import { log } from "./terminal.js";

export function initMonaco() {
    return new Promise((resolve, reject) => {
        if (typeof require === "undefined") {
            reject(new Error("Monaco loader is not available."));
            return;
        }

        require.config({
            paths: {
                vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs"
            }
        });

        require(
            ["vs/editor/editor.main"],
            () => {
                appState.editor = monaco.editor.create(
                    document.getElementById("editor"),
                    {
                        value: "// Upload a JavaScript file",
                        language: "javascript",
                        theme: "vs-dark",
                        automaticLayout: true
                    }
                );

                log("Monaco Editor loaded", "ok");
                resolve(appState.editor);
            },
            reject
        );
    });
}
