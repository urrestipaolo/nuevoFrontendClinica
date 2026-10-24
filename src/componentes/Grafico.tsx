import type { ReactNode } from 'react'

interface Props {
  titulo: string
  cargando: boolean
  error: string | null
  vacio: boolean
  mensajeVacio: string
  onReintentar: () => void
  children: ReactNode
}

export default function TarjetaGrafica({
  titulo,
  cargando,
  error,
  vacio,
  mensajeVacio,
  onReintentar,
  children,
}: Props) {
  let contenido: ReactNode

  if (cargando) {
    contenido = (
      <div
        role="status"
        aria-label="Cargando gráfica"
        className="h-[300px] w-full animate-pulse rounded-lg bg-slate-200"
      />
    )
  } else if (error) {
    contenido = (
      <div className="alert alert-error">
        <span>{error}</span>
        <button className="btn btn-sm" onClick={onReintentar}>
          Reintentar
        </button>
      </div>
    )
  } else if (vacio) {
    contenido = <div className="grafica-vacia">{mensajeVacio}</div>
  } else {
    contenido = children
  }

  return (
    <section className="card">
      <h2>{titulo}</h2>
      {contenido}
    </section>
  )
}