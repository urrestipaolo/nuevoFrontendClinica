import type { Medico, MedicoInput } from '../types'
import { crearServicio } from './crud'

export const medicosService = crearServicio<Medico, MedicoInput>('/medicos')