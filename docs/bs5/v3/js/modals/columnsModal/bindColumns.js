import { setColumnsContent } from "../../editor/models.js";
import { switchTab } from "../../tabs/tabSwitcher.js";
import { closeModal, readJsonFile } from "../helpers.js";

export function bindColumnsModal() {
    const loadSampleBtn = document.getElementById("loadSampleColumnsBtn");
    if (loadSampleBtn) {
        loadSampleBtn.addEventListener("click", () => {
            const sample = [
                { columnName: "id", label: "ID" },
                { columnName: "name", label: "Name" }
            ];
            setColumnsContent(sample);
            switchTab("columns");
            closeModal("columnsModal");
        });
    }

    const fileInput = document.getElementById("colFileInput");
    if (fileInput) {
        fileInput.addEventListener("change", async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            try {
                const content = await readJsonFile(file);
                setColumnsContent(content);
                switchTab("columns");
                closeModal("columnsModal");
            } catch (err) {
                alert(`Invalid JSON in ${file.name}: ${err.message}`);
            }
            fileInput.value = "";
        });
    }
}

