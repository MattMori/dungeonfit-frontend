import api from "./api";
export async function listActivityLogs(params = {}) { const { data } = await api.get("/activity-logs", { params }); return Array.isArray(data) ? data : data.logs || data.data || []; }
export async function listRecentActivityLogs(limit = 8) { const { data } = await api.get("/activity-logs/recent", { params: { limit } }); return Array.isArray(data) ? data : data.logs || data.data || []; }
