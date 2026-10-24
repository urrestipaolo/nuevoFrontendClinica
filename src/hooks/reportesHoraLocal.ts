import type { Cita } from '../types'
import type { CitasPorDia } from '../types/reportes'

const claveDia = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export function citasUltimosDias(citas: Cita[], dias = 7): CitasPorDia[] {
  const conteo = new Map<string, number>()
  for (const cita of citas) {
    const clave = claveDia(new Date(cita.fecha))
    conteo.set(clave, (conteo.get(clave) ?? 0) + 1)
  }

  const hoy = new Date()
  return Array.from({ length: dias }, (_, i) => {
    const dia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - (dias - 1 - i))
    return {
      dia: dia.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' }),
      total: conteo.get(claveDia(dia)) ?? 0,
    }
  })
}