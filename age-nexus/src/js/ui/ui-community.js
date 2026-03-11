const CommunityUI = (() => {
  const STORAGE_KEY = 'age-nexus-comments';

  const loadComments = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  };

  const saveComments = (comments) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
  };

  const renderComments = () => {
    const list = document.getElementById('comment-list');
    if (!list) return;

    const user = window.Auth?.getCurrentUser();
    const comments = loadComments();

    if (!comments.length) {
      list.innerHTML = '<p class="muted">Sé el primero en comentar.</p>';
      return;
    }

    list.innerHTML = comments
      .slice()
      .reverse()
      .map((comment) => {
        const isOwner = user && comment.user === user;
        return `
          <div class="comment" data-id="${comment.id}">
            <div class="comment-header">
              <strong>${comment.user}</strong>
              <small>${new Date(comment.createdAt).toLocaleString()}</small>
            </div>
            <p>${comment.text}</p>
            ${isOwner ? `<div class="comment-actions">
              <button class="btn outline" data-action="edit">Editar</button>
              <button class="btn outline" data-action="delete">Eliminar</button>
            </div>` : ''}
          </div>
        `;
      })
      .join('');
  };

  const showAuthPrompt = () => {
    document.getElementById('comment-auth')?.classList.remove('hidden');
    document.getElementById('comment-panel')?.classList.add('hidden');
  };

  const showCommentPanel = () => {
    document.getElementById('comment-auth')?.classList.add('hidden');
    document.getElementById('comment-panel')?.classList.remove('hidden');
    renderComments();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const textEl = document.getElementById('comment-text');
    if (!textEl || !textEl.value.trim()) return;

    const user = window.Auth?.getCurrentUser();
    if (!user) {
      return showAuthPrompt();
    }

    const comments = loadComments();
    comments.push({
      id: Date.now().toString(),
      user,
      text: textEl.value.trim(),
      createdAt: new Date().toISOString(),
    });
    saveComments(comments);
    textEl.value = '';
    renderComments();
  };

  const handleMessageAction = (e) => {
    const button = e.target.closest('button[data-action]');
    if (!button) return;
    const message = button.closest('.comment');
    const id = message?.dataset.id;
    if (!id) return;

    const user = window.Auth?.getCurrentUser();
    if (!user) return;

    const comments = loadComments();
    const idx = comments.findIndex((c) => c.id === id);
    if (idx === -1) return;

    if (button.dataset.action === 'delete') {
      if (comments[idx].user !== user) return;
      comments.splice(idx, 1);
      saveComments(comments);
      renderComments();
      return;
    }

    if (button.dataset.action === 'edit') {
      if (comments[idx].user !== user) return;
      const nextText = window.prompt('Edita tu comentario:', comments[idx].text);
      if (!nextText || !nextText.trim()) return;
      comments[idx].text = nextText.trim();
      saveComments(comments);
      renderComments();
    }
  };

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
    document.getElementById('comment-form')?.addEventListener('submit', handleSubmit);
    document.getElementById('comment-list')?.addEventListener('click', handleMessageAction);
    renderQuickActions();

    const handleAuth = (user) => {
      if (user) showCommentPanel();
      else showAuthPrompt();
    };

    if (window.Auth?.onAuthChange) {
      window.Auth.onAuthChange(handleAuth);
    } else {
      showAuthPrompt();
    }
  }

  return { init, randomCiv };
})();
