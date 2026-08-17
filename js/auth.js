// Gerenciador de Sessão e Autenticação

const GrapheneAuth = {
  getUser: function() {
    const user = localStorage.getItem('graphene_session');
    return user ? JSON.parse(user) : null;
  },
  
  login: function(username) {
    const sessionData = {
      name: username || 'Operador Arka',
      id: 'ARK-' + Math.floor(1000 + Math.random() * 9000) + '-X',
      capsuleModel: 'Arcturus MK-IV',
      authenticatedAt: new Date().toISOString()
    };
    localStorage.setItem('graphene_session', JSON.stringify(sessionData));
    window.location.href = 'dashboard.html';
  },

  logout: function() {
    localStorage.removeItem('graphene_session');
    window.location.href = 'login.html';
  },

  checkAuth: function() {
    const user = this.getUser();
    const isDashboard = window.location.pathname.includes('dashboard.html');
    
    if (isDashboard && !user) {
      window.location.href = 'login.html';
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  GrapheneAuth.checkAuth();

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('usernameInput').value;
      GrapheneAuth.login(username);
    });
  }
});