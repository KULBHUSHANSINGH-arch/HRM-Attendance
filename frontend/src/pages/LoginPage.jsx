import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Alert from '../components/Alert'
import PasswordInput from '../components/PasswordInput'
import { BuildingIcon, CalendarDaysIcon, ClockIcon, ChartBarIcon } from '../components/icons'

const FEATURES = [
  { icon: ClockIcon, text: 'Geo-tagged punch in/out with automatic hours calculation' },
  { icon: CalendarDaysIcon, text: 'Company holiday calendar with automatic status handling' },
  { icon: ChartBarIcon, text: 'Live dashboard with daily and monthly reports' },
]

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const user = await login(email, password)
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/attendance')
    } catch (err) {
      const message =
        err.response?.data?.errors?.email?.[0] ||
        err.response?.data?.message ||
        'Unable to sign in. Please try again.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-700 p-10 text-white lg:flex">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -left-10 h-80 w-80 rounded-full bg-white/10" />

        <div className="relative flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
            <BuildingIcon className="h-6 w-6" />
          </div>
          <span className="text-lg font-semibold">Attendance</span>
        </div>

        <div className="relative space-y-8">
          <h1 className="text-3xl font-semibold leading-snug">
            Employee Attendance Management, simplified.
          </h1>
          <div className="space-y-4">
            {FEATURES.map((feature) => (
              <div key={feature.text} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <feature.icon className="h-4 w-4" />
                </span>
                <p className="text-sm text-brand-50">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-brand-100">Built for admins and employees alike.</p>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
              <BuildingIcon className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold text-slate-800">Attendance</span>
          </div>

          <h2 className="text-xl font-semibold text-slate-800">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-500">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && <Alert variant="error">{error}</Alert>}

            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="input mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <PasswordInput
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
            <p className="font-medium text-slate-600">Demo accounts</p>
            <p>Admin: admin@example.com / password</p>
            <p>Employee: employee1@example.com / password</p>
          </div>
        </div>
      </div>
    </div>
  )
}
