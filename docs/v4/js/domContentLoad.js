import { jFInitApp } from "./app/InitApp.js";

function startApp() {
  console.log("DOM Content Loaded");
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", jFInitApp);
  } else {
    jFInitApp();
  }
}
export { startApp };