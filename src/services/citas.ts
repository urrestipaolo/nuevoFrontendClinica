import type { Cita, CitaInput, EstadoCita } from '../types'
import { crearServicio } from './crud'

const base = crearServicio<Cita, CitaInput>('/citas')

export const citasService = {
  ...base,
  cambiarEstado: (id: number, estado: EstadoCita) => base.actualizar(id, { estado }),
}
