/**
 * @file fileManager.js (Bridge Module)
 * @description File manager operations re-export bridge for backward compatibility.
 * Re-exports file store CRUD, tab bar rendering, explorer tree rendering,
 * and file import/export handlers from the modular ./fileManager/ subfolder.
 */

export { openFile, ensureFile, closeFile } from "./fileManager/fileStore.js";
export { renderTabs } from "./fileManager/tabBar.js";
export { renderTree } from "./fileManager/fileTree.js";
export { newFilePrompt as newFile, downloadFile, openLocalFile as openLocal } from "./fileManager/fileIo.js";
