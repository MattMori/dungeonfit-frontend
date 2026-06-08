import api from "./api";

function unwrap(response) {
  return response?.data?.data || response?.data;
}

export async function listChapterEncounters(slug, chapterId) {
  const response = await api.get(`/creator/campaigns/${slug}/chapters/${chapterId}/encounters`);
  return unwrap(response) || [];
}

export async function createEncounter(slug, chapterId, payload) {
  const response = await api.post(`/creator/campaigns/${slug}/chapters/${chapterId}/encounters`, payload);
  return unwrap(response);
}

export async function updateEncounter(id, payload) {
  const response = await api.patch(`/creator/encounters/${id}`, payload);
  return unwrap(response);
}

export async function deleteEncounter(id) {
  const response = await api.delete(`/creator/encounters/${id}`);
  return unwrap(response);
}
