/**
 * @file state.js
 * @description Central reactive state store for the editor workspace.
 * Manages active file tracking, open workspace files, editor instance,
 * theme configuration, active bottom panel, and terminal profile state.
 * Shared across all feature modules to maintain a single source of truth.
 */

export const state = {
  activeFile: "sample.js",
  editor: null,
  dark: true,
  wrap: false,
  panelVisible: true,
  activePanel: "terminal",
  terminalProfile: "cmd",
  files: new Map([
    ["spec.json", {
      language: "json",
      value: JSON.stringify({
        name: "keshavsoft-app",
        version: "1.0.0",
        description: "Monaco editor workspace sample",
        main: "sample.js"
      }, null, 2)
    }],
    ["sample.js", {
      language: "javascript",
      value: `console.log("Hello world");\n`
    }]
  ])
};
