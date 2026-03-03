import { registerUser, loginUser, saveToken, getToken, logout, updateAuthUI } from './auth.js';

(async function() {
  const SECTION_FILES = [
    'section-home.html',
    'section-lore.html',
    'section-civilizations.html',
    'section-buildorders.html',
    'section-units-techs.html',
    'section-maps-modes.html',
    'section-stats.html',
    'section-community.html',
    'section-about.html',
    'section-login.html',
    'section-register.html'
  ];

  async function loadSections() {
    const container = document.getElementById('content');
    for (const file of SECTION_FILES) {
      const res = await fetch(`src/html/${file}`);
      const html = await res.text();
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      container.appendChild(wrapper.firstElementChild);
    }
  }

  function toggleMenu() {
    const nav = document.getElementById('main-nav');
    nav.classList.toggle('open');
  }

  function bindNavigation() {
    document.getElementById('menu-toggle').addEventListener('click', toggleMenu);
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
        document.getElementById('main-nav').classList.remove('open');
      });
    });
    document.addEventListener('scroll', highlightActiveLink);
  }

  function highlightActiveLink() {
    const fromTop = window.scrollY + 90;
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => link.classList.remove('active'));
    document.querySelectorAll('section').forEach(section => {
      if (section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
        const link = document.querySelector(`.nav-link[data-section="${section.id}"]`);
        link?.classList.add('active');
      }
    });
  }

  function initAccordion() {
    document.querySelectorAll('.accordion-item header').forEach(header => {
      header.addEventListener('click', () => header.parentElement.classList.toggle('active'));
    });
  }

  function renderUnits(filter = 'all') {
    const grid = document.getElementById('unit-grid');
    if (!grid) return;
    const filtered = UNITS.filter(u => filter === 'all' || u.class === filter);
    grid.innerHTML = filtered.map(u => `
      <article class="card">
        <div class="card-body">
          <h3>${u.name}</h3>
          <p>${u.strength}</p>
          <p class="highlight">${u.class.toUpperCase()} · ${u.civ}</p>
          <small>Counter: ${u.counter} | Tech: ${u.tech} | Coste: ${u.cost}</small>
        </div>
      </article>
    `).join('');
    renderCompare(filtered.slice(0, 3));
  }

  function renderCompare(units) {
    const container = document.getElementById('unit-compare');
    if (!container) return;
    container.innerHTML = units.map(u => `
      <div class="card">
        <div class="card-body">
          <h4>${u.name}</h4>
          <p>${u.strength}</p>
          <p class="highlight">Counter: ${u.counter}</p>
        </div>
      </div>
    `).join('');
  }

  function bindUnitFilters() {
    const select = document.getElementById('filter-class');
    select?.addEventListener('change', () => renderUnits(select.value));
  }

  function bindHeroButtons() {
    document.querySelectorAll('[data-scroll]').forEach(btn => {
      btn.addEventListener('click', () =>
        document.getElementById(btn.dataset.scroll)?.scrollIntoView({ behavior: 'smooth' })
      );
    });
  }

  // =========================
  // GLOBAL SEARCH (FIXED)
  // =========================
  function scoreMatch(q, text) {
    const t = String(text || '').toLowerCase();
    if (!q || !t) return 0;
    if (t === q) return 100;         // exact match
    if (t.startsWith(q)) return 70;  // starts with
    if (t.includes(q)) return 40;    // contains
    return 0;
  }

  function globalSearch() {
    const input = document.getElementById('global-search');
    const query = input?.value.trim().toLowerCase();
    if (!query) return;

    const candidates = [];

    // Civs
    (CIVILIZATIONS || []).forEach(c => {
      const s = scoreMatch(query, c.name);
      if (s) candidates.push({ s, sectionId: 'civs', selector: `[data-id="${c.id}"]` });
    });

    // Builds
    (BUILD_ORDERS || []).forEach(b => {
      const s = scoreMatch(query, b.name);
      if (s) candidates.push({ s, sectionId: 'builds', selector: `[data-name="${b.name}"]` });
    });

    // Maps (AJUSTA sectionId si tu section tiene otro id)
   (MAPS || []).forEach(m => {
      const s = scoreMatch(query, m.name);
      if (s) candidates.push({ s, sectionId: 'mapas', selector: `[data-id="${m.id}"]` });
    });


    if (!candidates.length) return;

    candidates.sort((a, b) => b.s - a.s);
    const best = candidates[0];
    scrollToAndHighlight(best.sectionId, best.selector);
  }

  function scrollToAndHighlight(sectionId, selector) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  // 1) Acércate a la sección
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const OFFSET = 90;        // compensa tu topbar sticky (ajusta si quieres)
  const MAX_TRIES = 25;      // reintentos
  const TRY_EVERY_MS = 120;  // cada cuánto reintenta

  let tries = 0;

  const tick = () => {
    const el = document.querySelector(selector);

    if (el) {
      // 2) Scroll EXACTO al elemento con offset
      const y = el.getBoundingClientRect().top + window.scrollY - OFFSET;
      window.scrollTo({ top: y, behavior: 'smooth' });

      // 3) Highlight
      el.classList.add('highlighted');
      setTimeout(() => el.classList.remove('highlighted'), 2000);
      return;
    }

    tries++;
    if (tries < MAX_TRIES) setTimeout(tick, TRY_EVERY_MS);
  };

  // espera un poco para que termine el scroll inicial / render
  setTimeout(tick, 250);
}


  function bindSearch() {
    document.getElementById('search-btn')?.addEventListener('click', globalSearch);
    document.getElementById('global-search')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); globalSearch(); }
    });
  }

  async function init() {
    await loadSections();
    if (window.initLore) {
      window.initLore();
    }
    bindNavigation();
    initAccordion();
    CivUI.init();
    BuildUI.init();
    renderUnits();
    bindUnitFilters();
    MapUI.init();
    StatsUI.init();
    CommunityUI.init();
    bindHeroButtons();
    bindSearch();
    highlightActiveLink();

    // authentication UI setup
    updateAuthUI();
    document.getElementById('login-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      const result = await loginUser(email, password);
      if (result.token) {
        saveToken(result.token);
        updateAuthUI();
        alert('Autenticado con éxito');
      } else {
        alert(result.message || 'Error al iniciar sesión');
      }
    });

    document.getElementById('register-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value;
      const email = document.getElementById('reg-email').value;
      const password = document.getElementById('reg-password').value;
      const result = await registerUser(name, email, password);
      if (result.success) {
        alert('Usuario creado, ahora inicie sesión');
        window.location.hash = '#login';
      } else {
        alert(result.message || 'Error al registrarse');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
