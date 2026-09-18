export const STATUS_OPTIONS = [
  { value: 'present', label: 'Present' },
  { value: 'absent', label: 'Absent' },
  { value: 'half_day', label: 'Half Day' },
  { value: 'leave', label: 'Leave' },
  { value: 'holiday', label: 'Holiday' },
]

const STATUS_STYLES = {
  present: 'bg-emerald-100 text-emerald-700',
  absent: 'bg-rose-100 text-rose-700',
  half_day: 'bg-amber-100 text-amber-700',
  leave: 'bg-sky-100 text-sky-700',
  holiday: 'bg-violet-100 text-violet-700',
  not_marked: 'bg-slate-100 text-slate-500',
}

export function statusLabel(status) {
  if (!status) return 'Not Marked'
  const match = STATUS_OPTIONS.find((option) => option.value === status)
  return match ? match.label : 'Not Marked'
}

export function statusClasses(status) {
  return STATUS_STYLES[status] || STATUS_STYLES.not_marked
}
