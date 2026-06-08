import api from "./api";

function unwrap(response) {
  return response?.data?.data || response?.data;
}

export async function listEnemies(params = {}) {
  const response = await api.get("/enemies", { params });
  return unwrap(response) || [];
}

export async function createEnemy(payload) {
  const response = await api.post("/enemies", payload);
  return unwrap(response);
}
