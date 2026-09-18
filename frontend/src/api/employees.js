import client from './client'

export function fetchEmployees(params) {
  return client.get('/admin/employees', { params }).then((res) => res.data)
}

export function createEmployee(payload) {
  return client.post('/admin/employees', payload).then((res) => res.data.employee)
}

export function updateEmployee(id, payload) {
  return client.put(`/admin/employees/${id}`, payload).then((res) => res.data.employee)
}

export function deactivateEmployee(id) {
  return client.delete(`/admin/employees/${id}`).then((res) => res.data)
}
