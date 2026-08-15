/**
 * Programa ARKA - Graphene Corp.
 * Lógica do Dashboard da Cápsula
 * Controle biométrico, notificações e sistema de atributos RPG
 */

const ARKA_DASHBOARD = {
    TOTAL_ATTRIBUTE_POINTS: 20,
    
    /**
     * Inicializa o dashboard
     */
    init() {
        if (!ARKA_AUTH.requireAuth()) return;
        
        const user = ARKA_AUTH.getSession();
        this.renderBiometricData(user);
        this.renderCapsuleStatus(user);
        this.renderNotifications();
        this.initAttributeSystem(user);
        this.setupLogout();
    },

    /**
     * Renderiza ficha biométrica do cliente
     * @param {object} user 
     */
    renderBiometricData(user) {
        const bio = user.biometric;
        
        document.getElementById('clientName').textContent = user.name;
        document.getElementById('clientEmail').textContent = user.email;
        document.getElementById('bloodType').textContent = bio.bloodType;
        document.getElementById('height').textContent = `${bio.height} cm`;
        document.getElementById('weight').textContent = `${bio.weight} kg`;
        document.getElementById('age').textContent = `${bio.age} anos`;
        document.getElementById('gender').textContent = bio.gender;
    },

    /**
     * Renderiza status da cápsula
     * @param {object} user 
     */
    renderCapsuleStatus(user) {
        const state = user.capsuleState || 'Em Espera';
        const statusElement = document.getElementById('capsuleState');
        const statusIndicator = document.getElementById('statusIndicator');
        
        statusElement.textContent = state;
        
        // Define cores baseadas no estado
        statusIndicator.className = 'status-indicator';
        if (state === 'Hibernando') {
            statusIndicator.classList.add('status-hibernating');
        } else if (state === 'Desperto') {
            statusIndicator.classList.add('status-active');
        } else {
            statusIndicator.classList.add('status-waiting');
        }
    },

    /**
     * Renderiza notificações da cápsula
     */
    renderNotifications() {
        const container = document.getElementById('notificationsList');
        const notifications = ARKA_DATA.capsuleNotifications;
        
        container.innerHTML = '';
        
        notifications.forEach(notif => {
            const item = document.createElement('div');
            item.className = `notification-item notification-${notif.type}`;
            
            const icon = this.getNotificationIcon(notif.type);
            const time = new Date(notif.timestamp).toLocaleString('pt-BR');
            
            item.innerHTML = `
                <span class="notification-icon">${icon}</span>
                <div class="notification-content">
                    <p class="notification-message">${notif.message}</p>
                    <span class="notification-time">${time}</span>
                </div>
            `;
            
            container.appendChild(item);
        });
    },

    /**
     * Retorna ícone baseado no tipo de notificação
     * @param {string} type 
     * @returns {string}
     */
    getNotificationIcon(type) {
        const icons = {
            info: 'ℹ️',
            warning: '⚠️',
            success: '✅',
            error: '❌'
        };
        return icons[type] || '📢';
    },

    /**
     * Inicializa sistema de atributos RPG
     * @param {object} user 
     */
    initAttributeSystem(user) {
        this.currentAttributes = { ...user.attributes };
        this.updateAttributeDisplay();
        this.setupAttributeControls();
    },

    /**
     * Atualiza display dos atributos
     */
    updateAttributeDisplay() {
        const attrs = this.currentAttributes;
        const used = attrs.strength + attrs.dexterity + attrs.constitution + attrs.intelligence;
        const available = this.TOTAL_ATTRIBUTE_POINTS - used;
        
        document.getElementById('attrStrength').textContent = attrs.strength;
        document.getElementById('attrDexterity').textContent = attrs.dexterity;
        document.getElementById('attrConstitution').textContent = attrs.constitution;
        document.getElementById('attrIntelligence').textContent = attrs.intelligence;
        
        document.getElementById('pointsAvailable').textContent = available;
        document.getElementById('pointsUsed').textContent = used;
        
        // Atualiza estado dos botões
        this.updateButtonStates(available);
    },

    /**
     * Atualiza estado dos botões de controle
     * @param {number} available 
     */
    updateButtonStates(available) {
        const attrs = this.currentAttributes;
        
        // Botões de remover
        document.getElementById('btnRemoveStrength').disabled = attrs.strength <= 1;
        document.getElementById('btnRemoveDexterity').disabled = attrs.dexterity <= 1;
        document.getElementById('btnRemoveConstitution').disabled = attrs.constitution <= 1;
        document.getElementById('btnRemoveIntelligence').disabled = attrs.intelligence <= 1;
        
        // Botões de adicionar
        const addButtons = [
            'btnAddStrength', 'btnAddDexterity', 
            'btnAddConstitution', 'btnAddIntelligence'
        ];
        
        addButtons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.disabled = available <= 0;
            }
        });
    },

    /**
     * Configura controles dos atributos
     */
    setupAttributeControls() {
        // Adicionar pontos
        document.getElementById('btnAddStrength')?.addEventListener('click', () => {
            if (this.canAddPoints()) {
                this.currentAttributes.strength++;
                this.saveAndRender();
            }
        });
        
        document.getElementById('btnAddDexterity')?.addEventListener('click', () => {
            if (this.canAddPoints()) {
                this.currentAttributes.dexterity++;
                this.saveAndRender();
            }
        });
        
        document.getElementById('btnAddConstitution')?.addEventListener('click', () => {
            if (this.canAddPoints()) {
                this.currentAttributes.constitution++;
                this.saveAndRender();
            }
        });
        
        document.getElementById('btnAddIntelligence')?.addEventListener('click', () => {
            if (this.canAddPoints()) {
                this.currentAttributes.intelligence++;
                this.saveAndRender();
            }
        });
        
        // Remover pontos
        document.getElementById('btnRemoveStrength')?.addEventListener('click', () => {
            if (this.currentAttributes.strength > 1) {
                this.currentAttributes.strength--;
                this.saveAndRender();
            }
        });
        
        document.getElementById('btnRemoveDexterity')?.addEventListener('click', () => {
            if (this.currentAttributes.dexterity > 1) {
                this.currentAttributes.dexterity--;
                this.saveAndRender();
            }
        });
        
        document.getElementById('btnRemoveConstitution')?.addEventListener('click', () => {
            if (this.currentAttributes.constitution > 1) {
                this.currentAttributes.constitution--;
                this.saveAndRender();
            }
        });
        
        document.getElementById('btnRemoveIntelligence')?.addEventListener('click', () => {
            if (this.currentAttributes.intelligence > 1) {
                this.currentAttributes.intelligence--;
                this.saveAndRender();
            }
        });
    },

    /**
     * Verifica se pode adicionar pontos
     * @returns {boolean}
     */
    canAddPoints() {
        const attrs = this.currentAttributes;
        const used = attrs.strength + attrs.dexterity + attrs.constitution + attrs.intelligence;
        return used < this.TOTAL_ATTRIBUTE_POINTS;
    },

    /**
     * Salva atributos e atualiza renderização
     */
    saveAndRender() {
        ARKA_AUTH.updateSession({ attributes: this.currentAttributes });
        this.updateAttributeDisplay();
    },

    /**
     * Configura botão de logout
     */
    setupLogout() {
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            ARKA_AUTH.logout();
        });
    }
};

// Inicializa quando DOM estiver pronto
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        ARKA_DASHBOARD.init();
    });
}
