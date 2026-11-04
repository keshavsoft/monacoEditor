export function newFile() {
    let name = "new-file.js";
    let number = 1;

    while (appState.files[name]) {
        number++;
        name = "new-file-" + number + ".js";
    }

    appState.files[name] = {
        name,
        type: "js",
        content: "// New JavaScript file\n"
    };

    openFile(name);
    log("Created " + name, "ok");
}