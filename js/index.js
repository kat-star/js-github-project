(function () {

  const userList = document.getElementById('user-list');
  const repoList = document.getElementById('repos-list');

  listenForSubmit();
  listenForClick();

  function listenForSubmit() {
    const form = document.getElementById('github-form')
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      repoList.innerHTML = "";
      const userInput = form.querySelector('input')
      fetch(`https://api.github.com/search/users?q=${userInput.value}`, { 
        headers: {
          Accept: "application/vnd.github.v3+json"
        }
      })
      .then(resp => resp.json())
      .then(searchResults => {
        userList.innerHTML = searchResults.items.map(user => renderGithubUser(user)).join("");
      })
    })
  }

  function renderGithubUser(user) {
    return `
      <div id="${user.id}"><p>${user.login}</p>
      <img src="${user.avatar_url}">
      <a href="${user.html_url}">Link to Profile</a>
      </div>
    `;
  };

  function listenForClick() {
    userList.addEventListener('click', function(event) {
      const parentAccount = event.target.parentElement.querySelector('p').textContent
      const parentCard = event.target.parentElement
      userList.innerHTML = parentCard.outerHTML;
      fetch(`https://api.github.com/users/${parentAccount}/repos`, {
        headers: {
          Accept: "application/vnd.github.v3+json"
        }
      })
        .then(resp => resp.json())
        .then(repoResults => {
          repoList.innerHTML = repoResults.map(repo => renderRepo(repo)).join("");
        })    
    })
  }

  function renderRepo(repo) {
    return `
      <div data-id="${repo.id}"><div>Repo Name: ${repo.name}</div>
      <div>Language: ${repo.language}</div>
      <a href=${repo.html_url}>Link to Repo</a>
      </div>
      <br>
    `;
  }

  })();