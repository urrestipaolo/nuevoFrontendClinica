import type { Paciente } from '../types'

export const nombreCompleto = (p: Pick<Paciente, 'nombre' | 'apPaterno' | 'apMaterno'>) =>
  `${p.nombre} ${p.apPaterno} ${p.apMaterno}`.trim()

export const formatearFecha = (iso: string) =>
  new Date(iso).toLocaleDateString('es-PE', { timeZone: 'UTC' })

export const formatearFechaHora = (iso: string) =>
  new Date(iso).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })