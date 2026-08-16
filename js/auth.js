/**
 * Programa ARKA - Graphene Corp.
 * Gerenciamento de autenticação e sessão de usuário
 * Sistema de armazenamento baseado em arquivos individuais /auth/$USERNAME.js
 */

const ARKA_AUTH = {
    STORAGE_KEY: 'arka_user_session',

    /**
     * Realiza login do cliente carregando dados do arquivo individual
     * @param {string} username 
     * @param {string} password 
     * @returns {Promise<object|null>} Cliente autenticado ou null
     */
    async login(username, password) {
        try {
            // Tenta carregar o arquivo do usuário
            const response = await fetch(`./auth/${username}.js`);
            
            if (!response.ok) {
                // Arquivo não encontrado (404)
                return null;
            }
            
            // Executa o script para obter os dados do usuário
            const scriptText = await response.text();
            
            // Cria um sandbox para executar o script e extrair ARKA_USER_DATA
            const sandbox = {};
            const evalScript = new Function('sandbox', `
                ${scriptText}
                sandbox.userData = ARKA_USER_DATA;
            `);
            evalScript(sandbox);
            
            const client = sandbox.userData;
            
            // Valida a senha
            if (client && client.passwordHash === password) {
                // Remove senha dos dados armazenados
                const { passwordHash: _, ...clientData } = client;
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(clientData));
                return clientData;
            }
            
            return null;
        } catch (error) {
            // Erro ao carregar arquivo (file:// protocol ou outro erro)
            console.warn('Erro ao carregar dados do usuário:', error);
            return null;
        }
    },

    /**
     * Verifica se há usuário logado
     * @returns {object|null} Dados do usuário ou null
     */
    getSession() {
        const session = localStorage.getItem(this.STORAGE_KEY);
        return session ? JSON.parse(session) : null;
    },

    /**
     * Verifica se usuário está autenticado
     * @returns {boolean}
     */
    isAuthenticated() {
        return this.getSession() !== null;
    },

    /**
     * Realiza logout do usuário
     */
    logout() {
        localStorage.removeItem(this.STORAGE_KEY);
        window.location.href = 'login.html';
    },

    /**
     * Protege páginas que requerem autenticação
     */
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    /**
     * Redireciona para dashboard se já estiver logado
     */
    redirectIfAuthenticated() {
        if (this.isAuthenticated()) {
            window.location.href = 'dashboard.html';
            return true;
        }
        return false;
    },

    /**
     * Atualiza dados do usuário no localStorage
     * @param {object} updatedData 
     */
    updateSession(updatedData) {
        const current = this.getSession();
        if (current) {
            const merged = { ...current, ...updatedData };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(merged));
            return merged;
        }
        return null;
    }
};

// Auto-check para páginas protegidas
if (typeof window !== 'undefined') {
    // Verifica se estamos em uma página que requer auth
    const path = window.location.pathname;
    if (path.includes('dashboard.html')) {
        ARKA_AUTH.requireAuth();
    }
    
    // Redireciona se já logado nas páginas públicas
    if (path.includes('login.html') || path === '/' || path.endsWith('index.html')) {
        ARKA_AUTH.redirectIfAuthenticated();
    }
}
