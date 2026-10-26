
function initEditor() {
    require.config({
        paths: {
            vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs"
        }
    });

    require(["vs/editor/editor.main"], function () {
        fetch("./sample.js")
            .then(res => res.text())
            .then(code => {
                monaco.editor.create(document.getElementById("jsEditor"), {
                    value: code,
                    language: "javascript",
                    theme: "vs-dark",
                    automaticLayout: true
                });
            });
    });
}

initEditor();
