// Comportamento global — Graphene / Projeto Arka

document.addEventListener('DOMContentLoaded', () => {
  setupNavToggle();
  markActiveNav();
  setupReveal();
  setupTabsGeneric(); // no-op fora do dashboard
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = (typeof GRAPHENE_DATA !== 'undefined' ? GRAPHENE_DATA.year : new Date().getFullYear());
});

function setupNavToggle() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function markActiveNav() {
  const page = document.body.dataset.page;
  if (!page) return;
  document.querySelectorAll('[data-nav]').forEach((link) => {
    if (link.dataset.nav === page) {
      link.classList.add('active');
    }
  });
}



function setupReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || targets.length === 0) {
    targets.forEach((t) => t.classList.add('in-view'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach((t) => observer.observe(t));
}

// mantém compatibilidade caso outra página injete tabs sem dashboard.js
function setupTabsGeneric() {}
