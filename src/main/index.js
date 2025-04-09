const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const fs = require("fs");

const dataFile = path.join(__dirname, "../data", "study-log.json");

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
      contextIsolation: true,
      preload: path.join(__dirname, "../preload", "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../renderer", "index.html"));
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

ipcMain.on("save-study-time", (event, secondsStudied) => {
  const today = new Date().toISOString().slice(0, 10);
  let data = {};

  if (fs.existsSync(dataFile)) {
    data = JSON.parse(fs.readFileSync(dataFile));
  }

  if (!data[today]) data[today] = 0;
  data[today] += secondsStudied;

  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
});

ipcMain.handle("get-study-data", () => {
  if (fs.existsSync(dataFile)) {
    return JSON.parse(fs.readFileSync(dataFile));
  }
  return {};
});

ipcMain.on("open-stats-window", () => {
  const statsWindow = new BrowserWindow({
    width: 400,
    height: 400,
    frame: false,
    resizable: false,
    maximizable: false,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "../preload", "preload.js"),
    },
  });

  statsWindow.loadFile(path.join(__dirname, "../renderer", "stats.html"));
});
