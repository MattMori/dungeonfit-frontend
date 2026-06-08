import { useEffect, useState } from "react";
import { BookOpen, Sparkles } from "lucide-react";

import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

import { getCharacter } from "../services/characterService";
import { listSpells } from "../services/characterOptionsService";

import "../styles/progression-choices.css";

export default function Spellbook() {
  const [character, setCharacter] = useState(null);
  const [spells, setSpells] = useState([]);
  const [filterLevel, setFilterLevel] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSpellbook() {
    setLoading(true);
    setError("");

    try {
      const char = await getCharacter();
      setCharacter(char);

      const knownSlugs = [
        ...(char?.magias?.truques || []),
        ...(char?.magias?.conhecidas || []),
        ...(char?.magias?.preparadas || []),
      ];

      const allSpells = await listSpells({
        classe: char?.classe,
        ...(filterLevel !== "" ? { nivel: filterLevel } : {}),
      });

      setSpells(
        allSpells.map((spell) => ({
          ...spell,
          known: knownSlugs.includes(spell.slug),
        })),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar grimório.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSpellbook();
  }, [filterLevel]);

  return (
    <div>
      <PageHeader
        eyebrow="Grimório"
        title="Magias"
        description="Truques, magias conhecidas e slots da sua ficha."
      />

      <ErrorMessage message={error} />

      {loading ? (
        <Loading text="Abrindo grimório..." />
      ) : !character ? (
        <EmptyState
          title="Ficha não encontrada."
          description="Crie uma ficha para acessar o grimório."
        />
      ) : (
        <>
          <section className="spellbook-summary">
            <div>
              <span className="eyebrow">{character.classe}</span>
              <h2>{character.nome_personagem}</h2>
              <p>Slots: {JSON.stringify(character.magias?.slots || {})}</p>
            </div>

            <BookOpen size={42} />
          </section>

          <div className="filters">
            {[
              ["", "Todas"],
              ["0", "Truques"],
              ["1", "Nível 1"],
              ["2", "Nível 2"],
              ["3", "Nível 3"],
            ].map(([value, label]) => (
              <button
                key={label}
                className={filterLevel === value ? "active" : ""}
                type="button"
                onClick={() => setFilterLevel(value)}
              >
                {label}
              </button>
            ))}
          </div>

          {spells.length === 0 ? (
            <EmptyState
              title="Nenhuma magia encontrada."
              description="Rode o seed de magias ou escolha magias no level up."
            />
          ) : (
            <section className="spell-grid">
              {spells.map((spell) => (
                <article className={`spell-card ${spell.known ? "known" : ""}`} key={spell._id}>
                  <div className="spell-card-topline">
                    <span className="eyebrow">
                      {spell.nivel === 0 ? "Truque" : `Nível ${spell.nivel}`} · {spell.escola}
                    </span>
                    {spell.known && <Sparkles size={18} />}
                  </div>

                  <h3>{spell.nome}</h3>
                  <p>{spell.descricao}</p>

                  <div className="spell-meta-row">
                    <span>{spell.tempo_conjuracao}</span>
                    <span>{spell.alcance}</span>
                    <span>{spell.duracao}</span>
                  </div>
                </article>
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}
