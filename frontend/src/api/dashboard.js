import client from './client'

export function fetchDashboard() {
  return client.get('/admin/dashboard').then((res) => res.data)
}
