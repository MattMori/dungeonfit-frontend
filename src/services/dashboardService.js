import api from "./api";

function normalizeArray(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.resposta)) return value.resposta;
  return [];
}

async function safeGet(path, fallback = null) {
  try {
    const { data } = await api.get(path);
    return data;
  } catch (error) {
    const status = error.response?.status;

    if (status === 404 || status === 405) {
      return fallback;
    }

    throw error;
  }
}

export async function getDashboard() {
  const [characterResponse, workoutsResponse, rankingResponse] =
    await Promise.all([
      safeGet("/CharacterSheet/", null),
      safeGet("/Workout/listar", []),
      safeGet("/Ranking/listar", []),
    ]);

  const character =
    characterResponse?.data ||
    characterResponse?.character ||
    characterResponse?.personagem ||
    characterResponse ||
    null;

  const activities = normalizeArray(workoutsResponse);
  const ranking = normalizeArray(rankingResponse);

  return {
    user: null,
    character,
    personagem: character,

    progress: {
      streak: 0,
    },

    activities,
    todayActivities: activities,

    recentLogs: [],
    logs: [],

    rewards: [],
    unlockedRewards: [],
    nextRewards: [],

    ranking,

    weeklyBoss: {
      name: "Ogro da Preguiça",
      description:
        "Complete missões durante a semana para reduzir a vida do boss.",
      progress: 0,
    },
  };
}
