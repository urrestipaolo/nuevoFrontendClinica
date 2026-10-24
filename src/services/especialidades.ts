import type { Especialidad } from '../types'
import type { ActualizarEspecialidadDTO, CrearEspecialidadDTO } from '../types/dtos'
import { crearServicio } from './crud'

export const especialidadesService = crearServicio<
  Especialidad,
  CrearEspecialidadDTO,
  ActualizarEspecialidadDTO
>('/especialidades')
