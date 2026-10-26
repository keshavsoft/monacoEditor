let jVarOnNewFileRequested = null;

export function jFSetNewFileHandler(jVarFn) {
  jVarOnNewFileRequested = jVarFn;
}

export function jFGetNewFileHandler() {
  return jVarOnNewFileRequested;
}
