import { StartFunc as eventListenerJSFile } from "./eventListener.js";

const StartFunc = () => {
    document.getElementById("uploadJsBtn").addEventListener("click", eventListenerJSFile);


}
export { StartFunc };
