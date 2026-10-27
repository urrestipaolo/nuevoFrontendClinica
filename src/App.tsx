import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Layout from './componentes/Layout';
import PaginaDashboard from './pages/PaginaDashboard';
import PaginaMedicos from './pages/PaginaMedicos';
import PaginaNuevaCita from './pages/PaginaNuevaCita';
import PaginaPacientes from './pages/PaginaPacientes';
import PaginaReportes from './pages/PaginaReportes';
import { LoginPage } from './pages/LoginPage';
import { useAuthStore } from './stores/useAuthStore';
import { useEffect, useState } from 'react';
import { RutaProtegida } from './componentes/RutaProtegida';
import './App.css';

interface RutaProtegidaProps {
  rolesPermitidos?: string[];
}

/* function RutaProtegida({ rolesPermitidos }: RutaProtegidaProps) {
  // Selectores independientes para garantizar que React detecte los cambios de estado al instante
  const autenticado = useAuthStore((state) => state.autenticado);
  const token = useAuthStore((state) => state.token);
  const usuario = useAuthStore((state) => state.usuario);
  
  const [rehidratado, setRehidratado] = useState(
    useAuthStore.persist.hasHydrated(),
  );

  useEffect(() => {
    // Si ya está rehidratado, nos aseguramos de marcarlo
    if (useAuthStore.persist.hasHydrated()) {
      setRehidratado(true);
    }

    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setRehidratado(true);
    });
    return unsubscribe;
  }, []);

  // Mientras Zustand carga del localStorage, mostramos un spinner para evitar saltos falsos
  if (!rehidratado) {
    return (
      <div className="flex justify-center items-center h-screen bg-stone-50">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent" />
      </div>
    );
  }

  // VALIDACIÓN CLAVE: Verificamos token o autenticado de forma flexible
  if (!autenticado || !token) {
    return <Navigate to="/login" replace />;
  }

  // Validación de roles (si se requieren)
  if (rolesPermitidos && usuario && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/sin-acceso" replace />;
  }

  return <Outlet />;
} */

export default function App() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/sin-acceso" 
        element={
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600">Acceso Denegado</h1>
            <p className="mt-2 text-gray-600">No tienes permisos para ver esta sección.</p>
          </div>
        } 
      />

      {/* Rutas Protegidas */}
      <Route element={<RutaProtegida />}>
        <Route element={<Layout />}>
          <Route index element={<PaginaDashboard />} />
          <Route path="pacientes" element={<PaginaPacientes />} />
          <Route path="medicos" element={<PaginaMedicos />} />
          <Route path="citas/nueva" element={<PaginaNuevaCita />} />

          {/* Ruta protegida por roles */}
          <Route element={<RutaProtegida rolesPermitidos={['GERENCIA', 'ADMIN']} />}>
            <Route path="reportes" element={<PaginaReportes />} />
          </Route>
        </Route>
      </Route>

      {/* Ruta 404 */}
      <Route 
        path="*" 
        element={
          <div className="p-8 text-center">
            <h1 className="text-xl font-bold">Página no encontrada</h1>
          </div>
        } 
      />
    </Routes>
  );
}