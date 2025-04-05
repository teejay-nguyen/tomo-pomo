const { ipcRenderer } = require("electron");

document.getElementById("close-btn").addEventListener("click", () => {
  ipcRenderer.send("close-app");
});

document.getElementById("minimize-btn").addEventListener("click", () => {
  ipcRenderer.send("minimize-app");
});
