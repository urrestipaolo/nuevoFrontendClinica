interface SpinnerProps {
  fullscreen?: boolean;
}

export function Spinner({ fullscreen = false }: SpinnerProps) {
  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-600 border-t-transparent" />
      </div>
    );
  }
  return <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />;
}