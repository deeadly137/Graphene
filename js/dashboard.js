// Lógica do Dashboard — Minha Cápsula

document.addEventListener('DOMContentLoaded', () => {
  const user = GrapheneAuth.getUser();
  if (!user) return; // auth.js já redireciona

  setupTabs();
  setupLogout();
  renderGreeting(user);
  renderCapsuleStatus(user);
  renderSpecs(user);
  renderStatusMetrics(user);
  renderTelemetry(user);
});

function renderGreeting(user) {
  const firstName = (user.name || '').split(' ')[0];
  const nameEl = document.getElementById('greetingName');
  if (nameEl) nameEl.textContent = firstName || user.name || 'Operador';
}

function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  function activate(target) {
    tabBtns.forEach((b) => b.classList.toggle('active', b.getAttribute('data-tab') === target));
    tabContents.forEach((c) => c.classList.toggle('active', c.id === `tab-${target}`));
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => activate(btn.getAttribute('data-tab')));
  });

  const hashTarget = (window.location.hash || '').replace('#tab-', '');
  if (hashTarget && document.getElementById(`tab-${hashTarget}`)) activate(hashTarget);
}

function setupLogout() {
  const btn = document.getElementById('logoutBtn');
  if (btn) btn.addEventListener('click', () => GrapheneAuth.logout());
}

// gerador determinístico simples baseado no id do operador,
// para que os números "vividos" da cápsula fiquem estáveis durante a sessão
function seededValue(seedStr, min, max) {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash * 31 + seedStr.charCodeAt(i)) >>> 0;
  }
  const ratio = (hash % 1000) / 1000;
  return min + ratio * (max - min);
}

function renderCapsuleStatus(user) {
  const stateMeta = (GRAPHENE_DATA.capsuleStates[user.capsuleState]) || GRAPHENE_DATA.capsuleStates['Em Espera'];
  const toneVar = { phosphor: 'var(--phosphor)', brass: 'var(--brass-bright)', danger: 'var(--danger)' }[stateMeta.tone];

  const titleEl = document.getElementById('capsuleModelTitle');
  const descEl = document.getElementById('capsuleStateDesc');
  const badgeEl = document.getElementById('capsuleStateBadge');
  if (titleEl) titleEl.textContent = `Cápsula ${user.capsuleModel}`;
  if (descEl) descEl.textContent = stateMeta.detail;
  if (badgeEl) {
    badgeEl.textContent = stateMeta.label;
    badgeEl.style.color = toneVar;
  }

  const integrity = seededValue(user.id + 'i', 96.5, 99.9);
  const ringFg = document.getElementById('statusRingFg');
  const ringText = document.getElementById('statusRingText');
  const circumference = 2 * Math.PI * 52;
  if (ringFg) {
    ringFg.style.stroke = toneVar;
    ringFg.style.strokeDasharray = `${circumference}`;
    ringFg.style.strokeDashoffset = `${circumference * (1 - integrity / 100)}`;
  }
  if (ringText) ringText.textContent = `${integrity.toFixed(1)}%`;
}

function renderSpecs(user) {
  const specs = (typeof GRAPHENE_DATA !== 'undefined' && GRAPHENE_DATA.capsuleModels[user.capsuleModel]) || {
    isolationRating: '—', autonomyHours: '—', material: '—', pressure: '—'
  };
  const runtimeEl = document.getElementById('specRuntime');
  const isolationEl = document.getElementById('specIsolation');
  const pressureEl = document.getElementById('specPressure');
  const materialEl = document.getElementById('specMaterial');
  if (runtimeEl) runtimeEl.textContent = `${specs.autonomyHours} horas`;
  if (isolationEl) isolationEl.textContent = specs.isolationRating;
  if (pressureEl) pressureEl.textContent = specs.pressure;
  if (materialEl) materialEl.textContent = specs.material;
}

// Resumo rápido de biometria do ocupante e condições internas do casulo,
// exibido junto às informações do equipamento na aba "Status da Cápsula".
function renderStatusMetrics(user) {
  const heart = seededValue(user.id + 'h', 52, 64);
  const o2 = seededValue(user.id + 'o', 20.5, 21.4);
  const temp = seededValue(user.id + 't', 19.5, 22.5);
  const rad = seededValue(user.id + 'r', 0.08, 0.31);

  setText('statusHeartValue', `${heart.toFixed(0)} bpm`);
  setText('statusO2Value', `${o2.toFixed(1)}%`);
  setText('statusTempValue', `${temp.toFixed(1)}°C`);
  setText('statusRadValue', `${rad.toFixed(2)} mSv/h`);
}

function renderTelemetry(user) {
  const energy = seededValue(user.id + 'e', 78, 98);
  const o2 = seededValue(user.id + 'o', 20.5, 21.4);
  const co2 = seededValue(user.id + 'c', 0.02, 0.05);
  const temp = seededValue(user.id + 't', 19.5, 22.5);
  const rad = seededValue(user.id + 'r', 0.08, 0.31);

  setMeter('energyMeter', 'energyValue', energy, '%');
  const o2El = document.getElementById('o2Value');
  const co2El = document.getElementById('co2Value');
  const tempEl = document.getElementById('tempValue');
  const radEl = document.getElementById('radValue');
  if (o2El) o2El.textContent = `${o2.toFixed(1)}%`;
  if (co2El) co2El.textContent = `${co2.toFixed(2)}%`;
  if (tempEl) tempEl.textContent = `${temp.toFixed(1)}°C`;
  if (radEl) radEl.textContent = `${rad.toFixed(2)} mSv/h`;
}

function setMeter(barId, valueId, value, unit) {
  const bar = document.getElementById(barId);
  const val = document.getElementById(valueId);
  if (bar) bar.style.width = `${value}%`;
  if (val) val.textContent = `${value.toFixed(0)}${unit}`;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = (value === undefined || value === null || value === '') ? '—' : value;
}
