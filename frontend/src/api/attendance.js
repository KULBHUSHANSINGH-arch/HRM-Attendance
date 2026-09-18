import client from './client'

export function punchIn(coordinates) {
  return client.post('/attendance/login', coordinates || {}).then((res) => res.data.attendance)
}

export function punchOut(coordinates) {
  return client.post('/attendance/logout', coordinates || {}).then((res) => res.data.attendance)
}

export function fetchToday() {
  return client.get('/attendance/today').then((res) => res.data)
}

export function fetchHistory(params) {
  return client.get('/attendance/history', { params }).then((res) => res.data)
}
