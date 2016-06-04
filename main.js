const electron = require('electron');
const {ipcMain} = require('electron');

// External packages
const shell = require('shelljs');

// Configration module
const configration = require('./configration.js');

const {app} = electron;
const {BrowserWindow} = electron;

let win;

function createWindow() {
  fillConfigrations();

  win = new BrowserWindow({width: 800, height: 600});

  win.loadURL(`file://${__dirname}/app/index.html`);
  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

function fillConfigrations() {
// Nothing for now;
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null){
    createWindow();
  }
});

ipcMain.on('refresh-local-repos', () => {

  // command for finding all git repos as base dir ~.
  let gitCommand = 'find ~ -type d -name .git | xargs -n 1 dirname';

  shell.exec(gitCommand, (err, stdout, stderr) => {
    if (err) {
      console.log('error in exec [%s]', error);
    } else {
      console.log('stdout: [%s]', stdout);
      console.log('stderr: [%s]', stderr);
    }
  });
});
