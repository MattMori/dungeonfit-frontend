import api from "./api";

function unwrapResponse(response) {
  return response?.data?.data || response?.data;
}

export async function getDnd5e2014CreationRules() {
  try {
    const response = await api.get("/characters/rules");
    return unwrapResponse(response);
  } catch (error) {
    const status = error.response?.status;

    if (status !== 404 && status !== 405) {
      throw error;
    }

    return {
      ruleset: "dnd5e-2014",
      pointBuy: {
        total: 27,
        min: 8,
        max: 15,
        costs: {
          8: 0,
          9: 1,
          10: 2,
          11: 3,
          12: 4,
          13: 5,
          14: 7,
          15: 9,
        },
      },
      races: {
        anao: {
          label: "Anão",
          abilityBonuses: { con: 2 },
          speed: 7.5,
        },
        elfo: {
          label: "Elfo",
          abilityBonuses: { des: 2 },
          speed: 9,
        },
        halfling: {
          label: "Halfling",
          abilityBonuses: { des: 2 },
          speed: 7.5,
        },
        humano: {
          label: "Humano",
          abilityBonuses: {
            for: 1,
            des: 1,
            con: 1,
            int: 1,
            sab: 1,
            car: 1,
          },
          speed: 9,
        },
        draconato: {
          label: "Draconato",
          abilityBonuses: { for: 2, car: 1 },
          speed: 9,
        },
        gnomo: {
          label: "Gnomo",
          abilityBonuses: { int: 2 },
          speed: 7.5,
        },
        "meio-elfo": {
          label: "Meio-elfo",
          abilityBonuses: { car: 2 },
          flexibleAbilityBonuses: {
            count: 2,
            amount: 1,
            distinct: true,
            exclude: ["car"],
          },
          speed: 9,
        },
        "meio-orc": {
          label: "Meio-orc",
          abilityBonuses: { for: 2, con: 1 },
          speed: 9,
        },
        tiefling: {
          label: "Tiefling",
          abilityBonuses: { int: 1, car: 2 },
          speed: 9,
        },
      },
      classes: {
        barbaro: {
          label: "Bárbaro",
          hitDie: 12,
          savingThrows: ["for", "con"],
          skillChoices: {
            choose: 2,
            from: [
              "lidar_com_animais",
              "atletismo",
              "intimidacao",
              "natureza",
              "percepcao",
              "sobrevivencia",
            ],
          },
        },
        bardo: {
          label: "Bardo",
          hitDie: 8,
          savingThrows: ["des", "car"],
          skillChoices: {
            choose: 3,
            from: "any",
          },
        },
        bruxo: {
          label: "Bruxo",
          hitDie: 8,
          savingThrows: ["sab", "car"],
          skillChoices: {
            choose: 2,
            from: [
              "arcanismo",
              "enganacao",
              "historia",
              "intimidacao",
              "investigacao",
              "natureza",
              "religiao",
            ],
          },
        },
        clerigo: {
          label: "Clérigo",
          hitDie: 8,
          savingThrows: ["sab", "car"],
          skillChoices: {
            choose: 2,
            from: ["historia", "intuicao", "medicina", "persuasao", "religiao"],
          },
        },
        druida: {
          label: "Druida",
          hitDie: 8,
          savingThrows: ["int", "sab"],
          skillChoices: {
            choose: 2,
            from: [
              "arcanismo",
              "lidar_com_animais",
              "intuicao",
              "medicina",
              "natureza",
              "percepcao",
              "religiao",
              "sobrevivencia",
            ],
          },
        },
        feiticeiro: {
          label: "Feiticeiro",
          hitDie: 6,
          savingThrows: ["con", "car"],
          skillChoices: {
            choose: 2,
            from: [
              "arcanismo",
              "enganacao",
              "intuicao",
              "intimidacao",
              "persuasao",
              "religiao",
            ],
          },
        },
        guerreiro: {
          label: "Guerreiro",
          hitDie: 10,
          savingThrows: ["for", "con"],
          skillChoices: {
            choose: 2,
            from: [
              "acrobacia",
              "lidar_com_animais",
              "atletismo",
              "historia",
              "intuicao",
              "intimidacao",
              "percepcao",
              "sobrevivencia",
            ],
          },
        },
        ladino: {
          label: "Ladino",
          hitDie: 8,
          savingThrows: ["des", "int"],
          skillChoices: {
            choose: 4,
            from: [
              "acrobacia",
              "atletismo",
              "enganacao",
              "intuicao",
              "intimidacao",
              "investigacao",
              "percepcao",
              "atuacao",
              "persuasao",
              "prestidigitacao",
              "furtividade",
            ],
          },
        },
        mago: {
          label: "Mago",
          hitDie: 6,
          savingThrows: ["int", "sab"],
          skillChoices: {
            choose: 2,
            from: [
              "arcanismo",
              "historia",
              "intuicao",
              "investigacao",
              "medicina",
              "religiao",
            ],
          },
        },
        monge: {
          label: "Monge",
          hitDie: 8,
          savingThrows: ["for", "des"],
          skillChoices: {
            choose: 2,
            from: [
              "acrobacia",
              "atletismo",
              "historia",
              "intuicao",
              "religiao",
              "furtividade",
            ],
          },
        },
        paladino: {
          label: "Paladino",
          hitDie: 10,
          savingThrows: ["sab", "car"],
          skillChoices: {
            choose: 2,
            from: [
              "atletismo",
              "intuicao",
              "intimidacao",
              "medicina",
              "persuasao",
              "religiao",
            ],
          },
        },
        patrulheiro: {
          label: "Patrulheiro",
          hitDie: 10,
          savingThrows: ["for", "des"],
          skillChoices: {
            choose: 3,
            from: [
              "lidar_com_animais",
              "atletismo",
              "intuicao",
              "investigacao",
              "natureza",
              "percepcao",
              "furtividade",
              "sobrevivencia",
            ],
          },
        },
      },
    };
  }
}
