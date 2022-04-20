const { app, BrowserWindow, dialog, Menu, shell } = require('electron');

const isMac = process.platform === 'darwin';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const chooseDirectory = () => {
  const mainWindow = BrowserWindow.getFocusedWindow();
  const directory = dialog.showOpenDialogSync(mainWindow, {
    title: 'Select SQLite file',
    filter: {
      name: 'SQLite files',
      extensions: ['sqlite']
    },
    properties: ['openFile']
  });
  console.log(directory);
};

const randomHash = () => {
  const hash = Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2);
  return hash;
};

const sendRandom300rows = () => {
  const mainWindow = BrowserWindow.getFocusedWindow();
  const list = [];
  for (let i = 0; i < 300; i++) {
    list.push({
      filepath: `file-${i}-${Math.floor(Math.random() * 10000)}.txt`, 
      hash: randomHash(),
      filesize: Math.round(Math.random() * 10000, 2),
      modified: (new Date()).toISOString(), 
      count: Math.floor(Math.random() * 10 + 1)
    });
  }
  mainWindow.webContents.send('rows', list);
};

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
          chooseDirectory();
        }
      },
      {
        label: 'Generate random 300 rows',
        click: () => {
          sendRandom300rows();
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
          shell.openExternalSync('https://github.com/paazmaya/tozan');
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
