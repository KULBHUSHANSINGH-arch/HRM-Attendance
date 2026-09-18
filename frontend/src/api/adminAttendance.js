import client from './client'

export function fetchAttendances(params) {
  return client.get('/admin/attendances', { params }).then((res) => res.data)
}

export function createAttendance(payload) {
  return client.post('/admin/attendances', payload).then((res) => res.data.attendance)
}

export function updateAttendance(id, payload) {
  return client.put(`/admin/attendances/${id}`, payload).then((res) => res.data.attendance)
}

export function deleteAttendance(id) {
  return client.delete(`/admin/attendances/${id}`).then((res) => res.data)
}
