function defineTheme(monaco) {
  const themeName = "custom-dark";

  monaco.editor.defineTheme(themeName, {
    base: "vs-dark",

    inherit: true,

    rules: [
      {
        token: "comment",
        foreground: "6b7280",
        fontStyle: "italic"
      },
      {
        token: "keyword",
        foreground: "c084fc",
        fontStyle: "bold"
      },
      {
        token: "string",
        foreground: "a5f3fc"
      },
      {
        token: "number",
        foreground: "f472b6"
      }
    ],

    colors: {
      "editor.background": "#111827",
      "editor.foreground": "#f3f4f6",
      "editor.lineHighlightBackground": "#1f2937",
      "editorLineNumber.foreground": "#4b5563",
      "editorLineNumber.activeForeground": "#c084fc",
      "editorCursor.foreground": "#c084fc"
    }
  });

  return themeName;
}

window.defineTheme = defineTheme;