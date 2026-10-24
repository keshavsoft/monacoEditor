/**
 * @file ui.js (Bridge Module)
 * @description UI operations re-export bridge for backward compatibility.
 * Re-exports sidebar toggle, bottom panel management, command palette,
 * and terminal initialization from modular ./ui/ and ./terminal/ subfolders.
 */

export { toggleExplorer } from "./ui/sidebar.js";
export { togglePanel, setPanel } from "./ui/panels.js";
export { updateTitleBar } from "./ui/titleBar.js";
export { showCommandPalette, hideCommands, initCommandPalette, getCommandsList, showCommands } from "./ui/commandPalette.js";
export { initTerminalUI as initTerminal } from "./terminal/terminalUI.js";
