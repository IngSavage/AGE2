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
    const profile = await window.Auth.getProfile();
    const comments = await loadComments();
    const isAdmin = profile?.role?.toLowerCase() === 'admin';

    if (!comments.length) {
      list.innerHTML = '<p class="muted">Sé el primero en comentar.</p>';
      return;
    }

    list.innerHTML = comments
      .map((comment) => {
        const isOwner = user && comment.user_id === user.id;
        const canDelete = isOwner || isAdmin;
        const createdAt = new Date(comment.created_at || comment.createdAt);
        const displayName = comment.username || 'Anónimo';
        const avatar = comment.avatar_url ? `<img class="comment-avatar" src="${comment.avatar_url}" alt="Avatar">` : '';

        return `
          <div class="comment" data-id="${comment.id}">
            <div class="comment-header">
              ${avatar}
              <div class="comment-meta">
                <strong>${displayName}${isAdmin ? ' <small class="muted">(moderador)</small>' : ''}</strong>
                <small>${createdAt.toLocaleString()}</small>
              </div>
            </div>
            <p>${comment.text}</p>
            ${canDelete ? `<div class="comment-actions">
              ${isOwner ? `<button class="btn outline" data-action="edit">Editar</button>` : ''}
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
    const errorEl = document.getElementById('comment-error');
    const value = textEl?.value.trim();
    errorEl.textContent = '';

    if (!textEl || !value) {
      errorEl.textContent = 'Escribe un comentario antes de enviar.';
      return;
    }

    const user = await window.Auth.getUser();
    if (!user) {
      return showAuthPrompt();
    }

    const profile = await window.Auth.getProfile();
    const displayName = profile?.full_name || user.email || 'Anónimo';
    const avatarUrl = profile?.avatar_url || '';

    const comment = {
      user_id: user.id,
      username: displayName,
      text: value,
      created_at: new Date().toISOString(),
    };

    if (!useSupabase) {
      // localStorage fallback needs an ID
      comment.id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    if (avatarUrl) {
      comment.avatar_url = avatarUrl;
    }

    try {
      await saveComment(comment);
      textEl.value = '';
      renderComments();
    } catch (err) {
      console.warn('Error al guardar comentario:', err.message);
      errorEl.textContent = window.Auth.formatError(err);
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

    const profile = await window.Auth.getProfile();
    const isAdmin = profile?.role?.toLowerCase() === 'admin';

    const comments = await loadComments();
    const record = comments.find((c) => c.id === id);
    if (!record) return;

    if (button.dataset.action === 'delete') {
      if (record.user_id !== user.id && !isAdmin) return;
      await deleteComment(id);
      renderComments();
      return;
    }

    if (button.dataset.action === 'edit') {
      if (record.user_id !== user.id) return;
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
      // Asegura que el estado inicial se aplique aunque no haya cambio inmediato
      (async () => {
        const user = await window.Auth.getUser();
        handleAuth(user);
      })();
    } else {
      showAuthPrompt();
    }
  }

  return { init, randomCiv };
})();
