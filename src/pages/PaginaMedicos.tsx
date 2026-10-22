import { useState } from 'react'
import Estado from '../componentes/Estado'
import MedicoForm from '../componentes/MedicoForm'
import Modal from '../componentes/Modal'
import { useApi } from '../hooks/useApi'
import { getErrorMessage } from '../lib/axios'
import { especialidadesService } from '../services/especialidades'
import { medicosService } from '../services/medicos'
import { useFiltrosStore } from '../stores/filtroStore'
import type { Medico, MedicoInput } from '../types'

export default function PaginaMedicos() {
  const medicosQ = useApi(medicosService.listar)
  const especialidadesQ = useApi(especialidadesService.listar)
  const especialidadFiltro = useFiltrosStore((s) => s.especialidadFiltro)
  const setEspecialidad = useFiltrosStore((s) => s.setEspecialidad)
  const resetFiltros = useFiltrosStore((s) => s.resetFiltros)
  const [busqueda, setBusqueda] = useState('')
  const [formAbierto, setFormAbierto] = useState(false)
  const [seleccionado, setSeleccionado] = useState<Medico | null>(null)
  const [errorAccion, setErrorAccion] = useState<string | null>(null)

  const especialidades = especialidadesQ.data ?? []
  const nombreEspecialidad = (m: Medico) =>
    m.especialidad?.nombre ?? especialidades.find((e) => e.id === m.especialidadId)?.nombre ?? '—'

  const texto = busqueda.trim().toLowerCase()
  const medicos = (medicosQ.data ?? []).filter(
    (m) =>
      (especialidadFiltro === null || m.especialidadId === especialidadFiltro) &&
      `${m.medico} ${nombreEspecialidad(m)}`.toLowerCase().includes(texto),
  )

  const cargando = (medicosQ.cargando && !medicosQ.data) || (especialidadesQ.cargando && !especialidadesQ.data)
  const error = medicosQ.error ?? especialidadesQ.error
  const reintentar = () => {
    void medicosQ.recargar()
    void especialidadesQ.recargar()
  }

  function abrirNuevo() {
    setSeleccionado(null)
    setFormAbierto(true)
  }

  function abrirEditar(m: Medico) {
    setSeleccionado(m)
    setFormAbierto(true)
  }

  async function guardar(datos: MedicoInput) {
    if (seleccionado) await medicosService.actualizar(seleccionado.id, datos)
    else await medicosService.crear(datos)
    setFormAbierto(false)
    await medicosQ.recargar()
  }

  async function eliminar(m: Medico) {
    if (!window.confirm(`¿Eliminar a ${m.medico}?`)) return
    setErrorAccion(null)
    try {
      await medicosService.eliminar(m.id)
      await medicosQ.recargar()
    } catch (e) {
      setErrorAccion(getErrorMessage(e))
    }
  }

  return (
    <>
      <div className="encabezado">
        <div>
          <h1>Médicos</h1>
          <p className="muted">Directorio de médicos y sus especialidades</p>
        </div>
        <button className="btn btn-primary" onClick={abrirNuevo}>
          + Nuevo médico
        </button>
      </div>

      {errorAccion && <div className="alert alert-error">{errorAccion}</div>}

      <div className="barra">
        <input
          type="search"
          placeholder="Buscar por nombre o especialidad"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select
          aria-label="Filtrar por especialidad"
          value={especialidadFiltro ?? ''}
          onChange={(e) => setEspecialidad(e.target.value === '' ? null : Number(e.target.value))}
        >
          <option value="">Todas las especialidades</option>
          {especialidades.map((esp) => (
            <option key={esp.id} value={esp.id}>
              {esp.nombre}
            </option>
          ))}
        </select>
        <button
          className="btn"
          onClick={() => {
            resetFiltros()
            setBusqueda('')
          }}
        >
          Limpiar filtros
        </button>
      </div>

      <Estado cargando={cargando} error={error} onReintentar={reintentar}>
        <div className="card tabla-wrap">
          <table>
            <thead>
              <tr>
                <th>Médico</th>
                <th>Especialidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {medicos.map((m) => (
                <tr key={m.id}>
                  <td>{m.medico}</td>
                  <td>{nombreEspecialidad(m)}</td>
                  <td>
                    <div className="acciones">
                      <button className="btn btn-sm" onClick={() => abrirEditar(m)}>
                        Editar
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => eliminar(m)}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {medicos.length === 0 && (
                <tr>
                  <td colSpan={3} className="muted">
                    No hay médicos para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Estado>

      {formAbierto && (
        <Modal
          titulo={seleccionado ? 'Editar médico' : 'Nuevo médico'}
          onCerrar={() => setFormAbierto(false)}
        >
          <MedicoForm
            inicial={seleccionado}
            especialidades={especialidades}
            onGuardar={guardar}
            onCancelar={() => setFormAbierto(false)}
          />
        </Modal>
      )}
    </>
  )
}