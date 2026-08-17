// Carregamento de Notícias Dinâmicas

document.addEventListener('DOMContentLoaded', () => {
  fetchNews();
});

function fetchNews() {
  fetch('news/manifest.json')
    .then(response => response.json())
    .then(data => {
      const latestContainer = document.getElementById('latestNewsContainer');
      const allContainer = document.getElementById('allNewsContainer');

      if (latestContainer) {
        // Renderiza apenas os 3 primeiros no index
        renderNewsGrid(data.slice(0, 3), latestContainer);
      }

      if (allContainer) {
        // Renderiza todas as notícias em news.html
        renderNewsGrid(data, allContainer);
      }
    })
    .catch(err => {
      console.warn('Manifesto de notícias não encontrado ou erro de carregamento:', err);
    });
}

function renderNewsGrid(articles, container) {
  container.innerHTML = '';
  articles.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <span class="spec-badge">${item.date || 'Graphene News'}</span>
      <h3 style="margin: 0.5rem 0;">${item.title}</h3>
      <p style="color: var(--text-muted); font-size: 0.9rem;">${item.summary || item.description || ''}</p>
      <a href="news/${item.folder}/full.json" style="color: var(--accent-cyan); font-weight: 600; display: inline-block; margin-top: 1rem; font-size: 0.85rem;">Ler Artigo Completo &rarr;</a>
    `;
    container.appendChild(card);
  });
}