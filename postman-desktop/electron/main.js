const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = require('electron-is-dev');

// Define the path to the storage file
const storagePath = path.join(app.getPath('userData'), 'storage.json');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load the Angular app
  if (isDev) {
    win.loadURL('http://localhost:4200');
  } else {
    win.loadFile(path.join(__dirname, '../dist/postman-desktop/browser/index.html'));
  }

  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handler for getting data from storage.json
ipcMain.handle('get-storage', (event) => {
  try {
    if (fs.existsSync(storagePath)) {
      const data = fs.readFileSync(storagePath, 'utf8');
      return JSON.parse(data);
    }
    return {};
  } catch (error) {
    console.error('Failed to read storage file:', error);
    return {};
  }
});

// IPC handler for setting data in storage.json
ipcMain.handle('set-storage', (event, data) => {
  try {
    fs.writeFileSync(storagePath, JSON.stringify(data, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Failed to write to storage file:', error);
    return { success: false, error: error.message };
  }
});

// Ensure the storage file exists
if (!fs.existsSync(storagePath)) {
  fs.writeFileSync(storagePath, JSON.stringify({}, null, 2));
}