import type { Especialidad } from '../types'
import { crearServicio } from './crud'

export const especialidadesService = crearServicio<Especialidad, Omit<Especialidad, 'id'>>(
  '/especialidades',
)
