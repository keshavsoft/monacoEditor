// Hardcoded endpoints.js code
const fileCode = `import express from 'express';

import funcFromshowAll from './showAll/controller.js';
import funcFrominsertWithMeta from './insertWithMeta/controller.js';
import funcFromdel from './del/controller.js';
import funcFrommodify from './modify/controller.js';

const tableName = "doctors.json";
const tablePath = "Data/doctors.json";
const configPath = "Config/Schemas/doctors.json";

const router = express.Router();

router.get('/showAll', (req, res) => funcFromshowAll({ req, res, inTablePath: tablePath }));
router.post('/insertWithMeta', express.json(), (req, res) => funcFrominsertWithMeta({ req, res, inTablePath: tablePath, inConfigPath: configPath }));
router.delete('/del/:pk', (req, res) => funcFromdel({ req, res, inTablePath: tablePath }));
router.put('/modify', express.json(), (req, res) => funcFrommodify({ req, res, inTablePath: tablePath, inConfigPath: configPath }));

export { router };`;

let editor;

// Load Monaco
require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });

require(['vs/editor/editor.main'], function () {
  // Define a custom theme
  monaco.editor.defineTheme('custom-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'c084fc', fontStyle: 'bold' },
      { token: 'string', foreground: 'a5f3fc' },
      { token: 'number', foreground: 'f472b6' }
    ],
    colors: {
      'editor.background': '#111827',
      'editor.foreground': '#f3f4f6',
      'editor.lineHighlightBackground': '#1f2937',
      'editorLineNumber.foreground': '#4b5563',
      'editorLineNumber.activeForeground': '#c084fc',
      'editorCursor.foreground': '#c084fc'
    }
  });

  // Initialize Editor
  editor = monaco.editor.create(document.getElementById('editor-container'), {
    value: fileCode,
    language: 'javascript',
    theme: 'custom-dark',
    automaticLayout: true,
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: 14,
    lineHeight: 22,
    tabSize: 2,
    wordWrap: 'on',
    minimap: { enabled: true }
  });

  // Update lines count
  editor.onDidChangeModelContent(() => {
    const lineCount = editor.getModel().getLineCount();
    document.getElementById('line-count').textContent = `Lines: ${lineCount}`;
  });
});

// Copy Code Action
window.copyCode = function() {
  if (!editor) return;
  const text = editor.getValue();
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => showToast('Code copied to clipboard!'))
      .catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showToast('Code copied to clipboard!');
    } else {
      showToast('Failed to copy code.', 'error');
    }
  } catch (err) {
    showToast('Failed to copy code.', 'error');
  }
  document.body.removeChild(textArea);
}

// Download Code Action
window.downloadCode = function() {
  if (!editor) return;
  const element = document.createElement('a');
  const file = new Blob([editor.getValue()], {type: 'text/javascript'});
  element.href = URL.createObjectURL(file);
  element.download = "end-points.js";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  showToast('Downloading end-points.js...');
}

// Notification toast helper
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success'
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

  toast.innerHTML = `
    ${icon}
    <span>${escapeHTML(message)}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function escapeHTML(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
