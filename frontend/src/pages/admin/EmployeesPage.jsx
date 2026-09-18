import { useEffect, useState } from 'react'
import { fetchEmployees, deactivateEmployee, updateEmployee } from '../../api/employees'
import EmployeeFormModal from '../../components/EmployeeFormModal'
import Pagination from '../../components/Pagination'
import Spinner from '../../components/Spinner'
import Alert from '../../components/Alert'

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([])
  const [meta, setMeta] = useState(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalEmployee, setModalEmployee] = useState(undefined)

  function load() {
    setLoading(true)
    setError('')
    fetchEmployees({ search: search || undefined, status: status || undefined, page })
      .then((data) => {
        setEmployees(data.data)
        setMeta(data.meta)
      })
      .catch(() => setError('Unable to load employees.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const timeout = setTimeout(load, 300)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, page])

  async function handleToggleActive(employee) {
    const activating = !employee.is_active
    if (!window.confirm(`${activating ? 'Reactivate' : 'Deactivate'} ${employee.name}?`)) return

    try {
      if (activating) {
        await updateEmployee(employee.id, { name: employee.name, email: employee.email, is_active: true })
      } else {
        await deactivateEmployee(employee.id)
      }
      load()
    } catch {
      setError('Unable to update employee status.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-800">Employees</h1>
        <button
          type="button"
          onClick={() => setModalEmployee(null)}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Add Employee
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          placeholder="Search by name, email or code"
          value={search}
          onChange={(event) => {
            setPage(1)
            setSearch(event.target.value)
          }}
          className="input max-w-xs"
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
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Designation</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center">
                    <Spinner className="mx-auto h-6 w-6" />
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No employees found.
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{employee.name}</p>
                      <p className="text-xs text-slate-500">{employee.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{employee.employee_code || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{employee.department || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{employee.designation || '—'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          employee.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {employee.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setModalEmployee(employee)}
                        className="mr-3 text-sm font-medium text-brand-600 hover:text-brand-700"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(employee)}
                        className="text-sm font-medium text-rose-600 hover:text-rose-700"
                      >
                        {employee.is_active ? 'Deactivate' : 'Reactivate'}
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

      {modalEmployee !== undefined && (
        <EmployeeFormModal
          employee={modalEmployee}
          onClose={() => setModalEmployee(undefined)}
          onSaved={() => {
            setModalEmployee(undefined)
            load()
          }}
        />
      )}
    </div>
  )
}
