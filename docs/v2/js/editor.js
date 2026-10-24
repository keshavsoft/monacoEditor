/**
 * @file editor.js (Bridge Module)
 * @description Monaco editor operations re-export bridge for backward compatibility.
 * Re-exports editor initialization, buffer operations, formatting, themes,
 * and execution runners from the modular ./editor/ subfolder.
 */

export { getValue, setValue, initEditor as initMonaco } from "./editor/editorService.js";
export { updateCursor } from "./editor/cursorStatus.js";
export { layoutEditor, setupResizeObserver, toggleWrap } from "./editor/editorOptions.js";
export { formatCode } from "./editor/codeFormatter.js";
export { toggleTheme } from "./editor/editorTheme.js";
export { validateAndRun as validate } from "./editor/codeValidator.js";
