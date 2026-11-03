import { PackageOpen } from 'lucide-react';

interface EstadoVacioProps {
  titulo: string;
  descripcion?: string;
  accion?: {
    label: string;
    onClick: () => void;
  };
}

export function EstadoVacio({ titulo, descripcion, accion }: EstadoVacioProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <PackageOpen size={42} className="mx-auto text-slate-400" />
      <h3 className="mt-4 font-semibold text-slate-800">{titulo}</h3>
      {descripcion && <p className="mt-1 text-sm text-slate-500">{descripcion}</p>}
      {accion && (
        <button
          type="button"
          onClick={accion.onClick}
          className="mt-5 rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-800"
        >
          {accion.label}
        </button>
      )}
    </div>
  );
}