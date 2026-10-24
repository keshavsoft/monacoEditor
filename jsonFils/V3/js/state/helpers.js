/**
 * @file helpers.js
 * @description General helper functions for HTML escaping, language detection,
 * and transient user feedback toasts.
 * Keeps formatting and sanitize logic isolated and easily testable.
 * Imported across UI, fileManager, and terminal components.
 */

import { $ } from "./dom.js";
import { EXTENSION_MAP } from "./constants.js";

export const escapeHtml = (str) =>
  String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));

export const languageFor = (fileName) => {
  const ext = (fileName.split(".").pop() || "").toLowerCase();
  return EXTENSION_MAP[ext] || "plaintext";
};

let toastTimer = null;
export function toast(message) {
  const el = $("toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2300);
}
