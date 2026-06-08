import api from "./api";

function unwrap(response) {
  return response?.data?.data || response?.data;
}

export async function getWeeklyBoss() {
  const response = await api.get("/weekly-boss");
  return unwrap(response);
}

export async function claimWeeklyBossReward(id) {
  const response = await api.post(`/weekly-boss/${id}/claim`);
  return unwrap(response);
}
