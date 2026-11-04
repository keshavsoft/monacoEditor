function uploadJavaScriptFile({
  input,
  editor,
  editorData,
  fileNameElement,
  showToast
}) {
  const [file] = input.files;

  if (!file) {
    return;
  }

  if (!file.name.toLowerCase().endsWith(".js")) {
    showToast("Please select a JavaScript (.js) file.", "error");
    input.value = "";
    return;
  }

  const reader = new FileReader();

  reader.addEventListener("load", () => {
    const content = typeof reader.result === "string" ? reader.result : "";

    editor.setValue(content);
    editorData.fileName = file.name;
    editorData.fileCode = content;
    fileNameElement.textContent = file.name;
    showToast(`${file.name} loaded successfully.`);
    input.value = "";
  });

  reader.addEventListener("error", () => {
    showToast(`Unable to read ${file.name}.`, "error");
    input.value = "";
  });

  reader.readAsText(file);
}

window.uploadJavaScriptFile = uploadJavaScriptFile;
