import { useEffect, useState } from 'react'
import { fetchHistory } from '../../api/attendance'
import StatusBadge from '../../components/StatusBadge'
import LateBadge from '../../components/LateBadge'
import Pagination from '../../components/Pagination'
import Spinner from '../../components/Spinner'
import Alert from '../../components/Alert'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const now = new Date()
const CURRENT_YEAR = now.getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i)

export default function MyHistoryPage() {
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(CURRENT_YEAR)
  const [page, setPage] = useState(1)
  const [records, setRecords] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    fetchHistory({ month, year, page })
      .then((data) => {
        setRecords(data.data)
        setMeta(data.meta)
      })
      .catch(() => setError('Unable to load attendance history.'))
      .finally(() => setLoading(false))
  }, [month, year, page])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-800">My Attendance History</h1>
        <div className="flex gap-3">
          <select
            value={month}
            onChange={(event) => {
              setPage(1)
              setMonth(Number(event.target.value))
            }}
            className="input max-w-48"
          >
            {MONTHS.map((label, index) => (
              <option key={label} value={index + 1}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(event) => {
              setPage(1)
              setYear(Number(event.target.value))
            }}
            className="input max-w-28"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Punch In</th>
                <th className="px-4 py-3">Punch Out</th>
                <th className="px-4 py-3">Hours</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center">
                    <Spinner className="mx-auto h-6 w-6" />
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No attendance records for this period.
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id}>
                    <td className="px-4 py-3 text-slate-600">{record.date}</td>
                    <td className="px-4 py-3 text-slate-600">{record.login_time || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{record.logout_time || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{record.total_hours ?? '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <StatusBadge status={record.status} />
                        <LateBadge isLate={record.is_late} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{record.remarks || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination meta={meta} onPageChange={setPage} />
      </div>
    </div>
  )
}
