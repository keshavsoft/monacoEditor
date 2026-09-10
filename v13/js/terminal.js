// Terminal logging module.

export function log(message, type = "") {
    const output = document.getElementById("terminalOutput");
    if (!output) return;

    const line = document.createElement("div");
    line.textContent = "> " + message;

    if (type === "ok") {
        line.className = "success";
    }

    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
}
