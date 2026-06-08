import api from "./api";

function unwrap(response) {
  return response?.data?.data || response?.data;
}

export async function startCombat(encounterId) {
  const response = await api.post(`/combat/encounters/${encounterId}/start`);
  return unwrap(response);
}

export async function getCombatSession(sessionId) {
  const response = await api.get(`/combat/${sessionId}`);
  return unwrap(response);
}

export async function sendCombatAction(sessionId, payload) {
  const response = await api.post(`/combat/${sessionId}/action`, payload);
  return unwrap(response);
}
