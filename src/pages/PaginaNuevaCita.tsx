import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Estado from '../componentes/Estado'
import { useFetch } from '../hooks/useFetch'
import { medicosService } from '../services/medicos'
import { useCitasStore } from '../stores/useCitasStore'
import { usePacientesStore } from '../stores/usePacienteStore'
import { nombreCompleto } from '../hooks/format'

// Valor mínimo para <input type="datetime-local"> (hora local actual)
function ahoraLocal() {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

export default function PaginaNuevaCita() {
  const pacientes = usePacientesStore((s) => s.pacientes)
  const cargandoPacientes = usePacientesStore((s) => s.cargando)
  const errorPacientes = usePacientesStore((s) => s.error)
  const cargarPacientes = usePacientesStore((s) => s.cargar)

  const agregarCita = useCitasStore((s) => s.agregarCita)
  const errorCita = useCitasStore((s) => s.error)
  const limpiarErrorCita = useCitasStore((s) => s.limpiarError)

  const medicosQ = useFetch(medicosService.listar)

  // Estado local de UI: campos del formulario
  const [pacienteId, setPacienteId] = useState('')
  const [medicoId, setMedicoId] = useState('')
  const [fecha, setFecha] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [errorForm, setErrorForm] = useState<string | null>(null)
  const [exito, setExito] = useState(false)

  useEffect(() => {
    limpiarErrorCita()
    void cargarPacientes()
  }, [limpiarErrorCita, cargarPacientes])

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setExito(false)
    setErrorForm(null)

    if (new Date(fecha) <= new Date()) {
      setErrorForm('Selecciona una fecha y hora posteriores a este momento.')
      return
    }

    setGuardando(true)
    const ok = await agregarCita({
      pacienteId: Number(pacienteId),
      medicoId: Number(medicoId),
      fecha: new Date(fecha).toISOString(),
    })
    setGuardando(false)

    if (ok) {
      setExito(true)
      setPacienteId('')
      setMedicoId('')
      setFecha('')
    }
  }

  const medicos = medicosQ.data ?? []
  const mensajeError = errorForm ?? errorCita

  return (
    <>
      <div className="encabezado">
        <div>
          <h1>Agendar nueva cita</h1>
          <p className="muted">Elige paciente, médico y fecha</p>
        </div>
      </div>

      <Estado
        cargando={(medicosQ.loading && !medicosQ.data) || (cargandoPacientes && pacientes.length === 0)}
        error={medicosQ.error ?? errorPacientes}
        onReintentar={() => {
          void medicosQ.recargar()
          void cargarPacientes()
        }}
      >
        <form className="card form-cita" onSubmit={enviar}>
          {exito && (
            <div className="alert alert-ok">
              <span>Cita agendada correctamente.</span>
              <Link to="/">Ver en el dashboard</Link>
            </div>
          )}
          {mensajeError && <div className="alert alert-error">{mensajeError}</div>}

          <div className="campo">
            <label htmlFor="paciente">Paciente</label>
            <select
              id="paciente"
              value={pacienteId}
              onChange={(e) => setPacienteId(e.target.value)}
              required
            >
              <option value="">Selecciona un paciente</option>
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>
                  {nombreCompleto(p)}
                </option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label htmlFor="medico">Médico</label>
            <select
              id="medico"
              value={medicoId}
              onChange={(e) => setMedicoId(e.target.value)}
              required
            >
              <option value="">Selecciona un médico</option>
              {medicos.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.medico}
                </option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label htmlFor="fecha">Fecha y hora</label>
            <input
              id="fecha"
              type="datetime-local"
              min={ahoraLocal()}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>

          <div className="form-acciones">
            <button type="submit" className="btn btn-primary" disabled={guardando}>
              {guardando ? 'Agendando…' : 'Agendar cita'}
            </button>
          </div>
        </form>
      </Estado>
    </>
  )
}
