import api, { TOKEN_KEY, USER_KEY } from "./api";
export async function login(credentials) {
  const { data } = await api.post("/auth/login", credentials);
  if (data?.token) {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user || data));
  }
  return data;
}
export async function register(payload) { const { data } = await api.post("/auth/register", payload); return data; }
export function logout() { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); }
export function getStoredUser() { try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; } }
export function getToken() { return localStorage.getItem(TOKEN_KEY); }
