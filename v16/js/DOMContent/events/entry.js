import { StartFunc as eventChanger } from "./eventChanger.js";

const StartFunc = () => {
    document.getElementById("uploadJsBtn").addEventListener("click", eventChanger);

}
export { StartFunc };
