// monaco-editor.js - Monaco setup
require.config({paths:{vs:"https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs"}});
require(["vs/editor/editor.main"],function(){
 appState.editor=monaco.editor.create(document.getElementById("editor"),{value:"",language:"javascript",theme:"vs-dark",automaticLayout:true,minimap:{enabled:true},fontSize:14});
 appState.astEditor=monaco.editor.create(document.getElementById("astEditor"),{value:"",language:"json",theme:"vs-dark",readOnly:true,automaticLayout:true,minimap:{enabled:true},fontSize:13});
 appState.editor.onDidChangeModelContent(()=>{if(appState.currentFile&&appState.files[appState.currentFile])appState.files[appState.currentFile].content=appState.editor.getValue();});
 log("Monaco Editor loaded.","ok");
});