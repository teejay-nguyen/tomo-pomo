const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

let mainWindow;

app.whenReady().then(() => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 400,
    height: 400,
    frame: false,
    resizable: false,
    maximizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));
});

ipcMain.on("close-app", () => {
  mainWindow.close();
});

ipcMain.on("minimize-app", () => {
  mainWindow.minimize();
});

ipcMain.on("maximize-app", () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});
