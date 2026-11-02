function startFunc() {
    const editorEl = document.getElementById("jsonEditor");
    if (!editorEl || editorEl.style.display === "none") {
        preview.innerHTML = "<p>Upload a JSON file first.</p>";
        return;
    }

    const value = monaco.editor.getEditors().length > 0
        ? monaco.editor.getEditors()[0].getValue()
        : "";
    // console.log("value : ", value);

    try {
        const parsed = JSON.parse(value);

        window.ks.jsonToDom.appendToDom({
            jsonSpec: parsed,
            targetHtmlId: "domPreview",
            options: {},
            classToApply: "",
            appendPosition: "append",
        });


    } catch (error) {
        preview.innerHTML = "<p>Invalid JSON. Please upload a valid JSON file.</p>";
    }
};

export default startFunc;