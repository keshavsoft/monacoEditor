import { jVarVsPath } from "../state/jVarConstants.js";

export function jFLoadMonaco() {
  return new Promise((jVarResolve, jVarReject) => {
    if (window.monaco) {
      jVarResolve(window.monaco);
      return;
    }

    if (typeof window.require !== "undefined") {
      window.require.config({
        paths: { vs: jVarVsPath }
      });

      window.require(
        ["vs/editor/editor.main"],
        () => jVarResolve(window.monaco),
        (jVarErr) => jVarReject(jVarErr)
      );
    } else {
      let jVarAttempts = 0;
      const jVarInterval = setInterval(() => {
        jVarAttempts++;
        if (typeof window.require !== "undefined") {
          clearInterval(jVarInterval);
          window.require.config({ paths: { vs: jVarVsPath } });
          window.require(
            ["vs/editor/editor.main"],
            () => jVarResolve(window.monaco),
            (jVarErr) => jVarReject(jVarErr)
          );
        } else if (jVarAttempts > 50) {
          clearInterval(jVarInterval);
          jVarReject(new Error("Monaco loader.js timed out"));
        }
      }, 50);
    }
  });
}
