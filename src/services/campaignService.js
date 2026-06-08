import api from "./api";

function unwrap(response) {
  return response?.data?.data || response?.data;
}

export async function listCampaigns() {
  const response = await api.get("/campaigns");
  return unwrap(response) || [];
}

export async function getCampaign(slug) {
  const response = await api.get(`/campaigns/${slug}`);
  return unwrap(response);
}

export async function startCampaign(slug) {
  const response = await api.post(`/campaigns/${slug}/start`);
  return unwrap(response);
}

export async function getCurrentCampaignChapter(slug) {
  const response = await api.get(`/campaigns/${slug}/current`);
  return unwrap(response);
}

export async function chooseCampaignOption(slug, choice_id) {
  const response = await api.post(`/campaigns/${slug}/choice`, { choice_id });
  return unwrap(response);
}

export async function completeCampaignRealMission(slug) {
  const response = await api.post(`/campaigns/${slug}/complete-real-mission`);
  return unwrap(response);
}
export async function completeRealMission(payload = {}) {
  const response = await api.post(
    "/first-journey/complete-starter-mission",
    payload,
  );
  return response?.data?.data || response?.data;
}
