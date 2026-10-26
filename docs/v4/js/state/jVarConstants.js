export const jVarVsPath = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs";

export const jVarLanguageNames = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  json: "JSON",
  html: "HTML",
  css: "CSS",
  scss: "SCSS",
  less: "Less",
  markdown: "Markdown",
  python: "Python",
  xml: "XML",
  yaml: "YAML",
  sql: "SQL",
  shell: "Shell Script",
  bat: "Batch",
  java: "Java",
  c: "C",
  cpp: "C++",
  csharp: "C#",
  php: "PHP",
  rust: "Rust",
  go: "Go",
  plaintext: "Plain Text"
};

export const jVarExtensionMap = {
  js: "javascript", jsx: "javascript", mjs: "javascript", cjs: "javascript",
  ts: "typescript", tsx: "typescript",
  json: "json", html: "html", htm: "html",
  css: "css", scss: "scss", less: "less",
  md: "markdown", markdown: "markdown",
  py: "python", xml: "xml", svg: "xml",
  yml: "yaml", yaml: "yaml", sql: "sql",
  sh: "shell", bash: "shell", bat: "bat", cmd: "bat", ps1: "shell",
  java: "java", c: "c", cpp: "cpp", h: "cpp", hpp: "cpp", cs: "csharp",
  php: "php", rs: "rust", go: "go",
  txt: "plaintext", log: "plaintext", env: "plaintext", gitignore: "plaintext"
};

export function jFGetFileIconInfo(fileName, language) {
  const ext = (fileName.split(".").pop() || "").toLowerCase();

  if (fileName === "package.json") return { icon: "bi-filetype-json", color: "#e8a838" };
  if (fileName.startsWith(".git")) return { icon: "bi-git", color: "#f05032" };
  if (fileName.endsWith(".min.js")) return { icon: "bi-filetype-js", color: "#e8d44d" };

  switch (ext) {
    case "js":
    case "mjs":
    case "cjs":
      return { icon: "bi-filetype-js", color: "#e8d44d" };
    case "jsx":
      return { icon: "bi-filetype-jsx", color: "#61dafb" };
    case "ts":
    case "tsx":
      return { icon: "bi-filetype-tsx", color: "#3178c6" };
    case "json":
      return { icon: "bi-filetype-json", color: "#cbcb41" };
    case "html":
    case "htm":
      return { icon: "bi-filetype-html", color: "#e37933" };
    case "css":
      return { icon: "bi-filetype-css", color: "#42a5f5" };
    case "scss":
    case "sass":
    case "less":
      return { icon: "bi-filetype-scss", color: "#c76494" };
    case "md":
    case "markdown":
      return { icon: "bi-filetype-md", color: "#519aba" };
    case "py":
      return { icon: "bi-filetype-py", color: "#3572a5" };
    case "svg":
      return { icon: "bi-filetype-svg", color: "#ffb13b" };
    case "xml":
      return { icon: "bi-filetype-xml", color: "#e37933" };
    case "yml":
    case "yaml":
      return { icon: "bi-filetype-yml", color: "#cb171e" };
    case "sql":
      return { icon: "bi-filetype-sql", color: "#e38c00" };
    case "sh":
    case "bash":
    case "bat":
    case "cmd":
    case "ps1":
      return { icon: "bi-terminal", color: "#89d185" };
    case "java":
      return { icon: "bi-file-earmark-code", color: "#b07219" };
    case "c":
    case "cpp":
    case "h":
    case "hpp":
      return { icon: "bi-file-earmark-code", color: "#f34b7d" };
    case "php":
      return { icon: "bi-filetype-php", color: "#777bb4" };
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "webp":
    case "ico":
      return { icon: "bi-file-earmark-image", color: "#a074c4" };
    case "txt":
    case "log":
      return { icon: "bi-file-earmark-text", color: "#cccccc" };
    default:
      return { icon: "bi-file-earmark-code", color: "#858585" };
  }
}

export const jVarThemeDarkVars = {
  "--bg": "#1e1e1e",
  "--panel": "#252526",
  "--panel2": "#2d2d30",
  "--border": "#3c3c3c",
  "--text": "#cccccc",
  "--muted": "#858585",
  "--hover": "#2a2d2e",
  "--active": "#37373d"
};

export const jVarThemeLightVars = {
  "--bg": "#ffffff",
  "--panel": "#f3f3f3",
  "--panel2": "#e8e8e8",
  "--border": "#d4d4d4",
  "--text": "#333333",
  "--muted": "#666666",
  "--hover": "#e8e8e8",
  "--active": "#d6ebff"
};
