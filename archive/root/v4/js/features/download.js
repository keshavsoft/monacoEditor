window.MonacoEditorDownload = {
  download(editor, fileName, showToast) {
    if (!editor) return;

    const element = document.createElement('a');
    const file = new Blob([editor.getValue()], { type: 'text/javascript' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast(`Downloading ${fileName}...`);
  }
};