import client from './client'

export function fetchHolidays(params) {
  return client.get('/admin/holidays', { params }).then((res) => res.data.holidays)
}

export function createHoliday(payload) {
  return client.post('/admin/holidays', payload).then((res) => res.data.holiday)
}

export function deleteHoliday(id) {
  return client.delete(`/admin/holidays/${id}`).then((res) => res.data)
}
