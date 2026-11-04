import { state } from "./state.js";

function renderJsonToDom() {
    const preview = document.getElementById("domPreview");

    const columnsText = state.columnsModel ? state.columnsModel.getValue() : "";
    const dataText = state.dataModel ? state.dataModel.getValue() : "";

    let columns = null;
    let data = null;

    try {
        if (columnsText) columns = JSON.parse(columnsText);
    } catch (e) {
        console.error("columns.json parse error:", e);
    }

    try {
        if (dataText) data = JSON.parse(dataText);
    } catch (e) {
        console.error("data.json parse error:", e);
    }

    console.log("Render clicked. Columns:", columns, "Data:", data);

    // --- Write your custom render code below ---

}

export default renderJsonToDom;
