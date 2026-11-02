
let editor, files = {}, activeFile;

function renderTabs() {
    const tabs = document.getElementById("tabsContainer");
    tabs.innerHTML = "";

    Object.keys(files).forEach(name => {
        const tab = document.createElement("button");
        tab.textContent = name + " ×";
        tab.onclick = () => switchTab(name);
        tabs.appendChild(tab);
    });
}

function switchTab(name) {
    activeFile = name;
    editor.setModel(files[name]);
    renderTabs();
}

function addFile(name, code) {
    files[name] = monaco.editor.createModel(
        code, "javascript", monaco.Uri.file("/" + name)
    );
    switchTab(name);
}

function StartFunc() {
    const editorPath = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs";

    require.config({ paths: { vs: editorPath } });

    require(["vs/editor/editor.main"], async function () {
        const editorElement = document.getElementById("jsEditor");
        const uploadButton = document.getElementById("uploadBtn");
        const fileInput = document.getElementById("fileInput");
        const fileName = "sample.js";

        const response = await fetch(`./${fileName}`);
        const sourceCode = await response.text();

        files[fileName] = monaco.editor.createModel(sourceCode, "javascript");

        editor = monaco.editor.create(editorElement, {
            model: files[fileName],
            theme: "vs-dark",
            automaticLayout: true
        });

        activeFile = fileName;
        renderTabs();

        uploadButton.onclick = function () {
            fileInput.click();
        };

        fileInput.onchange = async function (event) {
            const uploadedFile = event.target.files[0];

            if (!uploadedFile || !uploadedFile.name.endsWith(".js")) return;

            addFile(uploadedFile.name, await uploadedFile.text());
            fileInput.value = "";
        };
    });
}

StartFunc();
