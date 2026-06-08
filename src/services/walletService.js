import api from "./api";

function unwrap(response) {
  return response?.data?.data || response?.data;
}

export async function getWallet() {
  const response = await api.get("/wallet");
  return unwrap(response);
}

export async function listWalletTransactions(params = {}) {
  const response = await api.get("/wallet/transactions", { params });
  return unwrap(response);
}
