export function formatValue(value, fallback = "-") {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}

export function titleCase(value, fallback = "-") {
  if (value === null || value === undefined || value === "") return fallback;

  return String(value)
    .replaceAll("_", " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      if (word.length <= 2) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

export function formatAlignment(value) {
  const map = {
    caotico_neutro: "Caótico e Neutro",
    caotico_bom: "Caótico e Bom",
    caotico_mau: "Caótico e Mau",
    neutro: "Neutro",
    neutro_bom: "Neutro e Bom",
    neutro_mau: "Neutro e Mau",
    leal_bom: "Leal e Bom",
    leal_neutro: "Leal e Neutro",
    leal_mau: "Leal e Mau",
  };

  return map[value] || titleCase(value);
}

export function getBackgroundName(character) {
  const antecedente = character?.antecedente;

  if (antecedente && typeof antecedente === "object") {
    return (
      antecedente.nome ||
      antecedente.tipo ||
      antecedente.name ||
      antecedente.title ||
      "-"
    );
  }

  return (
    character?.antecedente_nome ||
    character?.background?.nome ||
    character?.background?.name ||
    character?.backgroundName ||
    "-"
  );
}
