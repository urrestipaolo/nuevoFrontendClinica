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
  fechaNacimiento: string
}

export interface Medico {
  id: number
  medico: string
  especialidadId: number
  especialidad?: Especialidad
}

export type EstadoCita = 'pendiente' | 'completada' | 'cancelada'

export interface Cita {
  id: number
  pacienteId: number
  medicoId: number
  fecha: string // ISO
  estado: EstadoCita
}
