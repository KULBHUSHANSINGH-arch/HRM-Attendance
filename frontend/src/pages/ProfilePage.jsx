import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { updatePassword, updateProfile } from '../api/profile'
import Alert from '../components/Alert'
import PasswordInput from '../components/PasswordInput'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [profileForm, setProfileForm] = useState({ name: user.name, phone: user.phone || '' })
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  const backTo = user.role === 'admin' ? '/admin/dashboard' : '/attendance'

  async function handleProfileSubmit(event) {
    event.preventDefault()
    setProfileError('')
    setProfileSuccess('')
    setSavingProfile(true)

    try {
      await updateProfile(profileForm)
      setProfileSuccess('Profile updated successfully.')
    } catch (err) {
      setProfileError(err.response?.data?.errors?.name?.[0] || err.response?.data?.message || 'Unable to update profile.')
    } finally {
      setSavingProfile(false)
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')
    setSavingPassword(true)

    try {
      await updatePassword(passwordForm)
      setPasswordForm({ current_password: '', new_password: '', new_password_confirmation: '' })
      setPasswordSuccess('Password changed successfully.')
    } catch (err) {
      const errors = err.response?.data?.errors
      setPasswordError(
        errors?.current_password?.[0] || errors?.new_password?.[0] || err.response?.data?.message || 'Unable to change password.',
      )
    } finally {
      setSavingPassword(false)
    }
  }

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <Link to={backTo} className="text-sm font-medium text-brand-600 hover:text-brand-700">
            ← Back
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Logout
          </button>
        </div>

        <h1 className="text-2xl font-semibold text-slate-800">My Profile</h1>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700">Profile Details</h2>
          <form onSubmit={handleProfileSubmit} className="mt-3 space-y-4">
            {profileError && <Alert variant="error">{profileError}</Alert>}
            {profileSuccess && <Alert variant="success">{profileSuccess}</Alert>}

            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input value={user.email} disabled className="input mt-1 bg-slate-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Full Name</label>
              <input
                required
                value={profileForm.name}
                onChange={(event) => setProfileForm((prev) => ({ ...prev, name: event.target.value }))}
                className="input mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Phone</label>
              <input
                value={profileForm.phone}
                onChange={(event) => setProfileForm((prev) => ({ ...prev, phone: event.target.value }))}
                className="input mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {savingProfile ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="mt-3 space-y-4">
            {passwordError && <Alert variant="error">{passwordError}</Alert>}
            {passwordSuccess && <Alert variant="success">{passwordSuccess}</Alert>}

            <div>
              <label className="block text-sm font-medium text-slate-700">Current Password</label>
              <PasswordInput
                required
                value={passwordForm.current_password}
                onChange={(event) => setPasswordForm((prev) => ({ ...prev, current_password: event.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">New Password</label>
              <PasswordInput
                required
                value={passwordForm.new_password}
                onChange={(event) => setPasswordForm((prev) => ({ ...prev, new_password: event.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Confirm New Password</label>
              <PasswordInput
                required
                value={passwordForm.new_password_confirmation}
                onChange={(event) =>
                  setPasswordForm((prev) => ({ ...prev, new_password_confirmation: event.target.value }))
                }
                className="mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {savingPassword ? 'Saving…' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
