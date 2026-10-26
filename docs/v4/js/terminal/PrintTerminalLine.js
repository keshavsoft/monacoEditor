export function jFGetTerminalOutputEl() {
  return $("panel-terminal");
}

export function jFPrintTerminalLine(jVarText, jVarType = "normal") {
  const jVarContainer = jFGetTerminalOutputEl();
  if (!jVarContainer) return;

  const jVarLine = document.createElement("div");
  jVarLine.className = `terminal-line terminal-${jVarType}`;

  const jVarColors = {
    normal: "#cccccc",
    error: "#f48771",
    success: "#89d185",
    warn: "#cca700",
    info: "#75beff",
    muted: "#858585"
  };

  jVarLine.style.color = jVarColors[jVarType] || jVarColors.normal;
  jVarLine.style.whiteSpace = "pre-wrap";
  jVarLine.style.wordBreak = "break-all";
  jVarLine.textContent = jVarText;

  const jVarInputRow = jVarContainer.querySelector(".terminal-input");
  if (jVarInputRow) {
    jVarContainer.insertBefore(jVarLine, jVarInputRow);
  } else {
    jVarContainer.appendChild(jVarLine);
  }

  jVarContainer.scrollTop = jVarContainer.scrollHeight;
}
