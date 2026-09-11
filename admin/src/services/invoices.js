import api from '../lib/api'

export const listInvoices = () => api.get('/invoices').then((r) => r.data)

export async function downloadInvoicePdf(id, filename) {
  const res = await api.get(`/invoices/${id}/pdf`, { responseType: 'blob' })
  const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename || `${id}.pdf`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
