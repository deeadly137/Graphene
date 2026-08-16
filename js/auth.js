/**
 * Programa ARKA - Graphene Corp.
 * Gerenciamento de autenticação e sessão de usuário
 * Sistema de autenticação baseado em arquivos /auth/$USERNAME.js
 */

const ARKA_AUTH = {
    STORAGE_KEY: 'arka_user_session',
    currentUserData: null,

    /**
     * Realiza login do cliente carregando dados do arquivo /auth/$USERNAME.js
     * @param {string} username 
     * @param {string} password 
     * @returns {Promise<object|null>} Cliente autenticado ou null
     */
    async login(username, password) {
        try {
            // Tenta carregar o arquivo do usuário via fetch
            const response = await fetch(`./auth/${username}.js`);
            
            if (!response.ok) {
                // Arquivo não encontrado (404)
                return null;
            }
            
            // Executa o script para obter ARKA_USER_DATA
            const scriptText = await response.text();
            
            // Cria um contexto seguro para executar o script
            const userData = this._parseUserData(scriptText);
            
            if (!userData) {
                return null;
            }
            
            // Valida a senha
            if (userData.password !== password) {
                return null;
            }
            
            // Remove senha dos dados armazenados
            const { password: _, ...clientData } = userData;
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(clientData));
            return clientData;
            
        } catch (error) {
            console.error('Erro na autenticação:', error);
            return null;
        }
    },

    /**
     * Parseia os dados do usuário do conteúdo do script
     * @param {string} scriptText 
     * @returns {object|null}
     */
    _parseUserData(scriptText) {
        try {
            // Extrai o objeto ARKA_USER_DATA do script
            const match = scriptText.match(/const\s+ARKA_USER_DATA\s*=\s*({[\s\S]*?});?\s*$/);
            if (match && match[1]) {
                // Avalia o objeto JavaScript de forma segura
                const dataObj = new Function('return ' + match[1])();
                return dataObj;
            }
            return null;
        } catch (error) {
            console.error('Erro ao parsear dados do usuário:', error);
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
