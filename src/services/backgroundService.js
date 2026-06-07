import api from "./api";

function normalizeListResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.backgrounds)) return data.backgrounds;
  if (Array.isArray(data?.antecedentes)) return data.antecedentes;
  return [];
}

export async function listBackgrounds() {
  try {
    const { data } = await api.get("/backgrounds");
    return normalizeListResponse(data);
  } catch (error) {
    const status = error.response?.status;

    if (status === 404 || status === 405) {
      const { data } = await api.get("/Antecedentes/listar");
      return normalizeListResponse(data);
    }

    throw error;
  }
}
