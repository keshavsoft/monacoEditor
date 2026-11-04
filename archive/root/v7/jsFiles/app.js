const initialCode = `import express from 'express';

import funcFromshowAll from './showAll/controller.js';
import funcFrominsertWithMeta from './insertWithMeta/controller.js';
import funcFromdel from './del/controller.js';
import funcFrommodify from './modify/controller.js';

const tableName = "doctors.json";
const tablePath = "Data/doctors.json";
const configPath = "Config/Schemas/doctors.json";

const router = express.Router();

router.get('/showAll', (req, res) =>
  funcFromshowAll({
    req,
    res,
    inTablePath: tablePath
  })
);

router.post('/insertWithMeta', express.json(), (req, res) =>
  funcFrominsertWithMeta({
    req,
    res,
    inTablePath: tablePath,
    inConfigPath: configPath
  })
);

router.delete('/del/:pk', (req, res) =>
  funcFromdel({
    req,
    res,
    inTablePath: tablePath
  })
);

router.put('/modify', express.json(), (req, res) =>
  funcFrommodify({
    req,
    res,
    inTablePath: tablePath,
    inConfigPath: configPath
  })
);

export { router };
`;

let editor;
let currentFileName = "end-points.js";

const VS_PATH = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs";

function loadSavedSettings() {
  try {
    const raw = localStorage.getItem("monaco_settings");
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    return {};
  }
}

function validateWithBabel(editorInstance) {
  const model = editorInstance.getModel();
  if (!model) return;

  const code = editorInstance.getValue();
  const markers = [];

  if (window.Babel) {
    try {
      const result = window.Babel.transform(code, {
        ast: true,
        code: false,
        sourceType: "module"
      });

      if (result.ast?.errors && result.ast.errors.length > 0) {
        for (const err of result.ast.errors) {
          const line = err.loc?.line || 1;
          const col = err.loc?.column || 1;

          markers.push({
            startLineNumber: line,
            startColumn: col,
            endLineNumber: line,
            endColumn: col + 15,
            message: `[Babel AST Error] ${err.message}`,
            severity: window.monaco.MarkerSeverity.Error
          });
        }
      }
    } catch (err) {
      const line = err.loc?.line || 1;
      const col = err.loc?.column || 1;

      markers.push({
        startLineNumber: line,
        startColumn: col,
        endLineNumber: line,
        endColumn: col + 15,
        message: `[Babel Parse Error] ${err.message}`,
        severity: window.monaco.MarkerSeverity.Error
      });
    }
  }

  window.monaco.editor.setModelMarkers(model, "babel", markers);
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
    if (window.monaco.languages?.typescript?.javascriptDefaults) {
      window.monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
        diagnosticCodesToIgnore: []
      });
    }

    editor = window.monaco.editor.create(document.getElementById("editor-container"), {
      value: initialCode,
      language: "javascript",
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
      formatOnPaste: saved.formatOnPaste || false,
      hover: { enabled: true, delay: 200 },
      renderValidationDecorations: "on"
    });

    const updateLineCount = () => {
      document.getElementById("line-count").textContent = `Lines: ${editor.getModel()?.getLineCount() || 0}`;
    };
    updateLineCount();
    editor.onDidChangeModelContent(updateLineCount);

    // Initial Babel AST Validation
    validateWithBabel(editor);
    editor.onDidChangeModelContent(() => {
      validateWithBabel(editor);
    });

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

    // 3. Upload JS File Handler
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
        validateWithBabel(editor);
      };
      reader.readAsText(file);
    });

    // 4. Copy Code Handler
    document.getElementById("copy-button")?.addEventListener("click", () => {
      navigator.clipboard.writeText(editor.getValue());
      alert("Code copied to clipboard!");
    });

    // 5. Download File Handler
    document.getElementById("download-button")?.addEventListener("click", () => {
      const blob = new Blob([editor.getValue()], { type: "text/javascript" });
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
