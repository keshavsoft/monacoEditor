/**
 * @file constants.js
 * @description Centralized constants and language definitions for the editor.
 * Contains Monaco editor CDN paths, supported file extension mappings,
 * user-friendly language labels, and standard theme color definitions.
 * Used across editor, fileManager, and terminal modules.
 */

export const VS_PATH = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs";

export const LANGUAGE_NAMES = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  json: "JSON",
  html: "HTML",
  css: "CSS",
  markdown: "Markdown",
  python: "Python",
  xml: "XML",
  yaml: "YAML",
  sql: "SQL",
  plaintext: "Plain Text"
};

export const EXTENSION_MAP = {
  js: "javascript", jsx: "javascript", mjs: "javascript", cjs: "javascript",
  ts: "typescript", tsx: "typescript",
  json: "json", html: "html", htm: "html",
  css: "css", scss: "scss",
  md: "markdown", py: "python", xml: "xml",
  yml: "yaml", yaml: "yaml", sql: "sql", sh: "shell", txt: "plaintext"
};

export const THEME_DARK_VARS = {
  "--bg": "#1e1e1e",
  "--panel": "#252526",
  "--panel2": "#2d2d30",
  "--border": "#3c3c3c",
  "--text": "#cccccc",
  "--muted": "#858585",
  "--hover": "#2a2d2e",
  "--active": "#37373d"
};

export const THEME_LIGHT_VARS = {
  "--bg": "#ffffff",
  "--panel": "#f3f3f3",
  "--panel2": "#e8e8e8",
  "--border": "#d4d4d4",
  "--text": "#333333",
  "--muted": "#666666",
  "--hover": "#e8e8e8",
  "--active": "#d6ebff"
};
