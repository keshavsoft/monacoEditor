let jVarOnDownloadRequested = null;

export function jFSetTreeDownloadHandler(jVarFn) {
  jVarOnDownloadRequested = jVarFn;
}

export function jFGetTreeDownloadHandler() {
  return jVarOnDownloadRequested;
}
