import api from "./api";

function unwrap(response) {
  return response?.data?.data || response?.data;
}

export async function listGuilds() {
  const response = await api.get("/guilds");
  return unwrap(response);
}

export async function createGuild(payload) {
  const response = await api.post("/guilds", payload);
  return unwrap(response);
}

export async function getGuild(slug) {
  const response = await api.get(`/guilds/${slug}`);
  return unwrap(response);
}

export async function joinGuild(slug, payload = {}) {
  const response = await api.post(`/guilds/${slug}/join`, payload);
  return unwrap(response);
}

export async function joinGuildByCode(invite_code) {
  const response = await api.post("/guilds/join-by-code", { invite_code });
  return unwrap(response);
}

export async function leaveGuild(slug) {
  const response = await api.post(`/guilds/${slug}/leave`);
  return unwrap(response);
}

export async function listGuildMembers(slug) {
  const response = await api.get(`/guilds/${slug}/members`);
  return unwrap(response) || [];
}

export async function getGuildRanking(slug) {
  const response = await api.get(`/guilds/${slug}/ranking`);
  return unwrap(response) || [];
}

export async function getGuildFeed(slug) {
  const response = await api.get(`/guilds/${slug}/feed`);
  return unwrap(response) || [];
}
