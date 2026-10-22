import { Route, Routes } from 'react-router-dom'
import Layout from './componentes/Layout'
import PaginaDashboard from './pages/PaginaDashboard'
import PaginaMedicos from './pages/PaginaMedicos'
import PaginaNuevaCita from './pages/PaginaNuevaCita'
import PaginaPacientes from './pages/PaginaPacientes'
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<PaginaDashboard />} />
        <Route path="pacientes" element={<PaginaPacientes />} />
        <Route path="medicos" element={<PaginaMedicos />} />
        <Route path="citas/nueva" element={<PaginaNuevaCita />} />
        <Route path="*" element={<p>Página no encontrada</p>} />
      </Route>
    </Routes>
  )
}