import { useEffect, useState } from 'react'
import { fetchToday, punchIn, punchOut } from '../../api/attendance'
import { getCurrentPosition } from '../../utils/geolocation'
import StatusBadge from '../../components/StatusBadge'
import LateBadge from '../../components/LateBadge'
import Spinner from '../../components/Spinner'
import Alert from '../../components/Alert'

export default function MyAttendancePage() {
  const [attendance, setAttendance] = useState(null)
  const [holidayName, setHolidayName] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')

  function load() {
    setLoading(true)
    fetchToday()
      .then((data) => {
        setAttendance(data.attendance)
        setHolidayName(data.holiday_name)
      })
      .catch(() => setError('Unable to load today\'s attendance.'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handlePunchIn() {
    setError('')
    setActionLoading(true)
    try {
      const coordinates = await getCurrentPosition()
      const result = await punchIn(coordinates)
      setAttendance(result)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to punch in.')
    } finally {
      setActionLoading(false)
    }
  }

  async function handlePunchOut() {
    setError('')
    setActionLoading(true)
    try {
      const coordinates = await getCurrentPosition()
      const result = await punchOut(coordinates)
      setAttendance(result)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to punch out.')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-800">Today&rsquo;s Attendance</h1>

      {error && <Alert variant="error">{error}</Alert>}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {holidayName && !attendance ? (
          <div className="text-center">
            <StatusBadge status="holiday" />
            <p className="mt-3 text-slate-600">Today is {holidayName}. Enjoy your day off!</p>
          </div>
        ) : !attendance ? (
          <div className="text-center">
            <p className="text-slate-500">You have not punched in yet today.</p>
            <p className="mt-1 text-xs text-slate-400">Your current location will be recorded with your punch in.</p>
            <button
              type="button"
              onClick={handlePunchIn}
              disabled={actionLoading}
              className="mt-4 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {actionLoading ? 'Punching in…' : 'Punch In'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <StatusBadge status={attendance.status} />
                <LateBadge isLate={attendance.is_late} />
              </div>
              <span className="text-sm text-slate-500">{attendance.date}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs uppercase text-slate-400">Punch In</p>
                <p className="text-lg font-semibold text-slate-800">{attendance.login_time || '—'}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-400">Punch Out</p>
                <p className="text-lg font-semibold text-slate-800">{attendance.logout_time || '—'}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-400">Hours</p>
                <p className="text-lg font-semibold text-slate-800">{attendance.total_hours ?? '—'}</p>
              </div>
            </div>

            {!attendance.logout_time && (
              <button
                type="button"
                onClick={handlePunchOut}
                disabled={actionLoading}
                className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
              >
                {actionLoading ? 'Punching out…' : 'Punch Out'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
