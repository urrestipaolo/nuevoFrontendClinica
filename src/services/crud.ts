import { api } from '../lib/axios'

// Acepta [..] directo o envuelto ({ data: [..] }, { pacientes: [..] }, etc.)
function extraerLista<T>(cuerpo: unknown, ruta: string): T[] {
  if (Array.isArray(cuerpo)) return cuerpo as T[]
  if (cuerpo && typeof cuerpo === 'object') {
    const lista = Object.values(cuerpo).find(Array.isArray)
    if (lista) return lista as T[]
  }
  throw new Error(
    `La respuesta de ${ruta} no contiene una lista. Revisa su formato en la pestaña Network del navegador.`,
  )
}

// Un solo molde para todos los recursos: si tu backend cambia (PUT -> PATCH, prefijo, etc.), se corrige aquí.
export function crearServicio<T, TInput>(ruta: string) {
  return {
    listar: async (params?: Record<string, string | number>) => {
      const respuesta = await api.get<unknown>(ruta, { params })
      return extraerLista<T>(respuesta.data, ruta)
    },

    obtener: async (id: number) => (await api.get<T>(`${ruta}/${id}`)).data,

    crear: async (datos: TInput) => (await api.post<T>(ruta, datos)).data,

    actualizar: async (id: number, datos: Partial<T>) =>
      (await api.put<T>(`${ruta}/${id}`, datos)).data,

    eliminar: async (id: number) => {
      await api.delete(`${ruta}/${id}`)
    },
  }
}
