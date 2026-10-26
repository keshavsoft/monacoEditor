export function jFEscapeHtml(jVarStr) {
  const jVarLookup = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return String(jVarStr).replace(/[&<>"']/g, (jVarChar) => jVarLookup[jVarChar] || jVarChar);
}
