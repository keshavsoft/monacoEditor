/**
 * @file terminalRunner.js
 * @description Safe JavaScript runtime execution engine for the browser sandbox.
 * Intercepts console logging (log, warn, error, info), handles Promise returns,
 * captures runtime syntax/eval exceptions, and prints formatted output to terminal.
 * Triggered by the Run button and terminal CLI commands (e.g., node sample.js).
 */

import { state } from "../state/state.js";
import { escapeHtml } from "../state/helpers.js";

function formatArg(arg) {
  if (arg === undefined) return "undefined";
  if (arg === null) return "null";
  if (typeof arg === "object") {
    try {
      return JSON.stringify(arg, null, 2);
    } catch {
      return String(arg);
    }
  }
  return String(arg);
}

export function executeJsSandbox(code, onLog, onError) {
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalInfo = console.info;

  const capturedLogs = [];

  const safeLog = (...args) => {
    const formatted = args.map(formatArg).join(" ");
    capturedLogs.push({ type: "log", text: formatted });
    if (onLog) onLog(formatted, "log");
  };

  const safeWarn = (...args) => {
    const formatted = args.map(formatArg).join(" ");
    capturedLogs.push({ type: "warn", text: formatted });
    if (onLog) onLog(formatted, "warn");
  };

  const safeError = (...args) => {
    const formatted = args.map(formatArg).join(" ");
    capturedLogs.push({ type: "error", text: formatted });
    if (onError) onError(formatted);
  };

  const safeInfo = (...args) => {
    const formatted = args.map(formatArg).join(" ");
    capturedLogs.push({ type: "info", text: formatted });
    if (onLog) onLog(formatted, "info");
  };

  try {
    // Override console in sandbox scope
    const sandboxConsole = {
      log: safeLog,
      warn: safeWarn,
      error: safeError,
      info: safeInfo
    };

    // Construct runnable function with captured console
    const runner = new Function("console", `"use strict";\n${code}`);
    const result = runner(sandboxConsole);

    // Handle promise output if returned
    if (result && typeof result.then === "function") {
      result
        .then((resolved) => {
          if (resolved !== undefined) {
            safeLog(resolved);
          }
        })
        .catch((err) => {
          safeError(err && err.stack ? err.stack : String(err));
        });
    } else if (result !== undefined && capturedLogs.length === 0) {
      safeLog(result);
    }
  } catch (err) {
    const errText = err && err.stack ? err.stack : `Runtime Error: ${err.message || err}`;
    safeError(errText);
  } finally {
    console.log = originalLog;
    console.warn = originalWarn;
    console.error = originalError;
    console.info = originalInfo;
  }

  return capturedLogs;
}
