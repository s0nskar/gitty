const {ipcRenderer} = require('electron');

let refreshLocalRepos = document.getElementById('refresh-local-repos');

refreshLocalRepos.addEventListener('click', () => {
  ipcRenderer.send('refresh-local-repos');
});

ipcRenderer.on('local-repos', (event, localRepos) => {
  console.log(localRepos)
  let repoNav = document.getElementById('repos');
  repoNav.innerHTML = '';

  localRepos.forEach((repo) => {
    let repoDiv = document.createElement('div');
    let repoName = document.createTextNode(repo);
    repoDiv.appendChild(repoName);
    repoNav.appendChild(repoDiv);
  });
});
