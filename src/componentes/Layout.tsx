import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

export default function Layout() {
  const { usuario, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Header con datos de sesión */}
      <header className="bg-white shadow-sm border-b border-stone-200 px-6 py-4 flex justify-between items-center">
        <div>
          <span className="font-bold text-lg text-emerald-700">Clínica - Sistema Médico</span>
        </div>

        <div className="flex items-center gap-4">
          {usuario && (
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800">{usuario.nombre}</p>
              <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-medium">
                {usuario.rol}
              </span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 text-sm font-medium rounded-lg transition-colors border border-rose-200"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}