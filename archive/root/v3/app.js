let editor;

const appDependencies = window.MonacoEditorApp;

function bootstrap() {
  const amdRequire = window.require;
  amdRequire.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });

  amdRequire(['vs/editor/editor.main'], function () {
    const themeName = window.MonacoEditorTheme.define(window.monaco);
    editor = window.MonacoEditorSetup.createEditor({
      monaco: window.monaco,
      container: document.getElementById('editor-container'),
      value: appDependencies.data.fileCode,
      language: appDependencies.data.language,
      theme: themeName
    });

    window.MonacoEditorSetup.bindLineCounter(editor, document.getElementById('line-count'));

    window.copyCode = function () {
      window.MonacoEditorClipboard.copy(editor, window.MonacoEditorToast.show);
    };

    window.downloadCode = function () {
      window.MonacoEditorDownload.download(editor, appDependencies.data.fileName, window.MonacoEditorToast.show);
    };
  });
}

if (window.require && window.MonacoEditorApp) {
  bootstrap();
}
