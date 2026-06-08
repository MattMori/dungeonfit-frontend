import api from "./api";

function unwrapResponse(response) {
  return response?.data?.data || response?.data?.character || response?.data;
}

export async function getCharacter() {
  const response = await api.get("/characters/me");
  return unwrapResponse(response);
}

export async function createCharacter(payload) {
  const response = await api.post("/characters/me", payload);
  return unwrapResponse(response);
}

export async function addCharacterExperience(pontos_experiencia) {
  const response = await api.post("/characters/me/experience", {
    pontos_experiencia,
  });

  return unwrapResponse(response);
}

export async function levelUpCharacter() {
  const response = await api.post("/characters/me/level-up");
  return unwrapResponse(response);
}
