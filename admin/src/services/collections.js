import api from '../lib/api'

export const listCollections = () => api.get('/collections', { params: { all: 1 } }).then((r) => r.data)

function toFormData(fields, imageFile) {
  const fd = new FormData()
  Object.entries(fields).forEach(([k, v]) => v !== undefined && v !== null && v !== '' && fd.append(k, v))
  if (imageFile) fd.append('image', imageFile)
  return fd
}

export const createCollection = (fields, imageFile) =>
  api.post('/collections', toFormData(fields, imageFile)).then((r) => r.data)
export const updateCollection = (id, fields, imageFile) =>
  api.patch(`/collections/${id}`, toFormData(fields, imageFile)).then((r) => r.data)
export const deleteCollection = (id) => api.delete(`/collections/${id}`).then((r) => r.data)
