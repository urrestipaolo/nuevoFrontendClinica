import { useState } from 'react'
import { Link } from 'react-router-dom'
import EstadoBadge from '../componentes/EstadoBadge'
import Estado from '../componentes/Estado'
import MetricCard from '../componentes/MetricCard'
import { useFetch } from '../hooks/useFetch'
import { getErrorMessage } from '../lib/axios'
import { citasService } from '../services/citas'
import { medicosService } from '../services/medicos'
import { pacientesService } from '../services/pacientes'
import type { Cita, EstadoCita, Medico, Paciente } from '../types'
import { formatearFechaHora, nombreCompleto } from '../hooks/format'

const cargarResumen = async () => {
  const [pacientes, medicos, citas] = await Promise.all([
    pacientesService.listar(),
    medicosService.listar(),
    citasService.listar(),
  ])
  return { pacientes, medicos, citas }
}

export default function PaginaDashboard() {
  const { data, loading, error, recargar } = useFetch(cargarResumen)
  const [errorAccion, setErrorAccion] = useState<string | null>(null)

  const pacientes = data?.pacientes ?? []
  const medicos = data?.medicos ?? []
  const citas = [...(data?.citas ?? [])].sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)))

  const pacientePorId = new Map<number, Paciente>(pacientes.map((p): [number, Paciente] => [p.id, p]))
  const medicoPorId = new Map<number, Medico>(medicos.map((m): [number, Medico] => [m.id, m]))
  const contar = (estado: EstadoCita) => citas.filter((c) => c.estado === estado).length

  async function cambiarEstado(cita: Cita, estado: EstadoCita) {
    setErrorAccion(null)
    try {
      await citasService.cambiarEstado(cita.id, estado)
      await recargar()
    } catch (e) {
      setErrorAccion(getErrorMessage(e))
    }
  }

  async function eliminar(cita: Cita) {
    if (!window.confirm('¿Eliminar esta cita?')) return
    setErrorAccion(null)
    try {
      await citasService.eliminar(cita.id)
      await recargar()
    } catch (e) {
      setErrorAccion(getErrorMessage(e))
    }
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

      {errorAccion && <div className="alert alert-error">{errorAccion}</div>}

      <Estado cargando={loading && !data} error={error} onReintentar={recargar}>
        <div className="metricas">
          <MetricCard titulo="Pacientes" valor={pacientes.length} />
          <MetricCard titulo="Médicos" valor={medicos.length} />
          <MetricCard titulo="Citas pendientes" valor={contar('pendiente')} />
          <MetricCard titulo="Citas completadas" valor={contar('completada')} />
        </div>

        <h2 className="subtitulo">Citas</h2>
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
              {citas.map((c) => {
                const paciente = pacientePorId.get(c.pacienteId)
                const medico = medicoPorId.get(c.medicoId)
                return (
                  <tr key={c.id}>
                    <td>{formatearFechaHora(c.fecha)}</td>
                    <td>{paciente ? nombreCompleto(paciente) : `Paciente #${c.pacienteId}`}</td>
                    <td>{medico?.medico ?? `Médico #${c.medicoId}`}</td>
                    <td>
                      <EstadoBadge estado={c.estado} />
                    </td>
                    <td>
                      <div className="acciones">
                        {c.estado === 'pendiente' && (
                          <>
                            <button
                              className="btn btn-sm"
                              onClick={() => cambiarEstado(c, 'completada')}
                            >
                              Completar
                            </button>
                            <button
                              className="btn btn-sm"
                              onClick={() => cambiarEstado(c, 'cancelada')}
                            >
                              Cancelar
                            </button>
                          </>
                        )}
                        <button className="btn btn-sm btn-danger" onClick={() => eliminar(c)}>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {citas.length === 0 && (
                <tr>
                  <td colSpan={5} className="muted">
                    Aún no hay citas agendadas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Estado>
    </>
  )
}
