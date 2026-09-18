import { statusClasses, statusLabel } from '../utils/status'

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses(status)}`}>
      {statusLabel(status)}
    </span>
  )
}
