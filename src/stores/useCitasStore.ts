import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { extraerMensajeError } from '../lib/errorHandler'
import { citasService } from '../services/citas'
import type { Cita, EstadoCita } from '../types'
import type { CrearCitaDTO } from '../types/dtos'

interface CitasState {
  citas: Cita[]
  citaSeleccionada: Cita | null
  cargando: boolean
  error: string | null
  cargarTodas: () => Promise<void>
  cargarPorPaciente: (pacienteId: number) => Promise<void>
  seleccionar: (id: number) => void
  actualizarEstado: (id: number, estado: EstadoCita) => Promise<void>
  agregarCita: (datos: CrearCitaDTO) => Promise<boolean>
  eliminar: (id: number) => Promise<void>
  limpiarError: () => void
}

export const useCitasStore = create<CitasState>()(
  devtools(
    (set, get) => ({
      citas: [],
      citaSeleccionada: null,
      cargando: false,
      error: null,

      cargarTodas: async () => {
        set({ cargando: true, error: null }, false, 'citas/cargarTodas')
        try {
          const citas = await citasService.listar()
          set({ citas, cargando: false }, false, 'citas/cargarTodas/ok')
        } catch (err) {
          set({ error: extraerMensajeError(err), cargando: false }, false, 'citas/cargarTodas/error')
        }
      },

      cargarPorPaciente: async (pacienteId) => {
        set({ cargando: true, error: null }, false, 'citas/cargarPorPaciente')
        try {
          const citas = await citasService.listar({ pacienteId })
          set({ citas, cargando: false }, false, 'citas/cargarPorPaciente/ok')
        } catch (err) {
          set(
            { error: extraerMensajeError(err), cargando: false },
            false,
            'citas/cargarPorPaciente/error',
          )
        }
      },

      seleccionar: (id) =>
        set(
          { citaSeleccionada: get().citas.find((c) => c.id === id) ?? null },
          false,
          'citas/seleccionar',
        ),

      actualizarEstado: async (id, estado) => {
        set({ error: null }, false, 'citas/actualizarEstado')
        try {
          await citasService.cambiarEstado(id, estado)
          set(
            (s) => ({
              citas: s.citas.map((c) => (c.id === id ? { ...c, estado } : c)),
              citaSeleccionada:
                s.citaSeleccionada?.id === id ? { ...s.citaSeleccionada, estado } : s.citaSeleccionada,
            }),
            false,
            'citas/actualizarEstado/ok',
          )
        } catch (err) {
          set({ error: extraerMensajeError(err) }, false, 'citas/actualizarEstado/error')
        }
      },

      agregarCita: async (datos) => {
        set({ error: null }, false, 'citas/agregarCita')
        try {
          const nueva = await citasService.crear(datos)
          set((s) => ({ citas: [...s.citas, nueva] }), false, 'citas/agregarCita/ok')
          return true
        } catch (err) {
          set({ error: extraerMensajeError(err) }, false, 'citas/agregarCita/error')
          return false
        }
      },

      eliminar: async (id) => {
        set({ error: null }, false, 'citas/eliminar')
        try {
          await citasService.eliminar(id)
          set(
            (s) => ({
              citas: s.citas.filter((c) => c.id !== id),
              citaSeleccionada: s.citaSeleccionada?.id === id ? null : s.citaSeleccionada,
            }),
            false,
            'citas/eliminar/ok',
          )
        } catch (err) {
          set({ error: extraerMensajeError(err) }, false, 'citas/eliminar/error')
        }
      },

      limpiarError: () => set({ error: null }, false, 'citas/limpiarError'),
    }),
    { name: 'CitasStore' },
  ),
)