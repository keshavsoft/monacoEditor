let jVarFileChangeListeners = [];

export function jFOnFileChange(jVarListener) {
  jVarFileChangeListeners.push(jVarListener);
}

export function jFNotifyFileChange() {
  jVarFileChangeListeners.forEach((jVarFn) => jVarFn());
}
