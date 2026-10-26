export const jVarState = {
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
