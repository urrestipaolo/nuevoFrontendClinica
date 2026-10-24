import { useCallback, useEffect, useRef, useState } from 'react'
import { extraerMensajeError } from '../lib/errorHandler'

export function useApi<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const montado = useRef(false)

  const recargar = useCallback(async () => {
    setCargando(true)
    setError(null)

    try {
      const resultado = await fetcher()

      if (montado.current) {
        setData(resultado)
      }
    } catch (err: unknown) {
      if (montado.current) {
        setError(extraerMensajeError(err))
      }
    } finally {
      if (montado.current) {
        setCargando(false)
      }
    }
  }, [fetcher])

  useEffect(() => {
    montado.current = true

    void recargar()

    return () => {
      montado.current = false
    }
  }, [recargar])

  return { data, cargando, error, recargar }
}