import api from "./api";

function unwrap(response) {
  return response?.data?.data || response?.data;
}

export async function getAdminDashboard() {
  const response = await api.get("/admin/dashboard");
  return unwrap(response);
}

export async function listAdminCampaigns(params = {}) {
  const response = await api.get("/admin/campaigns", { params });
  return unwrap(response) || [];
}

export async function approveAdminCampaign(id, moderation_notes = "") {
  const response = await api.patch(`/admin/campaigns/${id}/approve`, { moderation_notes });
  return unwrap(response);
}

export async function rejectAdminCampaign(id, moderation_notes = "") {
  const response = await api.patch(`/admin/campaigns/${id}/reject`, { moderation_notes });
  return unwrap(response);
}

export async function flagAdminCampaign(id, moderation_notes = "") {
  const response = await api.patch(`/admin/campaigns/${id}/flag`, { moderation_notes });
  return unwrap(response);
}

export async function listAdminReports(params = {}) {
  const response = await api.get("/reports/admin", { params });
  return unwrap(response) || [];
}

export async function updateAdminReportStatus(id, payload) {
  const response = await api.patch(`/reports/admin/${id}/status`, payload);
  return unwrap(response);
}

export async function listAdminShopItems(params = {}) {
  const response = await api.get("/admin/shop/items", { params });
  return unwrap(response) || [];
}

export async function createAdminShopItem(payload) {
  const response = await api.post("/admin/shop/items", payload);
  return unwrap(response);
}

export async function updateAdminShopItem(id, payload) {
  const response = await api.patch(`/admin/shop/items/${id}`, payload);
  return unwrap(response);
}

export async function listAdminEnemies(params = {}) {
  const response = await api.get("/admin/enemies", { params });
  return unwrap(response) || [];
}

export async function createAdminEnemy(payload) {
  const response = await api.post("/admin/enemies", payload);
  return unwrap(response);
}

export async function updateAdminEnemy(id, payload) {
  const response = await api.patch(`/admin/enemies/${id}`, payload);
  return unwrap(response);
}

export async function getAdminEconomy() {
  const response = await api.get("/admin/economy");
  return unwrap(response);
}

export async function getCreatorCampaignMetrics(slug) {
  const response = await api.get(`/creator/campaigns/${slug}/metrics`);
  return unwrap(response);
}
