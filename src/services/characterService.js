import api from "./api";

function unwrapResponse(response) {
  return response?.data?.data || response?.data?.character || response?.data;
}

export async function getCharacter() {
  const response = await api.get("/CharacterSheet/");
  return unwrapResponse(response);
}

export async function createCharacter(payload) {
  const response = await api.post("/CharacterSheet/", payload);
  return unwrapResponse(response);
}

export async function addCharacterExperience(pontos_experiencia) {
  const response = await api.patch("/CharacterSheet/xp", {
    pontos_experiencia,
  });

  return unwrapResponse(response);
}

export async function levelUpCharacter() {
  const response = await api.patch("/CharacterSheet/level-up");
  return unwrapResponse(response);
}
