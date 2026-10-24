import axios from 'axios'

interface ErrorDelBackend {
  message?: string | string[]
  error?: string
}

export function extraerMensajeError(err: unknown): string {
  if (axios.isAxiosError<ErrorDelBackend>(err)) {
    if (!err.response) return 'No se pudo conectar con el servidor'

    const { message, error } = err.response.data ?? {}
    if (Array.isArray(message)) return message.join(', ')
    return message ?? error ?? `Error del servidor (${err.response.status})`
  }
  if (err instanceof Error) return err.message
  return 'Error inesperado'
}