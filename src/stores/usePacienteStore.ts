import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { getErrorMessage } from '../lib/axios'
import { pacientesService } from '../services/pacientes'
import type { Paciente, PacienteInput } from '../types'

interface PacientesState {
  pacientes: Paciente[]
  cargando: boolean
  error: string | null
  cargar: (query?: string) => Promise<void>
  crear: (datos: PacienteInput) => Promise<boolean>
  actualizar: (id: number, datos: PacienteInput) => Promise<boolean>
  eliminar: (id: number) => Promise<void>
  limpiarError: () => void
}

export const usePacientesStore = create<PacientesState>()(
  devtools(
    (set) => ({
      pacientes: [],
      cargando: false,
      error: null,

      cargar: async (query) => {
        set({ cargando: true, error: null }, false, 'pacientes/cargar')
        try {
          const pacientes = await pacientesService.listar({ query: query || undefined })
          set({ pacientes, cargando: false }, false, 'pacientes/cargar/ok')
        } catch (err) {
          set({ error: getErrorMessage(err), cargando: false }, false, 'pacientes/cargar/error')
        }
      },

      crear: async (datos) => {
        set({ error: null }, false, 'pacientes/crear')
        try {
          const nuevo = await pacientesService.crear(datos)
          set((s) => ({ pacientes: [...s.pacientes, nuevo] }), false, 'pacientes/crear/ok')
          return true
        } catch (err) {
          set({ error: getErrorMessage(err) }, false, 'pacientes/crear/error')
          return false
        }
      },

      actualizar: async (id, datos) => {
        set({ error: null }, false, 'pacientes/actualizar')
        try {
          await pacientesService.actualizar(id, datos)
          set(
            (s) => ({
              pacientes: s.pacientes.map((p) => (p.id === id ? { ...p, ...datos } : p)),
            }),
            false,
            'pacientes/actualizar/ok',
          )
          return true
        } catch (err) {
          set({ error: getErrorMessage(err) }, false, 'pacientes/actualizar/error')
          return false
        }
      },

      eliminar: async (id) => {
        set({ error: null }, false, 'pacientes/eliminar')
        try {
          await pacientesService.eliminar(id)
          set(
            (s) => ({ pacientes: s.pacientes.filter((p) => p.id !== id) }),
            false,
            'pacientes/eliminar/ok',
          )
        } catch (err) {
          set({ error: getErrorMessage(err) }, false, 'pacientes/eliminar/error')
        }
      },

      limpiarError: () => set({ error: null }, false, 'pacientes/limpiarError'),
    }),
    { name: 'PacientesStore' },
  ),
)
