/**
 * @file monacoLoader.js
 * @description Loads Monaco Editor AMD modules via cdnjs asynchronously.
 * Manages require.config and provides a Promise-based loader to ensure
 * Monaco dependencies are ready before editor instance instantiation.
 */

import { VS_PATH } from "../state/constants.js";

export function loadMonaco() {
  return new Promise((resolve, reject) => {
    if (window.monaco) {
      resolve(window.monaco);
      return;
    }

    if (typeof window.require !== "undefined") {
      window.require.config({
        paths: { vs: VS_PATH }
      });

      window.require(
        ["vs/editor/editor.main"],
        () => resolve(window.monaco),
        (err) => reject(err)
      );
    } else {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (typeof window.require !== "undefined") {
          clearInterval(interval);
          window.require.config({ paths: { vs: VS_PATH } });
          window.require(
            ["vs/editor/editor.main"],
            () => resolve(window.monaco),
            (err) => reject(err)
          );
        } else if (attempts > 50) {
          clearInterval(interval);
          reject(new Error("Monaco loader.js timed out"));
        }
      }, 50);
    }
  });
}
