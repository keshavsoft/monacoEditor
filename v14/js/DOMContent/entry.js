import { StartFunc as uploadentry } from "./upload/entry.js";
import { initMonaco } from "./Monaco/initMonaco.js";

const StartFunc = () => {
    document.addEventListener("DOMContentLoaded", initApp);

};

async function initApp() {
    uploadentry();

    try {
        await initMonaco();
    } catch (error) {
        console.error("Monaco initialization failed:", error);
    }
}
export { StartFunc };
