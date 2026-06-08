import api from "./api";

function unwrap(response) {
  return response?.data?.data || response?.data;
}

export async function listMyCampaigns(params = {}) {
  const response = await api.get("/creator/campaigns", { params });
  return unwrap(response) || [];
}

export async function createCreatorCampaign(payload) {
  const response = await api.post("/creator/campaigns", payload);
  return unwrap(response);
}

export async function getCreatorCampaign(slug) {
  const response = await api.get(`/creator/campaigns/${slug}`);
  return unwrap(response);
}

export async function updateCreatorCampaign(slug, payload) {
  const response = await api.patch(`/creator/campaigns/${slug}`, payload);
  return unwrap(response);
}

export async function validateCreatorCampaign(slug) {
  const response = await api.get(`/creator/campaigns/${slug}/validation`);
  return unwrap(response);
}

export async function publishCreatorCampaign(slug, payload = {}) {
  const response = await api.post(`/creator/campaigns/${slug}/publish`, payload);
  return unwrap(response);
}

export async function archiveCreatorCampaign(slug) {
  const response = await api.post(`/creator/campaigns/${slug}/archive`);
  return unwrap(response);
}

export async function duplicateCreatorCampaign(slug, payload = {}) {
  const response = await api.post(`/creator/campaigns/${slug}/duplicate`, payload);
  return unwrap(response);
}

export async function createCreatorChapter(slug, payload) {
  const response = await api.post(`/creator/campaigns/${slug}/chapters`, payload);
  return unwrap(response);
}

export async function reorderCreatorChapters(slug, orderedIds) {
  const response = await api.post(`/creator/campaigns/${slug}/chapters/reorder`, {
    orderedIds,
  });
  return unwrap(response);
}

export async function normalizeCreatorChaptersOrder(slug) {
  const response = await api.post(`/creator/campaigns/${slug}/chapters/normalize-order`);
  return unwrap(response);
}

export async function updateCreatorChapter(id, payload) {
  const response = await api.patch(`/creator/chapters/${id}`, payload);
  return unwrap(response);
}

export async function deleteCreatorChapter(id) {
  const response = await api.delete(`/creator/chapters/${id}`);
  return unwrap(response);
}

export async function getCreatorPreview(slug, params = {}) {
  const response = await api.get(`/creator/campaigns/${slug}/preview`, { params });
  return unwrap(response);
}

export async function previewCreatorChoice(slug, payload) {
  const response = await api.post(`/creator/campaigns/${slug}/preview/choice`, payload);
  return unwrap(response);
}
