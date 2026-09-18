import { useEffect, useState } from 'react'
import { downloadDailyReportCsv, fetchDailyReport } from '../../api/reports'
import StatusBadge from '../../components/StatusBadge'
import Spinner from '../../components/Spinner'
import Alert from '../../components/Alert'

function today() {
  return new Date().toISOString().slice(0, 10)
}

export default function DailyReportPage() {
  const [date, setDate] = useState(today())
  const [report, setReport] = useState([])
  const [holidayName, setHolidayName] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError('')
    fetchDailyReport(date)
      .then((data) => {
        setReport(data.report)
        setHolidayName(data.holiday_name)
      })
      .catch(() => setError('Unable to load the daily report.'))
      .finally(() => setLoading(false))
  }, [date])

  async function handleExport() {
    setExporting(true)
    try {
      await downloadDailyReportCsv(date)
    } catch {
      setError('Unable to export this report.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-800">Daily Report</h1>
        <div className="flex gap-3">
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="input max-w-48"
          />
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

      {holidayName && <Alert variant="success">Today is {holidayName} — company holiday.</Alert>}
      {error && <Alert variant="error">{error}</Alert>}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Punch In</th>
                <th className="px-4 py-3">Punch Out</th>
                <th className="px-4 py-3">Hours</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center">
                    <Spinner className="mx-auto h-6 w-6" />
                  </td>
                </tr>
              ) : report.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
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
                    <td className="px-4 py-3 text-slate-600">{row.login_time || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{row.logout_time || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{row.total_hours ?? '—'}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={row.status} />
                    </td>
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
