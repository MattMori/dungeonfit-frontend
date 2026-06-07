export function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function prettifyKey(key) {
  return String(key)
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (char) => char.toUpperCase());
}

export function getDisplayValue(value, fallback = "-") {
  if (value === null || value === undefined || value === "") return fallback;

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (Array.isArray(value)) {
    const result = value.map((item) => getDisplayValue(item, "")).filter(Boolean).join(", ");
    return result || fallback;
  }

  if (isPlainObject(value)) {
    return (
      value.nome ||
      value.name ||
      value.label ||
      value.tipo ||
      value.type ||
      value.titulo ||
      value.title ||
      value._id ||
      value.id ||
      fallback
    );
  }

  return fallback;
}

export function toReadableLines(value, prefix = "") {
  if (value === null || value === undefined || value === "") return [];

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return [String(value)];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => toReadableLines(item, prefix));
  }

  if (isPlainObject(value)) {
    return Object.entries(value).flatMap(([key, item]) => {
      const label = prefix ? `${prefix} · ${prettifyKey(key)}` : prettifyKey(key);

      if (
        typeof item === "string" ||
        typeof item === "number" ||
        typeof item === "boolean"
      ) {
        return [`${label}: ${item}`];
      }

      if (Array.isArray(item)) {
        return item.flatMap((arrayItem) => {
          if (
            typeof arrayItem === "string" ||
            typeof arrayItem === "number" ||
            typeof arrayItem === "boolean"
          ) {
            return `${label}: ${arrayItem}`;
          }

          return toReadableLines(arrayItem, label);
        });
      }

      if (isPlainObject(item)) return toReadableLines(item, label);

      return [];
    });
  }

  return [];
}

export function getOptionLabel(options = [], value, fallback = "-") {
  if (value === null || value === undefined || value === "") return fallback;

  const lookupValue = isPlainObject(value)
    ? value._id || value.id || value.value || value.nome || value.name || value.tipo
    : value;

  const found = options.find((option) => {
    const optionValue = option.value || option._id || option.id;
    return String(optionValue) === String(lookupValue);
  });

  return found?.label || getDisplayValue(value, fallback);
}
