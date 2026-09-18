import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import RootRedirect from './routes/RootRedirect'
import AdminLayout from './layouts/AdminLayout'
import EmployeeLayout from './layouts/EmployeeLayout'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import DashboardPage from './pages/admin/DashboardPage'
import EmployeesPage from './pages/admin/EmployeesPage'
import AttendancePage from './pages/admin/AttendancePage'
import HolidaysPage from './pages/admin/HolidaysPage'
import DailyReportPage from './pages/admin/DailyReportPage'
import MonthlyReportPage from './pages/admin/MonthlyReportPage'
import MyAttendancePage from './pages/employee/MyAttendancePage'
import MyHistoryPage from './pages/employee/MyHistoryPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route element={<ProtectedRoute role="admin" />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<DashboardPage />} />
              <Route path="/admin/employees" element={<EmployeesPage />} />
              <Route path="/admin/attendance" element={<AttendancePage />} />
              <Route path="/admin/holidays" element={<HolidaysPage />} />
              <Route path="/admin/reports/daily" element={<DailyReportPage />} />
              <Route path="/admin/reports/monthly" element={<MonthlyReportPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute role="employee" />}>
            <Route element={<EmployeeLayout />}>
              <Route path="/attendance" element={<MyAttendancePage />} />
              <Route path="/attendance/history" element={<MyHistoryPage />} />
            </Route>
          </Route>

          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
