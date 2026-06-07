import { useCallback, useEffect, useState } from "react";

function getErrorMessage(err) {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    "Erro inesperado."
  );
}

export function useAsync(asyncFunction, deps = [], options = {}) {
  const { immediate = true, throwOnError = false } = options;

  const [data, setData] = useState(options.initialData ?? null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState("");

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError("");

    try {
      const result = await asyncFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);

      if (throwOnError) {
        throw err;
      }

      return null;
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    data,
    setData,
    loading,
    error,
    execute,
  };
}
