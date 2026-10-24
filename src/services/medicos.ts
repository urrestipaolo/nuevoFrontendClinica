import type { Medico } from '../types'
import type { ActualizarMedicoDTO, CrearMedicoDTO } from '../types/dtos'
import { crearServicio } from './crud'

export const medicosService = crearServicio<Medico, CrearMedicoDTO, ActualizarMedicoDTO>('/medicos')