import api from '../lib/api'

export const listUpdates = () => api.get('/updates').then((r) => r.data)
export const createUpdate = (data) => api.post('/updates', data).then((r) => r.data)
export const deleteUpdate = (id) => api.delete(`/updates/${id}`).then((r) => r.data)
