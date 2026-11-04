function download(editor, fileName, showToast) {
  if (!editor) {
    return;
  }

  const blob = new Blob(
    [editor.getValue()],
    {
      type: "text/javascript"
    }
  );

  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;

  document.body.appendChild(anchor);

  anchor.click();

  document.body.removeChild(anchor);

  URL.revokeObjectURL(url);

  showToast(`Downloading ${fileName}...`);
}

window.download = download;