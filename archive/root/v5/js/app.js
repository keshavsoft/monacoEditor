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