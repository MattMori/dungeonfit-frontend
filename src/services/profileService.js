import api from "./api";

function unwrap(response) {
  return response?.data?.data || response?.data;
}

export async function getMyProfile() {
  const response = await api.get("/profiles/me");
  return unwrap(response);
}

export async function updateMyProfile(payload) {
  const response = await api.patch("/profiles/me", payload);
  return unwrap(response);
}

export async function getPublicProfile(username) {
  const response = await api.get(`/profiles/${username}`);
  return unwrap(response);
}

export async function getProfileCard(username) {
  const response = await api.get(`/profiles/${username}/card`);
  return unwrap(response);
}

export async function setProfileTitle(relic_id) {
  const response = await api.patch("/profiles/me/title", { relic_id });
  return unwrap(response);
}

export async function setFeaturedRelics(relic_ids) {
  const response = await api.patch("/profiles/me/featured-relics", { relic_ids });
  return unwrap(response);
}

export async function setFeaturedChronicles(chronicle_ids) {
  const response = await api.patch("/profiles/me/featured-chronicles", { chronicle_ids });
  return unwrap(response);
}
