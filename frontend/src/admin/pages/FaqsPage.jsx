import { useEffect, useState } from 'react'
import { adminFaqs } from '../api/adminApi'
import { PageHeader, Btn } from '../components/DataTable'
import Modal, { FormField, Input, Textarea } from '../components/Modal'
import ContentTranslationsModal from '../components/ContentTranslationsModal'
import {
  Plus, Pencil, Trash2, HelpCircle, Languages,
  ChevronDown, ChevronUp, ToggleLeft, ToggleRight, Search, X
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

const EMPTY = { category: 'general', question: '', answer: '', sort_order: 0, is_active: true }

export default function FaqsPage() {
  const { t } = useTranslation()
  const [rows, setRows]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [modal, setModal]       = useState(false)
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(EMPTY)
  const [saving, setSaving]     = useState(false)
  const [transModal, setTransModal] = useState(null)
  const [selected, setSelected] = useState([])
  const [deleting, setDeleting] = useState(false)

  const load = (q = search) => {
    setLoading(true)
    adminFaqs.list(q ? { search: q } : {})
      .then(r => setRows(r.data || []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const open = (row = null) => {
    setEditing(row)
    setForm(row ? {
      category:   row.category   || 'general',
      question:   row.question   || '',
      answer:     row.answer     || '',
      sort_order: row.sort_order ?? 0,
      is_active:  row.is_active  !== false,
    } : EMPTY)
    setModal(true)
  }

  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await adminFaqs.update(editing.id, form)
      } else {
        await adminFaqs.create(form)
      }
      setModal(false)
      load()
    } catch (err) {
      alert(err?.response?.data?.message || 'Error saving FAQ')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return
    await adminFaqs.delete(id)
    load()
  }

  const toggleActive = async (row) => {
    await adminFaqs.update(row.id, { is_active: !row.is_active })
    load()
  }

  const moveOrder = async (row, dir) => {
    const next = (row.sort_order ?? 0) + dir
    await adminFaqs.update(row.id, { sort_order: next < 0 ? 0 : next })
    load()
  }

  const bulkDelete = async () => {
    if (!selected.length || !window.confirm(`Delete ${selected.length} FAQs?`)) return
    setDeleting(true)
    try {
      await adminFaqs.bulkDelete(selected)
      setSelected([])
      load()
    } finally {
      setDeleting(false)
    }
  }

  const toggleSelect = id =>
    setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  const allSelected = rows.length > 0 && rows.every(r => selected.includes(r.id))

  const handleSearch = (e) => {
    e.preventDefault()
    load(search)
  }

  // Group rows by category for display
  const grouped = rows.reduce((acc, r) => {
    const cat = r.category || 'general'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(r)
    return acc
  }, {})

  return (
    <div>
      <PageHeader title="FAQs" subtitle={`${rows.length} questions`}>
        {selected.length > 0 && (
          <Btn variant="danger" onClick={bulkDelete} disabled={deleting}>
            <Trash2 size={14} /> Delete {selected.length}
          </Btn>
        )}
        <Btn variant="gold" onClick={() => open()}>
          <Plus size={15} /> Add FAQ
        </Btn>
      </PageHeader>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search questions or answers…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#BA1932]/20 focus:border-[#BA1932]"
          />
          {search && (
            <button type="button" onClick={() => { setSearch(''); load('') }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
              <X size={14} />
            </button>
          )}
        </div>
        <Btn type="submit" variant="ghost">Search</Btn>
      </form>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
          <input type="checkbox" checked={allSelected}
            onChange={() => setSelected(allSelected ? [] : rows.map(r => r.id))}
            className="rounded border-gray-300 text-[#BA1932] focus:ring-[#BA1932]" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex-1">Question</span>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-28 text-center hidden sm:block">Category</span>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-20 text-center hidden md:block">Order</span>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-20 text-center">Status</span>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-28 text-right">Actions</span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400 text-sm">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center">
            <HelpCircle size={36} className="mx-auto mb-3 text-gray-200" />
            <p className="text-gray-400 text-sm font-medium">No FAQs yet.</p>
            <p className="text-gray-300 text-xs mt-1">Click "Add FAQ" to create your first question.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {rows.map(r => (
              <div key={r.id} className={`flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/50 transition-colors ${selected.includes(r.id) ? 'bg-[#BA1932]/3' : ''}`}>
                <input type="checkbox" checked={selected.includes(r.id)}
                  onChange={() => toggleSelect(r.id)}
                  className="rounded border-gray-300 text-[#BA1932] focus:ring-[#BA1932]" />
                <div className="w-8 h-8 rounded-xl bg-[#BA1932]/10 flex items-center justify-center shrink-0">
                  <HelpCircle size={14} className="text-[#BA1932]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{r.question}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{r.answer}</p>
                </div>
                <span className="w-28 text-center hidden sm:block">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg font-medium capitalize">{r.category}</span>
                </span>
                <div className="w-20 hidden md:flex items-center justify-center gap-0.5">
                  <button onClick={() => moveOrder(r, -1)} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                    <ChevronUp size={12} />
                  </button>
                  <span className="text-xs text-gray-500 font-medium w-5 text-center">{r.sort_order}</span>
                  <button onClick={() => moveOrder(r, 1)} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                    <ChevronDown size={12} />
                  </button>
                </div>
                <div className="w-20 flex justify-center">
                  <button onClick={() => toggleActive(r)} title={r.is_active ? 'Active — click to deactivate' : 'Inactive — click to activate'}
                    className={`transition-colors ${r.is_active ? 'text-emerald-500 hover:text-emerald-700' : 'text-gray-300 hover:text-gray-500'}`}>
                    {r.is_active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                  </button>
                </div>
                <div className="w-28 flex gap-1 justify-end">
                  <Btn size="sm" variant="ghost" onClick={() => setTransModal(r)} title="Translations">
                    <Languages size={13} className="text-blue-500" />
                  </Btn>
                  <Btn size="sm" variant="ghost" onClick={() => open(r)}>
                    <Pencil size={13} />
                  </Btn>
                  <Btn size="sm" variant="danger" onClick={() => remove(r.id)}>
                    <Trash2 size={13} />
                  </Btn>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Translation modal */}
      <ContentTranslationsModal
        open={!!transModal}
        onClose={() => setTransModal(null)}
        type="faq"
        item={transModal}
      />

      {/* Create / Edit modal */}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? 'Edit FAQ' : 'Add FAQ'}
        size="md"
      >
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Category" required>
              <Input
                value={form.category}
                onChange={f('category')}
                required
                placeholder="e.g. general, buying, renting, account"
              />
            </FormField>
            <FormField label="Sort Order">
              <Input
                type="number"
                min={0}
                value={form.sort_order}
                onChange={f('sort_order')}
              />
            </FormField>
          </div>

          <FormField label="Question (default language)" required>
            <Input
              value={form.question}
              onChange={f('question')}
              required
              placeholder="What is the average price per m² in Casablanca?"
            />
          </FormField>

          <FormField label="Answer (default language)" required>
            <Textarea
              value={form.answer}
              onChange={f('answer')}
              required
              rows={4}
              placeholder="The average price in Casablanca is around…"
            />
          </FormField>

          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
            <button
              type="button"
              onClick={() => setForm(p => ({ ...p, is_active: !p.is_active }))}
              className={`transition-colors ${form.is_active ? 'text-emerald-500' : 'text-gray-300'}`}
            >
              {form.is_active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </button>
            <div>
              <p className="text-sm font-medium text-gray-700">
                {form.is_active ? 'Active — visible on the Help Center' : 'Inactive — hidden from public'}
              </p>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
            <Btn type="button" variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn type="submit" variant="gold" disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
            </Btn>
          </div>
        </form>
      </Modal>
    </div>
  )
}
