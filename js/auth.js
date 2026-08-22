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
      sheet: (typeof ARKA_SHEET_META !== 'undefined') ? ARKA_SHEET_META.defaultSheet() : null,
      authenticatedAt: new Date().toISOString(),
      guest: true
    };
    sessionStorage.setItem('graphene_session', JSON.stringify(sessionData));
    window.location.href = 'dashboard.html';
  },

  // Cria uma sessão local para um operador recém-registrado. Como o site
  // não tem backend, isto NÃO cadastra o operador em ARKA_USERS — apenas
  // permite que ele preencha a Ficha e gere o arquivo para envio ao
  // administrador (ver updateUser / dashboard "Salvar Ficha").
  registerOperator: function (data) {
    const sessionData = {
      id: 'ARK-' + Math.floor(1000 + Math.random() * 9000) + '-OP',
      username: String(data.username).trim(),
      password: data.password,
      name: data.name,
      accessLevel: 'Nível 1 (Recruta)',
      capsuleModel: data.capsuleModel || 'Arcturus MK-III',
      capsuleState: 'Em Espera',
      biometric: { bloodType: '—', height: '—', weight: '—', age: '—', gender: '—' },
      sheet: (typeof ARKA_SHEET_META !== 'undefined') ? ARKA_SHEET_META.defaultSheet() : null,
      authenticatedAt: new Date().toISOString(),
      guest: false,
      registered: true
    };
    localStorage.setItem('graphene_session', JSON.stringify(sessionData));
    window.location.href = 'dashboard.html#tab-user';
    return sessionData;
  },

  // Substitui a sessão ativa por uma versão atualizada (usado ao salvar a
  // Ficha do Operador), preservando o mesmo tipo de armazenamento (sessão
  // de convidado permanece em sessionStorage; demais em localStorage).
  updateUser: function (updatedUser) {
    const usesSession = !!sessionStorage.getItem('graphene_session');
    const storage = usesSession ? sessionStorage : localStorage;
    storage.setItem('graphene_session', JSON.stringify(updatedUser));
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

  // Alternância entre "Entrar" e "Registrar Operador" em login.html
  const modeBtns = document.querySelectorAll('.auth-mode-btn');
  if (modeBtns.length) {
    modeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        modeBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.auth-mode-panel').forEach((p) => {
          p.classList.toggle('active', p.dataset.modePanel === mode);
        });
      });
    });
  }

  const registerForm = document.getElementById('registerForm');
  const registerError = document.getElementById('registerError');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regNameInput').value.trim();
      const username = document.getElementById('regUsernameInput').value.trim();
      const password = document.getElementById('regPasswordInput').value;
      const confirm = document.getElementById('regConfirmInput').value;
      const capsuleModel = document.getElementById('regCapsuleInput').value;

      let error = '';
      if (!name || !username || !password) error = 'Preencha todos os campos obrigatórios.';
      else if (!/^[a-zA-Z0-9_]{3,24}$/.test(username)) error = 'O ID de operador deve ter de 3 a 24 caracteres (letras, números ou "_").';
      else if (password.length < 6) error = 'A chave de acesso precisa ter ao menos 6 caracteres.';
      else if (password !== confirm) error = 'As chaves de acesso não coincidem.';

      if (error) {
        if (registerError) {
          registerError.querySelector('span').textContent = error;
          registerError.classList.add('is-visible');
        }
        return;
      }
      if (registerError) registerError.classList.remove('is-visible');

      GrapheneAuth.registerOperator({ name, username, password, capsuleModel });
    });
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => GrapheneAuth.logout());
  }
});
