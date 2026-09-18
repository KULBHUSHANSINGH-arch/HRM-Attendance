import { useEffect, useState } from 'react'
import { fetchDashboard } from '../../api/dashboard'
import StatCard from '../../components/StatCard'
import Spinner from '../../components/Spinner'
import Alert from '../../components/Alert'
import { CalendarDaysIcon, ClockIcon, SunIcon, UsersIcon } from '../../components/icons'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
      .then(setStats)
      .catch(() => setError('Unable to load dashboard stats.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return <Alert variant="error">{error}</Alert>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Today&rsquo;s attendance at a glance.</p>
      </div>

      {stats.is_holiday_today && <Alert variant="success">Today is {stats.holiday_name} — company holiday.</Alert>}

      {stats.pending_leave_requests > 0 && (
        <Alert variant="error">
          {stats.pending_leave_requests} leave request(s) awaiting your review.{' '}
          <Link to="/admin/leave-requests" className="font-medium underline">
            Review now
          </Link>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Employees" value={stats.total_employees} icon={UsersIcon} tone="slate" />
        <StatCard label="Present Today" value={stats.present_today} icon={ClockIcon} tone="emerald" />
        <StatCard label="Absent Today" value={stats.absent_today} icon={ClockIcon} tone="rose" />
        <StatCard label="Half Day Today" value={stats.half_day_today} icon={ClockIcon} tone="amber" />
        <StatCard label="On Leave Today" value={stats.on_leave_today} icon={CalendarDaysIcon} tone="sky" />
        <StatCard label="Holiday Today" value={stats.holiday_today} icon={SunIcon} tone="violet" />
      </div>

      <p className="text-sm text-slate-500">
        {stats.not_marked_today} employee(s) have not marked attendance yet today.
      </p>
    </div>
  )
}
