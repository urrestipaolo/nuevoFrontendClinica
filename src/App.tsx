import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './componentes/Layout'
import PaginaDashboard from './pages/PaginaDashboard'
import PaginaMedicos from './pages/PaginaMedicos'
import PaginaNuevaCita from './pages/PaginaNuevaCita'
import PaginaPacientes from './pages/PaginaPacientes'
import "./App.css";
import PaginaReportes from './pages/PaginaReportes'
import { useAuthStore } from './stores/useAuthStore'
import { useEffect, useState } from 'react'
import { LoginPage } from './pages/LoginPage'

//FUNCION QUE PERMITE QUE AL REINICIAR LA PAGINA (COMO UN F5) NO SE PIERDA LA SESION
function RutaProtegida() {
  const autenticado = useAuthStore((state) => state.autenticado);
  const token = useAuthStore((state) => state.token);
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
    return null;
  }

  //CUANDO SE AUTENTIQUE AUTOMATICAMENTE REGRESA AL DASHBOARD | SINO SE QUEDA EN LOGIN
  return autenticado && token ? (
    <PaginaDashboard />
  ) : (
    <Navigate to="/login" replace />
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='login' element={<LoginPage/>}/>
        <Route index element={<PaginaDashboard />} />
        <Route path="pacientes" element={<PaginaPacientes />} />
        <Route path="medicos" element={<PaginaMedicos />} />
        <Route path="citas/nueva" element={<PaginaNuevaCita />} />
        <Route path="reportes" element={<PaginaReportes />} />
        <Route path="*" element={<p>Página no encontrada</p>} />
      </Route>
    </Routes>
  )
}