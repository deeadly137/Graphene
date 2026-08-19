// Notícias — Central de Comunicados Graphene

document.addEventListener('DOMContentLoaded', () => {
  const latestContainer = document.getElementById('latestNewsContainer');
  const allContainer = document.getElementById('allNewsContainer');

  if (latestContainer || allContainer) {
    loadPreviews().then((previews) => {
      if (latestContainer) renderNewsGrid(previews.slice(0, 3), latestContainer);
      if (allContainer) renderNewsGrid(previews, allContainer);
    });
  }

  // página de notícias também sabe exibir um artigo completo via #/artigo/<id>
  if (allContainer) {
    window.addEventListener('hashchange', handleNewsRoute);
    handleNewsRoute();
  }
});

function loadManifestIds() {
  return fetch('news/manifest.json')
    .then((r) => r.json())
    .then((data) => (data.news || []).map((item) => item.id))
    .catch(() => []);
}

function loadPreviews() {
  return loadManifestIds().then((ids) =>
    Promise.all(
      ids.map((id) =>
        fetch(`news/${id}/preview.json`)
          .then((r) => r.json())
          .catch(() => null)
      )
    ).then((list) => list.filter(Boolean).sort((a, b) => (a.date < b.date ? 1 : -1)))
  );
}

function renderNewsGrid(articles, container) {
  if (!articles.length) {
    container.innerHTML = '<p class="news-empty">Nenhum comunicado disponível no momento.</p>';
    return;
  }
  container.innerHTML = articles
    .map(
      (item) => `
    <a href="news.html#/artigo/${item.id}" class="news-card reveal in-view">
      <div class="news-card-img" style="background-image:url('${item.image || ''}')"></div>
      <div class="news-card-body">
        <div class="news-card-meta">
          <span>${item.category || 'Comunicado'}</span>
          <span>&middot;</span>
          <span>${formatDate(item.date)}</span>
        </div>
        <h3>${item.title}</h3>
        <p>${item.summary || ''}</p>
        <span class="news-card-link">Ler artigo completo &rarr;</span>
      </div>
    </a>
  `
    )
    .join('');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function handleNewsRoute() {
  const hash = window.location.hash; // ex: #/artigo/noticia-1
  const match = hash.match(/^#\/artigo\/(.+)$/);
  const grid = document.getElementById('allNewsContainer');
  const gridHeader = document.getElementById('newsGridHeader');
  const articleView = document.getElementById('articleView');

  if (!articleView) return;

  if (match) {
    const id = match[1];
    fetch(`news/${id}/full.json`)
      .then((r) => r.json())
      .then((data) => {
        renderArticle(data, articleView);
        if (grid) grid.style.display = 'none';
        if (gridHeader) gridHeader.style.display = 'none';
        articleView.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(() => {
        window.location.hash = '';
      });
  } else {
    articleView.classList.remove('active');
    articleView.innerHTML = '';
    if (grid) grid.style.display = '';
    if (gridHeader) gridHeader.style.display = '';
  }
}

function renderArticle(data, container) {
  const facts = data.fullDetails || {};
  const topics = (facts.relatedTopics || [])
    .map((t) => `<span class="chip">${t}</span>`)
    .join('');

  container.innerHTML = `
    <a href="news.html" class="article-back">&larr; Voltar aos comunicados</a>
    ${data.image ? `<div class="article-hero-img" style="background-image:url('${data.image}')"></div>` : ''}
    <div class="news-card-meta">
      <span>${data.category || 'Comunicado'}</span>
      <span>&middot;</span>
      <span>${formatDate(data.date)}</span>
      <span>&middot;</span>
      <span>${data.author || 'Redação Graphene'}</span>
    </div>
    <h1 class="article-title">${data.title}</h1>
    <div class="article-body">${data.contentHtml || ''}</div>
    ${
      facts.location || facts.impactLevel || topics
        ? `<div class="article-facts">
      <h4>Ficha do Comunicado</h4>
      <dl>
        ${facts.location ? `<dt>Localização</dt><dd>${facts.location}</dd>` : ''}
        ${facts.impactLevel ? `<dt>Nível de Impacto</dt><dd>${facts.impactLevel}</dd>` : ''}
        ${topics ? `<dt>Temas Relacionados</dt><dd><div class="chip-row">${topics}</div></dd>` : ''}
      </dl>
    </div>`
        : ''
    }
  `;
}
