import api from "./api";
export async function listActivities(params = {}) { const { data } = await api.get("/activities", { params }); return Array.isArray(data) ? data : data.activities || data.data || []; }
export async function getActivity(id) { const { data } = await api.get(`/activities/${id}`); return data; }
export async function createActivity(payload) { const { data } = await api.post("/activities", payload); return data; }
export async function updateActivity(id, payload) { const { data } = await api.patch(`/activities/${id}`, payload); return data; }
export async function deleteActivity(id) { const { data } = await api.delete(`/activities/${id}`); return data; }
export async function completeActivity(id, payload = {}) { const { data } = await api.post(`/activities/${id}/complete`, payload); return data; }
