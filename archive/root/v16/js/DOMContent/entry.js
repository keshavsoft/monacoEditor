import { StartFunc as events } from "./events/entry.js";
import { initMonaco } from "./Monaco/initMonaco.js";

const StartFunc = () => {
    document.addEventListener("DOMContentLoaded", initApp);
};

async function initApp() {
    events();

    try {
        await initMonaco();
    } catch (error) {
        console.error("Monaco initialization failed:", error);
    }
}
export { StartFunc };
