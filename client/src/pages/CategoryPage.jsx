import React, { useEffect, useMemo, useState } from 'react'
import { apiGet, apiPost } from '../lib/api'
import { uploadIssuePhoto } from '../lib/upload'
import { useAuth } from '../context/AuthContext'

function IssueRow({ issue }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-brand-red">{issue.status.toUpperCase()}</span>
            <span className="text-xs text-gray-500">{new Date(issue.createdAt).toLocaleString()}</span>
          </div>
          <p className="mt-2 text-sm text-gray-800">{issue.description}</p>
          <p className="mt-1 text-xs text-gray-500">By: {issue.createdBy?.name || issue.createdBy?.email || 'User'}</p>
        </div>
        {issue.photoUrl ? (
          <a className="link text-sm" href={issue.photoUrl} target="_blank" rel="noreferrer">
            View Photo
          </a>
        ) : (
          <span className="text-xs text-gray-400">No photo</span>
        )}
      </div>
    </div>
  )
}

export default function CategoryPage({ category, title }) {
  const { firebaseUser } = useAuth()
  const [tab, setTab] = useState('approved') // approved | pending
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const [desc, setDesc] = useState('')
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const status = useMemo(() => (tab === 'approved' ? 'approved' : 'pending'), [tab])

  async function load() {
    setErr('')
    setLoading(true)
    try {
      const data = await apiGet(`/api/issues?category=${encodeURIComponent(category)}&status=${encodeURIComponent(status)}`)
      setIssues(data.issues)
    } catch (e) {
      setErr(e?.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, status])

  async function submitIssue(e) {
    e.preventDefault()
    setErr('')
    if (!desc.trim()) {
      setErr('Please enter description')
      return
    }
    setSubmitting(true)
    try {
      let photoUrl = ''
      if (file) {
        photoUrl = await uploadIssuePhoto(file, { uid: firebaseUser.uid })
      }
      await apiPost('/api/issues', { category, description: desc.trim(), photoUrl })
      setDesc('')
      setFile(null)
      setTab('pending')
      await load()
    } catch (e2) {
      setErr(e2?.message || 'Submit failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-red">{title}</h1>
          <p className="text-sm text-gray-700">
            Create an issue (photo + description). Admin must verify before it becomes <span className="font-semibold text-brand-yellow">approved</span>.
          </p>
        </div>
        <div className="flex gap-2">
          <button className={tab === 'approved' ? 'btn-primary' : 'btn-outline'} onClick={() => setTab('approved')}>
            Approved
          </button>
          <button className={tab === 'pending' ? 'btn-primary' : 'btn-outline'} onClick={() => setTab('pending')}>
            Pending
          </button>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold text-brand-red">Upload Complaint</h2>
        <form onSubmit={submitIssue} className="mt-4 grid gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">Description</label>
            <textarea
              className="mt-1 w-full rounded-md border-gray-300 focus:border-brand-red focus:ring-brand-yellow"
              rows={4}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Explain the issue clearly…"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Photo (optional)</label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full text-sm"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file && <p className="mt-1 text-xs text-gray-500">Selected: {file.name}</p>}
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-primary" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
            <span className="text-xs text-gray-500">Status will be pending until admin approves.</span>
          </div>
          {err && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{err}</div>}
        </form>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand-red">
            {tab === 'approved' ? 'Approved Issues' : 'Pending Issues'}
          </h2>
          <button className="btn-outline" onClick={load} disabled={loading}>
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-sm text-gray-700">Loading…</div>
        ) : issues.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700">No issues found.</div>
        ) : (
          <div className="grid gap-3">
            {issues.map((i) => (
              <IssueRow key={i._id} issue={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

