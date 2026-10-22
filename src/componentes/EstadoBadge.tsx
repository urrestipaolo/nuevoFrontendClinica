import type { EstadoCita } from '../types'

export default function EstadoBadge({ estado }: { estado: EstadoCita }) {
  return <span className={`badge badge-${estado}`}>{estado}</span>
}
