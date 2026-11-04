import { setDataContent } from "../../editor/models.js";
import { switchTab } from "../../tabs/tabSwitcher.js";
import { closeModal, readJsonFile } from "../helpers.js";

export function bindDataModal() {
    const loadSampleBtn = document.getElementById("loadSampleDataBtn");
    if (loadSampleBtn) {
        loadSampleBtn.addEventListener("click", () => {
            const sample = [
                { id: 1, name: "Sample Item A" },
                { id: 2, name: "Sample Item B" }
            ];
            setDataContent(sample);
            switchTab("data");
            closeModal("dataModal");
        });
    }

    const fileInput = document.getElementById("dataFileInput");
    if (fileInput) {
        fileInput.addEventListener("change", async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            try {
                const content = await readJsonFile(file);
                setDataContent(content);
                switchTab("data");
                closeModal("dataModal");
            } catch (err) {
                alert(`Invalid JSON in ${file.name}: ${err.message}`);
            }
            fileInput.value = "";
        });
    }
}

