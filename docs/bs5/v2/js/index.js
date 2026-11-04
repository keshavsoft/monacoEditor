import { switchTab, setColumns, setData } from "./state.js";
import { initMonacoModels } from "./upload.js";
import { sampleColumns, sampleData } from "./presets.js";
import renderJsonToDom from "./renderJsonToDom.js";

function bindTabs() {
    const tabColBtn = document.getElementById("tabColumns");
    const tabDataBtn = document.getElementById("tabData");

    if (tabColBtn) {
        tabColBtn.addEventListener("click", () => switchTab("columns"));
    }

    if (tabDataBtn) {
        tabDataBtn.addEventListener("click", () => switchTab("data"));
    }
}

function bindModals() {
    // 1. Columns Modal
    const loadSampleColBtn = document.getElementById("loadSampleColumnsBtn");
    if (loadSampleColBtn) {
        loadSampleColBtn.addEventListener("click", () => {
            setColumns(sampleColumns);
            closeModal("columnsModal");
        });
    }

    const colFileInput = document.getElementById("colFileInput");
    if (colFileInput) {
        colFileInput.addEventListener("change", async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try {
                const text = await file.text();
                JSON.parse(text);
                setColumns(text);
                closeModal("columnsModal");
            } catch (err) {
                alert(`Invalid JSON in ${file.name}: ${err.message}`);
            }
            colFileInput.value = "";
        });
    }

    // 2. Data Modal
    const loadSampleDataBtn = document.getElementById("loadSampleDataBtn");
    if (loadSampleDataBtn) {
        loadSampleDataBtn.addEventListener("click", () => {
            setData(sampleData);
            closeModal("dataModal");
        });
    }

    const dataFileInput = document.getElementById("dataFileInput");
    if (dataFileInput) {
        dataFileInput.addEventListener("change", async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try {
                const text = await file.text();
                JSON.parse(text);
                setData(text);
                closeModal("dataModal");
            } catch (err) {
                alert(`Invalid JSON in ${file.name}: ${err.message}`);
            }
            dataFileInput.value = "";
        });
    }
}

function closeModal(modalId) {
    const modalEl = document.getElementById(modalId);
    if (modalEl && window.bootstrap?.Modal) {
        const modal = window.bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
    }
}

async function initEditor() {
    bindTabs();
    bindModals();

    const renderBtn = document.getElementById("renderBtn");
    if (renderBtn) {
        renderBtn.addEventListener("click", renderJsonToDom);
    }

    await initMonacoModels(sampleColumns, sampleData);
}

initEditor();
