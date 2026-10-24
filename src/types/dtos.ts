import type { Cita, Especialidad, Medico, Paciente } from './index'

//Pacientes
export type CrearPacienteDTO = Omit<Paciente, 'id'>
export type ActualizarPacienteDTO = Partial<Omit<Paciente, 'id'>>
export type ResumenPaciente = Pick<Paciente, 'id' | 'nombre' | 'apPaterno' | 'apMaterno' | 'email'>

//Médicos
export type CrearMedicoDTO = Omit<Medico, 'id' | 'especialidad'>
export type ActualizarMedicoDTO = Partial<Omit<Medico, 'id' | 'especialidad'>>
export type ResumenMedico = Pick<Medico, 'id' | 'medico'>

//Citas
export type CrearCitaDTO = Pick<Cita, 'pacienteId' | 'medicoId' | 'fecha'>
export type ActualizarCitaDTO = Partial<Omit<Cita, 'id'>>
export type CambiarEstadoCitaDTO = Pick<Cita, 'estado'>

//Especialidades
export type CrearEspecialidadDTO = Omit<Especialidad, 'id'>
export type ActualizarEspecialidadDTO = Partial<Omit<Especialidad, 'id'>>