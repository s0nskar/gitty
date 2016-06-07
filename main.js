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

/*
  Getting list of all commits in a repo
*/
ipcMain.on('get-commits', (event, repoPath) => {
  console.log(repoPath);
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
      console.log(allCommits);
      event.sender.send('commits', allCommits);
    }
  });
});

/*
  Getting list of all branches in a repo
*/
ipcMain.on('get-branches', (event, repoPath) => {
  console.log(repoPath);
  shell.cd(repoPath);

  let gitCommand = 'git branch';
  shell.exec(gitCommand, (err, stdout, stderr) => {
    if (err){
      console.log('error in exec [%s]', error);
    } else {
      branches = stdout.split('\n');
      console.log(branches);
      event.sender.send('branches', branches);
    }
  });
});

/*
  Getting info about a commit
*/
ipcMain.on('get-commit-info', (event, commitHash) => {
  let gitCommand = 'git show ' + commitHash;

  shell.exec(gitCommand, (err, stdout, stderr) => {
    if (err){
      console.log(err);
    } else {
      commitInfo = stdout;
      event.sender.send('commit-info', commitInfo);
    }
  });
});
