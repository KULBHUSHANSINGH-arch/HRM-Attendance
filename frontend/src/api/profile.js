import client from './client'

export function updateProfile(payload) {
  return client.put('/profile', payload).then((res) => res.data.user)
}

export function updatePassword(payload) {
  return client.put('/profile/password', payload).then((res) => res.data)
}
