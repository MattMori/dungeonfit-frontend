import axios from "axios";
import { API_URL } from "../config/env";
export const TOKEN_KEY = "dungeonfit_token";
export const USER_KEY = "dungeonfit_user";
const api = axios.create({ baseURL: API_URL, timeout: 15000 });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY);
      if (!window.location.pathname.includes("/login")) window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
export default api;
