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
import { citasUltimosDias } from '../hooks/reportesHoraLocal'
import { useCitas } from '../hooks/useCitas'

import { ErrorBoundary } from '../componentes/ui/ErrorBoundary'
import { AlertaBanner } from '../componentes/ui/AlertaBanner'
import { EstadoVacio } from '../componentes/ui/EstadoVacio'

export default function PaginaReportes() {
  const especialidadesQ = useApi(reportesService.citasPorEspecialidad)

  // Consumimos el estado y acciones a través del Custom Hook
  const { citas, cargando: cargandoCitas, error: errorCitas, cargarTodas: cargarCitas } = useCitas()

  const [citasListas, setCitasListas] = useState(false)
  const [aviso, setAviso] = useState<string>('Visualizando reportes analíticos de la clínica.')

  useEffect(() => {
    void cargarCitas().finally(() => setCitasListas(true))
  }, [cargarCitas])

  const datosEspecialidades = especialidadesQ.data ?? []
  const datosPorDia = useMemo(() => citasUltimosDias(citas, 7), [citas])
  const hayCitasPorDia = datosPorDia.some((d) => d.total > 0)

  return (
    <ErrorBoundary fallbackMensaje="Error crítico al cargar la sección de Reportes">
      <div className="space-y-6">
        <div className="encabezado">
          <div>
            <h1>Reportes</h1>
            <p className="muted">Actividad de la clínica de un vistazo</p>
          </div>
        </div>

        {aviso && (
          <div style={{ marginBottom: '1rem' }}>
            <AlertaBanner tipo="info" mensaje={aviso} onCerrar={() => setAviso('')} />
          </div>
        )}

        <div className="reportes-grid">
          <ErrorBoundary fallbackMensaje="Error en la gráfica de especialidades">
            <TarjetaGrafica
              titulo="Citas por especialidad"
              cargando={especialidadesQ.cargando}
              error={especialidadesQ.error}
              vacio={datosEspecialidades.length === 0}
              mensajeVacio="Todavía no hay citas registradas por especialidad."
              onReintentar={() => void especialidadesQ.recargar()}
            >
              {datosEspecialidades.length === 0 ? (
                <EstadoVacio
                  titulo="Sin datos de especialidades"
                  descripcion="Registra nuevas citas con especialidades asignadas para visualizar las estadísticas."
                />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={datosEspecialidades}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="especialidad" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="total" name="Citas" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </TarjetaGrafica>
          </ErrorBoundary>

          <ErrorBoundary fallbackMensaje="Error en la gráfica de citas por día">
            <TarjetaGrafica
              titulo="Citas por día (últimos 7 días)"
              cargando={!citasListas || cargandoCitas}
              error={errorCitas}
              vacio={!hayCitasPorDia}
              mensajeVacio="No hay citas en los últimos 7 días."
              onReintentar={() => void cargarCitas()}
            >
              {!hayCitasPorDia ? (
                <EstadoVacio
                  titulo="Sin actividad reciente"
                  descripcion="No se registran citas en los últimos 7 días."
                />
              ) : (
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
              )}
            </TarjetaGrafica>
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  )
}