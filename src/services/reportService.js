import api from "./api";

function unwrap(response) {
  return response?.data?.data || response?.data;
}

export async function createReport(payload) {
  const response = await api.post("/reports", payload);
  return unwrap(response);
}
