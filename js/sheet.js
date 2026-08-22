// Ficha do Operador — sheet editável inspirada em fichas de RPG de mesa,
// reinterpretada em chave futurista/corporativa para o universo Arka.

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('sheetForm');
  if (!form) return; // esta página não tem a aba Ficha do Operador

  const user = GrapheneAuth.getUser();
  if (!user) return; // auth.js já redireciona

  const sheet = user.sheet || (typeof ARKA_SHEET_META !== 'undefined' ? ARKA_SHEET_META.defaultSheet() : {});
  const bio = user.biometric || {};
  const vitals = sheet.vitals || {};

  // --- Cabeçalho ---------------------------------------------------------
  setValue('sheetName', user.name || '');
  setText('sheetUsernameDisplay', '@' + (user.username || 'operador'));
  setText('sheetIdDisplay', user.id || '—');
  updateAvatar(user.name);

  // --- Identificação -------------------------------------------------------
  populateSelect('sheetClass', ARKA_SHEET_META.operatorClasses, sheet.operatorClass);
  populateSelect('sheetSector', ARKA_SHEET_META.sectors, sheet.sector);
  populateSelect('sheetCapsule', Object.keys(GRAPHENE_DATA.capsuleModels), user.capsuleModel);
  setValue('sheetLevel', user.accessLevel || 'Nível 1 (Recruta)');
  setValue('sheetBlood', validOr(bio.bloodType, ''));
  setValue('sheetGender', validOr(bio.gender, ''));
  setValue('sheetHeight', typeof bio.height === 'number' ? bio.height : '');
  setValue('sheetWeight', typeof bio.weight === 'number' ? bio.weight : '');
  setValue('sheetAge', typeof bio.age === 'number' ? bio.age : '');

  // --- Atributos, vitais, perícias, equipamento ---------------------------
  renderAttrGrid(sheet.attributes || {});
  setValue('vitalIntegrity', numOr(vitals.integrity, 20));
  setValue('vitalIntegrityMax', numOr(vitals.integrityMax, 20));
  setValue('vitalShielding', numOr(vitals.shielding, 10));
  setValue('vitalInitiative', numOr(vitals.initiative, 0));
  renderSkillsList(sheet.skills || []);
  renderEquipList(sheet.equipment || []);

  // --- Perfil psicológico / histórico -------------------------------------
  setValue('sheetTrait', sheet.trait || '');
  setValue('sheetMotivation', sheet.motivation || '');
  setValue('sheetBond', sheet.bond || '');
  setValue('sheetFlaw', sheet.flaw || '');
  setValue('sheetBackstory', sheet.backstory || '');

  // --- Credenciais ---------------------------------------------------------
  setValue('sheetUsernameField', user.username || '');
  setValue('sheetPassword', user.password || '');

  const addBtn = document.getElementById('equipAddBtn');
  if (addBtn) addBtn.addEventListener('click', () => addEquipRow({ name: '', note: '' }));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    saveSheet(user);
  });
});

// ---------------------------------------------------------------------------
// Atributos (força, destreza, resistência, intelecto, percepção, influência)
// ---------------------------------------------------------------------------

function abilityMod(score) {
  return Math.floor((Number(score) - 10) / 2);
}

function fmtMod(n) {
  return (n >= 0 ? '+' : '') + n;
}

function renderAttrGrid(attributes) {
  const grid = document.getElementById('attrGrid');
  if (!grid) return;

  grid.innerHTML = ARKA_SHEET_META.attributes.map((a) => {
    const score = numOr(attributes[a.key], 10);
    return `
      <div class="attr-box">
        <label for="attr-${a.key}">${a.label}</label>
        <input type="number" id="attr-${a.key}" class="attr-input" data-attr="${a.key}" min="1" max="20" value="${score}">
        <span class="attr-mod" data-attr-mod="${a.key}">${fmtMod(abilityMod(score))}</span>
      </div>`;
  }).join('');

  grid.querySelectorAll('.attr-input').forEach((input) => {
    input.addEventListener('input', () => {
      const key = input.dataset.attr;
      const mod = abilityMod(input.value || 10);
      const modEl = grid.querySelector(`[data-attr-mod="${key}"]`);
      if (modEl) modEl.textContent = fmtMod(mod);
      updateSkillBonuses();
    });
  });
}

// ---------------------------------------------------------------------------
// Perícias
// ---------------------------------------------------------------------------

function renderSkillsList(skills) {
  const list = document.getElementById('skillsList');
  if (!list) return;

  const trainedMap = {};
  (skills || []).forEach((s) => { trainedMap[s.key] = !!s.trained; });

  list.innerHTML = ARKA_SHEET_META.skills.map((s) => {
    const attrLabel = ARKA_SHEET_META.attributes.find((a) => a.key === s.attr).label;
    return `
      <label class="skill-row">
        <span class="skill-row-main">
          <input type="checkbox" class="skill-check" data-skill="${s.key}" data-skill-attr="${s.attr}" ${trainedMap[s.key] ? 'checked' : ''}>
          <span>${s.name} <small>(${attrLabel})</small></span>
        </span>
        <span class="skill-bonus" data-skill-bonus="${s.key}">+0</span>
      </label>`;
  }).join('');

  list.querySelectorAll('.skill-check').forEach((cb) => cb.addEventListener('change', updateSkillBonuses));
  updateSkillBonuses();
}

function updateSkillBonuses() {
  document.querySelectorAll('.skill-check').forEach((cb) => {
    const attrInput = document.getElementById(`attr-${cb.dataset.skillAttr}`);
    const score = attrInput ? Number(attrInput.value) : 10;
    const bonus = abilityMod(score) + (cb.checked ? ARKA_SHEET_META.proficiencyBonus : 0);
    const bonusEl = document.querySelector(`[data-skill-bonus="${cb.dataset.skill}"]`);
    if (bonusEl) bonusEl.textContent = fmtMod(bonus);
  });
}

// ---------------------------------------------------------------------------
// Equipamento (lista dinâmica)
// ---------------------------------------------------------------------------

function renderEquipList(equipment) {
  const list = document.getElementById('equipList');
  if (!list) return;
  list.innerHTML = '';
  (equipment && equipment.length ? equipment : [{ name: '', note: '' }]).forEach(addEquipRow);
}

function addEquipRow(item) {
  const list = document.getElementById('equipList');
  if (!list) return;
  const row = document.createElement('div');
  row.className = 'equip-row';
  row.innerHTML = `
    <input type="text" class="sheet-input equip-name" placeholder="Nome do item" value="${escapeAttr((item && item.name) || '')}">
    <input type="text" class="sheet-input equip-note" placeholder="Descrição breve" value="${escapeAttr((item && item.note) || '')}">
    <button type="button" class="equip-remove" aria-label="Remover item">&times;</button>`;
  row.querySelector('.equip-remove').addEventListener('click', () => row.remove());
  list.appendChild(row);
}

// ---------------------------------------------------------------------------
// Salvar: atualiza a sessão e baixa o arquivo .js para o administrador
// ---------------------------------------------------------------------------

function saveSheet(originalUser) {
  const attributes = {};
  ARKA_SHEET_META.attributes.forEach((a) => {
    attributes[a.key] = Number((document.getElementById(`attr-${a.key}`) || {}).value) || 10;
  });

  const skills = Array.from(document.querySelectorAll('.skill-check')).map((cb) => ({
    key: cb.dataset.skill,
    trained: cb.checked
  }));

  const equipment = Array.from(document.querySelectorAll('.equip-row'))
    .map((row) => ({
      name: row.querySelector('.equip-name').value.trim(),
      note: row.querySelector('.equip-note').value.trim()
    }))
    .filter((item) => item.name);

  const updatedUser = Object.assign({}, originalUser, {
    name: getValue('sheetName').trim() || originalUser.name,
    accessLevel: getValue('sheetLevel'),
    capsuleModel: getValue('sheetCapsule'),
    password: getValue('sheetPassword') || originalUser.password,
    biometric: {
      bloodType: getValue('sheetBlood') || '—',
      gender: getValue('sheetGender') || '—',
      height: getValue('sheetHeight') ? Number(getValue('sheetHeight')) : '—',
      weight: getValue('sheetWeight') ? Number(getValue('sheetWeight')) : '—',
      age: getValue('sheetAge') ? Number(getValue('sheetAge')) : '—'
    },
    sheet: {
      operatorClass: getValue('sheetClass'),
      sector: getValue('sheetSector'),
      background: (originalUser.sheet && originalUser.sheet.background) || '',
      attributes: attributes,
      vitals: {
        integrity: Number(getValue('vitalIntegrity')) || 0,
        integrityMax: Number(getValue('vitalIntegrityMax')) || 1,
        shielding: Number(getValue('vitalShielding')) || 0,
        initiative: Number(getValue('vitalInitiative')) || 0
      },
      skills: skills,
      equipment: equipment,
      trait: getValue('sheetTrait').trim(),
      motivation: getValue('sheetMotivation').trim(),
      bond: getValue('sheetBond').trim(),
      flaw: getValue('sheetFlaw').trim(),
      backstory: getValue('sheetBackstory').trim()
    }
  });

  GrapheneAuth.updateUser(updatedUser);

  // Reflete as mudanças imediatamente no restante do painel
  updateAvatar(updatedUser.name);
  const greetingName = document.getElementById('greetingName');
  if (greetingName) greetingName.textContent = (updatedUser.name || '').split(' ')[0] || updatedUser.name;
  if (typeof renderCapsuleStatus === 'function') renderCapsuleStatus(updatedUser);
  if (typeof renderSpecs === 'function') renderSpecs(updatedUser);

  downloadOperatorFile(updatedUser);

  const msg = document.getElementById('sheetSaveMsg');
  if (msg) {
    msg.textContent = `Ficha salva. Arquivo ${updatedUser.username || 'operador'}.js baixado.`;
    msg.classList.add('is-visible');
    clearTimeout(msg._hideTimer);
    msg._hideTimer = setTimeout(() => msg.classList.remove('is-visible'), 6000);
  }
}

function downloadOperatorFile(user) {
  const record = {
    id: user.id,
    username: user.username,
    password: user.password,
    name: user.name,
    accessLevel: user.accessLevel,
    capsuleModel: user.capsuleModel,
    capsuleState: user.capsuleState || 'Em Espera',
    biometric: user.biometric,
    sheet: user.sheet
  };

  const content = '// ================================================================\n'
    + '// GRAPHENE / PROJETO ARKA — Ficha de Operador\n'
    + `// Gerada em ${new Date().toLocaleString('pt-BR')} pelo próprio painel do operador.\n`
    + '//\n'
    + '// Para ativar o acesso permanente deste operador, copie o objeto\n'
    + '// abaixo para dentro do array ARKA_USERS em js/users.js\n'
    + '// ================================================================\n\n'
    + JSON.stringify(record, null, 2) + '\n';

  const blob = new Blob([content], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${user.username || 'operador'}.js`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ---------------------------------------------------------------------------
// Utilitários
// ---------------------------------------------------------------------------

function updateAvatar(name) {
  const el = document.getElementById('userAvatar');
  if (!el) return;
  const initials = (name || '').split(' ').map((n) => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  el.textContent = initials || '—';
}

function populateSelect(id, options, selected) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = options.map((o) => `<option value="${escapeAttr(o)}"${o === selected ? ' selected' : ''}>${o}</option>`).join('');
}

function setValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value : '';
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function numOr(v, fallback) {
  return typeof v === 'number' ? v : fallback;
}

function validOr(v, fallback) {
  return (v && v !== '—') ? v : fallback;
}

function escapeAttr(str) {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}
