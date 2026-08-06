export function download(editor, fileName, showToast) {
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

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);

  showToast(`Downloading ${fileName}...`);
}