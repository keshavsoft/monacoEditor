let editor;
const files = {};
let activeFile = null;

function renderTabs() {
    const tabs = document.getElementById("tabsContainer");
    tabs.innerHTML = "";

    Object.keys(files).forEach((name) => {
        const tab = document.createElement("div");
        tab.className = `tab ${name === activeFile ? "active" : ""}`;
        tab.textContent = name;

        tab.onclick = () => switchFile(name);
        tabs.appendChild(tab);
    });
}

function switchFile(name) {
    if (!files[name]) return;

    activeFile = name;
    editor.setModel(files[name]);
    renderTabs();
}

function addFile(name, code) {
    files[name] = monaco.editor.createModel(code, "json");
    switchFile(name);
}

function uploadFile() {
    const input = document.getElementById("fileInput");
    input.click();

    input.onchange = async () => {
        const file = input.files[0];
        if (!file || !file.name.endsWith(".json")) return;

        addFile(file.name, await file.text());
        input.value = "";
    };
}

function resolveAssetUrl(assetName) {
    const currentUrl = new URL(window.location.href);
    const safePath = currentUrl.pathname.endsWith("/") ? currentUrl.pathname : `${currentUrl.pathname}/`;
    return new URL(assetName, `${currentUrl.origin}${safePath}`).href;
}

function StartFunc() {
    require.config({
        paths: {
            vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs"
        }
    });

    require(["vs/editor/editor.main"], async () => {
        const code = await fetch(resolveAssetUrl("sample.json")).then(res => res.text());

        editor = monaco.editor.create(document.getElementById("jsonEditor"), {
            model: monaco.editor.createModel(code, "json"),
            theme: "vs-dark",
            automaticLayout: true
        });

        files["sample.json"] = editor.getModel();
        activeFile = "sample.json";

        renderTabs();
        document.getElementById("uploadBtn").onclick = uploadFile;
    });
}

StartFunc();