import client from './client'

export function fetchDailyReport(date) {
  return client.get('/admin/reports/daily', { params: { date } }).then((res) => res.data)
}

export function fetchMonthlyReport(month, year) {
  return client.get('/admin/reports/monthly', { params: { month, year } }).then((res) => res.data)
}

function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export async function downloadDailyReportCsv(date) {
  const res = await client.get('/admin/reports/daily/export', { params: { date }, responseType: 'blob' })
  downloadBlob(res.data, `daily-attendance-${date}.csv`)
}

export async function downloadMonthlyReportCsv(month, year) {
  const res = await client.get('/admin/reports/monthly/export', { params: { month, year }, responseType: 'blob' })
  downloadBlob(res.data, `monthly-attendance-${year}-${month}.csv`)
}
