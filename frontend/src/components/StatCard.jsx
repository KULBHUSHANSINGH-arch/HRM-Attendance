export default function StatCard({ label, value, icon: IconComponent, tone = 'slate' }) {
  const toneClasses = {
    slate: 'bg-slate-100 text-slate-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    rose: 'bg-rose-100 text-rose-600',
    amber: 'bg-amber-100 text-amber-600',
    sky: 'bg-sky-100 text-sky-600',
    violet: 'bg-violet-100 text-violet-600',
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {IconComponent && (
          <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${toneClasses[tone]}`}>
            <IconComponent className="h-5 w-5" />
          </span>
        )}
      </div>
      <p className="mt-3 text-3xl font-semibold text-slate-800">{value}</p>
    </div>
  )
}
