const VARIANT_CLASSES = {
  error: 'bg-rose-50 text-rose-700 border-rose-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

export default function Alert({ variant = 'error', children }) {
  if (!children) return null

  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${VARIANT_CLASSES[variant]}`}>
      {children}
    </div>
  )
}
