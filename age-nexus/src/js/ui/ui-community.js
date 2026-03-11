const CommunityUI = (() => {
  async function renderMessages() {
    const list = document.getElementById('message-list');
    if (!list) return;

    try {
      const messages = await ApiClient.request('/api/messages');
      list.innerHTML = messages.map(msg => `
        <div class="message" data-id="${msg.id}">
          <strong>${msg.author?.username || 'Anónimo'}</strong>
          <p>${msg.text}</p>
        </div>
      `).join('');
    } catch (err) {
      list.innerHTML = `<p>${err.message}</p>`;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const text = document.getElementById('message-text');
    if (!text.value.trim()) return;
    await ApiClient.request('/api/messages', {
      method: 'POST',
      body: JSON.stringify({ text: text.value })
    });
    text.value = '';
    renderMessages();
  }

  // Message edit/delete actions removed (anonymous access with no DB/auth).

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
    renderMessages();
    const form = document.getElementById('message-form');
    form && form.addEventListener('submit', handleSubmit);
    document.getElementById('random-civ')?.addEventListener('click', randomCiv);
    renderQuickActions();
  }

  return { init, renderMessages, randomCiv };
})();
