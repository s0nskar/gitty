const electron = require('electron');
const {ipcMain} = require('electron');
const nativeImage = require('electron').nativeImage;

const path = require('path');

// External packages
const shell = require('shelljs');

const diff = require('./app/diff.js');
// Configration module
const configration = require('./app/js/configration.js');

const {app} = electron;
const {BrowserWindow} = electron;

let win;

function createWindow() {
  fillConfigrations();

  let windowsOptions = {
    width: 800,
    minWidth: 800,
    height: 600,
    minHeight: 600,
    center: true,
    title: 'Gitty | Unofficial Github Client'
  }

  win = new BrowserWindow(windowsOptions);

  win.loadURL(`file://${__dirname}/index.html`);
  win.webContents.openDevTools();
  win.maximize();

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

ipcMain.on('get-local-repos', (event) => {
  let localRepos = configration.readSettings('localRepos');

  if (localRepos){
    event.sender.send('local-repos', localRepos);
  }
})

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

/*
  Getting list of all commits in a repo
*/
ipcMain.on('get-commits', (event, repoPath) => {
  shell.cd(repoPath);
  /*
    Getting all git commits
    Options for format -->
     %H --> commit hash
     %an --> author name
     %ar --> author date, humanize form
     %s --> message
  */
  let gitCommand = 'git log --pretty=format:"%H | %an | %ar | %s"';
  shell.exec(gitCommand, (err, stdout, stderr) => {
    if (err){
      console.log('error in exec [%s]', error);
    } else {
      allCommits = stdout.split('\n');
      event.sender.send('commits', allCommits);
    }
  });
});

/*
  Getting list of all branches in a repo
*/
ipcMain.on('get-branches', (event, repoPath) => {
  shell.cd(repoPath);

  let gitCommand = 'git branch';
  shell.exec(gitCommand, (err, stdout, stderr) => {
    if (err){
      console.log('error in exec [%s]', error);
    } else {
      branches = stdout.split('\n');
      event.sender.send('branches', branches);
    }
  });
});

/*
  Getting info about a commit
*/
ipcMain.on('get-commit-info', (event, commitHash) => {
  let gitCommand = 'git show ' + commitHash;
  console.log(gitCommand);
  shell.exec(gitCommand, (err, stdout, stderr) => {
    if (err){
      console.log(err);
    } else {
      diff(stdout, (err, output) => {
        if (err) console.log(err);
        event.sender.send('commit-info', output);
      });
    }
  });
});
