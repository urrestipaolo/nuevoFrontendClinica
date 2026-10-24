import type { ReactNode } from 'react'

interface Props {
  cargando: boolean
  error: string | null
  onReintentar: () => void
  children: ReactNode
}

export default function Estado({ cargando, error, onReintentar, children }: Props) {
  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
        <button className="btn btn-sm" onClick={onReintentar}>
          Reintentar
        </button>
      </div>
    )
  }
  if (cargando) return <p className="muted">Cargando…</p>
  return <>{children}</>
}
