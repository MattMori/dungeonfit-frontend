import api from "./api";

function unwrap(response) {
  return response?.data?.data || response?.data;
}

export async function listNotifications(params = {}) {
  const response = await api.get("/notifications", { params });
  return unwrap(response);
}

export async function markNotificationRead(id) {
  const response = await api.patch(`/notifications/${id}/read`);
  return unwrap(response);
}

export async function markAllNotificationsRead() {
  const response = await api.patch("/notifications/read-all");
  return unwrap(response);
}
