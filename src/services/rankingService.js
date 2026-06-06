import api from "./api";
export async function listRankings() {
  try { const { data } = await api.get("/rankings"); return Array.isArray(data) ? data : data.rankings || data.data || []; }
  catch (error) { if ([404,405].includes(error.response?.status)) { const { data } = await api.get("/rankings/listar"); return Array.isArray(data) ? data : data.rankings || data.data || []; } throw error; }
}
