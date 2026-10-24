import { useCallback, useEffect, useState } from 'react'
import { extraerMensajeError } from '../lib/errorHandler'

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
      setError(extraerMensajeError(e))
    } finally {
      setLoading(false)
    }
  }, [fetcher])

  useEffect(() => {
    void recargar()
  }, [recargar])

  return { data, loading, error, recargar }
}