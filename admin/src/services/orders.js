import api from '../lib/api'

export const listOrders = (params) => api.get('/orders', { params }).then((r) => r.data)
export const getOrder = (id) => api.get(`/orders/${id}`).then((r) => r.data)
export const updateOrderStatus = (id, status, cancelReason) =>
  api.patch(`/orders/${id}/status`, { status, cancelReason }).then((r) => r.data)
export const shipOrder = (id) => api.post(`/orders/${id}/ship`).then((r) => r.data)
export const trackOrder = (id) => api.get(`/orders/${id}/track`).then((r) => r.data)
