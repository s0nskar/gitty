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

  win = new BrowserWindow({width: 800, height: 600, frame: false});

  win.loadURL(`file://${__dirname}/index.html`);
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

/*
    index.html Helpers
*/

ipcMain.on('refresh-local-repos', (event) => {

  // command for finding all git repos as base dir ~.
  let gitCommand = 'find ~ -type d -name .git | xargs -n 1 dirname';
  // List of local repos
  let localRepos = []

  shell.exec(gitCommand, (err, stdout, stderr) => {
    if (err) {
      console.log('error in exec [%s]', error);
    } else {
      localRepos = stdout.split('\n');
      configration.saveSettings('localRepos', localRepos);
      event.sender.send('local-repos', localRepos);
    }
  });
});
