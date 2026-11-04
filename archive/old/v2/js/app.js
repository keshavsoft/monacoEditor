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
    const themeName = window.defineTheme(window.monaco);

    editor = window.createEditor({
      monaco: window.monaco,
      container: document.getElementById("editor-container"),
      value: window.editorData.fileCode,
      language: window.editorData.language,
      theme: themeName
    });

    window.bindLineCounter(
      editor,
      document.getElementById("line-count")
    );

    document
      .getElementById("copy-button")
      .addEventListener("click", () => {
        window.copy(editor, window.showToast);
      });

    document
      .getElementById("download-button")
      .addEventListener("click", () => {
        window.download(
          editor,
          window.editorData.fileName,
          window.showToast
        );
      });

    const uploadButton = document.getElementById("upload-button");
    const fileUploadInput = document.getElementById("file-upload-input");

    uploadButton.addEventListener("click", () => {
      fileUploadInput.click();
    });

    fileUploadInput.addEventListener("change", () => {
      window.uploadJavaScriptFile({
        input: fileUploadInput,
        editor,
        editorData: window.editorData,
        fileNameElement: document.getElementById("file-name"),
        showToast: window.showToast
      });
    });
  });
}

if (window.require) {
  bootstrap();
}
