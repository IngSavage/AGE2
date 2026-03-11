const CommunityUI = (() => {
  async function renderMessages() {
    const list = document.getElementById('message-list');
    if (!list) return;

    try {
      const messages = await ApiClient.request('/api/messages');
      list.innerHTML = messages.map(msg => `
        <div class="message" data-id="${msg.id}">
          <strong>${msg.author.username}</strong>
          <p>${msg.text}</p>
          ${msg.isOwner ? `<div class="message-actions">
            <button class="btn outline" data-action="edit">Editar</button>
            <button class="btn outline" data-action="delete">Eliminar</button>
          </div>` : ''}
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

  async function handleMessageAction(e) {
    const button = e.target.closest('button[data-action]');
    if (!button) return;

    const message = button.closest('.message');
    const id = message?.dataset.id;
    if (!id) return;

    if (button.dataset.action === 'delete') {
      await ApiClient.request(`/api/messages/${id}`, { method: 'DELETE' });
      renderMessages();
      return;
    }

    if (button.dataset.action === 'edit') {
      const currentText = message.querySelector('p')?.textContent || '';
      const nextText = window.prompt('Edita tu comentario:', currentText);
      if (!nextText || !nextText.trim()) return;
      await ApiClient.request(`/api/messages/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ text: nextText })
      });
      renderMessages();
    }
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
    document.getElementById('message-list')?.addEventListener('click', handleMessageAction);
    document.getElementById('random-civ')?.addEventListener('click', randomCiv);
    renderQuickActions();
  }

  return { init, renderMessages, randomCiv };
})();
