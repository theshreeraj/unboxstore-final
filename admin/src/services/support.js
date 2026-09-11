import api from '../lib/api'

export const listTickets = (params) => api.get('/support', { params }).then((r) => r.data)
export const getTicket = (id) => api.get(`/support/${id}`).then((r) => r.data)
export const replyToTicket = (id, text) => api.post(`/support/${id}/messages`, { text }).then((r) => r.data)
export const updateTicket = (id, data) => api.patch(`/support/${id}`, data).then((r) => r.data)
