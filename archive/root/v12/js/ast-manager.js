// ast-manager.js - Babel loading, AST creation and download
async function createAST(){
 if(!appState.currentFile){alert("Please read a JavaScript file first.");return;}
 const file=appState.files[appState.currentFile],panel=document.getElementById("astPanel"),status=document.getElementById("astStatus");
 panel.classList.add("show");status.textContent="⏳ Creating AST...";
 try{
  const BabelLib=await loadBabel();
  const result=BabelLib.parse(file.content,{sourceType:"unambiguous",sourceFilename:file.name,plugins:[],errorRecovery:false});
  appState.currentAST=result;
  const json=JSON.stringify(result,null,2);
  appState.astEditor.setValue(json);
  const astName=file.name.replace(/\.(mjs|cjs|js)$/i,"")+".ast.json";
  appState.files[astName]={name:astName,type:"ast",content:json};
  renderExplorer();renderTabs();
  status.textContent="✅ AST created: "+astName;
  document.getElementById("downloadASTBtn").style.display="inline-block";
  log("Created "+astName,"ok");
 }catch(error){
  status.textContent="❌ AST Error: "+error.message;
  const line=error.loc&&error.loc.line?error.loc.line:1;
  monaco.editor.setModelMarkers(appState.editor.getModel(),"ast-error",[{startLineNumber:line,startColumn:1,endLineNumber:line,endColumn:appState.editor.getModel().getLineMaxColumn(line),message:error.message,severity:monaco.MarkerSeverity.Error}]);
  log("AST Error: "+error.message,"err");
 }
}
function loadBabel(){
 if(window.Babel)return Promise.resolve(window.Babel);
 if(appState.babelPromise)return appState.babelPromise;
 appState.babelPromise=new Promise((resolve,reject)=>{
  const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js";s.onload=()=>window.Babel?resolve(window.Babel):reject(new Error("Babel failed to load"));s.onerror=()=>reject(new Error("Babel CDN could not be loaded"));document.head.appendChild(s);
 });
 return appState.babelPromise;
}
function downloadAST(){
 if(!appState.currentAST){alert("Create AST first.");return;}
 const name=(appState.currentFile||"code.js").replace(/\.(mjs|cjs|js)$/i,"")+".ast.json";
 const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(appState.currentAST,null,2)],{type:"application/json"}));a.download=name;a.click();log("Downloaded "+name,"ok");
}
function closeAST(){document.getElementById("astPanel").classList.remove("show");}