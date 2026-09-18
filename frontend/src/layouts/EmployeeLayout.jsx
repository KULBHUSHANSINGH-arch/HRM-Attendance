import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  BuildingIcon,
  CalendarDaysIcon,
  ClockIcon,
  CloseIcon,
  LogoutIcon,
  MenuIcon,
  UserCircleIcon,
} from '../components/icons'

const NAV_ITEMS = [
  { to: '/attendance', label: 'Today', icon: ClockIcon, end: true },
  { to: '/attendance/history', label: 'My History', icon: CalendarDaysIcon },
  { to: '/profile', label: 'Profile', icon: UserCircleIcon },
]

const COLLAPSE_STORAGE_KEY = 'employee_sidebar_collapsed'

function NavItem({ item, onNavigate, collapsed }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          collapsed ? 'justify-center' : ''
        } ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'}`
      }
    >
      <item.icon className="h-5 w-5 shrink-0" />
      {!collapsed && item.label}
    </NavLink>
  )
}

function SidebarContent({ onNavigate, collapsed = false, onToggleCollapse }) {
  return (
    <div className="flex h-full flex-col">
      <div className={`flex items-center gap-2 px-4 py-5 ${collapsed ? 'flex-col' : ''}`}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
          <BuildingIcon className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">Attendance</p>
            <p className="truncate text-xs text-slate-400">Employee Portal</p>
          </div>
        )}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 px-3 pb-4">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.to} item={item} onNavigate={onNavigate} collapsed={collapsed} />
        ))}
      </nav>
    </div>
  )
}

export default function EmployeeLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSE_STORAGE_KEY) === '1'
    } catch {
      return false
    }
  })

  function toggleCollapse() {
    setCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem(COLLAPSE_STORAGE_KEY, next ? '1' : '0')
      } catch {
        // ignore storage failures (private browsing, etc.)
      }
      return next
    })
  }

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <aside
        className={`hidden shrink-0 border-r border-slate-200 bg-white transition-all duration-200 md:block ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <SidebarContent collapsed={collapsed} onToggleCollapse={toggleCollapse} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className="flex justify-end px-3 pt-3">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 md:hidden"
            aria-label="Open menu"
          >
            <MenuIcon className="h-6 w-6" />
          </button>

          <div className="ml-auto flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-700">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.employee_code}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <LogoutIcon className="h-4 w-4" />
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
