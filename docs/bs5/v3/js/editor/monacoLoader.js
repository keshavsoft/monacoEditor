export function loadMonaco() {
    return new Promise((resolve, reject) => {
        if (window.monaco && window.monaco.editor) {
            resolve(window.monaco);
            return;
        }

        require.config({
            paths: {
                vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs"
            }
        });

        require(["vs/editor/editor.main"], () => resolve(window.monaco), reject);
    });
}

