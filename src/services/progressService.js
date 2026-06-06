import api from "./api";
export async function getProgress(params = {}) { const { data } = await api.get("/progress", { params }); return data; }
