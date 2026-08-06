import { editorData } from "./core/editor-data.js";
import { defineTheme } from "./core/editor-theme.js";
import {
  createEditor,
  bindLineCounter
} from "./core/editor-setup.js";
import { showToast } from "./features/toast.js";
import { copy } from "./features/clipboard.js";
import { download } from "./features/download.js";

const elements = {
  editorContainer: document.getElementById("editor-container"),
  lineCounter: document.getElementById("line-count"),
  copyButton: document.getElementById("copy-button"),
  downloadButton: document.getElementById("download-button")
};

function initializeEditor() {
  require.config({
    paths: {
      vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs"
    }
  });

  require(["vs/editor/editor.main"], () => {
    const theme = defineTheme(monaco);

    const editor = createEditor({
      monaco,
      container: elements.editorContainer,
      value: editorData.fileCode,
      language: editorData.language,
      theme
    });

    bindLineCounter(editor, elements.lineCounter);

    elements.copyButton.addEventListener("click", () => {
      copy(editor, showToast);
    });

    elements.downloadButton.addEventListener("click", () => {
      download(editor, editorData.fileName, showToast);
    });
  });
}

try {
  initializeEditor();
} catch (error) {
  console.error(error);
  elements.lineCounter.textContent = "Failed to load editor";
}