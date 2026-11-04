export function createEditor({
  monaco,
  container,
  value,
  language,
  theme
}) {
  // 1. Enable Out-of-the-box Syntax & Semantic Diagnostics for JavaScript
  if (monaco.languages?.typescript?.javascriptDefaults) {
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      diagnosticCodesToIgnore: []
    });
  }

  // 2. Create Monaco Editor Instance
  const editorInstance = monaco.editor.create(container, {
    value,
    language,
    theme,

    automaticLayout: true,

    fontFamily: "'Courier New', Courier, monospace",
    fontSize: 14,
    lineHeight: 22,
    tabSize: 2,

    wordWrap: "on",

    minimap: {
      enabled: true
    },

    // Enable hover tooltips and red squiggly error decorations
    hover: {
      enabled: true,
      delay: 200
    },
    renderValidationDecorations: "on"
  });

  return editorInstance;
}

export function bindLineCounter(
  editor,
  lineCounterElement
) {
  function updateLineCounter() {
    const model = editor.getModel();

    if (!model) {
      lineCounterElement.textContent = "Lines: 0";
      return;
    }

    lineCounterElement.textContent =
      `Lines: ${model.getLineCount()}`;
  }

  updateLineCounter();

  editor.onDidChangeModelContent(
    updateLineCounter
  );
}