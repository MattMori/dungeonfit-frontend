import api from "./api";
export async function listRewards() { const { data } = await api.get("/rewards"); return Array.isArray(data) ? data : data.rewards || data.data || []; }
export async function listUnlockedRewards() { const { data } = await api.get("/rewards/unlocked"); return Array.isArray(data) ? data : data.rewards || data.data || []; }
export async function useReward(id) { const { data } = await api.post(`/rewards/${id}/use`); return data; }
