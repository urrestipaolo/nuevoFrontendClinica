import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage } from '../lib/axios'

// Carga datos al montar y expone loading / error / recargar.
// `fetcher` debe ser estable (una función de un service o declarada fuera del componente).
export function useFetch<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const recargar = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setData(await fetcher())
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [fetcher])

  useEffect(() => {
    void recargar()
  }, [recargar])

  return { data, loading, error, recargar }
}