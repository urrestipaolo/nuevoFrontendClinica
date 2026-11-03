import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

type TipoAlerta = 'info' | 'exito' | 'advertencia' | 'error';

interface AlertaBannerProps {
  tipo: TipoAlerta;
  mensaje: string;
  onCerrar?: () => void;
}

const estilosAlerta: Record<TipoAlerta, { bg: string; border: string; text: string; icon: any }> = {
  info: { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-800', icon: Info },
  exito: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', icon: CheckCircle2 },
  advertencia: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: AlertTriangle },
  error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: AlertCircle },
};

export function AlertaBanner({ tipo, mensaje, onCerrar }: AlertaBannerProps) {
  const config = estilosAlerta[tipo];
  const Icono = config.icon;

  return (
    <div role="alert" className={`flex items-center justify-between gap-3 rounded-xl border ${config.border} ${config.bg} px-4 py-3 text-sm ${config.text}`}>
      <div className="flex items-center gap-2">
        <Icono size={18} className="shrink-0" />
        <span>{mensaje}</span>
      </div>
      {onCerrar && (
        <button type="button" onClick={onCerrar} className="rounded-lg p-1 hover:bg-black/5" aria-label="Cerrar alerta">
          <X size={16} />
        </button>
      )}
    </div>
  );
}