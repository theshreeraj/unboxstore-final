import api from '../lib/api'

export const listUsers = (params) => api.get('/users', { params }).then((r) => r.data)
export const updateUser = (id, data) => api.patch(`/users/${id}`, data).then((r) => r.data)
export const deleteUser = (id) => api.delete(`/users/${id}`).then((r) => r.data)
export const updateMe = (data) => api.patch('/users/me', data).then((r) => r.data)
