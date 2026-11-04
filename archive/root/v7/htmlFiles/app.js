const htmlCode = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My HTML Page</title>
</head>

<body>

  <header id="header">
    <h1 class="title">Hello World</h1>
  </header>

  <main>
    <section class="content">
      <p>Welcome to Monaco HTML Editor with live HTML Statistics Counter!</p>
    </section>
  </main>

</body>
</html>
`;

let editor;
let currentFileName = "index.html";

const VS_PATH = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs";

// Read saved settings from LocalStorage
function loadSavedSettings() {
  try {
    const raw = localStorage.getItem("monaco_settings");
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    return {};
  }
}

// Calculate Live HTML Statistics (IDs, Classes, Tags)
function updateHTMLStats(editorInstance) {
  const statsElem = document.getElementById("html-stats");
  if (!statsElem || !editorInstance) return;

  const code = editorInstance.getValue();

  const idMatches = code.match(/id=["']([^"']+)["']/g) || [];
  const classMatches = code.match(/class=["']([^"']+)["']/g) || [];
  const tagMatches = code.match(/<[a-zA-Z1-6]+[^>]*>/g) || [];

  statsElem.textContent = `IDs: ${idMatches.length} Classes: ${classMatches.length} Tags: ${tagMatches.length}`;
}

function bootstrap() {
  const saved = loadSavedSettings();
  let currentFontSize = saved.fontSize || 14;

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
      value: htmlCode,
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

    // 1. Font Size Controls (A- 14px A+)
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

    // 2. How to Use Modal Handlers
    const howToUseBtn = document.getElementById("howtouse-button");
    const howToUseModal = document.getElementById("howtouse-modal");
    const closeHowToUse = document.getElementById("close-howtouse");

    howToUseBtn?.addEventListener("click", () => howToUseModal?.classList.add("active"));
    closeHowToUse?.addEventListener("click", () => howToUseModal?.classList.remove("active"));
    howToUseModal?.addEventListener("click", (e) => {
      if (e.target === howToUseModal) howToUseModal.classList.remove("active");
    });

    // 3. Upload HTML File Handler
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

      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target.result;
        editor.setValue(fileContent);
        updateHTMLStats(editor);
      };
      reader.readAsText(file);
    });

    // 4. Copy Code Handler
    document.getElementById("copy-button")?.addEventListener("click", () => {
      navigator.clipboard.writeText(editor.getValue());
      alert("HTML Code copied to clipboard!");
    });

    // 5. Download File Handler
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
