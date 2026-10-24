import type { Cita, EstadoCita } from '../types'
import type { ActualizarCitaDTO, CambiarEstadoCitaDTO, CrearCitaDTO } from '../types/dtos'
import { crearServicio } from './crud'

const base = crearServicio<Cita, CrearCitaDTO, ActualizarCitaDTO>('/citas')

export const citasService = {
  ...base,
  cambiarEstado: (id: number, estado: EstadoCita) => {
    const cambio: CambiarEstadoCitaDTO = { estado }
    return base.actualizar(id, cambio)
  },
}