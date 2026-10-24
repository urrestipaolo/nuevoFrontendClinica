import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import TarjetaGrafica from '../componentes/Grafico'
import { useApi } from '../hooks/useApi'
import { reportesService } from '../services/reportes'
import { useCitasStore } from '../stores/useCitasStore'
import { citasUltimosDias } from '../hooks/reportesHoraLocal'

export default function PaginaReportes() {
  const especialidadesQ = useApi(reportesService.citasPorEspecialidad)

  const citas = useCitasStore((s) => s.citas)
  const cargandoCitas = useCitasStore((s) => s.cargando)
  const errorCitas = useCitasStore((s) => s.error)
  const cargarCitas = useCitasStore((s) => s.cargarTodas)
  const [citasListas, setCitasListas] = useState(false)

  useEffect(() => {
    void cargarCitas().finally(() => setCitasListas(true))
  }, [cargarCitas])

  const datosEspecialidades = especialidadesQ.data ?? []
  const datosPorDia = useMemo(() => citasUltimosDias(citas, 7), [citas])
  const hayCitasPorDia = datosPorDia.some((d) => d.total > 0)

  return (
    <>
      <div className="encabezado">
        <div>
          <h1>Reportes</h1>
          <p className="muted">Actividad de la clínica de un vistazo</p>
        </div>
      </div>

      <div className="reportes-grid">
        <TarjetaGrafica
          titulo="Citas por especialidad"
          cargando={especialidadesQ.cargando}
          error={especialidadesQ.error}
          vacio={datosEspecialidades.length === 0}
          mensajeVacio="Todavía no hay citas registradas por especialidad."
          onReintentar={() => void especialidadesQ.recargar()}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosEspecialidades}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="especialidad" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total" name="Citas" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </TarjetaGrafica>

        <TarjetaGrafica
          titulo="Citas por día (últimos 7 días)"
          cargando={!citasListas || cargandoCitas}
          error={errorCitas}
          vacio={!hayCitasPorDia}
          mensajeVacio="No hay citas en los últimos 7 días."
          onReintentar={() => void cargarCitas()}
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={datosPorDia}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="dia" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                name="Citas"
                stroke="#0d9488"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </TarjetaGrafica>
      </div>
    </>
  )
}