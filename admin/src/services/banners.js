import api from '../lib/api'

export const listBanners = () => api.get('/banners', { params: { all: 1 } }).then((r) => r.data)

function toFormData(fields, imageFile) {
  const fd = new FormData()
  Object.entries(fields).forEach(([k, v]) => v !== undefined && v !== null && v !== '' && fd.append(k, v))
  if (imageFile) fd.append('image', imageFile)
  return fd
}

export const createBanner = (fields, imageFile) =>
  api.post('/banners', toFormData(fields, imageFile)).then((r) => r.data)
export const updateBanner = (id, fields, imageFile) =>
  api.patch(`/banners/${id}`, toFormData(fields, imageFile)).then((r) => r.data)
export const deleteBanner = (id) => api.delete(`/banners/${id}`).then((r) => r.data)
