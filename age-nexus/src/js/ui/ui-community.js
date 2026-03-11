const CommunityUI = (() => {
  const supabase = window.Auth?.supabase;
  const useSupabase = !!supabase;

  const loadComments = async () => {
    if (useSupabase) {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.warn('No se pudieron cargar comentarios:', error.message);
        return [];
      }
      return data || [];
    }

    try {
      return JSON.parse(localStorage.getItem('age-nexus-comments') || '[]');
    } catch {
      return [];
    }
  };

  const saveComment = async (comment) => {
    if (useSupabase) {
      const { error } = await supabase.from('comments').insert([comment]);
      if (error) throw error;
      return;
    }

    const all = await loadComments();
    all.push(comment);
    localStorage.setItem('age-nexus-comments', JSON.stringify(all));
  };

  const updateComment = async (id, updates) => {
    if (useSupabase) {
      const { error } = await supabase.from('comments').update(updates).eq('id', id);
      if (error) throw error;
      return;
    }
    const all = await loadComments();
    const idx = all.findIndex((c) => c.id === id);
    if (idx === -1) return;
    all[idx] = { ...all[idx], ...updates };
    localStorage.setItem('age-nexus-comments', JSON.stringify(all));
  };

  const deleteComment = async (id) => {
    if (useSupabase) {
      const { error } = await supabase.from('comments').delete().eq('id', id);
      if (error) throw error;
      return;
    }
    const all = await loadComments();
    localStorage.setItem('age-nexus-comments', JSON.stringify(all.filter((c) => c.id !== id)));
  };

  const renderComments = async () => {
    const list = document.getElementById('comment-list');
    if (!list) return;

    const user = await window.Auth.getUser();
    const comments = await loadComments();

    if (!comments.length) {
      list.innerHTML = '<p class="muted">Sé el primero en comentar.</p>';
      return;
    }

    list.innerHTML = comments
      .map((comment) => {
        const isOwner = user && comment.user_id === user.id;
        return `
          <div class="comment" data-id="${comment.id}">
            <div class="comment-header">
              <strong>${comment.username}</strong>
              <small>${new Date(comment.created_at || comment.createdAt).toLocaleString()}</small>
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const textEl = document.getElementById('comment-text');
    const value = textEl?.value.trim();
    if (!textEl || !value) {
      alert('Escribe un comentario antes de enviar.');
      return;
    }

    const user = await window.Auth.getUser();
    if (!user) {
      return showAuthPrompt();
    }

    const comment = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      user_id: user.id,
      username: user.email,
      text: textEl.value.trim(),
      created_at: new Date().toISOString(),
    };

    try {
      await saveComment(comment);
      textEl.value = '';
      renderComments();
    } catch (err) {
      console.warn('Error al guardar comentario:', err.message);
    }
  };

  const handleMessageAction = async (e) => {
    const button = e.target.closest('button[data-action]');
    if (!button) return;

    const message = button.closest('.comment');
    const id = message?.dataset.id;
    if (!id) return;

    const user = await window.Auth.getUser();
    if (!user) return;

    const comments = await loadComments();
    const record = comments.find((c) => c.id === id);
    if (!record) return;
    if (record.user_id !== user.id) return;

    if (button.dataset.action === 'delete') {
      await deleteComment(id);
      renderComments();
      return;
    }

    if (button.dataset.action === 'edit') {
      const nextText = window.prompt('Edita tu comentario:', record.text);
      if (!nextText || !nextText.trim()) return;
      await updateComment(id, { text: nextText.trim() });
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
