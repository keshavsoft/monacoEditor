import { models } from "../editor/models.js";

export function bindRender() {
    const renderBtn = document.getElementById("renderBtn");
    if (!renderBtn) return;

    renderBtn.addEventListener("click", () => {
        const columnsText = models.columnsModel ? models.columnsModel.getValue() : "";
        const dataText = models.dataModel ? models.dataModel.getValue() : "";

        let columns = null;
        let data = null;

        try {
            if (columnsText) columns = JSON.parse(columnsText);
        } catch (err) {
            console.error("Failed to parse columns JSON:", err);
        }

        try {
            if (dataText) data = JSON.parse(dataText);
        } catch (err) {
            console.error("Failed to parse data JSON:", err);
        }

        console.log("Render clicked:", { columns, data });

        window.ks.jsonRenderers.build.table.render({
            type: "table.simple",
            data,
            columns,
            options: {
                showSerial: true,
                showSearch: true,
                showOptions: true
            },
            targetHtmlId: "domPreview",
            classToApply: "",
            appendPosition: "replace"
        });

        // --- Custom DOM rendering logic goes here ---
    });
}

