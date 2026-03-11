const CommunityUI = (() => {
  function randomCiv() {
    const result = document.getElementById('random-civ-result');
    if (!result) return;
    const civ = CIVILIZATIONS[Math.floor(Math.random() * CIVILIZATIONS.length)];
    result.innerHTML = `<strong>${civ.name}</strong><p>${civ.recommended}</p><div class="quick-actions">${civ.builds.map(b => `<span class="tag">${b}</span>`).join('')}</div>`;
  }

  function renderQuickActions() {
    const container = document.getElementById('quick-actions');
    if (!container) return;
    const styles = ['rush', 'eco', 'hibrida'];
    container.innerHTML = styles.map(style => `<button data-style="${style}">${style.toUpperCase()}</button>`).join('');
    container.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const civ = CIVILIZATIONS.find(c => c.style === btn.dataset.style) || CIVILIZATIONS[0];
        document.getElementById('random-civ-result').innerHTML = `<strong>${civ.name}</strong><p>${civ.recommended}</p>`;
      });
    });
  }

  function init() {
    document.getElementById('random-civ')?.addEventListener('click', randomCiv);
    renderQuickActions();
  }

  return { init, randomCiv };
})();
