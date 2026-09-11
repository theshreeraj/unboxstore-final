import api from '../lib/api'

export const listCategories = () => api.get('/categories').then((r) => r.data)

function toFormData(fields, imageFile) {
  const fd = new FormData()
  Object.entries(fields).forEach(([k, v]) => v !== undefined && v !== null && v !== '' && fd.append(k, v))
  if (imageFile) fd.append('image', imageFile)
  return fd
}

export const createCategory = (fields, imageFile) =>
  api.post('/categories', toFormData(fields, imageFile)).then((r) => r.data)
export const updateCategory = (id, fields, imageFile) =>
  api.patch(`/categories/${id}`, toFormData(fields, imageFile)).then((r) => r.data)
export const deleteCategory = (id) => api.delete(`/categories/${id}`).then((r) => r.data)
