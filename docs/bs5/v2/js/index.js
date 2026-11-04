import { createEditor } from "./editor/editorInstance.js";
import { bindTabs } from "./tabs/bindTabs.js";
import { bindColumnsModal } from "./modals/columnsModal/bindColumns.js";
import { bindDataModal } from "./modals/dataModal/bindData.js";
import { bindRender } from "./render/onRenderClick.js";

async function init() {
    await createEditor();
    bindTabs();
    bindColumnsModal();
    bindDataModal();
    bindRender();
}

init();
