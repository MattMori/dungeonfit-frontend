import api from "./api";

function unwrap(response) {
  return response?.data?.data || response?.data;
}

export async function listInventory() {
  const response = await api.get("/inventory");
  return unwrap(response);
}

export async function createInventoryItem(payload) {
  const response = await api.post("/inventory/items", payload);
  return unwrap(response);
}

export async function equipInventoryItem(id) {
  const response = await api.patch(`/inventory/items/${id}/equip`);
  return unwrap(response);
}

export async function unequipInventoryItem(id) {
  const response = await api.patch(`/inventory/items/${id}/unequip`);
  return unwrap(response);
}

export async function useInventoryItem(id) {
  const response = await api.post(`/inventory/items/${id}/use`);
  return unwrap(response);
}
