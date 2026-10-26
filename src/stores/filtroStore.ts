import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { EstadoCita } from '../types'

export type FiltroEstadoCita = EstadoCita | 'Todos'

interface FiltrosState {
  queryPacientes: string
  especialidadFiltro: number | null
  estadoCitaFiltro: FiltroEstadoCita
  setQueryPacientes: (query: string) => void
  setEspecialidad: (id: number | null) => void
  setEstadoCita: (estado: FiltroEstadoCita) => void
  resetFiltros: () => void
}

const valoresIniciales: Pick<
  FiltrosState,
  'queryPacientes' | 'especialidadFiltro' | 'estadoCitaFiltro'
> = {
  queryPacientes: '',
  especialidadFiltro: null,
  estadoCitaFiltro: 'Todos',
}

export const useFiltrosStore = create<FiltrosState>()(
  devtools(
    (set) => ({
      ...valoresIniciales,
      setQueryPacientes: (queryPacientes) =>
        set({ queryPacientes }, false, 'filtros/setQueryPacientes'),
      setEspecialidad: (especialidadFiltro) =>
        set({ especialidadFiltro }, false, 'filtros/setEspecialidad'),
      setEstadoCita: (estadoCitaFiltro) =>
        set({ estadoCitaFiltro }, false, 'filtros/setEstadoCita'),
      resetFiltros: () => set({ ...valoresIniciales }, false, 'filtros/resetFiltros'),
    }),
    { name: 'FiltrosStore' },
  ),
)