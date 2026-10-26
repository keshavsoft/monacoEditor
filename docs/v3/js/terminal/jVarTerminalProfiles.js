export const jVarTerminalProfiles = {
  cmd: {
    name: "cmd",
    label: "1: cmd",
    icon: "bi-terminal",
    promptPrefix: "C:\\workspace>",
    banner: "Microsoft Windows [Version 10.0.26100.9711]\n(c) KeshavSoft Corporation. All rights reserved."
  },
  node: {
    name: "node",
    label: "2: node",
    icon: "bi-terminal-fill",
    promptPrefix: ">",
    banner: "Welcome to Node.js v20.11.0 (Browser Sandbox).\nType .help or JS expressions."
  },
  powershell: {
    name: "powershell",
    label: "3: powershell",
    icon: "bi-terminal",
    promptPrefix: "PS C:\\workspace>",
    banner: "Windows PowerShell\nCopyright (C) KeshavSoft Corporation. All rights reserved."
  },
  javascript: {
    name: "javascript",
    label: "4: javascript",
    icon: "bi-code-square",
    promptPrefix: "js>",
    banner: "JavaScript Sandbox Console · KeshavSoft Editor"
  }
};

export function jFGetProfilePrompt(jVarProfileKey = "cmd") {
  const jVarProfile = jVarTerminalProfiles[jVarProfileKey] || jVarTerminalProfiles.cmd;
  return jVarProfile.promptPrefix;
}
