import { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Layout from './componentes/Layout';
import PaginaDashboard from './pages/PaginaDashboard';
import { LoginPage } from './pages/LoginPage';
import { useAuthStore } from './stores/useAuthStore';
import './App.css';

const PaginaPacientes = lazy(() => import('./pages/PaginaPacientes'));
const PaginaMedicos = lazy(() => import('./pages/PaginaMedicos'));
const PaginaNuevaCita = lazy(() => import('./pages/PaginaNuevaCita'));
const PaginaReportes = lazy(() => import('./pages/PaginaReportes'));

/* interface RutaProtegidaProps {
  rolesPermitidos?: string[];
}

function RutaProtegida({ rolesPermitidos }: RutaProtegidaProps) {
  const autenticado = useAuthStore((state) => state.autenticado);
  const token = useAuthStore((state) => state.token);
  const usuario = useAuthStore((state) => state.usuario);
  
  const [rehidratado, setRehidratado] = useState(
    useAuthStore.persist.hasHydrated(),
  );

  useEffect(() => {
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setRehidratado(true);
    });
    return unsubscribe;
  }, []);

  if (!rehidratado) {
    return (
      <div className="flex justify-center items-center h-screen bg-stone-50">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent" />
      </div>
    );
  }

  // Validamos que exista autenticación y token
  if (!autenticado || !token) {
    return <Navigate to="/login" replace />;
  } 

  if (rolesPermitidos && usuario && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/sin-acceso" replace />;
  } 

  return <Outlet />;
} */

export default function App() {
  return (
    <Suspense 
      fallback={
        <div className="flex justify-center items-center h-screen bg-stone-50">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-600 rounded-full border-t-transparent" />
        </div>
      }
    >
      <Routes>
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

        <Route element={<Layout />}>
          <Route index element={<PaginaDashboard />} />
          <Route path="pacientes" element={<PaginaPacientes />} />
          <Route path="medicos" element={<PaginaMedicos />} />
          <Route path="citas/nueva" element={<PaginaNuevaCita />} />


          <Route path="reportes" element={<PaginaReportes />} />
        </Route>

        <Route 
          path="*" 
          element={
            <div className="p-8 text-center">
              <h1 className="text-xl font-bold">Página no encontrada</h1>
            </div>
          } 
        />
      </Routes>
    </Suspense>
  );
}