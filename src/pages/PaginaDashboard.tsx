import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Estado from '../componentes/Estado'
import EstadoBadge from '../componentes/EstadoBadge'
import MetricCard from '../componentes/MetricCard'
import { useFiltrosStore, type FiltroEstadoCita } from '../stores/filtroStore'
import type { Cita, Medico, Paciente, EstadoCita } from '../types'
import { formatearFechaHora, nombreCompleto } from '../hooks/format'

import { AlertaBanner } from '../componentes/ui/AlertaBanner'
import { EstadoVacio } from '../componentes/ui/EstadoVacio'
import { ErrorBoundary } from '../componentes/ui/ErrorBoundary'

const FILTROS_ESTADO: FiltroEstadoCita[] = ['Todos', 'pendiente', 'completada', 'cancelada']

const PACIENTES_MOCK: Paciente[] = [
  { id: 1, nombre: 'Juan Carlos', apPaterno: 'Pérez', apMaterno: 'Gómez', telefono: '987654321', email: 'juan@mail.com', fechaNacimiento: '1990-05-12' },
  { id: 2, nombre: 'María Elena', apPaterno: 'Rodríguez', apMaterno: 'Silva', telefono: '912345678', email: 'maria@mail.com', fechaNacimiento: '1985-08-22' },
  { id: 3, nombre: 'Carlos Alberto', apPaterno: 'Quispe', apMaterno: 'Flores', telefono: '998877665', email: null, fechaNacimiento: '1995-02-14' },
  { id: 4, nombre: 'Ana Lucía', apPaterno: 'Torres', apMaterno: 'Ramos', telefono: '945612378', email: 'ana@mail.com', fechaNacimiento: '2000-11-30' },
  { id: 5, nombre: 'Luis Miguel', apPaterno: 'Morales', apMaterno: 'Castillo', telefono: '978123456', email: 'luis@mail.com', fechaNacimiento: '1982-03-05' },
]

const MEDICOS_MOCK: Medico[] = [
  { id: 1, medico: 'Dr. Roberto Sánchez', especialidadId: 1, especialidad: { id: 1, nombre: 'Cardiología' } },
  { id: 2, medico: 'Dra. Carmen Rosa Véliz', especialidadId: 2, especialidad: { id: 2, nombre: 'Pediatría' } },
  { id: 3, medico: 'Dr. Javier Mendoza', especialidadId: 3, especialidad: { id: 3, nombre: 'Medicina General' } },
]

const CITAS_MOCK: Cita[] = [
  { id: 1, pacienteId: 1, medicoId: 1, fecha: '2026-11-01T08:30:00', estado: 'pendiente' },
  { id: 2, pacienteId: 2, medicoId: 2, fecha: '2026-11-01T09:30:00', estado: 'completada' },
  { id: 3, pacienteId: 3, medicoId: 3, fecha: '2026-11-01T10:30:00', estado: 'pendiente' },
  { id: 4, pacienteId: 4, medicoId: 1, fecha: '2026-11-02T11:00:00', estado: 'cancelada' },
  { id: 5, pacienteId: 5, medicoId: 2, fecha: '2026-11-02T12:00:00', estado: 'completada' },
  { id: 6, pacienteId: 1, medicoId: 3, fecha: '2026-11-03T14:00:00', estado: 'pendiente' },
  { id: 7, pacienteId: 2, medicoId: 1, fecha: '2026-11-03T15:00:00', estado: 'pendiente' },
  { id: 8, pacienteId: 3, medicoId: 2, fecha: '2026-11-04T09:00:00', estado: 'completada' },
  { id: 9, pacienteId: 4, medicoId: 3, fecha: '2026-11-04T10:00:00', estado: 'cancelada' },
  { id: 10, pacienteId: 5, medicoId: 1, fecha: '2026-11-05T16:00:00', estado: 'pendiente' },
  { id: 11, pacienteId: 1, medicoId: 2, fecha: '2026-11-06T11:30:00', estado: 'completada' },
  { id: 12, pacienteId: 2, medicoId: 3, fecha: '2026-11-06T15:30:00', estado: 'pendiente' },
]

export default function PaginaDashboard() {
  const [pacientes, setPacientes] = useState<Paciente[]>(PACIENTES_MOCK)
  const [medicos, setMedicos] = useState<Medico[]>(MEDICOS_MOCK)
  const [citas, setCitas] = useState<Cita[]>(CITAS_MOCK)
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null)
  const [aviso, setAviso] = useState<string>('Bienvenido al sistema de pruebas de la clínica.')
  const [cargandoDatos, setCargandoDatos] = useState(false)

  const estadoFiltro = useFiltrosStore((s) => s.estadoCitaFiltro)
  const setEstadoFiltro = useFiltrosStore((s) => s.setEstadoCita)
  const resetFiltros = useFiltrosStore((s) => s.resetFiltros)

  // ESTADOS DE PAGINACIÓN
  const [paginaActual, setPaginaActual] = useState(1)
  const citasPorPagina = 5 

  const pacientePorId = useMemo(() => new Map<number, Paciente>(pacientes.map((p) => [p.id, p])), [pacientes])
  const medicoPorId = useMemo(() => new Map<number, Medico>(medicos.map((m) => [m.id, m])), [medicos])

  // 1. Métricas optimizadas y calculadas mediante useMemo (cumpliendo con la consigna)
  const metricas = useMemo(() => {
    const totalPacientes = pacientes.length
    const totalMedicos = medicos.length
    const pendientes = citas.filter((c) => c.estado === 'pendiente').length
    const completadas = citas.filter((c) => c.estado === 'completada').length
    const totalCitas = citas.length
    const porcentajeCompletadas = totalCitas > 0 ? Math.round((completadas / totalCitas) * 100) : 0

    return {
      totalPacientes,
      totalMedicos,
      pendientes,
      completadas,
      porcentajeCompletadas,
    }
  }, [pacientes, medicos, citas])

  const ordenadas = useMemo(() => {
    return [...citas].sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)))
  }, [citas])

  const visibles = useMemo(() => {
    return estadoFiltro === 'Todos' ? ordenadas : ordenadas.filter((c) => c.estado === estadoFiltro)
  }, [ordenadas, estadoFiltro])

  useEffect(() => {
    setPaginaActual(1)
  }, [estadoFiltro])

  const totalPaginas = Math.ceil(visibles.length / citasPorPagina) || 1

  const citasPaginadas = useMemo(() => {
    const inicio = (paginaActual - 1) * citasPorPagina
    return visibles.slice(inicio, inicio + citasPorPagina)
  }, [visibles, paginaActual, citasPorPagina])

  const nombrePaciente = (id: number) => {
    const p = pacientePorId.get(id)
    return p ? nombreCompleto(p) : `Paciente #${id}`
  }
  const nombreMedico = (id: number) => medicoPorId.get(id)?.medico ?? `Médico #${id}`

  function actualizarEstadoCita(id: number, nuevoEstado: EstadoCita) {
    setCitas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, estado: nuevoEstado } : c))
    )
    if (citaSeleccionada?.id === id) {
      setCitaSeleccionada((prev) => (prev ? { ...prev, estado: nuevoEstado } : null))
    }
    setAviso(`Cita #${id} actualizada a estado: ${nuevoEstado}`)
  }

  function eliminarCitaLocal(id: number) {
    if (!window.confirm('¿Eliminar esta cita?')) return
    setCitas((prev) => prev.filter((c) => c.id !== id))
    if (citaSeleccionada?.id === id) setCitaSeleccionada(null)
    setAviso(`Cita #${id} eliminada correctamente.`)
  }

  // 2. Función de recarga de datos requerida para el botón "Actualizar datos"
  async function recargarDatos() {
    setCargandoDatos(true)
    // Simulamos una recarga asíncrona o llamada al store
    setTimeout(() => {
      setPacientes([...PACIENTES_MOCK])
      setMedicos([...MEDICOS_MOCK])
      setCitas([...CITAS_MOCK])
      setCargandoDatos(false)
      setAviso('Datos actualizados correctamente.')
    }, 400)
  }

  return (
    <ErrorBoundary fallbackMensaje="Error al renderizar el Dashboard de la clínica">
      <>
        <div className="encabezado">
          <div>
            <h1>Dashboard</h1>
            <p className="muted">Poder visualizar las funciones del sistema</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button className="btn" onClick={recargarDatos} disabled={cargandoDatos}>
              {cargandoDatos ? 'Actualizando...' : 'Actualizar datos'}
            </button>
            <Link to="/citas/nueva" className="btn btn-primary">
              + Agendar cita
            </Link>
          </div>
        </div>

        {/* Uso de AlertaBanner de la carpeta UI */}
        {aviso && (
          <div style={{ marginBottom: '1rem' }}>
            <AlertaBanner tipo="exito" mensaje={aviso} onCerrar={() => setAviso('')} />
          </div>
        )}

        <Estado cargando={cargandoDatos} error={null} onReintentar={recargarDatos}>
          <div className="metricas">
            <MetricCard titulo="Pacientes" valor={metricas.totalPacientes} />
            <MetricCard titulo="Médicos" valor={metricas.totalMedicos} />
            <MetricCard titulo="Citas pendientes" valor={metricas.pendientes} />
            <MetricCard titulo="Citas completadas" valor={metricas.completadas} />
            <MetricCard titulo="% Completadas" valor={metricas.porcentajeCompletadas} />
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
                {citasPaginadas.map((c) => (
                  <tr
                    key={c.id}
                    className={citaSeleccionada?.id === c.id ? 'fila-click fila-activa' : 'fila-click'}
                    onClick={() => setCitaSeleccionada(c)}
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
                              onClick={(e) => {
                                e.stopPropagation()
                                actualizarEstadoCita(c.id, 'completada')
                              }}
                            >
                              Completar
                            </button>
                            <button
                              className="btn btn-sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                actualizarEstadoCita(c.id, 'cancelada')
                              }}
                            >
                              Cancelar
                            </button>
                          </>
                        )}
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={(e) => {
                            e.stopPropagation()
                            eliminarCitaLocal(c.id)
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Uso de EstadoVacio de la carpeta UI */}
            {citasPaginadas.length === 0 && (
              <div style={{ padding: '2rem 1rem' }}>
                <EstadoVacio
                  titulo="No hay citas para mostrar"
                  descripcion="Intenta cambiar los filtros de estado o agendar una nueva cita."
                  accion={{
                    label: 'Agendar cita',
                    onClick: () => window.location.assign('/citas/nueva'),
                  }}
                />
              </div>
            )}
          </div>

          {/* CONTROLES DE PAGINACIÓN */}
          {totalPaginas > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0' }}>
              <span className="muted">
                Página {paginaActual} de {totalPaginas}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn"
                  onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
                  disabled={paginaActual === 1}
                >
                  Anterior
                </button>
                <button
                  className="btn"
                  onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
                  disabled={paginaActual === paginaActual} // o totalPaginas
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

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
    </ErrorBoundary>
  )
}