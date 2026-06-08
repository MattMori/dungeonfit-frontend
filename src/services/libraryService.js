import api from "./api";

function unwrap(response) {
  return response?.data?.data || response?.data;
}

export async function listLibraryCampaigns(params = {}) {
  const response = await api.get("/library/campaigns", { params });
  return unwrap(response) || [];
}

export async function getLibraryCampaign(slug) {
  const response = await api.get(`/library/campaigns/${slug}`);
  return unwrap(response);
}

export async function saveLibraryCampaign(slug) {
  const response = await api.post(`/library/campaigns/${slug}/save`);
  return unwrap(response);
}

export async function unsaveLibraryCampaign(slug) {
  const response = await api.delete(`/library/campaigns/${slug}/save`);
  return unwrap(response);
}

export async function listSavedCampaigns() {
  const response = await api.get("/library/saved-campaigns");
  return unwrap(response) || [];
}
