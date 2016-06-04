const {ipcRenderer} = require('electron');

let refreshLocalRepos = document.getElementById("refresh-local-repos");

refreshLocalRepos.addEventListener('click', () => {
  ipcRenderer.send('refresh-local-repos');
});
