import type { Paciente, PacienteInput } from '../types'
import { crearServicio } from './crud'

export const pacientesService = crearServicio<Paciente, PacienteInput>('/pacientes')
