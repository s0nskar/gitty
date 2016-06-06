const {ipcRenderer} = require('electron');

const path = require('path');

setTimeout(() => {
    document.querySelector('#about-modal').classList.remove('is-shown');
},1000);

let refreshLocalReposBtn = document.getElementById('refresh-local-repos');

refreshLocalReposBtn.addEventListener('click', () => {
  ipcRenderer.send('refresh-local-repos');
});

ipcRenderer.on('local-repos', (event, localRepos) => {

  let repoNav = document.getElementById('local-repos');

  localRepos.forEach((repo) => {
    let repoName = path.basename(repo);
    let repoDiv = document.createElement('div');
    let repoBtn = document.createElement('button');
    let repoPath = document.createElement('div');
    repoBtn.className += "nav-button local-repos";
    repoBtn.appendChild(document.createTextNode(repoName));
    repoPath.hidden = true;
    repoPath.appendChild(document.createTextNode(repo));
    repoDiv.appendChild(repoBtn);
    repoDiv.appendChild(repoPath);
    repoNav.appendChild(repoDiv);

    repoDiv.addEventListener('click', (repo) => {
      // console.log(repo);
      ipcRenderer.send('get-commits', '/home/maniac/code/python/dvdf');
      ipcRenderer.send('get-branches', '/home/maniac/code/python/dvdf');
    });
  });
});

ipcRenderer.on('commits', (event, allCommits) => {
  let content = document.querySelector('.content');

  allCommits.forEach((commit) => {
    let a = document.createElement('p')
    a.appendChild(document.createTextNode(commit));
    content.appendChild(a);
  });
});

ipcRenderer.on('branches', (event, branches) => {
  let content = document.querySelector('.content');

  branches.forEach((commit) => {
    let a = document.createElement('p')
    a.appendChild(document.createTextNode(commit));
    content.appendChild(a);
  });
});
