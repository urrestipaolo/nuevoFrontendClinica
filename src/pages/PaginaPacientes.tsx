import { useState } from 'react'
import Estado from '../componentes/Estado'
import Modal from '../componentes/Modal'
import PacienteForm from '../componentes/PacienteForm'
import { useFetch } from '../hooks/useFetch'
import { getErrorMessage } from '../lib/axios'
import { pacientesService } from '../services/pacientes'
import type { Paciente, PacienteInput } from '../types'
import { formatearFecha, nombreCompleto } from '../hooks/format'

export default function PaginaPacientes() {
  const { data, loading, error, recargar } = useFetch(pacientesService.listar)
  const [busqueda, setBusqueda] = useState('')
  const [formAbierto, setFormAbierto] = useState(false)
  const [seleccionado, setSeleccionado] = useState<Paciente | null>(null)
  const [errorAccion, setErrorAccion] = useState<string | null>(null)

  const texto = busqueda.trim().toLowerCase()
  const pacientes = (data ?? []).filter((p) =>
    `${nombreCompleto(p)} ${p.email ?? ''} ${p.telefono}`.toLowerCase().includes(texto),
  )

  function abrirNuevo() {
    setSeleccionado(null)
    setFormAbierto(true)
  }

  function abrirEditar(p: Paciente) {
    setSeleccionado(p)
    setFormAbierto(true)
  }

  async function guardar(datos: PacienteInput) {
    if (seleccionado) await pacientesService.actualizar(seleccionado.id, datos)
    else await pacientesService.crear(datos)
    setFormAbierto(false)
    await recargar()
  }

  async function eliminar(p: Paciente) {
    if (!window.confirm(`¿Eliminar a ${nombreCompleto(p)}?`)) return
    setErrorAccion(null)
    try {
      await pacientesService.eliminar(p.id)
      await recargar()
    } catch (e) {
      setErrorAccion(getErrorMessage(e))
    }
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

      {errorAccion && <div className="alert alert-error">{errorAccion}</div>}

      <div className="barra">
        <input
          type="search"
          placeholder="Buscar por nombre, email o teléfono"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <Estado cargando={loading && !data} error={error} onReintentar={recargar}>
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
                      <button className="btn btn-sm btn-danger" onClick={() => eliminar(p)}>
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
          <PacienteForm
            inicial={seleccionado}
            onGuardar={guardar}
            onCancelar={() => setFormAbierto(false)}
          />
        </Modal>
      )}
    </>
  )
}
