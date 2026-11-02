let editor = null;
const files = {};
let activeFileName = null;

function renderTabs() {
    const container = document.getElementById("tabsContainer");
    if (!container) return;
    container.innerHTML = "";

    Object.keys(files).forEach((fileName) => {
        const tab = document.createElement("div");
        tab.className = `tab ${fileName === activeFileName ? "active" : ""}`;
        tab.title = fileName;

        const icon = document.createElement("span");
        icon.className = "tab-icon";
        icon.textContent = "JS";

        const name = document.createElement("span");
        name.className = "tab-name";
        name.textContent = fileName;

        const closeBtn = document.createElement("span");
        closeBtn.className = "tab-close";
        closeBtn.innerHTML = "&times;";
        closeBtn.title = "Close file";
        closeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            closeTab(fileName);
        });

        tab.appendChild(icon);
        tab.appendChild(name);
        tab.appendChild(closeBtn);

        tab.addEventListener("click", () => {
            if (fileName !== activeFileName) {
                switchToTab(fileName);
            }
        });

        container.appendChild(tab);
    });
}

function switchToTab(fileName) {
    if (!files[fileName] || !editor) return;

    if (activeFileName && files[activeFileName]) {
        files[activeFileName].state = editor.saveViewState();
    }

    activeFileName = fileName;
    editor.setModel(files[fileName].model);

    if (files[fileName].state) {
        editor.restoreViewState(files[fileName].state);
    }

    renderTabs();
    editor.focus();
}

function closeTab(fileName) {
    const fileKeys = Object.keys(files);
    if (fileKeys.length <= 1) {
        alert("Cannot close the only open tab.");
        return;
    }

    const index = fileKeys.indexOf(fileName);
    if (files[fileName] && files[fileName].model) {
        files[fileName].model.dispose();
    }
    delete files[fileName];

    if (activeFileName === fileName) {
        const remainingKeys = Object.keys(files);
        const nextIndex = Math.min(index, remainingKeys.length - 1);
        switchToTab(remainingKeys[nextIndex]);
    } else {
        renderTabs();
    }
}

function addOrOpenFile(fileName, content) {
    const uri = monaco.Uri.file(`/${fileName}`);
    let model = monaco.editor.getModel(uri);

    if (!model) {
        model = monaco.editor.createModel(content, "javascript", uri);
    } else {
        model.setValue(content);
    }

    files[fileName] = {
        model: model,
        state: null
    };

    renderTabs();
    switchToTab(fileName);
}

function setupUpload() {
    const uploadBtn = document.getElementById("uploadBtn");
    const fileInput = document.getElementById("fileInput");

    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener("click", () => {
            fileInput.click();
        });

        fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (!file.name.toLowerCase().endsWith(".js")) {
                alert("Please select a JavaScript (.js) file.");
                fileInput.value = "";
                return;
            }

            const reader = new FileReader();
            reader.onload = (evt) => {
                const content = evt.target.result;
                addOrOpenFile(file.name, content);
                fileInput.value = "";
            };
            reader.onerror = () => {
                alert(`Error reading file: ${file.name}`);
                fileInput.value = "";
            };
            reader.readAsText(file);
        });
    }

    // Drag and drop support
    window.addEventListener("dragover", (e) => {
        e.preventDefault();
        document.body.classList.add("dragging");
    });

    window.addEventListener("dragleave", (e) => {
        if (e.relatedTarget === null) {
            document.body.classList.remove("dragging");
        }
    });

    window.addEventListener("drop", (e) => {
        e.preventDefault();
        document.body.classList.remove("dragging");

        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file.name.toLowerCase().endsWith(".js")) {
                const reader = new FileReader();
                reader.onload = (evt) => {
                    addOrOpenFile(file.name, evt.target.result);
                };
                reader.readAsText(file);
            } else {
                alert("Please drop a JavaScript (.js) file.");
            }
        }
    });
}

function initEditor() {
    require.config({
        paths: {
            vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs"
        }
    });

    require(["vs/editor/editor.main"], function () {
        fetch("./sample.js")
            .then((res) => res.text())
            .then((code) => {
                const initialFileName = "sample.js";
                const uri = monaco.Uri.file(`/${initialFileName}`);
                const sampleModel = monaco.editor.createModel(code, "javascript", uri);

                files[initialFileName] = {
                    model: sampleModel,
                    state: null
                };

                editor = monaco.editor.create(document.getElementById("jsEditor"), {
                    model: sampleModel,
                    theme: "vs-dark",
                    automaticLayout: true
                });

                activeFileName = initialFileName;
                renderTabs();
                setupUpload();
            })
            .catch((err) => {
                console.error("Failed to load sample.js", err);
            });
    });
}

initEditor();
