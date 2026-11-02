export const state = {
    editor: null,
    currentModel: null,
    currentFileName: null
};

export function updateFileLabel(fileName) {
    const label = document.getElementById("fileNameLabel");
    if (!label) return;

    label.textContent = fileName || "No file selected";
}
