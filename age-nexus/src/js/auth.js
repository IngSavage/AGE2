const AuthUI = (() => {
  let currentUser = null;

  function getCurrentUser() {
    return currentUser;
  }

  function updateAuthStatus() {
    const label = document.getElementById('auth-user-label');
    if (label) label.textContent = currentUser ? `Hola, ${currentUser.username}` : '';
  }

  function showApp() {
    document.getElementById('auth-screen')?.classList.add('hidden');
    document.getElementById('app-shell')?.classList.remove('hidden');
    updateAuthStatus();
  }

  function showAuth(error = '') {
    document.getElementById('auth-screen')?.classList.remove('hidden');
    document.getElementById('app-shell')?.classList.add('hidden');
    document.getElementById('auth-error').textContent = error;
  }

  async function validateSession() {
    const token = ApiClient.getToken();
    if (!token) {
      showAuth();
      return false;
    }

    try {
      const response = await ApiClient.request('/api/auth/me');
      currentUser = response.user;
      showApp();
      return true;
    } catch {
      ApiClient.setToken('');
      showAuth('Tu sesión expiró. Vuelve a iniciar sesión.');
      return false;
    }
  }

  async function onLoginSubmit(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    try {
      const response = await ApiClient.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      ApiClient.setToken(response.token);
      currentUser = response.user;
      showApp();
      window.dispatchEvent(new CustomEvent('auth:ready'));
    } catch (err) {
      showAuth(err.message);
    }
  }

  async function onSignupSubmit(e) {
    e.preventDefault();
    const username = document.getElementById('signup-username').value.trim();
    const password = document.getElementById('signup-password').value;

    try {
      const response = await ApiClient.request('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      ApiClient.setToken(response.token);
      currentUser = response.user;
      showApp();
      window.dispatchEvent(new CustomEvent('auth:ready'));
    } catch (err) {
      showAuth(err.message);
    }
  }

  function bindTabs() {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        forms.forEach(f => f.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.target)?.classList.add('active');
        document.getElementById('auth-error').textContent = '';
      });
    });
  }

  async function logout() {
    try {
      await ApiClient.request('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignora errores de logout remoto
    }
    currentUser = null;
    ApiClient.setToken('');
    showAuth();
  }

  function init() {
    bindTabs();
    document.getElementById('login-form')?.addEventListener('submit', onLoginSubmit);
    document.getElementById('signup-form')?.addEventListener('submit', onSignupSubmit);
    document.getElementById('logout-btn')?.addEventListener('click', logout);
    return validateSession();
  }

  return { init, getCurrentUser };
})();
