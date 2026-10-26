import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import ErrorBoundary from './ErrorBoundary'
import { useAuthStore } from '../stores/useAuthStore';

const enlaces = [
  { to: '/', texto: 'Dashboard', end: false },
  { to: '/login', texto: 'Login', end: true},
  { to: '/pacientes', texto: 'Pacientes', end: false },
  { to: '/medicos', texto: 'Médicos', end: false },
  { to: '/citas/nueva', texto: 'Nueva cita', end: false },
  { to: '/reportes', texto: 'Reportes', end: false },
]

/* //PERMITE DE SE VISUALICE SOLO CUANDO ESTAMOS INICIANDO SESION
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  //VARIABLE QUE PERMITE CERRAR LA SESION (EN LAS ETIQUETAS HAY UN BOTON QUE ACCIONA ESTA VARIABLE)
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  }; */

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