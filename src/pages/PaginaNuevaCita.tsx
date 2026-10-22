import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Estado from '../componentes/Estado'
import { useFetch } from '../hooks/useFetch'
import { getErrorMessage } from '../lib/axios'
import { citasService } from '../services/citas'
import { medicosService } from '../services/medicos'
import { pacientesService } from '../services/pacientes'
import { nombreCompleto } from '../hooks/format'

const cargarOpciones = async () => {
  const [pacientes, medicos] = await Promise.all([
    pacientesService.listar(),
    medicosService.listar(),
  ])
  return { pacientes, medicos }
}

// Valor mínimo para <input type="datetime-local"> (hora local actual)
function ahoraLocal() {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

export default function PaginaNuevaCita() {
  const { data, loading, error, recargar } = useFetch(cargarOpciones)
  const [pacienteId, setPacienteId] = useState('')
  const [medicoId, setMedicoId] = useState('')
  const [fecha, setFecha] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [errorForm, setErrorForm] = useState<string | null>(null)
  const [exito, setExito] = useState(false)

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setExito(false)
    setErrorForm(null)

    if (new Date(fecha) <= new Date()) {
      setErrorForm('Selecciona una fecha y hora posteriores a este momento.')
      return
    }

    setGuardando(true)
    try {
      await citasService.crear({
        pacienteId: Number(pacienteId),
        medicoId: Number(medicoId),
        fecha: new Date(fecha).toISOString(),
      })
      setExito(true)
      setPacienteId('')
      setMedicoId('')
      setFecha('')
    } catch (err) {
      setErrorForm(getErrorMessage(err))
    } finally {
      setGuardando(false)
    }
  }

  return (
    <>
      <div className="encabezado">
        <div>
          <h1>Agendar nueva cita</h1>
          <p className="muted">Elige paciente, médico y fecha</p>
        </div>
      </div>

      <Estado cargando={loading && !data} error={error} onReintentar={recargar}>
        {data && (
          <form className="card form-cita" onSubmit={enviar}>
            {exito && (
              <div className="alert alert-ok">
                <span>Cita agendada correctamente.</span>
                <Link to="/">Ver en el dashboard</Link>
              </div>
            )}
            {errorForm && <div className="alert alert-error">{errorForm}</div>}

            <div className="campo">
              <label htmlFor="paciente">Paciente</label>
              <select
                id="paciente"
                value={pacienteId}
                onChange={(e) => setPacienteId(e.target.value)}
                required
              >
                <option value="">Selecciona un paciente</option>
                {data.pacientes.map((p) => (
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
                {data.medicos.map((m) => (
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
        )}
      </Estado>
    </>
  )
}
