import { api } from '../lib/axios'
import type { RespuestaPaginada } from '../types/api'

export function extraerLista<T>(cuerpo: unknown, ruta: string): T[] {
  if (Array.isArray(cuerpo)) {
    return cuerpo as T[]
  }

  if (cuerpo && typeof cuerpo === 'object') {
    const objeto = cuerpo as Record<string, unknown>

    if (Array.isArray(objeto.data)) {
      return objeto.data as T[]
    }

    const lista = Object.values(objeto).find(Array.isArray)

    if (lista) {
      return lista as T[]
    }
  }

  throw new Error(
    `La respuesta de ${ruta} no contiene una lista. Revisa su formato en Network.`,
  )
}

// T = entidad completa, TCrear = DTO de creación, TActualizar = DTO de actualización
export function crearServicio<T, TCrear, TActualizar = Partial<TCrear>>(ruta: string) {
  return {
    listar: async (params?: Record<string, string | number | undefined>) => {
      const respuesta = await api.get<
        T[] | RespuestaPaginada<T> | Record<string, unknown>
      >(ruta, { params })

      return extraerLista<T>(respuesta.data, ruta)
    },

    obtener: async (id: number) =>
      (await api.get<T>(`${ruta}/${id}`)).data,

    crear: async (datos: TCrear) =>
      (await api.post<T>(ruta, datos)).data,

    actualizar: async (id: number, datos: TActualizar) =>
      (await api.put<T>(`${ruta}/${id}`, datos)).data,

    eliminar: async (id: number) => {
      await api.delete(`${ruta}/${id}`)
    },
  }
}
