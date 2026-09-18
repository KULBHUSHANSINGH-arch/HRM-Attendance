export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null

  return (
    <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
      <p className="text-sm text-slate-500">
        Page {meta.current_page} of {meta.last_page} &middot; {meta.total} records
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={meta.current_page <= 1}
          onClick={() => onPageChange(meta.current_page - 1)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={meta.current_page >= meta.last_page}
          onClick={() => onPageChange(meta.current_page + 1)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}
