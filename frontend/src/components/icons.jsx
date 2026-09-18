function Icon({ children, className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {children}
    </svg>
  )
}

export function DashboardIcon(props) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.2" />
    </Icon>
  )
}

export function UsersIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5" />
      <circle cx="17" cy="8.5" r="2.5" />
      <path d="M15.5 14.7c2.3.3 4 2.2 4 5.3" />
    </Icon>
  )
}

export function ClockIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </Icon>
  )
}

export function CalendarDaysIcon(props) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="4.5" width="17" height="16" rx="2" />
      <path d="M3.5 9.5h17" />
      <path d="M8 3v3M16 3v3" />
      <path d="M7.5 13.5h2M11 13.5h2M14.5 13.5h2M7.5 17h2M11 17h2" />
    </Icon>
  )
}

export function SunIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
    </Icon>
  )
}

export function DocumentIcon(props) {
  return (
    <Icon {...props}>
      <path d="M6.5 3.5h7l4 4v13h-11z" />
      <path d="M13.5 3.5v4h4" />
      <path d="M9 13h6M9 16.5h6" />
    </Icon>
  )
}

export function ChartBarIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 20V10M10 20V4M16 20v-7M20 20H4" />
    </Icon>
  )
}

export function SettingsIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13.5a7.9 7.9 0 0 0 0-3l1.9-1.5-2-3.4-2.3.6a7.7 7.7 0 0 0-2.6-1.5L14 2h-4l-.4 2.7a7.7 7.7 0 0 0-2.6 1.5l-2.3-.6-2 3.4L4.6 10.5a7.9 7.9 0 0 0 0 3l-1.9 1.5 2 3.4 2.3-.6c.8.7 1.7 1.2 2.6 1.5L10 22h4l.4-2.7a7.7 7.7 0 0 0 2.6-1.5l2.3.6 2-3.4z" />
    </Icon>
  )
}

export function UserCircleIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="10" r="3" />
      <path d="M6.3 18.2c.9-2.4 3-3.7 5.7-3.7s4.8 1.3 5.7 3.7" />
    </Icon>
  )
}

export function LogoutIcon(props) {
  return (
    <Icon {...props}>
      <path d="M9 21H5.5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2H9" />
      <path d="M16 17l4.5-5L16 7" />
      <path d="M20.5 12H9" />
    </Icon>
  )
}

export function MenuIcon(props) {
  return (
    <Icon {...props}>
      <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" />
    </Icon>
  )
}

export function CloseIcon(props) {
  return (
    <Icon {...props}>
      <path d="M5 5l14 14M19 5L5 19" />
    </Icon>
  )
}

export function ChevronDownIcon(props) {
  return (
    <Icon {...props}>
      <path d="M6 9l6 6 6-6" />
    </Icon>
  )
}

export function EyeIcon(props) {
  return (
    <Icon {...props}>
      <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  )
}

export function EyeOffIcon(props) {
  return (
    <Icon {...props}>
      <path d="M3 3l18 18" />
      <path d="M10.6 5.2A9.9 9.9 0 0 1 12 5c6 0 9.5 7 9.5 7a16.5 16.5 0 0 1-3.2 4.1M6.5 6.9C3.9 8.6 2.5 12 2.5 12s3.5 7 9.5 7c1.3 0 2.5-.3 3.6-.8" />
      <path d="M9.9 10.1a3 3 0 0 0 4.1 4.1" />
    </Icon>
  )
}

export function BuildingIcon(props) {
  return (
    <Icon {...props}>
      <rect x="5" y="3.5" width="14" height="17" rx="1.2" />
      <path d="M9 7.5h.01M12 7.5h.01M15 7.5h.01M9 11h.01M12 11h.01M15 11h.01M9 14.5h.01M12 14.5h.01M15 14.5h.01" strokeWidth="2.2" />
      <path d="M10 20.5v-4h4v4" />
    </Icon>
  )
}
