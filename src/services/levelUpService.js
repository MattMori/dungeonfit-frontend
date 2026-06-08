import api from "./api";

function unwrap(response) {
  return response?.data?.data || response?.data;
}

export async function getLevelUpStatus() {
  const response = await api.get("/level-up/status");
  return unwrap(response);
}

export async function confirmLevelUp(choices = {}) {
  const response = await api.post("/level-up/confirm", { choices });
  return unwrap(response);
}

export async function listLevelUpHistory() {
  const response = await api.get("/level-up/history");
  return unwrap(response) || [];
}
