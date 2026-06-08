import api from "./api";

function unwrap(response) {
  return response?.data?.data || response?.data;
}

export async function getTavern() {
  const response = await api.get("/cronarium/tavern");
  return unwrap(response);
}

export async function listChronicles(params = {}) {
  const response = await api.get("/cronarium/chronicles", { params });
  return unwrap(response) || [];
}

export async function listRelics(params = {}) {
  const response = await api.get("/cronarium/relics", { params });
  return unwrap(response) || [];
}

export async function getEvolution() {
  const response = await api.get("/cronarium/evolution");
  return unwrap(response);
}

export async function listRealMissions(params = {}) {
  const response = await api.get("/real-missions", { params });
  return unwrap(response) || [];
}

export async function createRealMission(payload) {
  const response = await api.post("/real-missions", payload);
  return unwrap(response);
}

export async function completeRealMissionById(id) {
  const response = await api.post(`/real-missions/${id}/complete`);
  return unwrap(response);
}
