import api from "./api";

function unwrap(response) {
  return response?.data?.data || response?.data;
}

export async function listChronicles(params = {}) {
  const response = await api.get("/chronicles", { params });
  const data = unwrap(response);

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(data?.chronicles)) {
    return data.chronicles;
  }

  if (Array.isArray(data?.events)) {
    return data.events;
  }

  return [];
}

export async function getChronicleById(id) {
  const response = await api.get(`/chronicles/${id}`);
  return unwrap(response);
}

export async function createChronicle(payload) {
  const response = await api.post("/chronicles", payload);
  return unwrap(response);
}

export async function updateChronicle(id, payload) {
  const response = await api.patch(`/chronicles/${id}`, payload);
  return unwrap(response);
}

export async function deleteChronicle(id) {
  const response = await api.delete(`/chronicles/${id}`);
  return unwrap(response);
}
