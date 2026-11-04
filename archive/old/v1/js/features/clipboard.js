function fallbackCopy(text, showToast) {
  const textArea = document.createElement("textarea");

  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.opacity = "0";

  document.body.appendChild(textArea);

  textArea.focus();
  textArea.select();

  try {
    const copied = document.execCommand("copy");

    if (copied) {
      showToast("Code copied to clipboard!");
    } else {
      showToast("Failed to copy code.", "error");
    }
  } catch (error) {
    showToast("Failed to copy code.", "error");
  }

  document.body.removeChild(textArea);
}

async function copy(editor, showToast) {
  if (!editor) {
    return;
  }

  const text = editor.getValue();

  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);

      showToast("Code copied to clipboard!");

      return;
    } catch (error) {
      fallbackCopy(text, showToast);

      return;
    }
  }

  fallbackCopy(text, showToast);
}

window.copy = copy;