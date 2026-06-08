import "../../styles/library.css";

export default function CampaignFilters({ filters, onChange, onClear }) {
  function handleChange(event) {
    const { name, value } = event.target;

    onChange({
      ...filters,
      [name]: value,
    });
  }

  return (
    <section className="campaign-filters">
      <label>
        Buscar
        <input
          name="search"
          value={filters.search || ""}
          onChange={handleChange}
          placeholder="Sino, vampiro, cidade..."
        />
      </label>

      <label>
        Tema
        <input
          name="theme"
          value={filters.theme || ""}
          onChange={handleChange}
          placeholder="Fantasia sombria"
        />
      </label>

      <label>
        Tag
        <input
          name="tag"
          value={filters.tag || ""}
          onChange={handleChange}
          placeholder="solo"
        />
      </label>

      <label>
        Origem
        <select name="official" value={filters.official || ""} onChange={handleChange}>
          <option value="">Todas</option>
          <option value="true">Oficiais</option>
          <option value="false">Comunidade</option>
        </select>
      </label>

      <button className="ghost-button" type="button" onClick={onClear}>
        Limpar filtros
      </button>
    </section>
  );
}
