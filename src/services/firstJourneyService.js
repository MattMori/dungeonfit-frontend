import api from "./api";

function unwrap(response) {
  return response?.data?.data || response?.data;
}

export async function getFirstJourney() {
  const response = await api.get("/first-journey");
  return unwrap(response);
}

export async function startFirstJourney() {
  const response = await api.post("/first-journey/start");
  return unwrap(response);
}

export async function completeStarterMission() {
  const response = await api.post("/first-journey/complete-starter-mission");
  return unwrap(response);
}

export async function completeFirstJourney() {
  const response = await api.post("/first-journey/complete");
  return unwrap(response);
}
