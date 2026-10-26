
function initJsonEditor() {
    require.config({
        paths: {
            vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs"
        }
    });

    require(["vs/editor/editor.main"], function () {
        fetch("./sample.json")
            .then(res => res.text())
            .then(code => {
                monaco.editor.create(document.getElementById("jsonEditor"), {
                    value: code,
                    language: "json",
                    theme: "vs-dark",
                    automaticLayout: true
                });
            });
    });
}

initJsonEditor();
