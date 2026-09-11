import api from '../lib/api'

export const listProducts = (params) => api.get('/products/admin', { params }).then((r) => r.data)
export const getProduct = (id) => api.get(`/products/admin/${id}`).then((r) => r.data)

export function buildProductFormData(fields, imageFiles = []) {
  const fd = new FormData()
  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    if (typeof value === 'object') fd.append(key, JSON.stringify(value))
    else fd.append(key, value)
  })
  imageFiles.forEach((file) => fd.append('images', file))
  return fd
}

export const createProduct = (fields, imageFiles) =>
  api.post('/products', buildProductFormData(fields, imageFiles)).then((r) => r.data)

export const updateProduct = (id, fields, imageFiles) =>
  api.patch(`/products/${id}`, buildProductFormData(fields, imageFiles)).then((r) => r.data)

export const deleteProduct = (id) => api.delete(`/products/${id}`).then((r) => r.data)
export const deleteProductImage = (id, publicId) =>
  api.delete(`/products/${id}/images/${encodeURIComponent(publicId)}`).then((r) => r.data)
export const toggleFeatured = (id, featured) =>
  api.patch(`/products/${id}/featured`, { featured }).then((r) => r.data)
export const getBestSellers = (limit = 20) =>
  api.get('/products/best-sellers', { params: { limit } }).then((r) => r.data)
