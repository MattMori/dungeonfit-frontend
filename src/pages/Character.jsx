import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Lock,
  Minus,
  Plus,
  Save,
  Shield,
  Sparkles,
} from "lucide-react";

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

const FALLBACK_RULES = {
  pointBuy: { total: 27 },
  races: {},
  classes: {},
};

const defaultForm = {
  nome_personagem: "",
  raca: "",
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
    flexibleAbilityBonuses: [],
  },
  escolhas_classe: {
    pericias: [],
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
            {character?.raca} · {character?.classe} · nível{" "}
            {character?.nivel || 1}
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
              <dd>{character?.nome_personagem}</dd>
            </div>
            <div>
              <dt>Raça</dt>
              <dd>{character?.raca}</dd>
            </div>
            <div>
              <dt>Classe</dt>
              <dd>{character?.classe}</dd>
            </div>
            <div>
              <dt>Antecedente</dt>
              <dd>{getDisplayValue(character?.antecedente)}</dd>
            </div>
            <div>
              <dt>Ruleset</dt>
              <dd>{character?.ruleset || "dnd5e-2014"}</dd>
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
                {character?.hp_atual}/{character?.hp_max}
              </dd>
            </div>
            <div>
              <dt>Iniciativa</dt>
              <dd>{getModifier(10 + (character?.iniciativa || 0) * 2)}</dd>
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
                <em>base {character?.atributos_base?.[key]}</em>
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
  const selectedClass = rules.classes?.[form.classe];
  const selectedBackground = backgrounds.find(
    (item) => item.value === form.antecedente_id,
  );
  const classSkills =
    selectedClass?.skillChoices?.from === "any"
      ? Object.keys(SKILL_LABELS)
      : selectedClass?.skillChoices?.from || [];
  const classSkillChoose = selectedClass?.skillChoices?.choose || 0;
  const raceFlex = selectedRace?.flexibleAbilityBonuses;

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
        if (loaded?._id || loaded?.id || loaded?.nome_personagem)
          setCharacter(loaded);
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
      ...(name === "classe" ? { escolhas_classe: { pericias: [] } } : {}),
      ...(name === "raca"
        ? { escolhas_raciais: { flexibleAbilityBonuses: [] } }
        : {}),
    }));
  }

  function changeAttribute(key, delta) {
    setForm((current) => {
      const currentValue = current.atributos_base[key];
      const nextValue = Math.max(8, Math.min(15, currentValue + delta));
      return {
        ...current,
        atributos_base: { ...current.atributos_base, [key]: nextValue },
      };
    });
  }

  function toggleClassSkill(skill) {
    setForm((current) => {
      const selected = current.escolhas_classe.pericias;
      const exists = selected.includes(skill);
      const next = exists
        ? selected.filter((item) => item !== skill)
        : selected.length < classSkillChoose
          ? [...selected, skill]
          : selected;

      return {
        ...current,
        escolhas_classe: { ...current.escolhas_classe, pericias: next },
      };
    });
  }

  function toggleRaceBonus(attribute) {
    setForm((current) => {
      const selected = current.escolhas_raciais.flexibleAbilityBonuses;
      const exists = selected.includes(attribute);
      const limit = raceFlex?.count || 0;
      const next = exists
        ? selected.filter((item) => item !== attribute)
        : selected.length < limit
          ? [...selected, attribute]
          : selected;

      return {
        ...current,
        escolhas_raciais: {
          ...current.escolhas_raciais,
          flexibleAbilityBonuses: next,
        },
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        antecedente: form.antecedente_id,
        antecedente_id: form.antecedente_id,
        antecedente_nome: selectedBackground?.label,
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

  if (loading) return <Loading text="Carregando regras D&D 5e 2014..." />;

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
        description="Fluxo fiel à criação de personagem D&D 5e 2014: identidade, point buy, escolhas obrigatórias e revisão final."
      />

      <ErrorMessage message={error} />

      <form className="panel dnd-builder" onSubmit={handleSubmit}>
        <div className="dnd-stepper">
          {[1, 2, 3, 4].map((item) => (
            <button
              type="button"
              key={item}
              className={`dnd-step ${step === item ? "active" : ""}`}
              onClick={() => setStep(item)}
            >
              Passo {item}
            </button>
          ))}
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
            {raceFlex && (
              <article className="dnd-choice-card">
                <h3>Bônus flexível de raça</h3>
                <p>
                  {selectedRace?.label} escolhe {raceFlex.count} atributos
                  diferentes para receber +{raceFlex.amount}.
                </p>
                <div className="checkbox-list">
                  {ATTRIBUTE_KEYS.filter(
                    (key) => !(raceFlex.exclude || []).includes(key),
                  ).map((key) => (
                    <label key={key}>
                      <input
                        type="checkbox"
                        checked={form.escolhas_raciais.flexibleAbilityBonuses.includes(
                          key,
                        )}
                        onChange={() => toggleRaceBonus(key)}
                      />

                      <span>{ATTRIBUTE_LABELS[key]}</span>
                    </label>
                  ))}
                </div>
              </article>
            )}

            {selectedClass && (
              <article className="dnd-choice-card">
                <h3>Perícias da classe</h3>
                <p>
                  {selectedClass.label} escolhe {classSkillChoose} perícia(s).
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
            )}
          </section>
        )}

        {step === 4 && (
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
                <strong>Classe:</strong> {selectedClass?.label || "-"}
              </p>
              <p>
                <strong>Antecedente:</strong> {selectedBackground?.label || "-"}
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

          {step < 4 ? (
            <button
              type="button"
              className="primary-button"
              onClick={() => setStep(Math.min(4, step + 1))}
            >
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
