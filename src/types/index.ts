export interface Especialidad {
  id: number
  nombre: string
}

export interface Paciente {
  id: number
  nombre: string
  apPaterno: string
  apMaterno: string
  telefono: string
  email: string | null
  fechaNacimiento: string // ISO
}
export type PacienteInput = Omit<Paciente, 'id'>

export interface Medico {
  id: number
  medico: string // nombre del médico
  especialidadId: number
  especialidad?: Especialidad // solo si el backend hace include
}
export type MedicoInput = Pick<Medico, 'medico' | 'especialidadId'>

export type EstadoCita = 'pendiente' | 'completada' | 'cancelada'

export interface Cita {
  id: number
  pacienteId: number
  medicoId: number
  fecha: string // ISO
  estado: EstadoCita
}
export type CitaInput = Pick<Cita, 'pacienteId' | 'medicoId' | 'fecha'>
