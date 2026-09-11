import api from '../lib/api'

export const listFlashSales = () => api.get('/flash-sales').then((r) => r.data)
export const createFlashSale = (data) => api.post('/flash-sales', data).then((r) => r.data)
export const updateFlashSale = (id, data) => api.patch(`/flash-sales/${id}`, data).then((r) => r.data)
export const deleteFlashSale = (id) => api.delete(`/flash-sales/${id}`).then((r) => r.data)
