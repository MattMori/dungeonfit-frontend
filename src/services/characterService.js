import api from "./api";
export async function getCharacter() {
  try { const { data } = await api.get("/characters/me"); return data; }
  catch (error) { if ([404,405].includes(error.response?.status)) { const { data } = await api.get("/characters"); return data; } throw error; }
}
export async function createCharacter(payload) { const { data } = await api.post("/characters", payload); return data; }
export async function updateCharacter(payload) {
  try { const { data } = await api.patch("/characters/me", payload); return data; }
  catch (error) { if ([404,405].includes(error.response?.status)) { const { data } = await api.patch("/characters", payload); return data; } throw error; }
}
