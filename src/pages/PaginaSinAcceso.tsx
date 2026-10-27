import React from 'react';
import { Link } from 'react-router-dom';

export default function PaginaSinAcceso() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md text-center border border-gray-200">
        <div className="text-red-500 text-5xl mb-4 font-bold">403</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Acceso Denegado</h1>
        <p className="text-gray-600 mb-6">
          No cuentas con los permisos necesarios (rol requerido) para visualizar esta sección del sistema. Si consideras que esto es un error, contacta al administrador.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}