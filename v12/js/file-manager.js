// file-manager.js - upload, Explorer, tabs, new/close files
function readJSFile(){document.getElementById("jsInput").click();}
document.getElementById("jsInput").addEventListener("change",e=>{
 const file=e.target.files[0];if(!file)return;
 const reader=new FileReader();
 reader.onload=ev=>{appState.files[file.name]={name:file.name,type:"js",content:ev.target.result};openFile(file.name);log("Read "+file.name,"ok");};
 reader.readAsText(file);e.target.value="";
});
function openFile(name){if(!appState.files[name])return;appState.currentFile=name;appState.editor.setValue(appState.files[name].content);monaco.editor.setModelLanguage(appState.editor.getModel(),appState.files[name].type==="ast"?"json":"javascript");renderExplorer();renderTabs();}
function renderExplorer(){const tree=document.getElementById("tree");tree.innerHTML="";Object.keys(appState.files).forEach(name=>{const d=document.createElement("div");d.className="tree-item "+(name===appState.currentFile?"active ":"")+(appState.files[name].type==="ast"?"ast":"");d.textContent=(appState.files[name].type==="ast"?"🌳 ":"📄 ")+name;d.onclick=()=>openFile(name);tree.appendChild(d);});}
function renderTabs(){const tabs=document.getElementById("tabs");tabs.innerHTML="";Object.keys(appState.files).forEach(name=>{const t=document.createElement("div");t.className="tab "+(name===appState.currentFile?"active":"");t.textContent=(appState.files[name].type==="ast"?"🌳 ":"📄 ")+name;const c=document.createElement("span");c.className="close";c.textContent="×";c.onclick=e=>closeFile(e,name);t.appendChild(c);t.onclick=()=>openFile(name);tabs.appendChild(t);});}
function closeFile(e,name){e.stopPropagation();delete appState.files[name];if(appState.currentFile===name){const a=Object.keys(appState.files);appState.currentFile=a[0]||"";appState.editor.setValue(appState.currentFile?appState.files[appState.currentFile].content:"");}renderExplorer();renderTabs();log("Closed "+name);}
function newFile(){let n="new-file.js",i=1;while(appState.files[n])n="new-file-"+(++i)+".js";appState.files[n]={name:n,type:"js",content:"// New JavaScript file\n"};openFile(n);log("Created "+n,"ok");}