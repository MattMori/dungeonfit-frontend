import api from "./api";

function unwrap(response) {
  return response?.data?.data || response?.data;
}

export async function getCharacterLevelUpOptions(params = {}) {
  const response = await api.get("/character-options/level-up", { params });
  return unwrap(response);
}

export async function listSubclasses(params = {}) {
  const response = await api.get("/character-options/subclasses", { params });
  return unwrap(response) || [];
}

export async function listFightingStyles(params = {}) {
  const response = await api.get("/character-options/fighting-styles", { params });
  return unwrap(response) || [];
}

export async function listInvocations(params = {}) {
  const response = await api.get("/character-options/invocations", { params });
  return unwrap(response) || [];
}

export async function listSpells(params = {}) {
  const response = await api.get("/character-options/spells", { params });
  return unwrap(response) || [];
}
