import client from './client'

export function login(email, password) {
  return client.post('/login', { email, password }).then((res) => res.data)
}

export function logout() {
  return client.post('/logout').then((res) => res.data)
}

export function fetchMe() {
  return client.get('/me').then((res) => res.data.user)
}
