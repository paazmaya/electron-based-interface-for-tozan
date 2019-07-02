import { app, BrowserWindow, dialog, Menu, shell } from 'electron';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';

import Better3 from 'better-sqlite3';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, db;

const isDevMode = process.execPath.match(/[\\/]electron/);
const isMac = process.platform === 'darwin';

const SELECT_DUPLICATES = `
  SELECT
    filepath, hash, filesize, modified, COUNT(hash) as count
  FROM
    files
  GROUP BY
    hash
  HAVING
    COUNT(hash) > 1
  ORDER BY
    hash, filepath;
`;

if (isDevMode) {
  enableLiveReload();
}

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
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


};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (!isMac) {
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

const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.getName(),
    submenu: [
      { role: 'about' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      {
        label: 'Open database',
        click: () => {

          dialog.showOpenDialog(mainWindow, {
            title: 'Select SQLite file',
            filter: {
              name: 'All Files',
              extensions: ['sqlite']
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
        }
      },
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: () => {
          shell.openExternalSync('https://github.com/paazmaya/tozan')
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
