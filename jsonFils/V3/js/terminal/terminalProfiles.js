/**
 * @file terminalProfiles.js
 * @description Defines terminal shell profiles (cmd, node, powershell, javascript).
 * Provides custom prompt prefixes, welcome banners, and profile metadata.
 * Enables switching terminal modes just like VS Code's integrated terminal.
 */

export const TERMINAL_PROFILES = {
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

export function getProfilePrompt(profileKey = "cmd") {
  const profile = TERMINAL_PROFILES[profileKey] || TERMINAL_PROFILES.cmd;
  return profile.promptPrefix;
}
