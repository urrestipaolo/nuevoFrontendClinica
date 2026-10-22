import type { ReactNode } from 'react'

interface Props {
  titulo: string
  onCerrar: () => void
  children: ReactNode
}

export default function Modal({ titulo, onCerrar, children }: Props) {
  return (
    <div className="overlay" onClick={onCerrar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{titulo}</h2>
        {children}
      </div>
    </div>
  )
}