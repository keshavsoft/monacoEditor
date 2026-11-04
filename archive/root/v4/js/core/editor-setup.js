window.MonacoEditorSetup = {
  createEditor({ monaco, container, value, language, theme }) {
    return monaco.editor.create(container, {
      value,
      language,
      theme,
      automaticLayout: true,
      fontFamily: "'Courier New', Courier, monospace",
      fontSize: 14,
      lineHeight: 22,
      tabSize: 2,
      wordWrap: 'on',
      minimap: { enabled: true }
    });
  },

  bindLineCounter(editor, lineCounterElement) {
    const updateLineCounter = () => {
      const lineCount = editor.getModel().getLineCount();
      lineCounterElement.textContent = `Lines: ${lineCount}`;
    };

    updateLineCounter();
    editor.onDidChangeModelContent(updateLineCounter);
  }
};