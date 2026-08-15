/**
 * Programa ARKA - Graphene Corp.
 * Carregador dinâmico de notícias locais via fetch
 */

const ARKA_NEWS = {
    MANIFEST_URL: 'news/manifest.json',
    
    /**
     * Carrega o manifest de notícias
     * @returns {Promise<Array>} Lista de notícias do manifest
     */
    async loadManifest() {
        try {
            const response = await fetch(this.MANIFEST_URL);
            if (!response.ok) throw new Error('Falha ao carregar manifest');
            const data = await response.json();
            return data.news || [];
        } catch (error) {
            console.error('Erro ao carregar manifest:', error);
            return [];
        }
    },
    
    /**
     * Carrega preview de uma notícia específica
     * @param {string} newsId - ID da notícia (ex: noticia-1)
     * @returns {Promise<object|null>} Dados do preview ou null
     */
    async loadPreview(newsId) {
        try {
            const response = await fetch(`news/${newsId}/preview.json`);
            if (!response.ok) throw new Error('Preview não encontrado');
            return await response.json();
        } catch (error) {
            console.error(`Erro ao carregar preview ${newsId}:`, error);
            return null;
        }
    },
    
    /**
     * Carrega conteúdo completo de uma notícia
     * @param {string} newsId - ID da notícia
     * @returns {Promise<object|null>} Dados completos ou null
     */
    async loadFull(newsId) {
        try {
            const response = await fetch(`news/${newsId}/full.json`);
            if (!response.ok) throw new Error('Conteúdo completo não encontrado');
            return await response.json();
        } catch (error) {
            console.error(`Erro ao carregar full ${newsId}:`, error);
            return null;
        }
    },
    
    /**
     * Carrega todos os previews de notícias
     * @returns {Promise<Array>} Array de previews
     */
    async loadAllPreviews() {
        const manifest = await this.loadManifest();
        const previews = [];
        
        for (const item of manifest) {
            const preview = await this.loadPreview(item.id);
            if (preview) {
                preview.slug = item.slug;
                previews.push(preview);
            }
        }
        
        return previews;
    },
    
    /**
     * Renderiza grid de notícias no index.html
     * @param {HTMLElement} container - Elemento container
     */
    async renderNewsGrid(container) {
        const previews = await this.loadAllPreviews();
        
        if (previews.length === 0) {
            container.innerHTML = '<p class="no-news">Nenhuma notícia disponível no momento.</p>';
            return;
        }
        
        // Ordena por data (mais recente primeiro)
        previews.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        container.innerHTML = previews.map((article, index) => `
            <article class="news-card ${index === 0 ? 'featured' : ''}" data-slug="${article.slug}">
                <div class="news-card-header">
                    <span class="news-category">${article.category}</span>
                </div>
                <div class="news-card-body">
                    <h3 class="news-title">${article.title}</h3>
                    <p class="news-summary">${article.summary}</p>
                </div>
                <div class="news-meta">
                    <span>${new Date(article.date).toLocaleDateString('pt-BR')}</span> • 
                    <span>${article.author}</span>
                </div>
            </article>
        `).join('');
        
        // Adiciona eventos de clique
        container.querySelectorAll('.news-card').forEach(card => {
            card.addEventListener('click', () => {
                const slug = card.dataset.slug;
                window.location.href = `news.html?slug=${slug}`;
            });
        });
    },
    
    /**
     * Carrega e renderiza notícia completa na página news.html
     * @param {string} slug - Slug da notícia da URL
     * @returns {Promise<boolean>} Sucesso ou falha
     */
    async loadAndRenderNews(slug) {
        // Encontra o ID correspondente ao slug
        const manifest = await this.loadManifest();
        const newsItem = manifest.find(item => item.slug === slug);
        
        if (!newsItem) {
            return false;
        }
        
        const fullContent = await this.loadFull(newsItem.id);
        
        if (!fullContent) {
            return false;
        }
        
        // Renderiza conteúdo
        document.getElementById('newsCategory').textContent = fullContent.category;
        document.getElementById('newsTitle').textContent = fullContent.title;
        document.getElementById('newsMeta').innerHTML = `
            <span>${new Date(fullContent.date).toLocaleDateString('pt-BR')}</span> • 
            <span>${fullContent.author}</span>
        `;
        document.getElementById('newsContent').innerHTML = fullContent.contentHtml;
        
        // Detalhes adicionais se existirem
        if (fullContent.fullDetails) {
            const detailsContainer = document.getElementById('newsDetails');
            detailsContainer.innerHTML = `
                <div class="news-detail-item">
                    <strong>Local:</strong> ${fullContent.fullDetails.location || 'Não especificado'}
                </div>
                <div class="news-detail-item">
                    <strong>Nível de Impacto:</strong> ${fullContent.fullDetails.impactLevel || 'N/A'}
                </div>
                <div class="news-detail-item">
                    <strong>Tópicos Relacionados:</strong> ${fullContent.fullDetails.relatedTopics?.join(', ') || 'N/A'}
                </div>
            `;
            detailsContainer.style.display = 'block';
        }
        
        return true;
    }
};

// Export para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ARKA_NEWS;
}
