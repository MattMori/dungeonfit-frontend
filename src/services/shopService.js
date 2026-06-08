import api from "./api";

function unwrap(response) {
  return response?.data?.data || response?.data;
}

export async function listShopItems(params = {}) {
  const response = await api.get("/shop", { params });
  return unwrap(response) || [];
}

export async function buyShopItem(slug, quantity = 1) {
  const response = await api.post(`/shop/items/${slug}/buy`, { quantity });
  return unwrap(response);
}
