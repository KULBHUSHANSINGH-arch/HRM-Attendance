import { useEffect, useState } from 'react'
import { downloadMonthlyReportCsv, fetchMonthlyReport } from '../../api/reports'
import Spinner from '../../components/Spinner'
import Alert from '../../components/Alert'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const now = new Date()
const CURRENT_YEAR = now.getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i)

export default function MonthlyReportPage() {
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(CURRENT_YEAR)
  const [report, setReport] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError('')
    fetchMonthlyReport(month, year)
      .then((data) => setReport(data.report))
      .catch(() => setError('Unable to load the monthly report.'))
      .finally(() => setLoading(false))
  }, [month, year])

  async function handleExport() {
    setExporting(true)
    try {
      await downloadMonthlyReportCsv(month, year)
    } catch {
      setError('Unable to export this report.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-800">Monthly Report</h1>
        <div className="flex gap-3">
          <select value={month} onChange={(event) => setMonth(Number(event.target.value))} className="input max-w-48">
            {MONTHS.map((label, index) => (
              <option key={label} value={index + 1}>
                {label}
              </option>
            ))}
          </select>
          <select value={year} onChange={(event) => setYear(Number(event.target.value))} className="input max-w-28">
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
          >
            {exporting ? 'Exporting…' : 'Export CSV'}
          </button>
        </div>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Present</th>
                <th className="px-4 py-3">Absent</th>
                <th className="px-4 py-3">Half Day</th>
                <th className="px-4 py-3">Leave</th>
                <th className="px-4 py-3">Holiday</th>
                <th className="px-4 py-3">Total Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center">
                    <Spinner className="mx-auto h-6 w-6" />
                  </td>
                </tr>
              ) : report.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    No employees found.
                  </td>
                </tr>
              ) : (
                report.map((row) => (
                  <tr key={row.user_id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{row.employee_name}</p>
                      <p className="text-xs text-slate-500">{row.employee_code}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{row.department || '—'}</td>
                    <td className="px-4 py-3 text-emerald-600">{row.present_days}</td>
                    <td className="px-4 py-3 text-rose-600">{row.absent_days}</td>
                    <td className="px-4 py-3 text-amber-600">{row.half_days}</td>
                    <td className="px-4 py-3 text-sky-600">{row.leave_days}</td>
                    <td className="px-4 py-3 text-violet-600">{row.holiday_days}</td>
                    <td className="px-4 py-3 text-slate-700">{row.total_hours}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
