/**
 * Programa ARKA - Graphene Corp.
 * Gerenciamento de autenticação e sessão de usuário
 */

const ARKA_AUTH = {
    STORAGE_KEY: 'arka_user_session',

    /**
     * Realiza login do cliente
     * @param {string} username 
     * @param {string} password 
     * @returns {object|null} Cliente autenticado ou null
     */
    login(username, password) {
        const client = ARKA_DATA.clients.find(
            c => c.username === username && c.password === password
        );

        if (client) {
            // Remove senha dos dados armazenados
            const { password: _, ...clientData } = client;
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(clientData));
            return clientData;
        }

        return null;
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
