function jFFormatArg(jVarArg) {
  if (jVarArg === undefined) return "undefined";
  if (jVarArg === null) return "null";
  if (typeof jVarArg === "object") {
    try {
      return JSON.stringify(jVarArg, null, 2);
    } catch {
      return String(jVarArg);
    }
  }
  return String(jVarArg);
}

export function jFExecuteJsSandbox(jVarCode, jVarOnLog, jVarOnError) {
  const jVarOriginalLog = console.log;
  const jVarOriginalWarn = console.warn;
  const jVarOriginalError = console.error;
  const jVarOriginalInfo = console.info;

  const jVarCapturedLogs = [];

  const jVarSafeLog = (...jVarArgs) => {
    const jVarFormatted = jVarArgs.map(jFFormatArg).join(" ");
    jVarCapturedLogs.push({ type: "log", text: jVarFormatted });
    if (jVarOnLog) jVarOnLog(jVarFormatted, "log");
  };

  const jVarSafeWarn = (...jVarArgs) => {
    const jVarFormatted = jVarArgs.map(jFFormatArg).join(" ");
    jVarCapturedLogs.push({ type: "warn", text: jVarFormatted });
    if (jVarOnLog) jVarOnLog(jVarFormatted, "warn");
  };

  const jVarSafeError = (...jVarArgs) => {
    const jVarFormatted = jVarArgs.map(jFFormatArg).join(" ");
    jVarCapturedLogs.push({ type: "error", text: jVarFormatted });
    if (jVarOnError) jVarOnError(jVarFormatted);
  };

  const jVarSafeInfo = (...jVarArgs) => {
    const jVarFormatted = jVarArgs.map(jFFormatArg).join(" ");
    jVarCapturedLogs.push({ type: "info", text: jVarFormatted });
    if (jVarOnLog) jVarOnLog(jVarFormatted, "info");
  };

  try {
    const jVarSandboxConsole = {
      log: jVarSafeLog,
      warn: jVarSafeWarn,
      error: jVarSafeError,
      info: jVarSafeInfo
    };

    const jVarRunner = new Function("console", `"use strict";\n${jVarCode}`);
    const jVarResult = jVarRunner(jVarSandboxConsole);

    if (jVarResult && typeof jVarResult.then === "function") {
      jVarResult
        .then((jVarResolved) => {
          if (jVarResolved !== undefined) {
            jVarSafeLog(jVarResolved);
          }
        })
        .catch((jVarErr) => {
          jVarSafeError(jVarErr && jVarErr.stack ? jVarErr.stack : String(jVarErr));
        });
    } else if (jVarResult !== undefined && jVarCapturedLogs.length === 0) {
      jVarSafeLog(jVarResult);
    }
  } catch (jVarErr) {
    const jVarErrText = jVarErr && jVarErr.stack ? jVarErr.stack : `Runtime Error: ${jVarErr.message || jVarErr}`;
    jVarSafeError(jVarErrText);
  } finally {
    console.log = jVarOriginalLog;
    console.warn = jVarOriginalWarn;
    console.error = jVarOriginalError;
    console.info = jVarOriginalInfo;
  }

  return jVarCapturedLogs;
}
