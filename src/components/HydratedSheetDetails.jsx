import {
  Backpack,
  BookOpen,
  Hammer,
  ScrollText,
  Shield,
  Sparkles,
  Sword,
} from "lucide-react";

import { prettifyKey, toReadableLines } from "../utils/renderValue";

function normalizeProficiencies(proficiencias) {
  if (!proficiencias) return [];

  if (Array.isArray(proficiencias)) return toReadableLines(proficiencias);

  const labels = {
    armas: "Armas",
    armaduras: "Armaduras",
    ferramentas: "Ferramentas",
    idiomas: "Idiomas",
    pericias: "Perícias",
  };

  return Object.entries(proficiencias).flatMap(([key, value]) =>
    toReadableLines(value).map((item) => `${labels[key] || prettifyKey(key)}: ${item}`)
  );
}

function SheetSection({ icon, title, items, emptyText = "Nada registrado." }) {
  const normalizedItems = Array.isArray(items) ? items : toReadableLines(items);

  return (
    <article className="hydrated-section-card">
      <div className="hydrated-section-header">
        <div className="hydrated-section-icon">{icon}</div>

        <div>
          <span className="eyebrow">Origem</span>
          <h3>{title}</h3>
        </div>
      </div>

      {normalizedItems.length === 0 ? (
        <p className="hydrated-empty">{emptyText}</p>
      ) : (
        <ul className="hydrated-list">
          {normalizedItems.map((item, index) => (
            <li key={`${title}-${index}`}>{String(item)}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default function HydratedSheetDetails({ character }) {
  const proficiencias = normalizeProficiencies(character?.proficiencias);
  const salvaguardas = toReadableLines(character?.salvaguardas?.proficientes);
  const pericias = toReadableLines(character?.pericias?.proficientes);
  const habilidades = toReadableLines(character?.habilidades);
  const equipamento = toReadableLines(character?.equipamento);
  const mochila = toReadableLines(character?.mochila);
  const caracteristicas = toReadableLines(character?.caracteristicas);
  const talentos = toReadableLines(character?.talento);

  const hasAnyDetails =
    proficiencias.length ||
    salvaguardas.length ||
    pericias.length ||
    habilidades.length ||
    equipamento.length ||
    mochila.length ||
    caracteristicas.length ||
    talentos.length;

  return (
    <section className="panel hydrated-sheet-panel">
      <div className="attributes-header">
        <div>
          <span className="eyebrow">Detalhes 5e 2014</span>
          <h2>Dados derivados da regra</h2>
          <p>
            Estes campos são montados pelo backend a partir da raça, classe,
            antecedente e escolhas obrigatórias da criação.
          </p>
        </div>

        <div className={hasAnyDetails ? "points-badge ok" : "points-badge"}>
          <Sparkles size={17} />
          {hasAnyDetails ? "Fiel à 5e" : "Vazia"}
        </div>
      </div>

      <div className="hydrated-section-grid">
        <SheetSection
          title="Proficiências"
          icon={<ScrollText size={20} />}
          items={proficiencias}
        />

        <SheetSection
          title="Salvaguardas"
          icon={<Shield size={20} />}
          items={salvaguardas}
        />

        <SheetSection title="Perícias escolhidas" icon={<Sword size={20} />} items={pericias} />

        <SheetSection title="Habilidades" icon={<Sparkles size={20} />} items={habilidades} />

        <SheetSection title="Equipamento inicial" icon={<Hammer size={20} />} items={equipamento} />

        <SheetSection
          title="Mochila"
          icon={<Backpack size={20} />}
          items={mochila}
          emptyText="Vazia. Itens conquistados entram aqui."
        />

        <SheetSection title="Características" icon={<BookOpen size={20} />} items={caracteristicas} />

        <SheetSection title="Talentos" icon={<Sparkles size={20} />} items={talentos} />
      </div>
    </section>
  );
}
