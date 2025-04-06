// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getStudyData: () => ipcRenderer.invoke("get-study-data"),
  saveStudyTime: (seconds) => ipcRenderer.send("save-study-time", seconds),
  closeApp: () => ipcRenderer.send("close-app"),
  minimizeApp: () => ipcRenderer.send("minimize-app"),
  openStatsWindow: () => ipcRenderer.send("open-stats-window"),
});
