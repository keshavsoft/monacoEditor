window.MonacoEditorClipboard = {
  copy(editor, showToast) {
    if (!editor) return;

    const text = editor.getValue();

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => showToast('Code copied to clipboard!'))
        .catch(() => fallbackCopy(text, showToast));
    } else {
      fallbackCopy(text, showToast);
    }
  }
};

function fallbackCopy(text, showToast) {
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