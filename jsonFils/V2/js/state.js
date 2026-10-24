// Central State and Configuration for keshavsoft editor
export const $ = id => document.getElementById(id);

export const state = {
  activeFile: "spec.json",
  editor: null,
  dark: true,
  wrap: false,
  panelVisible: true,
  files: new Map([
    ["spec.json", {
      language: "json",
      value: JSON.stringify({}, null, 2)
    }]
  ])
};

export const languageNames = {
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

export const languageFor = name => {
  const ext = (name.split(".").pop() || "").toLowerCase();
  return ({
    js: "javascript", jsx: "javascript", mjs: "javascript", cjs: "javascript",
    ts: "typescript", tsx: "typescript",
    json: "json", html: "html", htm: "html",
    css: "css", scss: "scss",
    md: "markdown", py: "python", xml: "xml",
    yml: "yaml", yaml: "yaml", sql: "sql", sh: "shell", txt: "plaintext"
  })[ext] || "plaintext";
};

export const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[c]));

let toastTimer = null;
export function toast(message) {
  const el = $("toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2300);
}
