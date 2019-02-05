import { app, BrowserWindow, dialog, Menu } from 'electron';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';

import Better3 from 'better-sqlite3';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, db;

const isDevMode = process.execPath.match(/[\\/]electron/);

const SELECT_DUPLICATES = `
  SELECT
    filepath, hash, filesize, modified, COUNT(hash) as count
  FROM
    files
  GROUP BY
   hash
  HAVING
    COUNT(hash) > 1;
  `;

if (isDevMode) enableLiveReload();

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  if (isDevMode) {
    await installExtension(VUEJS_DEVTOOLS);
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });


  dialog.showOpenDialog(mainWindow, {
    title: 'Select SQLite file',
    filter: {
      name: 'All Files',
      extensions: ['*']
    },
    properties: ['openFile']
  }, (filePaths) => {
    console.log(filePaths);
    db = new Better3(filePaths[0]);
    const stmt = db.prepare(SELECT_DUPLICATES);
    const rows = stmt.all();
    console.log('rows:', rows.length);
    mainWindow.webContents.send('rows', rows);
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const template = [
  {
    label: 'Edit',
    submenu: [
      {role: 'undo'}
    ]
  }
];

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {role: 'about'}
    ]
  });
}

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
