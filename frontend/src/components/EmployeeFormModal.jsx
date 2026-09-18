import { useState } from 'react'
import Modal from './Modal'
import Alert from './Alert'
import PasswordInput from './PasswordInput'
import { createEmployee, updateEmployee } from '../api/employees'

const EMPTY_FORM = {
  name: '',
  email: '',
  password: '',
  employee_code: '',
  phone: '',
  department: '',
  designation: '',
  date_of_joining: '',
  is_active: true,
}

export default function EmployeeFormModal({ employee, onClose, onSaved }) {
  const isEdit = Boolean(employee)
  const [form, setForm] = useState(
    isEdit
      ? {
          ...EMPTY_FORM,
          ...employee,
          password: '',
          date_of_joining: employee.date_of_joining || '',
        }
      : EMPTY_FORM,
  )
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

    const payload = { ...form }
    if (isEdit && !payload.password) {
      delete payload.password
    }

    try {
      const saved = isEdit ? await updateEmployee(employee.id, payload) : await createEmployee(payload)
      onSaved(saved)
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      } else {
        setError(err.response?.data?.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title={isEdit ? 'Edit Employee' : 'Add Employee'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full Name" error={errors.name?.[0]}>
            <input
              required
              value={form.name}
              onChange={(event) => handleChange('name', event.target.value)}
              className="input"
            />
          </Field>

          <Field label="Email" error={errors.email?.[0]}>
            <input
              type="email"
              required
              value={form.email}
              onChange={(event) => handleChange('email', event.target.value)}
              className="input"
            />
          </Field>

          <Field label={isEdit ? 'New Password (optional)' : 'Password'} error={errors.password?.[0]}>
            <PasswordInput
              required={!isEdit}
              value={form.password}
              onChange={(event) => handleChange('password', event.target.value)}
            />
          </Field>

          <Field label="Employee Code" error={errors.employee_code?.[0]}>
            <input
              value={form.employee_code || ''}
              onChange={(event) => handleChange('employee_code', event.target.value)}
              className="input"
            />
          </Field>

          <Field label="Phone" error={errors.phone?.[0]}>
            <input
              value={form.phone || ''}
              onChange={(event) => handleChange('phone', event.target.value)}
              className="input"
            />
          </Field>

          <Field label="Department" error={errors.department?.[0]}>
            <input
              value={form.department || ''}
              onChange={(event) => handleChange('department', event.target.value)}
              className="input"
            />
          </Field>

          <Field label="Designation" error={errors.designation?.[0]}>
            <input
              value={form.designation || ''}
              onChange={(event) => handleChange('designation', event.target.value)}
              className="input"
            />
          </Field>

          <Field label="Date of Joining" error={errors.date_of_joining?.[0]}>
            <input
              type="date"
              value={form.date_of_joining || ''}
              onChange={(event) => handleChange('date_of_joining', event.target.value)}
              className="input"
            />
          </Field>
        </div>

        {isEdit && (
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={Boolean(form.is_active)}
              onChange={(event) => handleChange('is_active', event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            Active
          </label>
        )}

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
