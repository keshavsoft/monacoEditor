# Monaco Editor — v3

## Overview

Version 3 is a modular browser-based Monaco Editor implementation for
editing JavaScript source files.

The v3 implementation separates the editor functionality into
multiple JavaScript modules. Each module has a specific responsibility,
while `app.js` acts as the application entry point.

The editor is configured to edit:

```text
end-points.js
````

The main page is:

```text
index.html
```

---

# 1. v3 Directory Structure

```text
v3/
│
├── index.html
├── style.css
│
├── editor-data.js
├── editor-theme.js
├── editor-setup.js
├── toast.js
├── clipboard.js
├── download.js
│
├── app.js
│
└── README_v3.md
```

---

# 2. Application Architecture

The v3 implementation follows a modular structure.

```text
                        index.html
                            │
                            ▼
                    Monaco AMD Loader
                            │
                            ▼
                    editor-data.js
                            │
                            ▼
                   editor-theme.js
                            │
                            ▼
                   editor-setup.js
                            │
                ┌───────────┼───────────┐
                │           │           │
                ▼           ▼           ▼
          Line Counter   HTML Stats   Font Size
                │
                ▼
              app.js
                │
        ┌───────┼────────┐
        │       │        │
        ▼       ▼        ▼
      Toast   Copy     Download
```

The purpose of this structure is to keep editor initialization,
editor-specific features, and application actions separated.

---

# 3. `index.html`

`index.html` is the main entry point of the v3 editor.

It provides the user interface and loads the required JavaScript
modules.

The page contains:

* Application header
* JavaScript file name
* Copy Code button
* Download File button
* Monaco editor container
* Status bar
* Line counter
* Encoding information
* Language information
* Monaco CDN information
* Toast notification container

---

# 4. HTML Page Structure

The main application structure is:

```text
Application
│
├── Header
│   ├── Logo
│   ├── File name
│   ├── Copy Code
│   └── Download File
│
├── Workspace
│   └── Monaco Editor
│
└── Status Bar
    ├── Line count
    ├── UTF-8
    ├── JavaScript
    └── Monaco Editor CDN
```

The Monaco editor is rendered inside:

```html
<div id="editor-container"></div>
```

---

# 5. Monaco Editor

The project uses Monaco Editor as the code editor.

The Monaco AMD loader is loaded from the CDN:

```html
<script
  src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.js">
</script>
```

The loader is responsible for loading the Monaco Editor modules
required by the application.

---

# 6. JavaScript Module Loading

The v3 page loads the application modules in the following order:

```html
<script src="editor-data.js"></script>
<script src="editor-theme.js"></script>
<script src="editor-setup.js"></script>
<script src="toast.js"></script>
<script src="clipboard.js"></script>
<script src="download.js"></script>
<script src="app.js"></script>
```

The order allows the application entry point to use functionality
provided by the modules loaded before it.

---

# 7. `editor-data.js`

`editor-data.js` contains the initial editor data.

This includes information such as:

* File name
* File content
* Programming language

The editor setup uses this data while creating the Monaco Editor
instance.

Conceptually:

```text
editor-data.js
     │
     ├── fileName
     ├── fileCode
     └── language
             │
             ▼
       editor-setup.js
```

---

# 8. `editor-theme.js`

`editor-theme.js` contains the Monaco Editor theme configuration.

The theme is created before the editor is initialized.

The resulting theme is passed to the Monaco editor during creation.

The flow is:

```text
editor-theme.js
      │
      ▼
Define Monaco Theme
      │
      ▼
editor-setup.js
      │
      ▼
monaco.editor.create()
```

---

# 9. `editor-setup.js`

`editor-setup.js` contains the main Monaco Editor configuration.

It is responsible for:

* Creating the Monaco Editor
* Applying editor settings
* Configuring editor behavior
* Counting lines
* Calculating HTML statistics
* Controlling editor font size
* Registering application-specific editor commands

The main functions are:

```text
createEditor()
bindLineCounter()
bindHtmlStats()
bindFontSizeControls()
```

These functions are exposed to the application through the `window`
object.

---

# 10. Creating the Editor

The editor is created using Monaco's editor creation API:

```javascript
monaco.editor.create(...)
```

The editor receives:

* Container
* Initial value
* Programming language
* Theme
* Font configuration
* Tab size
* Word wrapping
* Line numbers
* Minimap configuration
* Smooth scrolling
* Auto-closing brackets
* Auto-closing quotes
* Format-on-paste configuration

The configuration follows the application settings.

Example:

```javascript
const editor = monaco.editor.create(container, {
  value,
  language,
  theme,

  automaticLayout: true,

  fontFamily: `'${settings.fontFamily}', monospace`,
  fontSize: settings.fontSize,
  lineHeight: 22,
  tabSize: settings.tabSize,

  wordWrap:
    settings.wordWrap ? "on" : "off",

  lineNumbers:
    settings.lineNumbers ? "on" : "off",

  minimap: {
    enabled: settings.minimap
  },

  smoothScrolling:
    settings.smoothScrolling,

  autoClosingBrackets:
    settings.autoClosingBrackets
      ? "always"
      : "never",

  autoClosingQuotes:
    settings.autoClosingQuotes
      ? "always"
      : "never",

  formatOnPaste:
    settings.formatOnPaste
});
```

---

# 11. Editor Settings

The editor supports the following settings:

| Setting               | Purpose                            |
| --------------------- | ---------------------------------- |
| `fontFamily`          | Editor font family                 |
| `fontSize`            | Editor font size                   |
| `tabSize`             | Number of spaces used for tabs     |
| `wordWrap`            | Enables or disables word wrapping  |
| `lineNumbers`         | Shows or hides line numbers        |
| `minimap`             | Enables or disables the minimap    |
| `theme`               | Monaco Editor theme                |
| `smoothScrolling`     | Enables smooth scrolling           |
| `autoClosingBrackets` | Controls automatic bracket closing |
| `autoClosingQuotes`   | Controls automatic quote closing   |
| `formatOnPaste`       | Controls formatting on paste       |

---

# 12. Line Counter

The editor displays the current number of lines in the status bar.

The implementation gets the current Monaco model:

```javascript
const model =
  editor.getModel();
```

The number of lines is obtained using:

```javascript
model.getLineCount();
```

The value is displayed as:

```text
Lines: 19
```

The line counter is updated immediately when the editor starts and
whenever the editor content changes.

```javascript
editor.onDidChangeModelContent(
  updateLineCounter
);
```

---

# 13. HTML Statistics

The editor calculates HTML statistics from the current editor
content.

The current editor content is obtained from the Monaco model:

```javascript
const content =
  model.getValue();
```

The HTML is then parsed using the browser's native `DOMParser`:

```javascript
const parser =
  new DOMParser();

const document =
  parser.parseFromString(
    content,
    "text/html"
  );
```

The implementation calculates:

* Number of IDs
* Number of unique class names
* Number of HTML elements

The results are displayed as:

```text
IDs: X   Classes: Y   Tags: Z
```

---

# 14. ID Count

Elements containing an `id` attribute are counted using:

```javascript
const idCount =
  document.querySelectorAll(
    "[id]"
  ).length;
```

For example:

```html
<div id="header"></div>
<section id="content"></section>
```

would produce:

```text
IDs: 2
```

---

# 15. Class Count

Class attributes are collected from the HTML document.

A JavaScript `Set` is used to store the class names:

```javascript
const classNames =
  new Set();
```

The class names are then collected:

```javascript
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
```

Using a `Set` means duplicate class names are counted only once.

For example:

```html
<div class="container"></div>
<section class="container"></section>
<p class="text"></p>
```

The unique class names are:

```text
container
text
```

Therefore:

```text
Classes: 2
```

---

# 16. Tag Count

All HTML elements are selected using:

```javascript
document.querySelectorAll("*");
```

The number of returned elements is used as the tag count.

For example, the HTML document can be represented as:

```text
HTML
├── HEAD
│   ├── META
│   └── TITLE
│
└── BODY
    ├── DIV
    ├── H1
    └── P
```

The implementation counts the elements returned by:

```javascript
document.querySelectorAll("*");
```

---

# 17. Updating HTML Statistics

The HTML statistics are calculated immediately:

```javascript
updateHtmlStats();
```

They are also recalculated whenever the Monaco editor content changes:

```javascript
editor.onDidChangeModelContent(
  updateHtmlStats
);
```

Therefore, the displayed statistics remain synchronized with the
current editor content.

---

# 18. Font Size Controls

The editor provides controls to increase and decrease the editor font
size.

The current font size is obtained from Monaco:

```javascript
editor.getOption(
  monaco.editor.EditorOption.fontSize
);
```

The editor is updated using:

```javascript
editor.updateOptions({
  fontSize
});
```

The configured range is:

```text
Minimum: 8px
Maximum: 32px
```

The current value is displayed in the UI.

---

# 19. Keyboard Shortcuts

The v3 editor uses Monaco Editor's built-in keyboard shortcut
functionality.

The important point is that the standard Find functionality is
provided by Monaco Editor itself.

The application does not implement a separate search engine for
standard Find behavior.

---

# 20. Ctrl + F — Find

Currently, pressing:

```text
Ctrl + F
```

opens Monaco Editor's built-in Find window.

Flow:

```text
Ctrl + F
    │
    ▼
Monaco Editor
    │
    ▼
Built-in Find Widget
```

The Find widget and search functionality are provided by Monaco.

The v3 application does not create a separate HTML search bar for
this behavior.

---

# 21. Ctrl + H — Replace

Monaco Editor provides Replace functionality as part of its editor
features.

The standard shortcut is:

```text
Ctrl + H
```

This opens the Replace interface provided by Monaco.

The application does not implement a separate Replace engine.

---

# 22. F3 — Find Next

After a search is entered in the Find window:

```text
F3
```

can be used to move to the next search result.

This behavior belongs to Monaco's Find functionality.

---

# 23. Shift + F3 — Find Previous

The previous search result can be selected using:

```text
Shift + F3
```

This is part of Monaco's Find navigation functionality.

---

# 24. Current Keyboard Shortcut Summary

| Shortcut     | Function      | Provider      |
| ------------ | ------------- | ------------- |
| `Ctrl + F`   | Open Find     | Monaco Editor |
| `Ctrl + H`   | Open Replace  | Monaco Editor |
| `F3`         | Find Next     | Monaco Editor |
| `Shift + F3` | Find Previous | Monaco Editor |

### Important

There is currently **no `Ctrl + D → Find` mapping in v3**.

`Ctrl + F` remains the shortcut that opens the Find window.

---

# 25. Monaco Editor Command System

Monaco provides an editor command and action system.

The editor API provides functionality such as:

```text
addCommand()
getAction()
KeyMod
KeyCode
```

These APIs can be used when the application needs to customize
keyboard behavior.

However, the current v3 Find behavior does not replace `Ctrl + F`
with a custom implementation.

It uses Monaco's existing Find functionality.

---

# 26. `app.js`

`app.js` acts as the application entry point.

It is loaded after the editor modules:

```html
<script src="app.js"></script>
```

The application entry point is responsible for connecting the modules
and starting the editor application.

The general runtime flow is:

```text
app.js
  │
  ├── Access editor data
  │
  ├── Configure Monaco
  │
  ├── Initialize editor
  │
  ├── Bind line counter
  │
  ├── Bind HTML statistics
  │
  ├── Bind font controls
  │
  ├── Connect Copy action
  │
  ├── Connect Download action
  │
  └── Start application
```

---

# 27. `toast.js`

`toast.js` provides notification functionality.

The HTML page contains the toast container:

```html
<div
  class="toast-container"
  id="toast-container">
</div>
```

The toast system can display temporary feedback messages for
application operations.

Examples include:

```text
Code copied successfully
File downloaded
Operation completed
Error
```

---

# 28. `clipboard.js`

`clipboard.js` handles copying the current editor content.

The Copy Code button is located in the application header.

The button triggers the copy functionality through the application
JavaScript.

---

# 29. `download.js`

`download.js` handles downloading the current editor content as a
file.

The content used for the download comes from the current editor
content.

The Download File button is located in the application header.

---

# 30. `style.css`

`style.css` contains the visual styling for the v3 editor.

The stylesheet controls:

* Application background
* Header
* Logo
* File title
* Buttons
* Editor workspace
* Status bar
* Toast notifications
* Font controls
* HTML statistics
* General spacing and typography

The editor UI follows a dark development-tool style.

---

# 31. Header

The header contains:

```text
JS
end-points.js
Local Standalone Editor
```

It also contains:

```text
Copy Code
Download File
```

buttons.

---

# 32. Workspace

The workspace contains the Monaco Editor:

```html
<div id="editor-container"></div>
```

The editor occupies the available workspace area.

---

# 33. Status Bar

The status bar displays editor information.

The v3 page includes:

```text
Lines: 19
UTF-8
JavaScript
Monaco Editor CDN
```

The line count is dynamically updated by `editor-setup.js`.

---

# 34. Application Loading Order

The complete script loading order is:

```text
1. Monaco Loader
2. editor-data.js
3. editor-theme.js
4. editor-setup.js
5. toast.js
6. clipboard.js
7. download.js
8. app.js
```

This order ensures that the application entry point can access the
functions and data exposed by the earlier modules.

---

# 35. Complete Runtime Flow

```text
                         Browser
                            │
                            ▼
                        index.html
                            │
                            ▼
                     Monaco Loader
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
   editor-data.js    editor-theme.js   editor-setup.js
          │                 │                 │
          │                 │          ┌──────┼──────┐
          │                 │          │      │      │
          │                 │          ▼      ▼      ▼
          │                 │       Lines   HTML    Font
          │                 │       Count   Stats  Controls
          │                 │          │
          └─────────────────┴──────────┘
                            │
                            ▼
                       app.js
                            │
                ┌───────────┼───────────┐
                │           │           │
                ▼           ▼           ▼
             Toast       Copy       Download
```

---

# 36. Responsibility Separation

The v3 implementation follows a clear separation of responsibilities.

## Editor Layer

`editor-setup.js`

Responsible for:

* Monaco initialization
* Editor configuration
* Line counter
* HTML statistics
* Font controls
* Editor commands

## Data Layer

`editor-data.js`

Responsible for:

* File name
* File content
* Language

## Theme Layer

`editor-theme.js`

Responsible for:

* Monaco theme configuration

## Application Actions

```text
clipboard.js
download.js
toast.js
```

Responsible for:

* Clipboard
* File download
* Notifications

## Application Entry Point

`app.js`

Responsible for:

* Starting the application
* Connecting the modules
* Initializing the editor
* Binding application actions

---

# 37. Monaco Responsibilities vs Application Responsibilities

## Monaco Editor provides

* Code editing
* Text model
* Syntax highlighting
* Cursor handling
* Selection
* Find
* Replace
* Search navigation
* Editor commands
* Editor actions
* Editor configuration
* Keyboard shortcut infrastructure

## The application provides

* Editor initialization
* Application-specific editor settings
* Line counter
* HTML statistics
* Font-size controls
* Copy Code integration
* Download integration
* Toast notifications
* Theme configuration
* Application layout

---

# 38. Why Monaco's Built-in Find Is Used

The project uses Monaco's existing Find functionality instead of
implementing another search engine.

The current behavior is:

```text
Ctrl + F
   │
   ▼
Monaco Find
   │
   ├── Search input
   ├── Match calculation
   ├── Match highlighting
   └── Find navigation
```

This avoids duplicating functionality already provided by the editor.

---

# 39. Current Search Architecture

```text
User
 │
 │ Ctrl + F
 ▼
Monaco Editor
 │
 ▼
Find Widget
 │
 ├── Search
 ├── Find matches
 ├── Highlight matches
 └── Navigate matches
```

The v3 application does not create a separate custom search widget for
this functionality.

---

# 40. Official Monaco API Concepts

The v3 implementation uses Monaco Editor APIs for editor operations.

Important APIs include:

```text
monaco.editor.create()
editor.getModel()
model.getValue()
model.getLineCount()
editor.onDidChangeModelContent()
editor.updateOptions()
editor.getOption()
editor.addCommand()
editor.getAction()
monaco.KeyMod
monaco.KeyCode
```

The official Monaco Editor API documentation should be used when
modifying editor configuration, commands, actions, models, or
keyboard shortcuts.

---

# 41. Official Documentation

The project uses Monaco Editor as the underlying editor engine.

For official API reference and implementation details, refer to the
official Monaco Editor documentation:

**Monaco Editor Documentation**

[https://microsoft.github.io/monaco-editor/](https://microsoft.github.io/monaco-editor/)

Relevant API areas include:

```text
Editor API
Editor Actions
Editor Commands
Editor Options
Text Model
Find / Replace
Keyboard Commands
```

---

# 42. Development Notes

When modifying the v3 editor:

1. Keep editor-specific functionality inside `editor-setup.js`.
2. Keep file/editor data inside `editor-data.js`.
3. Keep Monaco theme configuration inside `editor-theme.js`.
4. Keep clipboard functionality inside `clipboard.js`.
5. Keep download functionality inside `download.js`.
6. Keep notifications inside `toast.js`.
7. Use `app.js` as the application entry point.
8. Prefer Monaco APIs when Monaco already provides the required
   functionality.
9. Avoid duplicating Monaco's built-in editor features unnecessarily.
10. Update this README when the editor architecture or keyboard
    behavior changes.

---

# 43. Current Feature Summary

The v3 editor currently provides:

* Monaco Editor
* JavaScript editing
* Monaco theme
* Configurable editor settings
* Line counter
* HTML ID statistics
* Unique HTML class statistics
* HTML element/tag statistics
* Font-size controls
* Copy Code
* Download File
* Toast notifications
* Monaco Find
* Monaco Replace
* Find Next
* Find Previous

---

# 44. Current Keyboard Shortcut Summary

```text
┌────────────────────┬──────────────────────────┐
│ Shortcut            │ Function                 │
├────────────────────┼──────────────────────────┤
│ Ctrl + F            │ Open Monaco Find         │
│ Ctrl + H            │ Open Monaco Replace      │
│ F3                  │ Find Next                │
│ Shift + F3          │ Find Previous            │
└────────────────────┴──────────────────────────┘
```

The current v3 implementation does not map `Ctrl + D` to Find.

---

# 45. Summary

Monaco Editor v3 is a modular browser-based code editor that separates
editor initialization, data, theme configuration, application
actions, and UI functionality into individual modules.

The editor uses Monaco's existing editor capabilities wherever
possible.

The main editor functionality is implemented in:

```text
editor-setup.js
```

The application entry point is:

```text
app.js
```

The current Find behavior remains Monaco's built-in behavior:

```text
Ctrl + F
    ↓
Monaco Find Widget
```

The application does not implement a separate search engine for the
standard Find functionality.


