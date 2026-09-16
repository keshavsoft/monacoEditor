# Monaco Editor — Basic Usage

## 1. What is Monaco Editor?

Monaco Editor is a code editor component that gives a VS Code-like editing experience.

In our project, Monaco is used to:
- Display JavaScript code.
- Read uploaded `app.js` content.
- Show the code inside the editor.
- Read the current editor content.
- Access the editor model.
- Inspect language and tokenization information.
- Edit code programmatically.

## 2. Basic Flow

```text
Upload app.js
     ↓
FileReader reads the file
     ↓
reader.result
     ↓
editor.setValue(code)
     ↓
Monaco Editor displays the code
     ↓
Editor Model
     ↓
Inspect / Edit / Read
```

## 3. Create the Editor

```javascript
editor = monaco.editor.create(
    document.getElementById("editor"),
    {
        language: "javascript",
        theme: "vs-dark",
        readOnly: true,
        automaticLayout: true
    }
);
```

- `language` — tells Monaco the language.
- `theme` — controls the editor theme.
- `readOnly` — controls whether the user can edit.
- `automaticLayout` — adjusts the editor layout automatically.

## 4. Read an Uploaded JS File

```javascript
const file = event.target.files[0];

const reader = new FileReader();

reader.onload = () => {
    const code = reader.result;
    editor.setValue(code);
};

reader.readAsText(file);
```

Flow:

```text
app.js
  ↓
FileReader
  ↓
readAsText(file)
  ↓
reader.result
  ↓
actual JavaScript code
```

## 5. `editor.setValue()`

```javascript
editor.setValue(code);
```

Purpose:
- Replaces the current Monaco content with the supplied text.
- Used after reading the uploaded file.

Example:

```javascript
editor.setValue('console.log("Hello Monaco");');
```

## 6. `editor.getValue()`

```javascript
const code = editor.getValue();
```

Purpose:
- Gets the current text inside Monaco.
- Useful for saving edited code.
- Useful for sending code to an AST parser.
- Useful for running or validating code.

```text
Monaco Editor
     ↓
getValue()
     ↓
Current code as text
```

## 7. `editor.getModel()`

```javascript
const model = editor.getModel();
```

Purpose:
- Gets the document model currently used by the editor.
- The model represents the document/code behind the editor.

```text
Editor = visible UI
Model  = document/code
```

You can inspect it:

```javascript
console.log("getModel:", editor.getModel());
```

## 8. Get Language ID

```javascript
const model = editor.getModel();

console.log(
    "Language ID:",
    model.getLanguageId()
);
```

Example:

```text
javascript
```

This is useful when supporting multiple languages:

```text
app.js       → javascript
index.html   → html
style.css    → css
data.json    → json
```

## 9. Change Language

```javascript
monaco.editor.setModelLanguage(
    editor.getModel(),
    "javascript"
);
```

This changes the language associated with the current model.

## 10. Get Line Count

```javascript
const model = editor.getModel();

console.log(
    "Line count:",
    model.getLineCount()
);
```

If the file contains 50 lines:

```text
Line count: 50
```

## 11. Get a Particular Line

```javascript
const model = editor.getModel();

console.log(
    model.getLineContent(5)
);
```

This gets the content of line 5.

## 12. Get Cursor Position

```javascript
const position = editor.getPosition();

console.log(position);
```

It gives information such as:

```javascript
{
    lineNumber: 10,
    column: 5
}
```

Meaning:
- Line = 10
- Column = 5

## 13. Get Selected Text

```javascript
const selection = editor.getSelection();

const selectedText =
    editor.getModel().getValueInRange(selection);

console.log(selectedText);
```

This gets the code selected by the user.

## 14. Detect Editing Changes

```javascript
editor.onDidChangeModelContent(() => {

    const code = editor.getValue();

    console.log(
        "Updated code:",
        code
    );
});
```

Flow:

```text
User edits code
      ↓
onDidChangeModelContent()
      ↓
getValue()
      ↓
Updated code
```

## 15. Programmatically Edit Code

Monaco provides `executeEdits()` for programmatic changes.

Example:

```javascript
const model = editor.getModel();

const line = 5;

const range = new monaco.Range(
    line,
    1,
    line,
    model.getLineMaxColumn(line)
);

editor.executeEdits(
    "replace-line",
    [
        {
            range: range,
            text: 'console.log("New line");'
        }
    ]
);
```

This replaces the content of line 5.

## 16. Tokenization

In our project we can inspect the model's tokenization-related information:

```javascript
console.log(
    "Tokenization:",
    editor.getModel().tokenization
);
```

Tokenization means identifying different parts of source code.

Example:

```javascript
const name = "Srinivas";
```

Conceptually:

```text
const       → keyword
name        → identifier
=           → operator
"Srinivas"  → string
```

## 17. File Content vs Editor Content

These are two stages:

### Uploaded file

```javascript
reader.result
```

This is the text read from the uploaded file.

### Current editor

```javascript
editor.getValue()
```

This is the text currently inside Monaco.

Flow:

```text
app.js
  ↓
reader.result
  ↓
editor.setValue()
  ↓
Monaco
  ↓
User edits
  ↓
editor.getValue()
  ↓
Updated code
```

## 18. Useful Inspector Function

```javascript
function inspectEditor() {

    const model = editor.getModel();

    console.log("========== MONACO INSPECTOR ==========");

    console.log("Editor:", editor);

    console.log("Model:", model);

    console.log(
        "Language ID:",
        model.getLanguageId()
    );

    console.log(
        "Line Count:",
        model.getLineCount()
    );

    console.log(
        "Current Code:",
        editor.getValue()
    );

    console.log(
        "Cursor Position:",
        editor.getPosition()
    );

    console.log(
        "Selection:",
        editor.getSelection()
    );

    console.log(
        "Tokenization:",
        model.tokenization
    );

    console.log("======================================");
}
```

Call it:

```javascript
inspectEditor();
```

Then open:

```text
Browser
  ↓
Developer Tools
  ↓
Console
```

## 19. Important APIs

| API | Purpose |
|---|---|
| `monaco.editor.create()` | Creates the editor |
| `editor.setValue()` | Puts text into Monaco |
| `editor.getValue()` | Gets current editor text |
| `editor.getModel()` | Gets the document model |
| `model.getLanguageId()` | Gets the language ID |
| `model.getLineCount()` | Gets the number of lines |
| `model.getLineContent()` | Gets a particular line |
| `editor.getPosition()` | Gets cursor position |
| `editor.getSelection()` | Gets selected range |
| `model.getValueInRange()` | Gets selected text |
| `editor.executeEdits()` | Programmatically edits code |
| `editor.onDidChangeModelContent()` | Detects code changes |
| `model.tokenization` | Inspects tokenization-related model information |

## 20. Simple Story for Sir

> "First, we upload `app.js` and use FileReader to read the actual file content as text. Then we pass that content to Monaco using `editor.setValue()`. After loading, we can use `editor.getValue()` to read the current code, `editor.getModel()` to access the document model, `getLanguageId()` to identify the language, and model APIs to inspect lines and tokenization."

## 21. Key Point

Remember this:

```javascript
reader.result
        ↓
editor.setValue(code)
        ↓
editor.getModel()
        ↓
editor.getValue()
```

- `reader.result` = uploaded file content
- `editor.setValue()` = puts content into Monaco
- `editor.getModel()` = gets the document model
- `editor.getValue()` = gets the current Monaco code
