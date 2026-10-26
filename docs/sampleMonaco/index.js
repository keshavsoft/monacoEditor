
require.config({
    paths: {
        vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs"
    }
});

require(["vs/editor/editor.main"], function () {
    monaco.editor.create(document.getElementById("jsonEditor"), {
        value: "{}",
        language: "json",
        theme: "vs-dark",
        automaticLayout: true
    });

    monaco.editor.create(document.getElementById("jsEditor"), {
        value: "console.log('Hello JavaScript');",
        language: "javascript",
        theme: "vs-dark",
        automaticLayout: true
    });
});
