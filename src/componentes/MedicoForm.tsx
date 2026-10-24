import { useState, type FormEvent } from 'react'
import { extraerMensajeError } from '../lib/errorHandler'
import type { Especialidad, Medico } from '../types'
import type { CrearMedicoDTO } from '../types/dtos'

interface Props {
  inicial: Medico | null
  especialidades: Especialidad[]
  onGuardar: (datos: CrearMedicoDTO) => Promise<void>
  onCancelar: () => void
}

export default function MedicoForm({ inicial, especialidades, onGuardar, onCancelar }: Props) {
  const [nombre, setNombre] = useState(inicial?.medico ?? '')
  const [especialidadId, setEspecialidadId] = useState(
    inicial ? String(inicial.especialidadId) : '',
  )
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setGuardando(true)
    setError(null)
    try {
      await onGuardar({ medico: nombre.trim(), especialidadId: Number(especialidadId) })
    } catch (err) {
      setError(extraerMensajeError(err))
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form onSubmit={enviar}>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="campo">
        <label htmlFor="medico">Nombre del médico</label>
        <input id="medico" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </div>
      <div className="campo">
        <label htmlFor="especialidad">Especialidad</label>
        <select
          id="especialidad"
          value={especialidadId}
          onChange={(e) => setEspecialidadId(e.target.value)}
          required
        >
          <option value="">Selecciona una especialidad</option>
          {especialidades.map((esp) => (
            <option key={esp.id} value={esp.id}>
              {esp.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="form-acciones">
        <button type="button" className="btn" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={guardando}>
          {guardando ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}
