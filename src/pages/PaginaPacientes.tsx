import { useEffect, useState } from 'react'
import Estado from '../componentes/Estado'
import Modal from '../componentes/Modal'
import PacienteForm from '../componentes/PacienteForm'
import { useFiltrosStore } from '../stores/filtroStore'
import { usePacientesStore } from '../stores/usePacienteStore'
import type { Paciente } from '../types'
import { formatearFecha, nombreCompleto } from '../hooks/format'
import { useDebounce } from '../hooks/useDebounce'


export default function PaginaPacientes() {
  const pacientes = usePacientesStore((s) => s.pacientes)
  const cargando = usePacientesStore((s) => s.cargando)
  const error = usePacientesStore((s) => s.error)
  const cargar = usePacientesStore((s) => s.cargar)
  const eliminar = usePacientesStore((s) => s.eliminar)
  const limpiarError = usePacientesStore((s) => s.limpiarError)


  const query = useFiltrosStore((s) => s.queryPacientes)
  const setQuery = useFiltrosStore((s) => s.setQueryPacientes)
  const resetFiltros = useFiltrosStore((s) => s.resetFiltros)



  const [formAbierto, setFormAbierto] = useState(false)
  const [seleccionado, setSeleccionado] = useState<Paciente | null>(null)


  const queryDebounced = useDebounce(query, 350)

    useEffect(() => {
    void cargar(queryDebounced)
    }, [queryDebounced, cargar])

  const buscando = query !== queryDebounced || cargando

  function abrirNuevo() {
    limpiarError()
    setSeleccionado(null)
    setFormAbierto(true)
  }

  function abrirEditar(p: Paciente) {
    limpiarError()
    setSeleccionado(p)
    setFormAbierto(true)
  }

  async function eliminarPaciente(p: Paciente) {
    if (!window.confirm(`¿Eliminar a ${nombreCompleto(p)}?`)) return
    await eliminar(p.id)
  }

  return (
    <>
      <div className="encabezado">
        <div>
          <h1>Pacientes</h1>
          <p className="muted">Registro y administración de pacientes</p>
        </div>
        <button className="btn btn-primary" onClick={abrirNuevo}>
          + Nuevo paciente
        </button>
      </div>
      
      <div className="barra">
      <div className="buscador-pacientes">
          <input
          type="search"
          placeholder="Buscar por nombre, email o teléfono"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Buscar pacientes"
          />

          {buscando && (
            <span
              className="spinner-busqueda"
              role="status"
              aria-label="Buscando pacientes"
          />
          )}
      </div>

  <button className="btn" onClick={resetFiltros}>
    Limpiar filtros
  </button>
</div>


      <Estado
        cargando={cargando && pacientes.length === 0}
        error={error}
        onReintentar={() => void cargar(query)}
      >
        <div className="card tabla-wrap">
          <table>
            <thead>
              <tr>
                <th>Nombre completo</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Nacimiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((p) => (
                <tr key={p.id}>
                  <td>{nombreCompleto(p)}</td>
                  <td>{p.telefono}</td>
                  <td>{p.email ?? '—'}</td>
                  <td>{formatearFecha(p.fechaNacimiento)}</td>
                  <td>
                    <div className="acciones">
                      <button className="btn btn-sm" onClick={() => abrirEditar(p)}>
                        Editar
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => eliminarPaciente(p)}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pacientes.length === 0 && (
                <tr>
                  <td colSpan={5} className="muted">
                    No hay pacientes para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Estado>

      {formAbierto && (
        <Modal
          titulo={seleccionado ? 'Editar paciente' : 'Nuevo paciente'}
          onCerrar={() => setFormAbierto(false)}
        >
          <PacienteForm inicial={seleccionado} onCerrar={() => setFormAbierto(false)} />
        </Modal>
      )}
    </>
  )
}
