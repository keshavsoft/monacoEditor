# Modular JavaScript File Manager

This project is a browser-based JavaScript file manager with Monaco Editor.

The original HTML contained the UI, CSS and all JavaScript logic inside one HTML file. The project has been separated into modular files while keeping the same main functionality.

## Features

- Read/upload `.js` files from the browser
- Display opened files in Explorer
- Open files using tabs
- Close files
- Create new JavaScript files
- Edit files using Monaco Editor
- Download the currently opened JavaScript file
- Display application messages in the terminal

## Project Structure

```text
modular-file-manager/
│
├── index.html
├── README.md
│
├── css/
│   └── style.css
│
└── js/
    ├── index.js
    ├── state.js
    ├── terminal.js
    ├── monaco.js
    ├── file-manager.js
    ├── explorer.js
    ├── tabs.js
    └── download.js
```

## Module Responsibilities

### `js/index.js`

This is the **main JavaScript entry point**.

Responsibilities:

- Starts the application
- Connects toolbar buttons with functions
- Connects the file input event
- Initializes Monaco Editor

The HTML only loads:

```html
<script type="module" src="./js/index.js"></script>
```

### `js/state.js`

Contains the shared application state:

```js
export const appState = {
    files: {},
    currentFile: "",
    editor: null
};
```

- `files` stores opened JavaScript files
- `currentFile` stores the selected file name
- `editor` stores the Monaco Editor instance

### `js/file-manager.js`

Handles file operations:

- Read JS file
- Open file
- Create new file
- Close file

### `js/explorer.js`

Responsible only for rendering the Explorer file list.

### `js/tabs.js`

Responsible only for rendering the editor tabs and close buttons.

### `js/monaco.js`

Responsible for loading and creating the Monaco Editor.

### `js/terminal.js`

Contains the `log()` function used to show messages in the terminal area.

### `js/download.js`

Handles downloading the current JavaScript file.

## Application Flow

```text
index.html
    |
    v
js/index.js
    |
    +----> monaco.js
    |
    +----> file-manager.js
    |          |
    |          +----> explorer.js
    |          |
    |          +----> tabs.js
    |
    +----> download.js
    |
    +----> state.js
    |
    +----> terminal.js
```

## Read JS File Flow

```text
User clicks "Read JS"
        |
        v
index.js
        |
        v
file-manager.js
        |
        v
Browser file picker
        |
        v
FileReader
        |
        v
appState.files
        |
        v
openFile()
        |
        +----> Monaco Editor
        |
        +----> Explorer
        |
        +----> Tabs
```

## How Monaco Works

The HTML loads the Monaco AMD loader:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.js"></script>
```

Then `monaco.js` configures the Monaco path and loads:

```js
require(["vs/editor/editor.main"], () => {
    // Create editor
});
```

The editor is configured for JavaScript:

```js
{
    language: "javascript",
    theme: "vs-dark",
    automaticLayout: true
}
```

## Run the Project

Because the project uses JavaScript ES modules, run it through a local web server instead of opening `index.html` directly with `file://`.

For example, with VS Code Live Server:

1. Open the project folder in VS Code.
2. Start Live Server.
3. Open `index.html`.

Or use another local HTTP server.

## Important Design Decision

The original version used inline HTML handlers such as:

```html
<button onclick="readJSFile()">
```

The modular version removes inline handlers.

Instead, `index.js` uses:

```js
document
    .getElementById("readJsBtn")
    .addEventListener("click", readJSFile);
```

This keeps HTML responsible for structure and JavaScript responsible for behavior.

## Why `index.js` Is the Main File

`index.js` is intentionally small.

It does not contain all application logic. It acts as the application entry point and connects the modules together.

This makes the project easier to:

- Understand
- Maintain
- Debug
- Extend
- Test
- Reuse

## Adding a New Feature

For a new feature, create a separate module when possible.

Example:

```text
js/
├── index.js
├── state.js
├── file-manager.js
├── explorer.js
├── tabs.js
├── download.js
├── terminal.js
├── monaco.js
└── new-feature.js
```

Then import it from `index.js`.

```js
import { newFeature } from "./new-feature.js";
```

## Note

This implementation keeps the original application's browser-only behavior. Files are stored in memory while the page is open. They are not automatically saved to the server or filesystem.
