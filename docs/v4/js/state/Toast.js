let jVarToastTimer = null;

export function jFToast(jVarMessage) {
  const jVarEl = $("toast");
  if (!jVarEl) return;

  jVarEl.textContent = jVarMessage;
  jVarEl.classList.add("show");

  clearTimeout(jVarToastTimer);
  jVarToastTimer = setTimeout(() => {
    jVarEl.classList.remove("show");
  }, 2300);
}
