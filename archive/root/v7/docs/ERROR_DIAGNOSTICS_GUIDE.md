# 🔍 Monaco Editor - Error Diagnostics & Mouse Hover Tooltip Guide

This document explains the technical architecture behind **Red Squiggly Underlines** and **Mouse Hover Error Tooltips** in Monaco Editor.

---

## 1. Out-of-the-Box Monaco Diagnostics
Monaco Editor contains a built-in TypeScript/JavaScript Language Service. By calling:
```javascript
monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false
});
```
Monaco automatically validates JavaScript syntax and highlights basic errors out-of-the-box.

---

## 2. Custom Babel Markers (`monaco.editor.setModelMarkers`)
To feed custom Babel AST errors (e.g. `Identifier 'dotenv' has already been declared`) into Monaco Editor:
```javascript
const markers = [
  {
    startLineNumber: 3,
    startColumn: 7,
    endLineNumber: 3,
    endColumn: 22,
    message: "[Babel AST Error] Identifier 'dotenv' has already been declared.",
    severity: monaco.MarkerSeverity.Error
  }
];

monaco.editor.setModelMarkers(model, "babel", markers);
```

When `setModelMarkers` is invoked:
1. Monaco draws a **Red Squiggly Line** under line 3, column 7.
2. Hovering the mouse over line 3 displays an interactive **Error Tooltip Popup Card** containing the error message!
