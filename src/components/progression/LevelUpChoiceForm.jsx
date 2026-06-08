import { useMemo } from "react";
import { Sparkles } from "lucide-react";

import "../../styles/progression-choices.css";

const ABILITIES = [
  ["for", "Força"],
  ["des", "Destreza"],
  ["con", "Constituição"],
  ["int", "Inteligência"],
  ["sab", "Sabedoria"],
  ["car", "Carisma"],
];

export default function LevelUpChoiceForm({
  status,
  options,
  choices,
  onChange,
}) {
  const pending = status?.pending_choices || [];

  const spellOptions = options?.spellcasting?.spells || [];
  const cantripOptions = useMemo(
    () => spellOptions.filter((spell) => Number(spell.nivel) === 0),
    [spellOptions],
  );
  const leveledSpellOptions = useMemo(
    () => spellOptions.filter((spell) => Number(spell.nivel) > 0),
    [spellOptions],
  );

  function updateChoice(key, value) {
    onChange({
      ...choices,
      [key]: value,
    });
  }

  function updateAsi(attribute, value) {
    const increments = {
      ...(choices.asi?.increments || {}),
      [attribute]: Number(value || 0),
    };

    Object.keys(increments).forEach((key) => {
      if (!increments[key]) delete increments[key];
    });

    updateChoice("asi", { increments });
  }

  function toggleArrayChoice(group, value, checked) {
    const current = choices[group] || [];
    const next = checked
      ? Array.from(new Set([...current, value]))
      : current.filter((item) => item !== value);

    updateChoice(group, next);
  }

  function toggleSpell(group, value, checked) {
    const current = choices.magias || {};
    const currentGroup = current[group] || [];
    const nextGroup = checked
      ? Array.from(new Set([...currentGroup, value]))
      : currentGroup.filter((item) => item !== value);

    updateChoice("magias", {
      ...current,
      [group]: nextGroup,
    });
  }

  if (!pending.length && !options?.spellcasting?.is_spellcaster) {
    return null;
  }

  return (
    <section className="level-up-choice-form">
      <div className="choice-form-heading">
        <div>
          <span className="eyebrow">Escolhas reais</span>
          <h2>Defina como seu personagem evolui</h2>
        </div>
        <Sparkles size={24} />
      </div>

      {pending.includes("subclasse") && (
        <article className="choice-block">
          <h3>Subclasse</h3>
          <p>Escolha o caminho que vai definir sua identidade de classe.</p>

          <div className="choice-option-grid">
            {(options?.subclasses || []).map((subclass) => (
              <label key={subclass.slug} className="choice-radio-card">
                <input
                  type="radio"
                  name="subclasse"
                  checked={choices.subclasse === subclass.slug}
                  onChange={() => updateChoice("subclasse", subclass.slug)}
                />
                <strong>{subclass.nome}</strong>
                <span>Nível {subclass.nivel}</span>
              </label>
            ))}
          </div>
        </article>
      )}

      {pending.includes("estilo_luta") && (
        <article className="choice-block">
          <h3>Estilo de luta</h3>
          <p>Escolha sua especialização de combate.</p>

          <div className="choice-option-grid">
            {(options?.fighting_styles || []).map((style) => (
              <label key={style.slug} className="choice-radio-card">
                <input
                  type="radio"
                  name="estilo_luta"
                  checked={choices.estilo_luta === style.slug}
                  onChange={() => updateChoice("estilo_luta", style.slug)}
                />
                <strong>{style.nome}</strong>
              </label>
            ))}
          </div>
        </article>
      )}

      {pending.includes("invocacoes") && (
        <article className="choice-block">
          <h3>Invocações Místicas</h3>
          <p>
            Escolha invocações para seu bruxo. Necessárias:{" "}
            {options?.invocations_required_count || 0}.
          </p>

          <div className="choice-option-grid">
            {(options?.invocations || []).map((invocation) => (
              <label key={invocation.slug} className="choice-radio-card">
                <input
                  type="checkbox"
                  checked={(choices.invocacoes || []).includes(invocation.slug)}
                  onChange={(event) =>
                    toggleArrayChoice("invocacoes", invocation.slug, event.target.checked)
                  }
                />
                <strong>{invocation.nome}</strong>
                <span>{invocation.requisito}</span>
              </label>
            ))}
          </div>
        </article>
      )}

      {pending.includes("asi") && (
        <article className="choice-block">
          <h3>Incremento de atributo</h3>
          <p>Distribua até 2 pontos. Use +2 em um atributo ou +1 em dois atributos.</p>

          <div className="asi-grid">
            {ABILITIES.map(([key, label]) => (
              <label key={key}>
                {label}
                <select
                  value={choices.asi?.increments?.[key] || 0}
                  onChange={(event) => updateAsi(key, event.target.value)}
                >
                  <option value={0}>+0</option>
                  <option value={1}>+1</option>
                  <option value={2}>+2</option>
                </select>
              </label>
            ))}
          </div>
        </article>
      )}

      {options?.spellcasting?.is_spellcaster && (
        <article className="choice-block">
          <h3>Magias</h3>
          <p>
            Estrutura inicial de grimório. Slots atuais:{" "}
            {JSON.stringify(options.spellcasting.slots || {})}
          </p>

          {cantripOptions.length > 0 && (
            <>
              <h4>Truques</h4>
              <div className="choice-option-grid">
                {cantripOptions.map((spell) => (
                  <label key={spell.slug} className="choice-radio-card">
                    <input
                      type="checkbox"
                      checked={(choices.magias?.truques || []).includes(spell.slug)}
                      onChange={(event) =>
                        toggleSpell("truques", spell.slug, event.target.checked)
                      }
                    />
                    <strong>{spell.nome}</strong>
                    <span>{spell.escola}</span>
                  </label>
                ))}
              </div>
            </>
          )}

          {leveledSpellOptions.length > 0 && (
            <>
              <h4>Magias de nível 1+</h4>
              <div className="choice-option-grid">
                {leveledSpellOptions.map((spell) => (
                  <label key={spell.slug} className="choice-radio-card">
                    <input
                      type="checkbox"
                      checked={(choices.magias?.conhecidas || []).includes(spell.slug)}
                      onChange={(event) =>
                        toggleSpell("conhecidas", spell.slug, event.target.checked)
                      }
                    />
                    <strong>{spell.nome}</strong>
                    <span>Nível {spell.nivel} · {spell.escola}</span>
                  </label>
                ))}
              </div>
            </>
          )}
        </article>
      )}
    </section>
  );
}
