export function getId(item) { return item?._id || item?.id; }
export function formatDate(date) { if (!date) return "-"; return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(date)); }
export function formatDateTime(date) { if (!date) return "-"; return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(date)); }
export function normalizeArray(data, ...keys) { if (Array.isArray(data)) return data; for (const key of keys) if (Array.isArray(data?.[key])) return data[key]; if (Array.isArray(data?.data)) return data.data; return []; }
