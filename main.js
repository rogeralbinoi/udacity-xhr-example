const NYT_ID = '<-- Client ID -->';
const rootElement = document.getElementById('root');
const searchForm = document.getElementById('search-form');

const filterArticles = doc => {
  return (doc.document_type === 'article' && !!((doc.multimedia[0] || {}).url));
}

function addArticles() {
  const data = JSON.parse(this.responseText);
  loader.style.display = 'none';
  const docs = data.response.docs.filter(filterArticles).map(doc => `
    <a class="${!!(doc.snippet.length >= 150) ? 'card-medium' : 'card-small'}" href="${doc.web_url}" target="_blank">
      <article>
          <figure>
            <img src="//www.nytimes.com/${doc.multimedia[0].url}">
          </figure>
        <p>${doc.snippet}</p>
      </article>
    </a>
  `);

  const docList = docs.join('');

  rootElement.innerHTML = `
    <div class="results">
      ${docList.trim()}
    </div>
    <div class="copy">
      <small>${data.copyright}</small>
    </div>
  `;
}

function articlesError(err) {
  loader.style.display = 'none';
  alert('Error')
}

function searchForArticles(query) {
  loader.style.display = 'block';
  rootElement.innerHTML = ''
  const articleRequest = new XMLHttpRequest();
  articleRequest.onload = addArticles;
  articleRequest.onerror = articlesError;
  articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&api-key=${NYT_ID}`);
  articleRequest.send();
}

function submitSearch(e) {
  e.preventDefault();
  searchForArticles(e.target[0].value);
}

searchForm.addEventListener('submit', submitSearch);