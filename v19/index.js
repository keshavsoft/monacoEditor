const MONACO_PATH =
    "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs";

const EDITOR_PATH = "vs/editor/editor.main"

let editor;

require.config({
    paths: { vs: MONACO_PATH }
});

function StartFunc() {
    require([EDITOR_PATH], initializeEditor);
};

function initializeEditor() {

    editor = monaco.editor.create(
        document.getElementById("editor"),
        {
            language: "javascript",
            theme: "vs-dark",
            readOnly: true,
            automaticLayout: true
        }
    );

    document.getElementById("file").onchange = readAppJS;
};

function readAppJS(event) {
    const file = event.target.files[0];

    if (!file || file.name !== "app.js") {
        alert("Select app.js");
        return;
    }

    const reader = new FileReader();

    reader.onload = () => editor.setValue(reader.result);

    reader.readAsText(file);
}

StartFunc();