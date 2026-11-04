import { editorData } from "./core/editor-data.js";
import { defineTheme } from "./core/editor-theme.js";
import {
  createEditor,
  bindLineCounter
} from "./core/editor-setup.js";
import { copy } from "./features/clipboard.js";
import { download } from "./features/download.js";
import { showToast } from "./features/toast.js";

let editor;

const VS_PATH =
  "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs";

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

  // Set model markers on Monaco Editor to render red squigglies & hover tooltips
  window.monaco.editor.setModelMarkers(model, "babel", markers);
}

function bootstrap() {
  const amdRequire = window.require;

  amdRequire.config({
    paths: {
      vs: VS_PATH
    }
  });

  amdRequire(["vs/editor/editor.main"], () => {
    const themeName = defineTheme(window.monaco);

    editor = createEditor({
      monaco: window.monaco,
      container: document.getElementById("editor-container"),
      value: editorData.fileCode,
      language: editorData.language,
      theme: themeName
    });

    bindLineCounter(
      editor,
      document.getElementById("line-count")
    );

    // Validate with Babel on load
    validateWithBabel(editor);

    // Validate with Babel on live edit
    editor.onDidChangeModelContent(() => {
      validateWithBabel(editor);
    });

    document
      .getElementById("copy-button")
      .addEventListener("click", () => {
        copy(editor, showToast);
      });

    document
      .getElementById("download-button")
      .addEventListener("click", () => {
        download(
          editor,
          editorData.fileName,
          showToast
        );
      });
  });
}

if (window.require) {
  bootstrap();
}