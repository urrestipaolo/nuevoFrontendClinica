import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Estado from '../componentes/Estado'
import EstadoBadge from '../componentes/EstadoBadge'
import MetricCard from '../componentes/MetricCard'
import { useApi } from '../hooks/useApi'
import { medicosService } from '../services/medicos'
import { useCitasStore } from '../stores/useCitasStore'
import { useFiltrosStore, type FiltroEstadoCita } from '../stores/filtroStore'
import { usePacientesStore } from '../stores/usePacienteStore'
import type { EstadoCita, Medico, Paciente } from '../types'
import { formatearFechaHora, nombreCompleto } from '../hooks/format'

const FILTROS_ESTADO: FiltroEstadoCita[] = ['Todos', 'pendiente', 'completada', 'cancelada']

export default function PaginaDashboard() {
  const pacientes = usePacientesStore((s) => s.pacientes)
  const errorPacientes = usePacientesStore((s) => s.error)
  const cargarPacientes = usePacientesStore((s) => s.cargar)

  const citas = useCitasStore((s) => s.citas)
  const citaSeleccionada = useCitasStore((s) => s.citaSeleccionada)
  const cargandoCitas = useCitasStore((s) => s.cargando)
  const errorCitas = useCitasStore((s) => s.error)
  const cargarCitas = useCitasStore((s) => s.cargarTodas)
  const seleccionar = useCitasStore((s) => s.seleccionar)
  const actualizarEstado = useCitasStore((s) => s.actualizarEstado)
  const eliminarCita = useCitasStore((s) => s.eliminar)

  const estadoFiltro = useFiltrosStore((s) => s.estadoCitaFiltro)
  const setEstadoFiltro = useFiltrosStore((s) => s.setEstadoCita)
  const resetFiltros = useFiltrosStore((s) => s.resetFiltros)

  const medicosQ = useApi(medicosService.listar)

  useEffect(() => {
    void cargarPacientes()
    void cargarCitas()
  }, [cargarPacientes, cargarCitas])

  const medicos = medicosQ.data ?? []
  const pacientePorId = new Map<number, Paciente>(pacientes.map((p): [number, Paciente] => [p.id, p]))
  const medicoPorId = new Map<number, Medico>(medicos.map((m): [number, Medico] => [m.id, m]))

  const contar = (estado: EstadoCita) => citas.filter((c) => c.estado === estado).length
  const ordenadas = [...citas].sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)))
  const visibles =
    estadoFiltro === 'Todos' ? ordenadas : ordenadas.filter((c) => c.estado === estadoFiltro)

  const nombrePaciente = (id: number) => {
    const p = pacientePorId.get(id)
    return p ? nombreCompleto(p) : `Paciente #${id}`
  }
  const nombreMedico = (id: number) => medicoPorId.get(id)?.medico ?? `Médico #${id}`

  async function eliminar(id: number) {
    if (!window.confirm('¿Eliminar esta cita?')) return
    await eliminarCita(id)
  }

  return (
    <>
      <div className="encabezado">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Resumen de la clínica</p>
        </div>
        <Link to="/citas/nueva" className="btn btn-primary">
          + Agendar cita
        </Link>
      </div>

      <Estado
        cargando={cargandoCitas && citas.length === 0}
        error={errorCitas ?? errorPacientes ?? medicosQ.error}
        onReintentar={() => {
          void cargarPacientes()
          void cargarCitas()
          void medicosQ.recargar()
        }}
      >
        <div className="metricas">
          <MetricCard titulo="Pacientes" valor={pacientes.length} />
          <MetricCard titulo="Médicos" valor={medicos.length} />
          <MetricCard titulo="Citas pendientes" valor={contar('pendiente')} />
          <MetricCard titulo="Citas completadas" valor={contar('completada')} />
        </div>

        <div className="enlace-reportes">
          <Link to="/reportes">Ver reportes completos →</Link>
        </div>

        <div className="encabezado">
          <h2>Citas</h2>
          <div className="barra barra-inline">
            <select
              aria-label="Filtrar por estado"
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value as FiltroEstadoCita)}
            >
              {FILTROS_ESTADO.map((e) => (
                <option key={e} value={e}>
                  {e === 'Todos' ? 'Todos los estados' : e}
                </option>
              ))}
            </select>
            <button className="btn" onClick={resetFiltros}>
              Limpiar filtros
            </button>
          </div>
        </div>

        <div className="card tabla-wrap">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Paciente</th>
                <th>Médico</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((c) => (
                <tr
                  key={c.id}
                  className={citaSeleccionada?.id === c.id ? 'fila-click fila-activa' : 'fila-click'}
                  onClick={() => seleccionar(c.id)}
                >
                  <td>{formatearFechaHora(c.fecha)}</td>
                  <td>{nombrePaciente(c.pacienteId)}</td>
                  <td>{nombreMedico(c.medicoId)}</td>
                  <td>
                    <EstadoBadge estado={c.estado} />
                  </td>
                  <td>
                    <div className="acciones">
                      {c.estado === 'pendiente' && (
                        <>
                          <button
                            className="btn btn-sm"
                            onClick={() => void actualizarEstado(c.id, 'completada')}
                          >
                            Completar
                          </button>
                          <button
                            className="btn btn-sm"
                            onClick={() => void actualizarEstado(c.id, 'cancelada')}
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                      <button className="btn btn-sm btn-danger" onClick={() => void eliminar(c.id)}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibles.length === 0 && (
                <tr>
                  <td colSpan={5} className="muted">
                    No hay citas para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {citaSeleccionada && (
          <div className="card detalle-cita">
            <h2>Cita seleccionada</h2>
            <p>
              <strong>{nombrePaciente(citaSeleccionada.pacienteId)}</strong> con{' '}
              <strong>{nombreMedico(citaSeleccionada.medicoId)}</strong>
            </p>
            <p className="muted">
              {formatearFechaHora(citaSeleccionada.fecha)} · <EstadoBadge estado={citaSeleccionada.estado} />
            </p>
          </div>
        )}
      </Estado>
    </>
  )
}
