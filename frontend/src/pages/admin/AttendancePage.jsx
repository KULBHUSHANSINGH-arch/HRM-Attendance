import { useEffect, useState } from 'react'
import { fetchAttendances, deleteAttendance } from '../../api/adminAttendance'
import { fetchEmployees } from '../../api/employees'
import AttendanceFormModal from '../../components/AttendanceFormModal'
import StatusBadge from '../../components/StatusBadge'
import LateBadge from '../../components/LateBadge'
import Pagination from '../../components/Pagination'
import Spinner from '../../components/Spinner'
import Alert from '../../components/Alert'
import { STATUS_OPTIONS } from '../../utils/status'

export default function AttendancePage() {
  const [records, setRecords] = useState([])
  const [meta, setMeta] = useState(null)
  const [employees, setEmployees] = useState([])
  const [date, setDate] = useState('')
  const [status, setStatus] = useState('')
  const [userId, setUserId] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)

  useEffect(() => {
    fetchEmployees({ per_page: 100 }).then((data) => setEmployees(data.data))
  }, [])

  function load() {
    setLoading(true)
    setError('')
    fetchAttendances({
      date: date || undefined,
      status: status || undefined,
      user_id: userId || undefined,
      page,
    })
      .then((data) => {
        setRecords(data.data)
        setMeta(data.meta)
      })
      .catch(() => setError('Unable to load attendance records.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, status, userId, page])

  async function handleDelete(record) {
    if (!window.confirm(`Delete attendance record for ${record.employee_name} on ${record.date}?`)) return

    try {
      await deleteAttendance(record.id)
      load()
    } catch {
      setError('Unable to delete this record.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-800">Attendance Records</h1>
        <button
          type="button"
          onClick={() => {
            setEditingRecord(null)
            setModalOpen(true)
          }}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Mark Attendance
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="date"
          value={date}
          onChange={(event) => {
            setPage(1)
            setDate(event.target.value)
          }}
          className="input max-w-48"
        />
        <select
          value={status}
          onChange={(event) => {
            setPage(1)
            setStatus(event.target.value)
          }}
          className="input max-w-40"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={userId}
          onChange={(event) => {
            setPage(1)
            setUserId(event.target.value)
          }}
          className="input max-w-56"
        >
          <option value="">All Employees</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Punch In</th>
                <th className="px-4 py-3">Punch Out</th>
                <th className="px-4 py-3">Hours</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    <Spinner className="mx-auto h-6 w-6" />
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{record.employee_name}</p>
                      <p className="text-xs text-slate-500">{record.employee_code}</p>
                    </td>
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
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingRecord(record)
                          setModalOpen(true)
                        }}
                        className="mr-3 text-sm font-medium text-brand-600 hover:text-brand-700"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(record)}
                        className="text-sm font-medium text-rose-600 hover:text-rose-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination meta={meta} onPageChange={setPage} />
      </div>

      {modalOpen && (
        <AttendanceFormModal
          attendance={editingRecord}
          employees={employees}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false)
            load()
          }}
        />
      )}
    </div>
  )
}
