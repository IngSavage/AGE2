// authentication helper functions
function getApiBase() {
  return window.API_BASE_URL || "";
}

async function registerUser(name, email, password) {
  const res = await fetch(`${getApiBase()}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
}

async function loginUser(email, password) {
  const res = await fetch(`${getApiBase()}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

function saveToken(token) {
  localStorage.setItem("authToken", token);
}

function getToken() {
  return localStorage.getItem("authToken");
}

function logout() {
  localStorage.removeItem("authToken");
  updateAuthUI();
}

async function updateAuthUI() {
  const token = getToken();
  const authArea = document.getElementById("auth-area");
  if (!authArea) return;
  if (token) {
    // attempt to fetch profile
    let name = '';
    try {
      const res = await fetch(`${getApiBase()}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const profile = await res.json();
        name = profile.name ? ` (${profile.name})` : '';
      }
    } catch (e) {
      console.warn('No se pudo obtener perfil');
    }
    authArea.innerHTML = `<span>Logged in${name}</span> <button id="logout-btn">Cerrar sesión</button>`;
    document.getElementById("logout-btn").addEventListener("click", logout);
  } else {
    authArea.innerHTML = `<a href="#login" class="nav-link">Login</a> <a href="#register" class="nav-link">Registro</a>`;
  }
}

export { registerUser, loginUser, saveToken, getToken, logout, updateAuthUI };