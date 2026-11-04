export function createEditor({
  monaco,
  container,
  value,
  language,
  theme
}) {
  return monaco.editor.create(container, {
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
    }
  });
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