import { useEffect, useMemo, useState } from "react";
import { Lock, Minus, Plus, Save, Shield, Sparkles } from "lucide-react";

import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import HydratedSheetDetails from "../components/HydratedSheetDetails";

import { createCharacter, getCharacter } from "../services/characterService";
import { listBackgrounds } from "../services/backgroundService";
import { getDnd5e2014CreationRules } from "../services/dnd5e2014Service";
import { getDisplayValue } from "../utils/renderValue";

import "../styles/character.css";
import "../styles/dnd-character-builder.css";
import "../styles/hydrated-sheet.css";

const ATTRIBUTE_LABELS = {
  for: "Força",
  des: "Destreza",
  con: "Constituição",
  int: "Inteligência",
  sab: "Sabedoria",
  car: "Carisma",
};

const ATTRIBUTE_KEYS = ["for", "des", "con", "int", "sab", "car"];

const POINT_COST = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};

const SKILL_LABELS = {
  acrobacia: "Acrobacia",
  arcanismo: "Arcanismo",
  atletismo: "Atletismo",
  atuacao: "Atuação",
  enganacao: "Enganação",
  furtividade: "Furtividade",
  historia: "História",
  intimidacao: "Intimidação",
  intuicao: "Intuição",
  investigacao: "Investigação",
  lidar_com_animais: "Lidar com Animais",
  medicina: "Medicina",
  natureza: "Natureza",
  percepcao: "Percepção",
  persuasao: "Persuasão",
  prestidigitacao: "Prestidigitação",
  religiao: "Religião",
  sobrevivencia: "Sobrevivência",
};

const ALIGNMENTS = [
  ["leal_bom", "Leal e Bom"],
  ["neutro_bom", "Neutro e Bom"],
  ["caotico_bom", "Caótico e Bom"],
  ["leal_neutro", "Leal e Neutro"],
  ["neutro", "Neutro"],
  ["caotico_neutro", "Caótico e Neutro"],
  ["leal_mau", "Leal e Mau"],
  ["neutro_mau", "Neutro e Mau"],
  ["caotico_mau", "Caótico e Mau"],
];

const ALIGNMENT_LABELS = Object.fromEntries(ALIGNMENTS);

const DEFAULT_LANGUAGES = [
  "Abissal",
  "Anão",
  "Celestial",
  "Comum",
  "Dracônico",
  "Élfico",
  "Gigante",
  "Gnômico",
  "Goblin",
  "Halfling",
  "Infernal",
  "Orc",
  "Primordial",
  "Silvestre",
  "Subcomum",
];

const DEFAULT_SIMPLE_WEAPONS = [
  "Adaga",
  "Azagaia",
  "Bordão",
  "Clava",
  "Foice curta",
  "Lança",
  "Maça",
  "Martelo leve",
  "Porrete",
  "Machadinha",
  "Besta leve",
  "Dardo",
  "Funda",
  "Arco curto",
];

const FALLBACK_RULES = {
  pointBuy: { total: 27 },
  races: {},
  classes: {},
  languages: DEFAULT_LANGUAGES,
  simpleWeapons: DEFAULT_SIMPLE_WEAPONS,
};

const defaultForm = {
  nome_personagem: "",
  alinhamento: "neutro",
  raca: "",
  subraca: "",
  classe: "",
  antecedente_id: "",
  atributos_base: {
    for: 8,
    des: 8,
    con: 8,
    int: 8,
    sab: 8,
    car: 8,
  },
  escolhas_raciais: {
    abilityBonuses: [],
    skills: [],
    idiomas: [],
    ancestralidade_draconica: [],
  },
  escolhas_classe: {
    pericias: [],
  },
  escolhas_antecedente: {
    idiomas: [],
  },
  escolhas_equipamento: {
    arma_simples: "",
  },
  escolhas_narrativas: {
    personalidade: "",
    ideal: "",
    vinculo: "",
    defeito: "",
  },
};

function unwrapCharacter(response) {
  return (
    response?.data || response?.character || response?.personagem || response
  );
}

function getModifier(value) {
  const modifier = Math.floor((Number(value) - 10) / 2);
  return modifier >= 0 ? `+${modifier}` : String(modifier);
}

function getUsedPoints(attributes) {
  return ATTRIBUTE_KEYS.reduce(
    (sum, key) => sum + (POINT_COST[attributes[key]] ?? 999),
    0,
  );
}

function normalizeBackgroundOption(background) {
  return {
    value: background?._id || background?.id || background?.value,
    label:
      background?.nome ||
      background?.name ||
      background?.label ||
      background?.tipo ||
      "Antecedente",
    raw: background,
  };
}

function toggleUnique(list, value, limit) {
  const exists = list.includes(value);

  if (exists) {
    return list.filter((item) => item !== value);
  }

  if (limit && list.length >= limit) {
    return list;
  }

  return [...list, value];
}

function isChoicePlaceholder(value) {
  const text = String(value || "").toLowerCase();

  return (
    text.includes("à escolha") ||
    text.includes("a escolha") ||
    text.includes("qualquer") ||
    text.includes("escolha")
  );
}

function LockedCharacterView({ character }) {
  const atributos = character?.atributos || {};

  return (
    <div className="locked-character">
      <section className="locked-hero-card">
        <div className="character-token large">
          <Shield size={42} />
        </div>

        <div>
          <span className="eyebrow">Ficha selada</span>
          <h2>{character?.nome_personagem || "Herói sem nome"}</h2>
          <p>
            {character?.raca}
            {character?.subraca ? `/${character.subraca}` : ""} ·{" "}
            {character?.classe} · nível {character?.nivel || 1}
          </p>
        </div>

        <div className="sealed-badge">
          <Lock size={17} />
          D&D 5e 2014
        </div>
      </section>

      <section className="character-read-grid">
        <article className="panel">
          <span className="eyebrow">Identidade</span>

          <dl className="sheet-definition-list">
            <div>
              <dt>Nome</dt>
              <dd>{character?.nome_personagem || "-"}</dd>
            </div>

            <div>
              <dt>Raça</dt>
              <dd>{character?.raca || "-"}</dd>
            </div>

            <div>
              <dt>Sub-raça</dt>
              <dd>{character?.subraca || "-"}</dd>
            </div>

            <div>
              <dt>Classe</dt>
              <dd>{character?.classe || "-"}</dd>
            </div>

            <div>
              <dt>Antecedente</dt>
              <dd>{getDisplayValue(character?.antecedente)}</dd>
            </div>

            <div>
              <dt>Alinhamento</dt>
              <dd>
                {ALIGNMENT_LABELS[character?.alinhamento] ||
                  character?.alinhamento ||
                  "-"}
              </dd>
            </div>
          </dl>
        </article>

        <article className="panel">
          <span className="eyebrow">Combate</span>

          <dl className="sheet-definition-list">
            <div>
              <dt>CA</dt>
              <dd>{character?.classe_armadura ?? character?.ca ?? 10}</dd>
            </div>

            <div>
              <dt>HP</dt>
              <dd>
                {character?.hp_atual ?? 0}/{character?.hp_max ?? 0}
              </dd>
            </div>

            <div>
              <dt>Iniciativa</dt>
              <dd>
                {Number(character?.iniciativa || 0) >= 0
                  ? `+${character?.iniciativa || 0}`
                  : character?.iniciativa}
              </dd>
            </div>

            <div>
              <dt>Proficiência</dt>
              <dd>+{character?.bonus_proficiencia || 2}</dd>
            </div>
          </dl>
        </article>
      </section>

      <section className="panel character-attributes-card">
        <div className="attributes-header">
          <div>
            <span className="eyebrow">Atributos selados</span>
            <h2>Base e final</h2>
            <p>O atributo final inclui bônus racial validado pelo backend.</p>
          </div>
        </div>

        <div className="attribute-card-grid read-only">
          {ATTRIBUTE_KEYS.map((key) => (
            <article className="attribute-card locked" key={key}>
              <div className="attribute-card-top">
                <div>
                  <span>{key.toUpperCase()}</span>
                  <strong>{ATTRIBUTE_LABELS[key]}</strong>
                </div>

                <em>base {character?.atributos_base?.[key] ?? "-"}</em>
              </div>

              <div className="attribute-score locked-score">
                <strong>{String(atributos[key] || 8).padStart(2, "0")}</strong>
                <span>mod {getModifier(atributos[key] || 8)}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <HydratedSheetDetails character={character} />
    </div>
  );
}

export default function Character() {
  const [step, setStep] = useState(1);
  const [rules, setRules] = useState(FALLBACK_RULES);
  const [backgrounds, setBackgrounds] = useState([]);
  const [character, setCharacter] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [acceptedSeal, setAcceptedSeal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const usedPoints = useMemo(() => getUsedPoints(form.atributos_base), [form]);
  const remainingPoints = 27 - usedPoints;

  const selectedRace = rules.races?.[form.raca];
  const selectedSubrace = selectedRace?.subraces?.[form.subraca];
  const selectedClass = rules.classes?.[form.classe];

  const selectedBackground = backgrounds.find(
    (item) => item.value === form.antecedente_id,
  );

  const classSkills =
    selectedClass?.skillChoices?.from === "any"
      ? Object.keys(SKILL_LABELS)
      : selectedClass?.skillChoices?.from || [];

  const classSkillChoose = selectedClass?.skillChoices?.choose || 0;
  const requiredChoices = selectedClass?.requiredChoices || {};
  const raceRequiredChoices = selectedRace?.requiredChoices || {};

  const backgroundLanguageChoiceCount = useMemo(() => {
    const languages = selectedBackground?.raw?.proficiencias?.idiomas || [];
    return languages.filter(isChoicePlaceholder).length;
  }, [selectedBackground]);

  const needsSimpleWeapon = useMemo(() => {
    const equipment = selectedClass?.fixedEquipment || [];

    return equipment.some((item) =>
      String(item || "")
        .toLowerCase()
        .includes("qualquer arma simples"),
    );
  }, [selectedClass]);

  const languageOptions = rules.languages || DEFAULT_LANGUAGES;
  const simpleWeaponOptions = rules.simpleWeapons || DEFAULT_SIMPLE_WEAPONS;

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [characterResult, rulesResult, backgroundsResult] =
        await Promise.allSettled([
          getCharacter(),
          getDnd5e2014CreationRules(),
          listBackgrounds(),
        ]);

      if (characterResult.status === "fulfilled") {
        const loaded = unwrapCharacter(characterResult.value);

        if (loaded?._id || loaded?.id || loaded?.nome_personagem) {
          setCharacter(loaded);
        }
      }

      if (rulesResult.status === "fulfilled") {
        setRules(rulesResult.value || FALLBACK_RULES);
      }

      if (backgroundsResult.status === "fulfilled") {
        setBackgrounds(
          backgroundsResult.value
            .map(normalizeBackgroundOption)
            .filter((item) => item.value),
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar ficha.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function setField(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "raca"
        ? {
            subraca: "",
            escolhas_raciais: defaultForm.escolhas_raciais,
          }
        : {}),
      ...(name === "classe"
        ? {
            escolhas_classe: { pericias: [] },
            escolhas_equipamento: defaultForm.escolhas_equipamento,
          }
        : {}),
      ...(name === "antecedente_id"
        ? {
            escolhas_antecedente: defaultForm.escolhas_antecedente,
          }
        : {}),
    }));
  }

  function setNarrativeField(name, value) {
    setForm((current) => ({
      ...current,
      escolhas_narrativas: {
        ...current.escolhas_narrativas,
        [name]: value,
      },
    }));
  }

  function setEquipmentField(name, value) {
    setForm((current) => ({
      ...current,
      escolhas_equipamento: {
        ...current.escolhas_equipamento,
        [name]: value,
      },
    }));
  }

  function changeAttribute(key, delta) {
    setForm((current) => {
      const currentValue = current.atributos_base[key];
      const nextValue = Math.max(8, Math.min(15, currentValue + delta));

      return {
        ...current,
        atributos_base: {
          ...current.atributos_base,
          [key]: nextValue,
        },
      };
    });
  }

  function toggleClassSkill(skill) {
    setForm((current) => ({
      ...current,
      escolhas_classe: {
        ...current.escolhas_classe,
        pericias: toggleUnique(
          current.escolhas_classe.pericias,
          skill,
          classSkillChoose,
        ),
      },
    }));
  }

  function toggleClassChoice(choiceKey, value, limit) {
    setForm((current) => ({
      ...current,
      escolhas_classe: {
        ...current.escolhas_classe,
        [choiceKey]: toggleUnique(
          current.escolhas_classe[choiceKey] || [],
          value,
          limit,
        ),
      },
    }));
  }

  function toggleRaceChoice(choiceKey, value, limit) {
    setForm((current) => ({
      ...current,
      escolhas_raciais: {
        ...current.escolhas_raciais,
        [choiceKey]: toggleUnique(
          current.escolhas_raciais[choiceKey] || [],
          value,
          limit,
        ),
      },
    }));
  }

  function toggleBackgroundLanguage(language) {
    setForm((current) => ({
      ...current,
      escolhas_antecedente: {
        ...current.escolhas_antecedente,
        idiomas: toggleUnique(
          current.escolhas_antecedente.idiomas || [],
          language,
          backgroundLanguageChoiceCount,
        ),
      },
    }));
  }

  function validateStep(nextStep = step) {
    if (nextStep > 1) {
      if (
        !form.nome_personagem ||
        !form.raca ||
        !form.classe ||
        !form.antecedente_id
      ) {
        return "Preencha nome, raça, classe e antecedente.";
      }

      if (selectedRace?.requiresSubrace && !form.subraca) {
        return "Escolha uma sub-raça.";
      }
    }

    if (nextStep > 2 && remainingPoints !== 0) {
      return "Distribua exatamente os 27 pontos de atributo.";
    }

    if (
      nextStep > 4 &&
      form.escolhas_classe.pericias.length !== classSkillChoose
    ) {
      return `Escolha exatamente ${classSkillChoose} perícia(s) da classe.`;
    }

    if (
      nextStep > 6 &&
      backgroundLanguageChoiceCount > 0 &&
      form.escolhas_antecedente.idiomas.length !== backgroundLanguageChoiceCount
    ) {
      return `Escolha ${backgroundLanguageChoiceCount} idioma(s) do antecedente.`;
    }

    if (
      nextStep > 6 &&
      needsSimpleWeapon &&
      !form.escolhas_equipamento.arma_simples
    ) {
      return "Escolha uma arma simples inicial.";
    }

    return "";
  }

  function goNext() {
    const validationError = validateStep(step + 1);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setStep((current) => Math.min(8, current + 1));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationError = validateStep(8);

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        antecedente: form.antecedente_id,
        antecedente_id: form.antecedente_id,
        antecedente_nome: selectedBackground?.label,
        escolhas_narrativas: {
          ...form.escolhas_narrativas,
          alinhamento: form.alinhamento,
        },
      };

      await createCharacter(payload);
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Não foi possível criar a ficha.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <Loading text="Carregando regras D&D 5e 2014..." />;
  }

  if (character) {
    return (
      <div>
        <PageHeader
          eyebrow="Ficha"
          title="Personagem"
          description="Ficha selada seguindo D&D 5e 2014."
        />

        <ErrorMessage message={error} />

        <LockedCharacterView character={character} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Criação fiel"
        title="Criar personagem"
        description="Fluxo fiel à criação de personagem D&D 5e 2014."
      />

      <ErrorMessage message={error} />

      <form className="panel dnd-builder" onSubmit={handleSubmit}>
        <div className="dnd-stepper">
          {[
            "Identidade",
            "Atributos",
            "Raça",
            "Classe",
            "Antecedente",
            "Escolhas",
            "Narrativa",
            "Revisão",
          ].map((label, index) => {
            const item = index + 1;

            return (
              <button
                type="button"
                key={label}
                className={`dnd-step ${step === item ? "active" : ""}`}
                onClick={() => setStep(item)}
              >
                {item}. {label}
              </button>
            );
          })}
        </div>

        {step === 1 && (
          <section className="dnd-choice-grid">
            <label>
              Nome
              <input
                value={form.nome_personagem}
                onChange={(event) =>
                  setField("nome_personagem", event.target.value)
                }
                placeholder="Erehiel"
                required
              />
            </label>

            <label>
              Alinhamento
              <select
                value={form.alinhamento}
                onChange={(event) =>
                  setField("alinhamento", event.target.value)
                }
              >
                {ALIGNMENTS.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Raça
              <select
                value={form.raca}
                onChange={(event) => setField("raca", event.target.value)}
                required
              >
                <option value="">Selecione</option>
                {Object.entries(rules.races || {}).map(([key, race]) => (
                  <option key={key} value={key}>
                    {race.label}
                  </option>
                ))}
              </select>
            </label>

            {selectedRace?.requiresSubrace && (
              <label>
                Sub-raça
                <select
                  value={form.subraca}
                  onChange={(event) => setField("subraca", event.target.value)}
                  required
                >
                  <option value="">Selecione</option>
                  {Object.entries(selectedRace.subraces || {}).map(
                    ([key, subrace]) => (
                      <option key={key} value={key}>
                        {subrace.label}
                      </option>
                    ),
                  )}
                </select>
              </label>
            )}

            <label>
              Classe
              <select
                value={form.classe}
                onChange={(event) => setField("classe", event.target.value)}
                required
              >
                <option value="">Selecione</option>
                {Object.entries(rules.classes || {}).map(([key, classData]) => (
                  <option key={key} value={key}>
                    {classData.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Antecedente
              <select
                value={form.antecedente_id}
                onChange={(event) =>
                  setField("antecedente_id", event.target.value)
                }
                required
              >
                <option value="">Selecione</option>
                {backgrounds.map((background) => (
                  <option key={background.value} value={background.value}>
                    {background.label}
                  </option>
                ))}
              </select>
            </label>
          </section>
        )}

        {step === 2 && (
          <section>
            <div className="attributes-header">
              <div>
                <span className="eyebrow">Point Buy</span>
                <h2>Distribua exatamente 27 pontos</h2>
                <p>Valores base entre 8 e 15 antes dos bônus raciais.</p>
              </div>

              <div
                className={
                  remainingPoints === 0 ? "points-badge ok" : "points-badge"
                }
              >
                <Sparkles size={17} />
                {remainingPoints >= 0
                  ? `${remainingPoints} restantes`
                  : `${Math.abs(remainingPoints)} acima`}
              </div>
            </div>

            <div className="attribute-card-grid">
              {ATTRIBUTE_KEYS.map((key) => (
                <article className="attribute-card" key={key}>
                  <div className="attribute-card-top">
                    <div>
                      <span>{key.toUpperCase()}</span>
                      <strong>{ATTRIBUTE_LABELS[key]}</strong>
                    </div>

                    <em>Custo {POINT_COST[form.atributos_base[key]]}</em>
                  </div>

                  <div className="attribute-score-row">
                    <button
                      type="button"
                      className="attribute-step"
                      onClick={() => changeAttribute(key, -1)}
                    >
                      <Minus size={16} />
                    </button>

                    <div className="attribute-score">
                      <strong>
                        {String(form.atributos_base[key]).padStart(2, "0")}
                      </strong>
                      <span>mod {getModifier(form.atributos_base[key])}</span>
                    </div>

                    <button
                      type="button"
                      className="attribute-step"
                      onClick={() => changeAttribute(key, 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="dnd-choice-grid">
            <article className="dnd-choice-card">
              <h3>{selectedRace?.label || "Raça"}</h3>
              <p>Sub-raça: {selectedSubrace?.label || "Não aplicável"}.</p>
              <p>
                Bônus racial fixo aplicado pelo backend. Nada de escolher bônus
                livremente, exceto regras específicas como Meio-elfo.
              </p>
              <p>
                Traços:{" "}
                {[
                  ...(selectedRace?.traits || []),
                  ...(selectedSubrace?.traits || []),
                ].join(", ") || "-"}
              </p>
            </article>

            {form.raca === "meio-elfo" && (
              <>
                <article className="dnd-choice-card">
                  <h3>Bônus de habilidade do Meio-elfo</h3>
                  <p>
                    Escolha 2 atributos diferentes, exceto Carisma, para receber
                    +1.
                  </p>

                  <div className="checkbox-list">
                    {ATTRIBUTE_KEYS.filter((key) => key !== "car").map(
                      (key) => (
                        <label key={key}>
                          <input
                            type="checkbox"
                            checked={form.escolhas_raciais.abilityBonuses.includes(
                              key,
                            )}
                            onChange={() =>
                              toggleRaceChoice("abilityBonuses", key, 2)
                            }
                          />
                          <span>{ATTRIBUTE_LABELS[key]}</span>
                        </label>
                      ),
                    )}
                  </div>
                </article>

                <article className="dnd-choice-card">
                  <h3>Versatilidade em Perícias</h3>
                  <p>Escolha 2 perícias.</p>

                  <div className="checkbox-list">
                    {Object.entries(SKILL_LABELS).map(([key, label]) => (
                      <label key={key}>
                        <input
                          type="checkbox"
                          checked={form.escolhas_raciais.skills.includes(key)}
                          onChange={() => toggleRaceChoice("skills", key, 2)}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </article>
              </>
            )}

            {raceRequiredChoices.ancestralidade_draconica && (
              <article className="dnd-choice-card">
                <h3>Ancestralidade Dracônica</h3>

                <div className="checkbox-list">
                  {raceRequiredChoices.ancestralidade_draconica.options.map(
                    (option) => (
                      <label key={option}>
                        <input
                          type="checkbox"
                          checked={form.escolhas_raciais.ancestralidade_draconica.includes(
                            option,
                          )}
                          onChange={() =>
                            toggleRaceChoice(
                              "ancestralidade_draconica",
                              option,
                              1,
                            )
                          }
                        />
                        <span>{option}</span>
                      </label>
                    ),
                  )}
                </div>
              </article>
            )}
          </section>
        )}

        {step === 4 && (
          <section className="dnd-choice-grid">
            <article className="dnd-choice-card">
              <h3>{selectedClass?.label || "Classe"}</h3>
              <p>Dado de vida: d{selectedClass?.hitDie || "-"}</p>
              <p>
                Salvaguardas:{" "}
                {(selectedClass?.savingThrows || []).join(", ") || "-"}
              </p>
              <p>
                Habilidades nível 1:{" "}
                {(selectedClass?.level1Features || []).join(", ") || "-"}
              </p>
            </article>

            <article className="dnd-choice-card">
              <h3>Perícias da classe</h3>
              <p>
                {selectedClass?.label || "Classe"} escolhe {classSkillChoose}{" "}
                perícia(s).
              </p>

              <div className="checkbox-list">
                {classSkills.map((skill) => (
                  <label key={skill}>
                    <input
                      type="checkbox"
                      checked={form.escolhas_classe.pericias.includes(skill)}
                      onChange={() => toggleClassSkill(skill)}
                    />
                    <span>{SKILL_LABELS[skill] || skill}</span>
                  </label>
                ))}
              </div>
            </article>
          </section>
        )}

        {step === 5 && (
          <section className="dnd-choice-grid">
            <article className="dnd-choice-card">
              <h3>{selectedBackground?.label || "Antecedente"}</h3>
              <p>
                As proficiências, equipamentos e característica do antecedente
                serão aplicados pelo backend.
              </p>
              <p>
                Idiomas à escolha precisam ser definidos antes da ficha ser
                selada.
              </p>
            </article>

            {backgroundLanguageChoiceCount > 0 && (
              <article className="dnd-choice-card">
                <h3>Idiomas do antecedente</h3>
                <p>Escolha {backgroundLanguageChoiceCount} idioma(s).</p>

                <div className="checkbox-list">
                  {languageOptions.map((language) => (
                    <label key={language}>
                      <input
                        type="checkbox"
                        checked={form.escolhas_antecedente.idiomas.includes(
                          language,
                        )}
                        onChange={() => toggleBackgroundLanguage(language)}
                      />
                      <span>{language}</span>
                    </label>
                  ))}
                </div>
              </article>
            )}
          </section>
        )}

        {step === 6 && (
          <section className="dnd-choice-grid">
            {needsSimpleWeapon && (
              <label>
                Arma simples inicial
                <select
                  value={form.escolhas_equipamento.arma_simples}
                  onChange={(event) =>
                    setEquipmentField("arma_simples", event.target.value)
                  }
                  required
                >
                  <option value="">Selecione</option>
                  {simpleWeaponOptions.map((weapon) => (
                    <option key={weapon} value={weapon}>
                      {weapon}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {Object.entries(requiredChoices).length === 0 ? (
              <article className="dnd-choice-card">
                <h3>Nenhuma escolha adicional</h3>
                <p>
                  Esta classe não exige escolhas extras no nível 1 além das
                  perícias.
                </p>
              </article>
            ) : (
              Object.entries(requiredChoices).map(([choiceKey, config]) => {
                if (config.from && !config.options) {
                  return (
                    <article className="dnd-choice-card" key={choiceKey}>
                      <h3>{config.label}</h3>
                      <p>
                        Esta escolha depende das proficiências finais e será
                        validada pelo backend.
                      </p>
                    </article>
                  );
                }

                return (
                  <article className="dnd-choice-card" key={choiceKey}>
                    <h3>{config.label}</h3>
                    <p>Escolha {config.choose} opção/opções.</p>

                    <div className="checkbox-list">
                      {(config.options || []).map((option) => (
                        <label key={option}>
                          <input
                            type="checkbox"
                            checked={(
                              form.escolhas_classe[choiceKey] || []
                            ).includes(option)}
                            onChange={() =>
                              toggleClassChoice(
                                choiceKey,
                                option,
                                config.choose,
                              )
                            }
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </article>
                );
              })
            )}
          </section>
        )}

        {step === 7 && (
          <section className="dnd-choice-grid">
            <label>
              Traço de personalidade
              <input
                value={form.escolhas_narrativas.personalidade}
                onChange={(event) =>
                  setNarrativeField("personalidade", event.target.value)
                }
                placeholder="Curioso e analítico"
                required
              />
            </label>

            <label>
              Ideal
              <input
                value={form.escolhas_narrativas.ideal}
                onChange={(event) =>
                  setNarrativeField("ideal", event.target.value)
                }
                placeholder="Conhecimento"
                required
              />
            </label>

            <label>
              Vínculo
              <input
                value={form.escolhas_narrativas.vinculo}
                onChange={(event) =>
                  setNarrativeField("vinculo", event.target.value)
                }
                placeholder="A busca pela verdade"
                required
              />
            </label>

            <label>
              Defeito
              <input
                value={form.escolhas_narrativas.defeito}
                onChange={(event) =>
                  setNarrativeField("defeito", event.target.value)
                }
                placeholder="Excessivamente crítico"
                required
              />
            </label>
          </section>
        )}

        {step === 8 && (
          <section className="review-grid">
            <article className="dnd-choice-card">
              <h3>Resumo</h3>
              <p>
                <strong>Nome:</strong> {form.nome_personagem || "-"}
              </p>
              <p>
                <strong>Raça:</strong> {selectedRace?.label || "-"}
              </p>
              <p>
                <strong>Sub-raça:</strong> {selectedSubrace?.label || "-"}
              </p>
              <p>
                <strong>Classe:</strong> {selectedClass?.label || "-"}
              </p>
              <p>
                <strong>Antecedente:</strong> {selectedBackground?.label || "-"}
              </p>
              <p>
                <strong>Pontos restantes:</strong> {remainingPoints}
              </p>
            </article>

            <article className="dnd-choice-card">
              <h3>Confirmação</h3>
              <p>A ficha será criada uma única vez e ficará selada.</p>

              <label className="seal-confirmation">
                <input
                  type="checkbox"
                  checked={acceptedSeal}
                  onChange={(event) => setAcceptedSeal(event.target.checked)}
                />
                Entendo que a ficha base segue D&D 5e 2014 e não poderá ser
                alterada depois.
              </label>
            </article>
          </section>
        )}

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            className="ghost-button"
            onClick={() => setStep(Math.max(1, step - 1))}
          >
            Voltar
          </button>

          {step < 8 ? (
            <button type="button" className="primary-button" onClick={goNext}>
              Próximo
            </button>
          ) : (
            <button
              className="primary-button"
              disabled={saving || remainingPoints !== 0 || !acceptedSeal}
            >
              <Save size={18} />
              {saving ? "Selando..." : "Criar ficha fiel à 5e"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
