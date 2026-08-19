// Gerenciador de Sessão e Autenticação — Projeto Arka

const GrapheneAuth = {
  getUser: function () {
    const user = sessionStorage.getItem('graphene_session') || localStorage.getItem('graphene_session');
    return user ? JSON.parse(user) : null;
  },

  loginWithCredentials: function (username, password) {
    const match = (typeof ARKA_USERS !== 'undefined' ? ARKA_USERS : []).find(
      (u) => u.username.toLowerCase() === String(username).trim().toLowerCase() && u.password === password
    );
    if (!match) return false;

    const sessionData = {
      name: match.name,
      id: match.id,
      username: match.username,
      accessLevel: match.accessLevel,
      capsuleModel: match.capsuleModel,
      capsuleState: match.capsuleState,
      biometric: match.biometric,
      authenticatedAt: new Date().toISOString(),
      guest: false
    };
    localStorage.setItem('graphene_session', JSON.stringify(sessionData));
    window.location.href = 'dashboard.html';
    return true;
  },

  loginAsGuest: function () {
    const capsules = ['Arcturus MK-III', 'Arcturus MK-IV'];
    const sessionData = {
      name: 'Operador Convidado',
      id: 'ARK-' + Math.floor(1000 + Math.random() * 9000) + '-G',
      username: 'guest',
      accessLevel: 'Nível 1 (Visitante)',
      capsuleModel: capsules[Math.floor(Math.random() * capsules.length)],
      capsuleState: 'Em Espera',
      biometric: { bloodType: '—', height: '—', weight: '—', age: '—', gender: '—' },
      authenticatedAt: new Date().toISOString(),
      guest: true
    };
    sessionStorage.setItem('graphene_session', JSON.stringify(sessionData));
    window.location.href = 'dashboard.html';
  },

  logout: function () {
    localStorage.removeItem('graphene_session');
    sessionStorage.removeItem('graphene_session');
    window.location.href = 'login.html';
  },

  checkAuth: function () {
    const user = this.getUser();
    const isDashboard = window.location.pathname.endsWith('dashboard.html');
    if (isDashboard && !user) {
      window.location.href = 'login.html';
    }
  },

  // Atualiza a navegação para refletir sessão ativa (Entrar -> Minha Cápsula)
  reflectNavState: function () {
    const navItem = document.getElementById('authNavItem');
    if (!navItem) return;
    const user = this.getUser();
    if (user) {
      navItem.innerHTML = `
        <a href="dashboard.html" class="btn-access">
          <svg class="nav-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          <span>Minha Cápsula</span>
        </a>`;
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  GrapheneAuth.checkAuth();
  GrapheneAuth.reflectNavState();

  const loginForm = document.getElementById('loginForm');
  const errorBox = document.getElementById('authError');
  const panel = document.getElementById('authPanel');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('usernameInput').value;
      const password = document.getElementById('passwordInput').value;
      const ok = GrapheneAuth.loginWithCredentials(username, password);
      if (!ok) {
        if (errorBox) errorBox.classList.add('is-visible');
        if (panel) {
          panel.classList.remove('is-shaking');
          void panel.offsetWidth; // reinicia a animação
          panel.classList.add('is-shaking');
        }
      }
    });
  }

  const guestBtn = document.getElementById('guestLoginBtn');
  if (guestBtn) {
    guestBtn.addEventListener('click', () => GrapheneAuth.loginAsGuest());
  }

  document.querySelectorAll('.demo-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const u = document.getElementById('usernameInput');
      const p = document.getElementById('passwordInput');
      if (u && p) {
        u.value = chip.dataset.username;
        p.value = chip.dataset.password;
        u.focus();
      }
    });
  });

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => GrapheneAuth.logout());
  }
});
