// Lógica do Dashboard - Cápsula Pessoal e Abas sem interferência externa

document.addEventListener('DOMContentLoaded', () => {
  setupCustomTabs();
  loadUserData();
  setupLogout();
});

function setupCustomTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const activeContent = document.getElementById(`tab-${targetTab}`);
      if (activeContent) {
        activeContent.classList.add('active');
      }
    });
  });
}

function loadUserData() {
  const user = GrapheneAuth.getUser();
  if (user) {
    const nameEl = document.getElementById('userName');
    const idEl = document.getElementById('userId');
    const modelEl = document.getElementById('capsuleModelTitle');

    if (nameEl) nameEl.textContent = user.name;
    if (idEl) idEl.textContent = user.id;
    if (modelEl) modelEl.textContent = `Cápsula ${user.capsuleModel}`;
  }
}

function setupLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      GrapheneAuth.logout();
    });
  }
}