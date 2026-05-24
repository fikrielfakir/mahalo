import { useState, useRef, useEffect, useCallback } from 'react'
import { adminApi } from '../api/adminApi'
import { Upload, CheckCircle, XCircle, Clock, Trash2, RefreshCw, FileArchive, AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

function formatBytes(bytes) {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function formatDate(str) {
  if (!str) return '—'
  return new Date(str).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function AppUpdatePage() {
  const { t } = useTranslation()
  const [file, setFile]           = useState(null)
  const [dragging, setDragging]   = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress]   = useState(0)
  const [result, setResult]       = useState(null)
  const [history, setHistory]     = useState([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const inputRef = useRef(null)

  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true)
    try {
      const res = await adminApi.get('/admin/app-update/history')
      setHistory(res.data.data || [])
    } catch { setHistory([]) } finally { setLoadingHistory(false) }
  }, [])

  useEffect(() => { fetchHistory() }, [fetchHistory])

  const handleFile = (f) => {
    if (!f) return
    if (!f.name.endsWith('.zip')) { setResult({ error: true, message: t('admin.appUpdate.onlyZip') }); return }
    setFile(f); setResult(null)
  }

  const handleDrop = (e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true); setProgress(0); setResult(null)
    const form = new FormData()
    form.append('zip', file)
    try {
      const res = await adminApi.post('/admin/app-update/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => { if (e.total) setProgress(Math.round((e.loaded / e.total) * 100)) },
      })
      setResult({ error: false, message: res.data.message, data: res.data.data })
      setFile(null); fetchHistory()
    } catch (err) {
      const msg = err?.response?.data?.message || t('admin.appUpdate.uploadFailed')
      setResult({ error: true, message: msg })
    } finally { setUploading(false); setProgress(0) }
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      await adminApi.delete(`/admin/app-update/history/${id}`)
      setHistory(prev => prev.filter(h => h.id !== id))
    } catch { } finally { setDeletingId(null) }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.appUpdate.title')}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {t('admin.appUpdate.subtitle')} <code className="bg-gray-100 px-1 rounded">.zip</code>. {t('admin.appUpdate.securityNote')}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <Upload size={16} className="text-[#730D26]" />
          {t('admin.appUpdate.uploadTitle')}
        </h2>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
            ${dragging ? 'border-[#730D26] bg-[#730D26]/5' : 'border-gray-300 hover:border-[#730D26]/50 hover:bg-gray-50'}`}
        >
          <input ref={inputRef} type="file" accept=".zip" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
          <FileArchive size={36} className="mx-auto mb-3 text-gray-400" />
          {file ? (
            <div className="space-y-1">
              <p className="font-semibold text-gray-800">{file.name}</p>
              <p className="text-sm text-gray-500">{formatBytes(file.size)}</p>
              <p className="text-xs text-[#730D26] mt-1">{t('admin.appUpdate.clickToReplace')}</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="font-medium text-gray-700">{t('admin.appUpdate.dropHere')}</p>
              <p className="text-sm text-gray-400">{t('admin.appUpdate.orClickBrowse')}</p>
            </div>
          )}
        </div>

        {uploading && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-gray-500">
              <span>{t('admin.appUpdate.uploadingExtracting')}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-[#730D26] h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {result && (
          <div className={`flex items-start gap-3 rounded-xl px-4 py-3 text-sm ${
            result.error ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {result.error ? <XCircle size={16} className="shrink-0 mt-0.5" /> : <CheckCircle size={16} className="shrink-0 mt-0.5" />}
            <div>
              <p>{result.message}</p>
              {result.data && (
                <p className="text-xs mt-0.5 opacity-75">
                  {result.data.files_extracted} {t('admin.appUpdate.filesExtracted')}
                  {result.data.skipped > 0 ? `, ${result.data.skipped} ${t('admin.appUpdate.skippedSecurity')}` : ''}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <span>{t('admin.appUpdate.securityWarning')}</span>
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full py-3 rounded-xl font-semibold text-sm bg-[#730D26] text-white hover:bg-[#BA1932] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? t('admin.appUpdate.applying') : t('admin.appUpdate.applyUpdate')}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <Clock size={16} className="text-[#730D26]" />
            {t('admin.appUpdate.historyTitle')}
          </h2>
          <button onClick={fetchHistory} disabled={loadingHistory} className="text-gray-400 hover:text-[#730D26] transition-colors" title={t('admin.appUpdate.refresh')}>
            <RefreshCw size={15} className={loadingHistory ? 'animate-spin' : ''} />
          </button>
        </div>

        {loadingHistory ? (
          <div className="p-10 text-center text-gray-400 text-sm">{t('admin.appUpdate.loadingHistory')}</div>
        ) : history.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">{t('admin.appUpdate.noHistory')}</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50">
                <th className="px-6 py-3">{t('admin.appUpdate.colFile')}</th>
                <th className="px-6 py-3 hidden md:table-cell">{t('admin.appUpdate.colSize')}</th>
                <th className="px-6 py-3 hidden md:table-cell">{t('admin.appUpdate.colFiles')}</th>
                <th className="px-6 py-3 hidden lg:table-cell">{t('admin.appUpdate.colAppliedBy')}</th>
                <th className="px-6 py-3">{t('admin.appUpdate.colDate')}</th>
                <th className="px-6 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileArchive size={14} className="text-gray-400 shrink-0" />
                      <span className="font-medium text-gray-800 truncate max-w-[180px]">{row.filename}</span>
                    </div>
                    {row.note && <p className="text-xs text-amber-600 mt-0.5 ml-5">{row.note}</p>}
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-gray-500">{formatBytes(row.size)}</td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">{row.files_extracted} files</span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell text-gray-500">{row.applied_by || '—'}</td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{formatDate(row.created_at)}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(row.id)} disabled={deletingId === row.id} className="text-gray-300 hover:text-red-500 transition-colors" title="Remove from history">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
