const CommunityUI = (() => {
  const messages = [
    { author: 'Valkyrie', text: 'Arabia es puro tempo, scout rush o arqueros rápidos.' },
    { author: 'RelicHunter', text: 'En Arena controla reliquias minuto 12, monjes + águilas.' },
    { author: 'DockMaster', text: 'En Nómada abre con pesca, luego establo rápido.' }
  ];

  function renderMessages() {
    const list = document.getElementById('message-list');
    if (!list) return;
    list.innerHTML = messages.map(msg => `<div class="message"><strong>${msg.author}</strong><p>${msg.text}</p></div>`).join('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    const author = document.getElementById('message-author');
    const text = document.getElementById('message-text');
    if (!author.value || !text.value) return;
    messages.unshift({ author: author.value, text: text.value });
    renderMessages();
    e.target.reset();
  }

  function randomCiv() {
    const result = document.getElementById('random-civ-result');
    if (!result) return;
    const civ = CIVILIZATIONS[Math.floor(Math.random() * CIVILIZATIONS.length)];
    result.innerHTML = `<strong>${civ.name}</strong><p>${civ.recommended}</p><div class="quick-actions">${civ.builds.map(b => `<span class="tag">${b}</span>`).join('')}</div>`;
  }

  function renderQuickActions() {
    const container = document.getElementById('quick-actions');
    if (!container) return;
    const styles = ['rush','eco','hibrida'];
    container.innerHTML = styles.map(style => `<button data-style="${style}">${style.toUpperCase()}</button>`).join('');
    container.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const civ = CIVILIZATIONS.find(c => c.style === btn.dataset.style) || CIVILIZATIONS[0];
        document.getElementById('random-civ-result').innerHTML = `<strong>${civ.name}</strong><p>${civ.recommended}</p>`;
      });
    });
  }

  function init() {
    renderMessages();
    const form = document.getElementById('message-form');
    form && form.addEventListener('submit', handleSubmit);
    document.getElementById('random-civ')?.addEventListener('click', randomCiv);
    renderQuickActions();
  }

  return { init, renderMessages, randomCiv };
})();
