import { useState } from 'react'
import Modal from './Modal'
import Alert from './Alert'
import { createAttendance, updateAttendance } from '../api/adminAttendance'
import { STATUS_OPTIONS } from '../utils/status'

export default function AttendanceFormModal({ attendance, employees, onClose, onSaved }) {
  const isEdit = Boolean(attendance)

  const [form, setForm] = useState({
    user_id: attendance?.user_id || '',
    date: attendance?.date || '',
    status: attendance?.status || 'present',
    login_time: attendance?.login_time || '',
    logout_time: attendance?.logout_time || '',
    remarks: attendance?.remarks || '',
  })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setErrors({})
    setSubmitting(true)

    const payload = {
      ...form,
      login_time: form.login_time || null,
      logout_time: form.logout_time || null,
      remarks: form.remarks || null,
    }

    try {
      const saved = isEdit ? await updateAttendance(attendance.id, payload) : await createAttendance(payload)
      onSaved(saved)
    } catch (err) {
      if (err.response?.status === 422 && err.response.data.errors) {
        setErrors(err.response.data.errors)
      } else {
        setError(err.response?.data?.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title={isEdit ? 'Edit Attendance' : 'Mark Attendance'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}

        <Field label="Employee" error={errors.user_id?.[0]}>
          <select
            required
            disabled={isEdit}
            value={form.user_id}
            onChange={(event) => handleChange('user_id', event.target.value)}
            className="input disabled:bg-slate-100"
          >
            <option value="" disabled>
              Select employee
            </option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name} {employee.employee_code ? `(${employee.employee_code})` : ''}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Date" error={errors.date?.[0]}>
            <input
              type="date"
              required
              value={form.date}
              onChange={(event) => handleChange('date', event.target.value)}
              className="input"
            />
          </Field>

          <Field label="Status" error={errors.status?.[0]}>
            <select
              required
              value={form.status}
              onChange={(event) => handleChange('status', event.target.value)}
              className="input"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Punch In Time" error={errors.login_time?.[0]}>
            <input
              type="time"
              value={form.login_time}
              onChange={(event) => handleChange('login_time', event.target.value)}
              className="input"
            />
          </Field>

          <Field label="Punch Out Time" error={errors.logout_time?.[0]}>
            <input
              type="time"
              value={form.logout_time}
              onChange={(event) => handleChange('logout_time', event.target.value)}
              className="input"
            />
          </Field>
        </div>

        <Field label="Remarks" error={errors.remarks?.[0]}>
          <textarea
            rows={2}
            value={form.remarks}
            onChange={(event) => handleChange('remarks', event.target.value)}
            className="input"
          />
        </Field>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {submitting ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="mt-1">{children}</div>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  )
}
