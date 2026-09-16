const MONACO_PATH =
    "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs";

const EDITOR_PATH = "vs/editor/editor.main";

let editor;

require.config({
    paths: {
        vs: MONACO_PATH
    }
});

function StartFunc() {

    require(
        [EDITOR_PATH],
        initializeEditor
    );

    document
        .getElementById("tokenButton")
        .addEventListener(
            "click",
            inspectTokens
        );
}

function initializeEditor() {

    // 1. Define a language
    monaco.languages.register({
        id: "myJavaScript"
    });

    // 2. Define Monarch tokenizer
    monaco.languages.setMonarchTokensProvider(
        "myJavaScript",
        {
            keywords: [
                "function",
                "return",
                "const",
                "let",
                "var",
                "if",
                "else",
                "require"
            ],

            tokenizer: {

                root: [

                    // Keywords and identifiers
                    [
                        /[a-zA-Z_$][\w$]*/,
                        {
                            cases: {
                                "@keywords": "keyword",
                                "@default": "identifier"
                            }
                        }
                    ],

                    // Numbers
                    [/\d+/, "number"],

                    // Strings
                    [/"[^"]*"/, "string"],
                    [/'[^']*'/, "string"],
                    [/`[^`]*`/, "string"],

                    // Comments
                    [/\/\/.*$/, "comment"],

                    // Operators
                    [/[=+\-*\/]/, "operator"],

                    // Delimiters
                    [/[{}()[\];,.]/, "delimiter"]
                ]
            }
        }
    );

    // 3. Initial app.js content
    const code = `const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(\`Example app listening on port \${port}\`);
});`;

    // 4. Create Monaco Editor
    editor = monaco.editor.create(
        document.getElementById("editor"),
        {
            value: code,
            language: "myJavaScript",
            theme: "vs-dark",
            readOnly: true,
            automaticLayout: true,
            minimap: {
                enabled: false
            }
        }
    );

    document.getElementById("file").onchange =
        readAppJS;
}


function readAppJS(event) {

    const file =
        event.target.files[0];

    if (!file || file.name !== "app.js") {

        alert("Select app.js");

        return;
    }

    const reader =
        new FileReader();

    console.log(
        "Reading file:",
        file
    );

    reader.onload = () => {

        const code =
            reader.result;

        editor.setValue(code);
    };

    reader.readAsText(file);
}


function inspectTokens() {

    const model =
        editor.getModel();

    const code =
        model.getValue();

    const languageId =
        model.getLanguageId();

    const lines =
        monaco.editor.tokenize(
            code,
            languageId
        );

    lines.forEach(
        (tokens, lineIndex) => {

            const line =
                model.getLineContent(
                    lineIndex + 1
                );

            tokens.forEach(
                (token, index) => {

                    const start =
                        token.offset;

                    const end =
                        index + 1 < tokens.length
                            ? tokens[index + 1].offset
                            : line.length;

                    const text =
                        line
                            .substring(
                                start,
                                end
                            )
                            .trim();

                    if (text) {

                        console.log(
                            `${text.padEnd(15)} → ${token.type}`
                        );
                    }
                }
            );
        }
    );
}


StartFunc();