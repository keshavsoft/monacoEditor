# Monaco Editor — Implementation Documentation

## 1. Overview

This project uses **Monaco Editor** as the core code-editing component.

Monaco provides the editor UI, text model, language configuration, editor options, and content-change events.

Our application uses these Monaco APIs and adds application-specific features such as:

- File upload
- File download
- Copy to clipboard
- Line count
- HTML statistics
- Font-size controls
- Editor settings
- Toast notifications

The implementation is divided mainly between:

   text
index.html
    ↓
app.js
    ↓
editor-setup.js
    ↓
Monaco Editor




# 2. Editor Initialization

The Monaco loader is included in `index.html`.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.js"></script>
```

The application then loads Monaco through the AMD loader.

In `app.js`:

```javascript
const VS_PATH =
  "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs";

function bootstrap() {
  const amdRequire = window.require;

  amdRequire.config({
    paths: {
      vs: VS_PATH
    }
  });

  amdRequire(
    ["vs/editor/editor.main"],
    () => {
      // Monaco is ready
    }
  );
}
```

The purpose of this code is to configure the Monaco loader and load the Monaco editor module before creating the editor instance.

---

# 3. Creating the Editor

The actual editor creation is implemented in `editor-setup.js`.

```javascript
function createEditor({
  monaco,
  container,
  value,
  language,
  theme,
  settings
}) {
  return monaco.editor.create(container, {
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
}
```

The main Monaco API used here is:

```javascript
monaco.editor.create()
```

This creates the editor instance inside the specified container.

### Configuration

| Option            | Purpose                                      |
| ----------------- | -------------------------------------------- |
| `container`       | DOM element where Monaco is rendered         |
| `value`           | Initial source code                          |
| `language`        | Language used by Monaco                      |
| `theme`           | Monaco editor theme                          |
| `fontFamily`      | Editor font                                  |
| `fontSize`        | Editor font size                             |
| `tabSize`         | Tab size                                     |
| `wordWrap`        | Enables or disables word wrapping            |
| `lineNumbers`     | Shows or hides line numbers                  |
| `minimap`         | Enables or disables minimap                  |
| `automaticLayout` | Allows the editor to adapt to container size |

---

# 4. Editor Instance and Text Model

There are two important concepts in Monaco:

```text
Monaco Editor
      |
      +---- Editor Instance
      |
      +---- Text Model
```

The **editor instance** represents the editor UI.

The **text model** contains the source code being edited.

The model is accessed using:

```javascript
const model = editor.getModel();
```

The current source code is obtained using:

```javascript
const content = model.getValue();
```

This is important because `window.editorData.fileCode` contains the initial file content, while the Monaco model contains the **current content after the user edits the file**.

Therefore, features that need the latest source code use:

```javascript
editor.getModel()
```

followed by:

```javascript
model.getValue()
```

---

# 5. Monaco APIs Used in This Project

The main Monaco APIs used by the editor implementation are:

## `monaco.editor.create()`

Creates the Monaco editor.

```javascript
const editor =
  monaco.editor.create(
    container,
    options
  );
```

---

## `editor.getModel()`

Gets the text model associated with the editor.

```javascript
const model =
  editor.getModel();
```

---

## `model.getValue()`

Gets the current source code from the model.

```javascript
const content =
  model.getValue();
```

---

## `model.getLineCount()`

Gets the current number of lines.

```javascript
const lineCount =
  model.getLineCount();
```

---

## `editor.onDidChangeModelContent()`

Registers a listener that runs when the editor's model content changes.

```javascript
editor.onDidChangeModelContent(
  updateFunction
);
```

---

## `editor.updateOptions()`

Updates editor options after the editor has already been created.

```javascript
editor.updateOptions({
  fontSize
});
```

---

# 6. Line Counter

The line counter is implemented in `editor-setup.js`.

```javascript
function bindLineCounter(
  editor,
  lineCounterElement
) {
  function updateLineCounter() {
    const model = editor.getModel();

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
```

The actual calculation is:

```javascript
model.getLineCount()
```

The result is displayed in the status bar:

```text
Lines: 10
```

The function is executed once initially:

```javascript
updateLineCounter();
```

and then whenever the editor content changes:

```javascript
editor.onDidChangeModelContent(
  updateLineCounter
);
```

### Flow

```text
User edits code
      ↓
Monaco model changes
      ↓
onDidChangeModelContent
      ↓
updateLineCounter()
      ↓
model.getLineCount()
      ↓
Status bar updated
```

---

# 7. HTML Statistics

The editor also displays:

```text
IDs: X   Classes: Y   Tags: Z
```

This functionality is **not a built-in Monaco Editor feature**.

Monaco provides the current editor content through its model APIs.

The HTML analysis is implemented separately using browser-native DOM APIs.

The flow is:

```text
Monaco Editor
      ↓
editor.getModel()
      ↓
model.getValue()
      ↓
HTML source
      ↓
DOMParser
      ↓
Parsed HTML document
      ↓
IDs / Classes / Elements
      ↓
Status Bar
```

---

## Getting the Current HTML

The current content is obtained from the Monaco model:

```javascript
const model =
  editor.getModel();

const content =
  model.getValue();
```

---

## Parsing the HTML

The browser's native `DOMParser` is used:

```javascript
const parser =
  new DOMParser();

const document =
  parser.parseFromString(
    content,
    "text/html"
  );
```

This converts the HTML source string into a DOM document that can be queried using standard DOM APIs.

---

# 8. ID Calculation

The number of elements containing an `id` attribute is calculated using:

```javascript
const idCount =
  document.querySelectorAll("[id]").length;
```

The selector:

```text
[id]
```

matches every element that contains an `id` attribute.

For example:

```html
<div id="header"></div>
<section id="content"></section>
```

The result is:

```text
IDs: 2
```

This calculation is performed using the browser DOM API, not by Monaco itself.

---

# 9. Class Calculation

The application counts **unique class names**.

A JavaScript `Set` is used:

```javascript
const classNames =
  new Set();

document
  .querySelectorAll("[class]")
  .forEach((element) => {
    element.classList.forEach(
      (className) => {
        classNames.add(className);
      }
    );
  });
```

The final count is:

```javascript
classNames.size
```

For example:

```html
<div class="card active"></div>
<div class="card"></div>
<div class="card active"></div>
```

The class names encountered are:

```text
card
active
card
card
active
```

The `Set` stores only unique values:

```text
card
active
```

Therefore:

```text
Classes: 2
```

---

# 10. Tag / Element Calculation

The current implementation counts the total number of HTML elements.

```javascript
const elements =
  document.querySelectorAll("*");

const tagCount =
  elements.length;
```

The selector:

```text
*
```

matches all elements in the parsed document.

For example:

```html
<div>
  <p>Hello</p>
</div>
```

There are three elements:

```text
html
body
div
p
```

Depending on how the browser constructs the parsed document, the DOM also contains automatically created document elements such as `html` and `body`.

Therefore, the value represents the **total number of elements in the parsed DOM**, not the number of unique HTML tag names.

---

# 11. Complete HTML Statistics Function

The complete implementation is:

```javascript
function bindHtmlStats(
  editor,
  statsElement
) {
  function updateHtmlStats() {
    const model = editor.getModel();

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

    const idCount =
      document.querySelectorAll("[id]").length;

    const classNames =
      new Set();

    document
      .querySelectorAll("[class]")
      .forEach((element) => {
        element.classList.forEach(
          (className) => {
            classNames.add(className);
          }
        );
      });

    const elements =
      document.querySelectorAll("*");

    const tagCount =
      elements.length;

    statsElement.textContent =
      `IDs: ${idCount}   Classes: ${classNames.size}   Tags: ${tagCount}`;
  }

  updateHtmlStats();

  editor.onDidChangeModelContent(
    updateHtmlStats
  );
}
```

The important distinction is:

```text
Monaco
  ↓
getModel()
  ↓
getValue()
  ↓
Our HTML analysis
  ↓
DOMParser
  ↓
querySelectorAll()
  ↓
IDs / Classes / Elements
```

Monaco supplies the source text.

The browser DOM APIs perform the HTML analysis.

---

# 12. Live HTML Statistics

The statistics are recalculated whenever the editor content changes:

```javascript
editor.onDidChangeModelContent(
  updateHtmlStats
);
```

Therefore, the user does not need to refresh the page.

For example:

```text
Initial HTML
    ↓
IDs: 1   Classes: 2   Tags: 5

User edits HTML
    ↓
Monaco content-change event
    ↓
updateHtmlStats()
    ↓
HTML parsed again
    ↓
New statistics
```

This keeps the status bar synchronized with the current editor content.

---

# 13. Font Size Controls

The application provides `A−` and `A+` controls.

The actual Monaco editor option is updated using:

```javascript
editor.updateOptions({
  fontSize
});
```

The application limits the font size.

Minimum:

```javascript
if (fontSize <= 8) {
  return;
}
```

Maximum:

```javascript
if (fontSize >= 32) {
  return;
}
```

The flow is:

```text
A− / A+
   ↓
Change fontSize
   ↓
editor.updateOptions()
   ↓
Monaco updates editor
```

The editor is not recreated when the font size changes.

---

# 14. Application Flow

`app.js` is responsible for initializing Monaco and connecting the application features.

The sequence is:

```text
index.html
    ↓
Monaco loader
    ↓
app.js
    ↓
Load editor.main
    ↓
createEditor()
    ↓
Monaco Editor Instance
    ↓
Bind application features
```

The editor is created in `app.js` using the function exposed by `editor-setup.js`:

```javascript
editor =
  window.createEditor({
    monaco: window.monaco,

    container:
      document.getElementById(
        "editor-container"
      ),

    value:
      window.editorData.fileCode,

    language:
      window.editorData.language,

    theme:
      themeName,

    settings:
      editorSettings
  });
```

After creation, the same editor instance is passed to the required features.

For example:

```javascript
window.bindLineCounter(
  editor,
  document.getElementById(
    "line-count"
  )
);
```

and:

```javascript
window.bindHtmlStats(
  editor,
  htmlStats
);
```

---

# 15. `app.js` vs `editor-setup.js`

The responsibilities are separated.

## `app.js`

`app.js` is responsible for:

* Starting the application
* Loading Monaco
* Reading editor settings
* Creating the editor
* Connecting UI events
* Initializing editor features

Conceptually:

```text
app.js
   |
   +-- Load Monaco
   |
   +-- Create editor
   |
   +-- Bind features
   |
   +-- Handle application events
```

## `editor-setup.js`

`editor-setup.js` contains the editor-related implementation:

```text
editor-setup.js
   |
   +-- createEditor()
   |
   +-- bindLineCounter()
   |
   +-- bindHtmlStats()
   |
   +-- bindFontSizeControls()
```

This keeps the application bootstrap separate from the actual editor setup logic.

---

# 16. Monaco Features vs Custom Features

This is an important architectural distinction.

## Monaco APIs used

```javascript
monaco.editor.create()
editor.getModel()
model.getValue()
model.getLineCount()
editor.onDidChangeModelContent()
editor.updateOptions()
```

These are used to interact with the Monaco editor and its text model.

## Custom application functionality

The following functionality is implemented by our application:

```text
HTML ID counting
Unique class counting
HTML element counting
Status-bar statistics
File upload
File download
Clipboard handling
Toast notifications
Font-size controls
Settings persistence
```

For HTML statistics:

```text
Monaco
   ↓
getModel()
   ↓
getValue()
   ↓
HTML source
   ↓
DOMParser
   ↓
Browser DOM APIs
   ↓
ID / Class / Element counts
   ↓
Status Bar
```

Therefore:

> **Monaco provides the editor and model APIs. The application uses those APIs and implements project-specific functionality around them.**

---

# 17. Official Monaco Documentation

The implementation should be understood together with the official Monaco Editor API documentation.

Official documentation:

[https://microsoft.github.io/monaco-editor/](https://microsoft.github.io/monaco-editor/)

The main APIs relevant to this implementation are:

```text
monaco.editor.create()
editor.getModel()
model.getValue()
model.getLineCount()
editor.onDidChangeModelContent()
editor.updateOptions()
```

The HTML statistics functionality is separate from Monaco and uses standard browser APIs:

```text
DOMParser
querySelectorAll()
classList
Set
```

This distinction helps identify which parts are provided by Monaco and which parts are implemented by the application.

---

# 18. Final Architecture

The complete editor flow can be summarized as:

```text
                         index.html
                              |
                              v
                            app.js
                              |
                              v
                     Monaco AMD Loader
                              |
                              v
                   monaco.editor.create()
                              |
                              v
                      Monaco Editor
                              |
                    +---------+---------+
                    |                   |
                    v                   v
              Editor Instance       Text Model
                    |                   |
                    |            +------+------+
                    |            |      |      |
                    |            v      v      v
                    |        getValue  Lines  Change Event
                    |            |
                    |            v
                    |        HTML Source
                    |            |
                    |        DOMParser
                    |            |
                    |            v
                    |        Parsed DOM
                    |            |
                    |      +-----+-----+
                    |      |     |     |
                    |      v     v     v
                    |     IDs Classes Elements
                    |      |     |     |
                    +------+-----+-----+
                           |
                           v
                      Status Bar
```

## Key Principle

**Monaco Editor is used as the editor engine.**

**The Monaco model APIs provide access to the current source and editor state.**

**Application-specific features are implemented separately on top of those APIs.**

For the HTML statistics feature specifically:

```text
Monaco Text Model
       ↓
model.getValue()
       ↓
HTML source
       ↓
DOMParser
       ↓
DOM queries
       ↓
IDs / Unique Classes / Elements
       ↓
Status Bar
```

This separation makes it clear which functionality comes from Monaco and which functionality is implemented by the application.
git add docs/byExtension/monaco-editor.md