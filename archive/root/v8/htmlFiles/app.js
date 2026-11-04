const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My HTML Page</title>
  <style>
    body { font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 20px; }
    h1 { color: #c084fc; }
    .card { background: #1e293b; padding: 15px; border-radius: 12px; margin-top: 15px; }
  </style>
</head>
<body>

  <header id="header">
    <h1 class="title">Monaco v8 HTML Preview</h1>
  </header>

  <main>
    <div class="card">
      <p>Edit HTML live on the left and see instant rendered preview on the right!</p>
    </div>
  </main>

</body>
</html>
`;

let editor;
let currentFileName = "index.html";
let currentFontSize = 14;
let untitledCount = 1;

const filesBuffer = {
  "index.html": htmlCode,
  "template.html": `<h1>Sample Template</h1>`
};

const VS_PATH = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs";

function loadSavedSettings() {
  try {
    const raw = localStorage.getItem("monaco_settings");
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    return {};
  }
}

function updateHTMLStats(editorInstance) {
  const statsElem = document.getElementById("html-stats");
  if (!statsElem || !editorInstance) return;

  const code = editorInstance.getValue();
  filesBuffer[currentFileName] = code;

  const idMatches = code.match(/id=["']([^"']+)["']/g) || [];
  const classMatches = code.match(/class=["']([^"']+)["']/g) || [];
  const tagMatches = code.match(/<[a-zA-Z1-6]+[^>]*>/g) || [];

  statsElem.textContent = `IDs: ${idMatches.length} Classes: ${classMatches.length} Tags: ${tagMatches.length}`;

  updateLivePreview(code);
}

function updateLivePreview(code) {
  const previewIframe = document.getElementById("preview-iframe");
  if (!previewIframe) return;

  const doc = previewIframe.contentDocument || previewIframe.contentWindow.document;
  doc.open();
  doc.write(code);
  doc.close();
}

function switchToFile(fileName) {
  currentFileName = fileName;
  const titleElem = document.getElementById("file-title");
  if (titleElem) titleElem.textContent = currentFileName;

  if (filesBuffer[currentFileName] === undefined) {
    filesBuffer[currentFileName] = `<!-- ${currentFileName} -->\n<h1>New Page</h1>\n`;
  }

  editor.setValue(filesBuffer[currentFileName]);
  updateHTMLStats(editor);

  document.querySelectorAll(".tab-item").forEach(t => {
    if (t.getAttribute("data-file") === fileName) {
      t.classList.add("active");
    } else {
      t.classList.remove("active");
    }
  });
}

function bootstrap() {
  const saved = loadSavedSettings();
  currentFontSize = saved.fontSize || 14;

  const fontDisplay = document.getElementById("font-size-val");
  if (fontDisplay) fontDisplay.textContent = `${currentFontSize}px`;

  const amdRequire = window.require;

  amdRequire.config({
    paths: {
      vs: VS_PATH
    }
  });

  amdRequire(["vs/editor/editor.main"], () => {
    editor = window.monaco.editor.create(document.getElementById("editor-container"), {
      value: filesBuffer[currentFileName],
      language: "html",
      theme: saved.theme || "vs-dark",
      automaticLayout: true,
      fontFamily: saved.fontFamily || "'Courier New', Courier, monospace",
      fontSize: currentFontSize,
      lineHeight: 22,
      tabSize: saved.tabSize || 2,
      wordWrap: saved.wordWrap || "on",
      lineNumbers: saved.lineNumbers || "on",
      minimap: { enabled: saved.minimap !== false },
      smoothScrolling: saved.smoothScroll !== false,
      autoClosingBrackets: saved.autoBrackets !== false ? "always" : "never",
      autoClosingQuotes: saved.autoQuotes !== false ? "always" : "never",
      formatOnPaste: saved.formatOnPaste || false
    });

    const updateLineCount = () => {
      document.getElementById("line-count").textContent = `Lines: ${editor.getModel()?.getLineCount() || 0}`;
      updateHTMLStats(editor);
    };
    updateLineCount();
    editor.onDidChangeModelContent(updateLineCount);

    // 1. Live Render Preview Toggle Handler
    const previewContainer = document.getElementById("preview-container");
    document.getElementById("toggle-preview-btn")?.addEventListener("click", () => {
      previewContainer?.classList.toggle("open");
      editor.layout();
    });

    // 2. Existing Tabs Click Handlers
    document.querySelectorAll(".tab-item").forEach(tab => {
      tab.addEventListener("click", () => {
        const file = tab.getAttribute("data-file");
        switchToFile(file);
      });
    });

    // 3. (+) NEW TAB CREATION HANDLER FOR HTML
    const addBtn = document.getElementById("add-tab-btn");
    addBtn?.addEventListener("click", () => {
      const inputName = prompt("Enter new HTML file name:", `page-${untitledCount}.html`);
      if (!inputName) return;

      const newFileName = inputName.endsWith(".html") || inputName.endsWith(".htm") ? inputName : `${inputName}.html`;
      untitledCount++;

      const tabDiv = document.createElement("div");
      tabDiv.className = "tab-item";
      tabDiv.setAttribute("data-file", newFileName);
      tabDiv.innerHTML = `<span>📄 ${newFileName}</span>`;

      tabDiv.addEventListener("click", () => {
        switchToFile(newFileName);
      });

      addBtn.parentNode.insertBefore(tabDiv, addBtn);
      switchToFile(newFileName);
    });

    // 4. Font Size Controls (A- 14px A+)
    const fontDecBtn = document.getElementById("font-decrease");
    const fontIncBtn = document.getElementById("font-increase");

    fontDecBtn?.addEventListener("click", () => {
      if (currentFontSize > 10) {
        currentFontSize -= 1;
        editor.updateOptions({ fontSize: currentFontSize });
        if (fontDisplay) fontDisplay.textContent = `${currentFontSize}px`;
        saved.fontSize = currentFontSize;
        localStorage.setItem("monaco_settings", JSON.stringify(saved));
      }
    });

    fontIncBtn?.addEventListener("click", () => {
      if (currentFontSize < 24) {
        currentFontSize += 1;
        editor.updateOptions({ fontSize: currentFontSize });
        if (fontDisplay) fontDisplay.textContent = `${currentFontSize}px`;
        saved.fontSize = currentFontSize;
        localStorage.setItem("monaco_settings", JSON.stringify(saved));
      }
    });

    // 5. Upload HTML File Handler
    const uploadBtn = document.getElementById("upload-button");
    const uploadInput = document.getElementById("file-upload-input");

    uploadBtn?.addEventListener("click", () => {
      uploadInput?.click();
    });

    uploadInput?.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      currentFileName = file.name;
      const titleElem = document.getElementById("file-title");
      if (titleElem) titleElem.textContent = currentFileName;

      let existingTab = document.querySelector(`.tab-item[data-file="${currentFileName}"]`);
      if (!existingTab && addBtn) {
        const tabDiv = document.createElement("div");
        tabDiv.className = "tab-item";
        tabDiv.setAttribute("data-file", currentFileName);
        tabDiv.innerHTML = `<span>📄 ${currentFileName}</span>`;
        tabDiv.addEventListener("click", () => switchToFile(currentFileName));
        addBtn.parentNode.insertBefore(tabDiv, addBtn);
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target.result;
        filesBuffer[currentFileName] = fileContent;
        switchToFile(currentFileName);
      };
      reader.readAsText(file);
    });

    // 6. Copy & Download Handlers
    document.getElementById("copy-button")?.addEventListener("click", () => {
      navigator.clipboard.writeText(editor.getValue());
      alert("HTML Code copied to clipboard!");
    });

    document.getElementById("download-button")?.addEventListener("click", () => {
      const blob = new Blob([editor.getValue()], { type: "text/html" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = currentFileName;
      a.click();
    });
  });
}

if (window.require) {
  bootstrap();
}
