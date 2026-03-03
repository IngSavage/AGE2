const ApiClient = (() => {
  let token = localStorage.getItem('authToken') || '';

  function setToken(nextToken) {
    token = nextToken || '';
    if (token) localStorage.setItem('authToken', token);
    else localStorage.removeItem('authToken');
  }

  function getToken() {
    return token;
  }

  async function request(url, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(url, { ...options, headers });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Error de servidor');
    return data;
  }

  return { request, setToken, getToken };
})();
