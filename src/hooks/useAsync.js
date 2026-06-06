import { useCallback, useEffect, useState } from "react";
export function useAsync(asyncFunction, deps = [], options = {}) {
  const { immediate = true } = options;
  const [data, setData] = useState(options.initialData ?? null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState("");
  const execute = useCallback(async (...args) => {
    setLoading(true); setError("");
    try { const result = await asyncFunction(...args); setData(result); return result; }
    catch (err) { const message = err.response?.data?.message || err.response?.data?.error || err.message || "Erro inesperado."; setError(message); throw err; }
    finally { setLoading(false); }
  }, deps);
  useEffect(() => { if (immediate) execute(); }, [execute, immediate]);
  return { data, setData, loading, error, execute };
}
