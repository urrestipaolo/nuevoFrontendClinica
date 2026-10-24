import type { Paciente } from '../types'
import type { ActualizarPacienteDTO, CrearPacienteDTO } from '../types/dtos'
import { crearServicio } from './crud'

export const pacientesService = crearServicio<Paciente, CrearPacienteDTO, ActualizarPacienteDTO>(
  '/pacientes',
)
