import { handleFileInput } from "../fileManager/handleFileInput.js";

const StartFunc = () => {
    document.getElementById("jsInput").click();
    document.getElementById("jsInput").addEventListener("change", handleFileInput);

}
export { StartFunc };
