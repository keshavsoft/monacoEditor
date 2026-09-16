const MONACO_PATH =
    "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs";

const EDITOR_PATH = "vs/editor/editor.main";

let editor;

require.config({
    paths: { vs: MONACO_PATH }
});

function StartFunc() {
    require([EDITOR_PATH], initializeEditor);

}

function initializeEditor() {

    // 1. Define a language
    monaco.languages.register({
        id: "myJavaScript"
    });

    // 2. Define Monarch tokenizer
    monaco.languages.setMonarchTokensProvider("myJavaScript", {

        keywords: [
            "function",
            "return",
            "const",
            "let",
            "var",
            "if",
            "else"
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

                // Comments
                [/\/\/.*$/, "comment"],

                // Operators
                [/[=+\-*\/]/, "operator"]
            ]
        }
    });
    // debugger
    // 3. Create Monaco Editor
    editor = monaco.editor.create(
        document.getElementById("editor"),
        {
            language: "myJavaScript",
            theme: "vs-dark",
            readOnly: true,
            automaticLayout: true
        }
    );

    document.getElementById("file").onchange = readAppJS;
}


function readAppJS(event) {

    const file = event.target.files[0];

    if (!file || file.name !== "app.js") {
        alert("Select app.js");
        return;
    }

    const reader = new FileReader();

    console.log("Reading file:", file);

    reader.onload = () => {

        // Actual app.js content
        const code = reader.result;

        // Put code into Monaco
        editor.setValue(code);
        // console.log("File content:", editor.getValue()); 
        console.log("getModel:", editor.getModel());
        console.log("tokenization:", editor.getModel().tokenization);

    };

    reader.readAsText(file);
};


StartFunc();