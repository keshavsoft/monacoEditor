function createEditor({
  monaco,
  container,
  value,
  language,
  theme,
  settings
}) {
  const editor = monaco.editor.create(container, {
    value,
    language,
    theme,

    automaticLayout: true,

    fontFamily: `'${settings.fontFamily}', monospace`,
    fontSize: settings.fontSize,
    lineHeight: 22,
    tabSize: settings.tabSize,

    wordWrap: settings.wordWrap ? "on" : "off",

    lineNumbers: settings.lineNumbers ? "on" : "off",

    minimap: {
      enabled: settings.minimap
    },

    smoothScrolling: settings.smoothScrolling,

    autoClosingBrackets:
      settings.autoClosingBrackets
        ? "always"
        : "never",

    autoClosingQuotes:
      settings.autoClosingQuotes
        ? "always"
        : "never",

    formatOnPaste: settings.formatOnPaste
  });

  /*
   * Ctrl + D
   *
   * Open Monaco's built-in Find widget.
   *
   * "actions.find" is Monaco's built-in
   * Find action.
   */
  editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyD,
    () => {
      const findAction =
        editor.getAction("actions.find");

      if (findAction) {
        findAction.run();
      }
    }
  );

  return editor;
}


function bindLineCounter(
  editor,
  lineCounterElement
) {
  function updateLineCounter() {
    const model =
      editor.getModel();

    if (!model) {
      lineCounterElement.textContent =
        "Lines: 0";

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


function bindHtmlStats(
  editor,
  statsElement
) {
  function updateHtmlStats() {
    const model =
      editor.getModel();

    if (!model) {
      statsElement.textContent =
        "IDs: 0   Classes: 0   Tags: 0";

      return;
    }

    const content =
      model.getValue();

    const parser =
      new DOMParser();

    const document =
      parser.parseFromString(
        content,
        "text/html"
      );

    const elements =
      document.querySelectorAll("*");

    const idCount =
      document.querySelectorAll(
        "[id]"
      ).length;

    const classNames =
      new Set();

    document
      .querySelectorAll("[class]")
      .forEach((element) => {
        element.classList.forEach(
          (className) => {
            classNames.add(
              className
            );
          }
        );
      });

    statsElement.textContent =
      `IDs: ${idCount}   Classes: ${classNames.size}   Tags: ${elements.length}`;
  }

  updateHtmlStats();

  editor.onDidChangeModelContent(
    updateHtmlStats
  );
}


function bindFontSizeControls(
  editor,
  decreaseButton,
  increaseButton,
  sizeElement
) {
  let fontSize =
    editor.getOption(
      monaco.editor.EditorOption.fontSize
    );

  function updateFontSize() {
    editor.updateOptions({
      fontSize
    });

    sizeElement.textContent =
      `${fontSize}px`;
  }

  decreaseButton.addEventListener(
    "click",
    () => {
      if (fontSize <= 8) {
        return;
      }

      fontSize -= 1;

      updateFontSize();
    }
  );

  increaseButton.addEventListener(
    "click",
    () => {
      if (fontSize >= 32) {
        return;
      }

      fontSize += 1;

      updateFontSize();
    }
  );

  updateFontSize();
}


window.createEditor =
  createEditor;

window.bindLineCounter =
  bindLineCounter;

window.bindHtmlStats =
  bindHtmlStats;

window.bindFontSizeControls =
  bindFontSizeControls;