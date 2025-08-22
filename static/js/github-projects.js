function projectTemplate(repo) {
    return `<a href="${repo.html_url}" class="list-group-item list-group-item-action" title="${repo.full_name}" target="_blank">
        <h5 class="mb-1">${repo.name}</h5>
        <p class="mb-1">${repo.description}</p>
        <div class="d-flex w-100 justify-content-between">
            <small>${repo.license ? repo.license.name : 'No License'}</small>
            <small>
                <i class="bi bi-git"></i>
                <span>${repo.forks_count} Forks</span>
            </small>
            <small>
                <i class="bi bi-star-fill"></i>
                <span>${repo.stargazers_count} Stars</span>
            </small>
            <small>
                <i class="bi bi-exclamation-circle"></i>
                <span>${repo.open_issues_count} Issues</span>
            </small>
            <small style="width:130px">
                <i class="bi bi-calendar"></i>
                <span>${luxon.DateTime.fromISO(repo.updated_at).toRelative()}</span>
            </small>
        </div>
    </a>`;
}

function loadGitHubProjects() {
    const url = "https://api.github.com/search/repositories?q=org:loresoft+stars:>20&sort=stars";

    fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/vnd.github.mercy-preview+json"
        }
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(function(data) {
        const projectsContainer = document.getElementById('github-projects');
        if (projectsContainer) {
            projectsContainer.innerHTML = data.items.map(projectTemplate).join('');
        }
    })
    .catch(function(error) {
        console.error('Error fetching GitHub projects:', error);
    });
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', loadGitHubProjects);
