export default function LateBadge({ isLate }) {
  if (!isLate) return null

  return (
    <span className="ml-1.5 inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
      Late
    </span>
  )
}
