import { NavLink, Outlet, useLocation } from 'react-router-dom'
import ErrorBoundary from './ErrorBoundary'

const enlaces = [
  { to: '/', texto: 'Dashboard', end: true },
  { to: '/pacientes', texto: 'Pacientes', end: false },
  { to: '/medicos', texto: 'Médicos', end: false },
  { to: '/citas/nueva', texto: 'Nueva cita', end: false },
  { to: '/reportes', texto: 'Reportes', end: false },
]

export default function Layout() {
  const { pathname } = useLocation()
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="marca">
          Clínica Salud PAOLO
          <small>Panel del Sistema Clinico :D</small>
        </div>
        <nav className="nav">
          {enlaces.map((e) => (
            <NavLink
              key={e.to}
              to={e.to}
              end={e.end}
              className={({ isActive }) => (isActive ? 'nav-link activo' : 'nav-link')}
            >
              {e.texto}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="contenido">
        <ErrorBoundary key={pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  )
}