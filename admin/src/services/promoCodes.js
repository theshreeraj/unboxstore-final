import api from '../lib/api'

export const listPromoCodes = () => api.get('/promo-codes').then((r) => r.data)
export const createPromoCode = (data) => api.post('/promo-codes', data).then((r) => r.data)
export const updatePromoCode = (id, data) => api.patch(`/promo-codes/${id}`, data).then((r) => r.data)
export const deletePromoCode = (id) => api.delete(`/promo-codes/${id}`).then((r) => r.data)
