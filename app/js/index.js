const {ipcRenderer} = require('electron');

const path = require('path');

let refreshLocalReposBtn = document.getElementById('refresh-local-repos');

refreshLocalReposBtn.addEventListener('click', () => {
  ipcRenderer.send('refresh-local-repos');
});

ipcRenderer.on('local-repos', (event, localRepos) => {

  let repoNav = document.getElementById('local-repos');

  localRepos.forEach((repo) => {
    let repoName = path.basename(repo);
    let repoBtn = document.createElement('button');
    repoBtn.className += "nav-button local-repos";
    repoBtn.appendChild(document.createTextNode(repoName));
    repoNav.appendChild(repoBtn);
  });
});
