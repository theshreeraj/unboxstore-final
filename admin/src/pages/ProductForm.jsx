import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, X, Upload, Loader2 } from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { useToast } from '../context/ToastContext'
import { apiErrorMessage } from '../lib/api'
import { listCategories } from '../services/categories'
import { listCollections } from '../services/collections'
import { getProduct, createProduct, updateProduct, deleteProductImage } from '../services/products'

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const GENDER_OPTIONS = ['Unisex', 'Men', 'Women', 'Kids']
const DISCOUNT_TYPES = ['None', 'Percent', 'Flat']

const EMPTY = {
  name: '',
  category: '',
  collection: '',
  material: '',
  gender: 'Unisex',
  sku: '',
  costPrice: '',
  price: '',
  discountType: 'None',
  discountValue: '',
  stockCount: '',
  lowStockThreshold: '5',
  shortDescription: '',
  description: '',
  details: [''],
  sizes: [],
  colors: [{ name: '', hex: '#1a1a1a' }],
  weightKg: '',
  length: '',
  width: '',
  height: '',
  isActive: true,
  isFeatured: false,
  isNewArrival: false,
  metaTitle: '',
  metaDescription: '',
  tags: '',
}

export default function ProductForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const toast = useToast()

  const [form, setForm] = useState(EMPTY)
  const [categories, setCategories] = useState([])
  const [collections, setCollections] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [newImageFiles, setNewImageFiles] = useState([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    listCategories().then((res) => setCategories(res.categories)).catch(() => {})
    listCollections().then((res) => setCollections(res.collections)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!isEdit) return
    getProduct(id)
      .then((res) => {
        const p = res.product
        setForm({
          name: p.name,
          category: p.category?._id || '',
          collection: p.collection?._id || '',
          material: p.material || '',
          gender: p.gender || 'Unisex',
          sku: p.sku || '',
          costPrice: p.costPrice ?? '',
          price: p.price,
          discountType: p.discountType || 'None',
          discountValue: p.discountValue || '',
          stockCount: p.stockCount,
          lowStockThreshold: p.lowStockThreshold ?? 5,
          shortDescription: p.shortDescription || '',
          description: p.description || '',
          details: p.details?.length ? p.details : [''],
          sizes: p.sizes || [],
          colors: p.colors?.length ? p.colors : [{ name: '', hex: '#1a1a1a' }],
          weightKg: p.weightKg ?? '',
          length: p.dimensions?.length ?? '',
          width: p.dimensions?.width ?? '',
          height: p.dimensions?.height ?? '',
          isActive: p.isActive ?? true,
          isFeatured: p.isFeatured || false,
          isNewArrival: p.isNewArrival || false,
          metaTitle: p.seo?.metaTitle || '',
          metaDescription: p.seo?.metaDescription || '',
          tags: p.seo?.tags?.join(', ') || '',
        })
        setExistingImages(p.images || [])
      })
      .catch((err) => toast.error(apiErrorMessage(err)))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function setListItem(field, index, value) {
    setForm((f) => ({ ...f, [field]: f[field].map((v, i) => (i === index ? value : v)) }))
  }
  function addListItem(field, empty) {
    setForm((f) => ({ ...f, [field]: [...f[field], empty] }))
  }
  function removeListItem(field, index) {
    setForm((f) => ({ ...f, [field]: f[field].filter((_, i) => i !== index) }))
  }

  function toggleSize(size) {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter((s) => s !== size) : [...f.sizes, size],
    }))
  }

  function handleFileSelect(e) {
    const files = Array.from(e.target.files || [])
    setNewImageFiles((prev) => [...prev, ...files])
    e.target.value = ''
  }

  async function handleRemoveExistingImage(publicId) {
    if (!isEdit) return
    try {
      await deleteProductImage(id, publicId)
      setExistingImages((prev) => prev.filter((img) => img.publicId !== publicId))
      toast.success('Image removed')
    } catch (err) {
      toast.error(apiErrorMessage(err))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.category || !form.price) {
      toast.error('Name, category and selling price are required')
      return
    }

    const payload = {
      name: form.name,
      category: form.category,
      collection: form.collection || '',
      material: form.material,
      gender: form.gender,
      sku: form.sku,
      costPrice: form.costPrice || undefined,
      price: form.price,
      discountType: form.discountType,
      discountValue: form.discountValue || 0,
      stockCount: form.stockCount || 0,
      lowStockThreshold: form.lowStockThreshold || 5,
      shortDescription: form.shortDescription,
      description: form.description,
      details: form.details.filter(Boolean),
      sizes: form.sizes,
      colors: form.colors.filter((c) => c.name && c.hex),
      weightKg: form.weightKg || undefined,
      dimensions: { length: form.length || 0, width: form.width || 0, height: form.height || 0 },
      isActive: form.isActive,
      isFeatured: form.isFeatured,
      isNewArrival: form.isNewArrival,
      seo: {
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        tags: form.tags,
      },
    }

    setSaving(true)
    try {
      if (isEdit) {
        await updateProduct(id, payload, newImageFiles)
        toast.success('Product updated')
      } else {
        await createProduct(payload, newImageFiles)
        toast.success('Product created')
      }
      navigate('/products')
    } catch (err) {
      toast.error(apiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 size={24} className="animate-spin text-neutral-400" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6 flex items-center gap-3">
        <Link to="/products" className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-sm text-neutral-500">Fill in the details {isEdit ? 'and save your changes' : 'to add a new product'}</p>
        </div>
      </div>

      <div className="space-y-6">
        <Section title="Basic Information">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Product Name" required className="sm:col-span-2">
              <input value={form.name} onChange={(e) => set('name', e.target.value)} className={inputClass} placeholder="Enter product title" required />
            </Field>
            <Field label="Category" required>
              <select value={form.category} onChange={(e) => set('category', e.target.value)} className={inputClass} required>
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Collection">
              <select value={form.collection} onChange={(e) => set('collection', e.target.value)} className={inputClass}>
                <option value="">No collection</option>
                {collections.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Material">
              <input value={form.material} onChange={(e) => set('material', e.target.value)} className={inputClass} placeholder="e.g. Organic Cotton" />
            </Field>
            <Field label="Gender">
              <select value={form.gender} onChange={(e) => set('gender', e.target.value)} className={inputClass}>
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </Field>
            <Field label="SKU" className="sm:col-span-2">
              <div className="flex gap-2">
                <input value={form.sku} onChange={(e) => set('sku', e.target.value)} className={inputClass} placeholder="Auto-generated if left blank" />
              </div>
            </Field>
          </div>
        </Section>

        <Section title="Pricing & Inventory">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Cost Price">
              <input type="number" min="0" value={form.costPrice} onChange={(e) => set('costPrice', e.target.value)} className={inputClass} placeholder="₹ Internal only" />
            </Field>
            <Field label="Selling Price" required>
              <input type="number" min="0" value={form.price} onChange={(e) => set('price', e.target.value)} className={inputClass} placeholder="₹" required />
            </Field>
            <Field label="Stock Quantity" required>
              <input type="number" min="0" value={form.stockCount} onChange={(e) => set('stockCount', e.target.value)} className={inputClass} />
            </Field>
            <Field label="Discount Type">
              <select value={form.discountType} onChange={(e) => set('discountType', e.target.value)} className={inputClass}>
                {DISCOUNT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Discount Value">
              <input
                type="number"
                min="0"
                value={form.discountValue}
                onChange={(e) => set('discountValue', e.target.value)}
                className={inputClass}
                disabled={form.discountType === 'None'}
                placeholder={form.discountType === 'Percent' ? '% off' : '₹ off'}
              />
            </Field>
            <Field label="Low Stock Threshold">
              <input type="number" min="0" value={form.lowStockThreshold} onChange={(e) => set('lowStockThreshold', e.target.value)} className={inputClass} />
            </Field>
          </div>
          {form.discountType !== 'None' && form.discountValue && form.price && (
            <p className="mt-3 text-xs text-neutral-500">
              Compare-at price shown to customers: <span className="font-semibold text-neutral-700">
                ₹{form.discountType === 'Percent'
                  ? Math.round(form.price / (1 - Math.min(form.discountValue, 95) / 100))
                  : Number(form.price) + Number(form.discountValue)}
              </span>
            </p>
          )}
        </Section>

        <Section title="Description & Content">
          <div className="space-y-4">
            <Field label="Short Description">
              <textarea value={form.shortDescription} onChange={(e) => set('shortDescription', e.target.value)} className={`${inputClass} min-h-[70px]`} placeholder="Brief summary (appears in listings)" />
            </Field>
            <Field label="Full Description">
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} className={`${inputClass} min-h-[120px]`} placeholder="Full product description..." />
            </Field>
            <div>
              <span className="mb-1.5 block text-sm font-medium text-neutral-700">Detail bullets</span>
              <div className="space-y-2">
                {form.details.map((d, i) => (
                  <div key={i} className="flex gap-2">
                    <input value={d} onChange={(e) => setListItem('details', i, e.target.value)} className={inputClass} placeholder="e.g. Regular fit — true to size" />
                    <button type="button" onClick={() => removeListItem('details', i)} className="rounded-lg border border-neutral-200 px-2.5 text-neutral-400 hover:bg-neutral-50">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => addListItem('details', '')} className="mt-2 flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900">
                <Plus size={13} /> Add bullet
              </button>
            </div>
          </div>
        </Section>

        <Section title="Variants">
          <div>
            <span className="mb-2 block text-sm font-medium text-neutral-700">Sizes</span>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => toggleSize(s)}
                  className={`h-9 min-w-9 rounded-lg border px-3 text-sm font-medium ${
                    form.sizes.includes(s) ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <span className="mb-2 block text-sm font-medium text-neutral-700">Colors</span>
            <div className="space-y-2">
              {form.colors.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="color" value={c.hex} onChange={(e) => setListItem('colors', i, { ...c, hex: e.target.value })} className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-neutral-200" />
                  <input value={c.name} onChange={(e) => setListItem('colors', i, { ...c, name: e.target.value })} className={inputClass} placeholder="Color name, e.g. Olive" />
                  <button type="button" onClick={() => removeListItem('colors', i)} className="rounded-lg border border-neutral-200 px-2.5 text-neutral-400 hover:bg-neutral-50">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => addListItem('colors', { name: '', hex: '#1a1a1a' })} className="mt-2 flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900">
              <Plus size={13} /> Add color
            </button>
          </div>
        </Section>

        <Section title="Media Management">
          {existingImages.length > 0 && (
            <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {existingImages.map((img) => (
                <div key={img.publicId || img.url} className="group relative aspect-square overflow-hidden rounded-lg bg-neutral-100">
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(img.publicId)}
                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {newImageFiles.length > 0 && (
            <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {newImageFiles.map((file, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-lg bg-neutral-100">
                  <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setNewImageFiles((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-200 py-10 text-center hover:border-neutral-300">
            <Upload size={20} className="text-neutral-400" />
            <span className="text-sm font-medium text-neutral-700">Click to upload images</span>
            <span className="text-xs text-neutral-400">JPG, PNG — multiple allowed</span>
            <input type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />
          </label>
        </Section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Section title="Physical Details">
            <Field label="Weight (kg)">
              <input type="number" min="0" step="0.01" value={form.weightKg} onChange={(e) => set('weightKg', e.target.value)} className={inputClass} placeholder="0.000" />
            </Field>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <Field label="Length (cm)">
                <input type="number" min="0" value={form.length} onChange={(e) => set('length', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Width (cm)">
                <input type="number" min="0" value={form.width} onChange={(e) => set('width', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Height (cm)">
                <input type="number" min="0" value={form.height} onChange={(e) => set('height', e.target.value)} className={inputClass} />
              </Field>
            </div>
          </Section>

          <Section title="Visibility & Status">
            <div className="space-y-3">
              <Checkbox label="Active" hint="Visible to users" checked={form.isActive} onChange={(v) => set('isActive', v)} />
              <Checkbox label="Featured" hint="Home page spotlight" checked={form.isFeatured} onChange={(v) => set('isFeatured', v)} />
              <Checkbox label="New Arrival" hint="Latest products tag" checked={form.isNewArrival} onChange={(v) => set('isNewArrival', v)} />
            </div>
          </Section>
        </div>

        <Section title="Search Engine Optimization">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Meta Title">
              <input value={form.metaTitle} onChange={(e) => set('metaTitle', e.target.value)} className={inputClass} placeholder="Product title for SEO" />
            </Field>
            <Field label="Tags (comma separated)">
              <input value={form.tags} onChange={(e) => set('tags', e.target.value)} className={inputClass} placeholder="cotton, jacket, winter" />
            </Field>
            <Field label="Meta Description" className="sm:col-span-2">
              <textarea value={form.metaDescription} onChange={(e) => set('metaDescription', e.target.value)} className={`${inputClass} min-h-[80px]`} placeholder="SEO optimized description for search engines..." />
            </Field>
          </div>
        </Section>

        <div className="flex justify-end gap-3 pb-10">
          <Button type="button" variant="secondary" onClick={() => navigate('/products')}>
            Discard Changes
          </Button>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 size={16} className="animate-spin" />}
            {isEdit ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </div>
    </form>
  )
}

const inputClass =
  'w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900 disabled:bg-neutral-50 disabled:text-neutral-400'

function Section({ title, children }) {
  return (
    <Card>
      <h2 className="mb-5 text-base font-semibold text-neutral-900">{title}</h2>
      {children}
    </Card>
  )
}

function Field({ label, required, children, className = '' }) {
  return (
    <label className={`block text-sm ${className}`}>
      <span className="mb-1.5 block font-medium text-neutral-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  )
}

function Checkbox({ label, hint, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-neutral-200 p-3 hover:bg-neutral-50">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-4 w-4 accent-neutral-900" />
      <span>
        <span className="block text-sm font-medium text-neutral-900">{label}</span>
        <span className="block text-xs text-neutral-500">{hint}</span>
      </span>
    </label>
  )
}
