import { useState, type ChangeEvent, type FormEvent } from 'react'
import { usePacientesStore } from '../stores/usePacienteStore'
import type { Paciente } from '../types'
import type { CrearPacienteDTO } from '../types/dtos'

interface Props {
  inicial: Paciente | null
  onCerrar: () => void
}

export default function PacienteForm({ inicial, onCerrar }: Props) {
  const crear = usePacientesStore((s) => s.crear)
  const actualizar = usePacientesStore((s) => s.actualizar)
  const error = usePacientesStore((s) => s.error)
  const [form, setForm] = useState({
    nombre: inicial?.nombre ?? '',
    apPaterno: inicial?.apPaterno ?? '',
    apMaterno: inicial?.apMaterno ?? '',
    telefono: inicial?.telefono ?? '',
    email: inicial?.email ?? '',
    fechaNacimiento: inicial?.fechaNacimiento.slice(0, 10) ?? '',
  })
  const [guardando, setGuardando] = useState(false)

  const cambiar = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setGuardando(true)
    const datos: CrearPacienteDTO = {
      nombre: form.nombre.trim(),
      apPaterno: form.apPaterno.trim(),
      apMaterno: form.apMaterno.trim(),
      telefono: form.telefono.trim(),
      email: form.email.trim() || null,
      fechaNacimiento: new Date(form.fechaNacimiento).toISOString(),
    }
    const ok = inicial ? await actualizar(inicial.id, datos) : await crear(datos)
    setGuardando(false)
    if (ok) onCerrar()
  }

  return (
    <form onSubmit={enviar}>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="campo">
        <label htmlFor="nombre">Nombre</label>
        <input id="nombre" name="nombre" value={form.nombre} onChange={cambiar} required />
      </div>
      <div className="fila-campos">
        <div className="campo">
          <label htmlFor="apPaterno">Apellido paterno</label>
          <input id="apPaterno" name="apPaterno" value={form.apPaterno} onChange={cambiar} required />
        </div>
        <div className="campo">
          <label htmlFor="apMaterno">Apellido materno</label>
          <input id="apMaterno" name="apMaterno" value={form.apMaterno} onChange={cambiar} required />
        </div>
      </div>
      <div className="fila-campos">
        <div className="campo">
          <label htmlFor="telefono">Teléfono</label>
          <input id="telefono" name="telefono" type="tel" value={form.telefono} onChange={cambiar} required />
        </div>
        <div className="campo">
          <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
          <input
            id="fechaNacimiento"
            name="fechaNacimiento"
            type="date"
            max={new Date().toISOString().slice(0, 10)}
            value={form.fechaNacimiento}
            onChange={cambiar}
            required
          />
        </div>
      </div>
      <div className="campo">
        <label htmlFor="email">Email (opcional)</label>
        <input id="email" name="email" type="email" value={form.email} onChange={cambiar} />
      </div>

      <div className="form-acciones">
        <button type="button" className="btn" onClick={onCerrar}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={guardando}>
          {guardando ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}

