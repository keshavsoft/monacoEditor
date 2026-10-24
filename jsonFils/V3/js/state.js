/**
 * @file state.js (Bridge Module)
 * @description Central state re-export bridge for backward compatibility.
 * Re-exports reactive state, DOM helpers, constants, and utility helpers
 * from the modular ./state/ subfolder.
 */

export { $ } from "./state/dom.js";
export { state } from "./state/state.js";
export { LANGUAGE_NAMES as languageNames, EXTENSION_MAP } from "./state/constants.js";
export { escapeHtml, languageFor, toast } from "./state/helpers.js";
