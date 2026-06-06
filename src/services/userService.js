import api from "./api";
export async function getMe() {
  try { const { data } = await api.get("/users/me"); return data; }
  catch (error) { if ([404,405].includes(error.response?.status)) { const { data } = await api.get("/users/buscar"); return data; } throw error; }
}
export async function updateMe(payload) {
  try { const { data } = await api.patch("/users/me", payload); return data; }
  catch (error) { if ([404,405].includes(error.response?.status)) { const { data } = await api.put("/users/atualizar", payload); return data; } throw error; }
}
