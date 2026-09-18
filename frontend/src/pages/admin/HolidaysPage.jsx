import { useEffect, useState } from 'react'
import { createHoliday, deleteHoliday, fetchHolidays } from '../../api/holidays'
import Spinner from '../../components/Spinner'
import Alert from '../../components/Alert'

const EMPTY_FORM = { date: '', name: '' }

export default function HolidaysPage() {
  const [holidays, setHolidays] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  function load() {
    setLoading(true)
    fetchHolidays()
      .then(setHolidays)
      .catch(() => setError('Unable to load holidays.'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')
    setSubmitting(true)

    try {
      await createHoliday(form)
      setForm(EMPTY_FORM)
      load()
    } catch (err) {
      setFormError(err.response?.data?.errors?.date?.[0] || err.response?.data?.message || 'Unable to add holiday.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(holiday) {
    if (!window.confirm(`Remove ${holiday.name} (${holiday.date})?`)) return

    try {
      await deleteHoliday(holiday.id)
      load()
    } catch {
      setError('Unable to remove this holiday.')
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-800">Company Holidays</h1>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700">Add Holiday</h2>
        <form onSubmit={handleSubmit} className="mt-3 flex flex-wrap items-end gap-3">
          {formError && (
            <div className="w-full">
              <Alert variant="error">{formError}</Alert>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700">Date</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
              className="input mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Name</label>
            <input
              required
              placeholder="e.g. Diwali"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="input mt-1"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {submitting ? 'Adding…' : 'Add Holiday'}
          </button>
        </form>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center">
                    <Spinner className="mx-auto h-6 w-6" />
                  </td>
                </tr>
              ) : holidays.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                    No holidays defined yet.
                  </td>
                </tr>
              ) : (
                holidays.map((holiday) => (
                  <tr key={holiday.id}>
                    <td className="px-4 py-3 text-slate-600">{holiday.date.slice(0, 10)}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{holiday.name}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(holiday)}
                        className="text-sm font-medium text-rose-600 hover:text-rose-700"
                      >
                        Remove
                      </button>
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
