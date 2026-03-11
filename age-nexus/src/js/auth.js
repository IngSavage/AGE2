// Simple client-side auth using localStorage (NOT secure, for demo purposes)
(function() {
  const USERS_KEY = 'age-nexus-users';
  const SESSION_KEY = 'age-nexus-current-user';

  const getUsers = () => {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    } catch {
      return {};
    }
  };

  const setUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const getCurrentUser = () => {
    return localStorage.getItem(SESSION_KEY);
  };

  const setCurrentUser = (username) => {
    if (!username) {
      localStorage.removeItem(SESSION_KEY);
    } else {
      localStorage.setItem(SESSION_KEY, username);
    }
    notifyAuthChange();
  };

  const register = (username, password) => {
    const normalized = (username || '').trim().toLowerCase();
    if (!normalized || !password) {
      throw new Error('Usuario y contraseña requeridos');
    }
    const users = getUsers();
    if (users[normalized]) {
      throw new Error('El usuario ya existe');
    }
    users[normalized] = { password };
    setUsers(users);
    setCurrentUser(normalized);
    return normalized;
  };

  const login = (username, password) => {
    const normalized = (username || '').trim().toLowerCase();
    const users = getUsers();
    const user = users[normalized];
    if (!user || user.password !== password) {
      throw new Error('Usuario o contraseña incorrectos');
    }
    setCurrentUser(normalized);
    return normalized;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const listeners = new Set();
  const notifyAuthChange = () => {
    listeners.forEach((cb) => { try { cb(getCurrentUser()); } catch {} });
  };

  const onAuthChange = (cb) => {
    if (typeof cb !== 'function') return;
    listeners.add(cb);
    cb(getCurrentUser());
    return () => listeners.delete(cb);
  };

  window.Auth = {
    getCurrentUser,
    register,
    login,
    logout,
    onAuthChange,
  };
})();
