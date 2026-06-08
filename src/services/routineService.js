import api from "./api";

function unwrap(response) {
  return response?.data?.data || response?.data;
}

export async function getRoutine() {
  const response = await api.get("/routine");
  return unwrap(response);
}

export async function completeDailyRoutine(payload = {}) {
  const response = await api.post("/routine/complete-daily", payload);
  return unwrap(response);
}
