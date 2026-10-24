import { api } from '../lib/axios'
import type { CitasPorEspecialidad } from '../types/reportes'
import { extraerLista } from './crud'

interface FilaEspecialidad {
  especialidad: unknown
  total: unknown
}

function esFilaEspecialidad(valor: unknown): valor is FilaEspecialidad {
  return (
    typeof valor === 'object' && valor !== null && 'especialidad' in valor && 'total' in valor
  )
}

export const reportesService = {
  citasPorEspecialidad: async (): Promise<CitasPorEspecialidad[]> => {
    const ruta = '/reportes/especialidades'
    const respuesta = await api.get<unknown>(ruta)
    const filas = extraerLista<unknown>(respuesta.data, ruta)
    const validas = filas.filter(esFilaEspecialidad)

    if (filas.length > 0 && validas.length === 0) {
      throw new Error(`La respuesta de ${ruta} debe incluir los campos "especialidad" y "total".`)
    }
    
    return validas.map((f) => ({ especialidad: String(f.especialidad), total: Number(f.total) }))
  },
}