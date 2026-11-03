
export function SkeletonMetricCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse">
      <div className="flex justify-between">
        <div className="h-4 w-24 bg-slate-200 rounded" />
        <div className="h-10 w-10 bg-slate-100 rounded-xl" />
      </div>
      <div className="mt-4 h-8 w-16 bg-slate-200 rounded" />
    </div>
  );
}

export function SkeletonCitaRow() {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      <td className="py-4 px-3"><div className="h-4 w-32 bg-slate-200 rounded" /></td>
      <td className="py-4 px-3"><div className="h-4 w-28 bg-slate-200 rounded" /></td>
      <td className="py-4 px-3"><div className="h-4 w-28 bg-slate-200 rounded" /></td>
      <td className="py-4 px-3"><div className="h-6 w-20 bg-slate-200 rounded-full" /></td>
      <td className="py-4 px-3"><div className="h-8 w-24 bg-slate-200 rounded-lg" /></td>
    </tr>
  );
}