import React, { useEffect, useMemo, useState } from 'react'
import { apiGet, apiPost } from '../lib/api'
import { uploadIssuePhoto } from '../lib/upload'
import { useAuth } from '../context/AuthContext'

function IssueRow({ issue }) {
  const statusBadge = {
    pending: 'badge-yellow',
    approved: 'badge-green',
    rejected: 'badge-red'
  }

  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={statusBadge[issue.status] || 'badge-gray'}>{issue.status.toUpperCase()}</span>
            <span className="text-xs text-gray-400">{new Date(issue.createdAt).toLocaleString()}</span>
          </div>
          <p className="text-sm text-gray-800 leading-relaxed">{issue.description}</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {issue.createdBy?.name || issue.createdBy?.email || 'User'}
          </div>
        </div>
        {issue.photoUrl ? (
          <a className="link text-sm shrink-0 flex items-center gap-1" href={issue.photoUrl} target="_blank" rel="noreferrer">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Photo
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
  const [tab, setTab] = useState('approved')
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
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <svg className="h-7 w-7 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {title}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create an issue (photo + description). Admin must verify before it becomes approved.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className={tab === 'approved' ? 'btn-primary' : 'btn-ghost'}
            onClick={() => setTab('approved')}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Approved
          </button>
          <button
            className={tab === 'pending' ? 'btn-primary' : 'btn-ghost'}
            onClick={() => setTab('pending')}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pending
          </button>
        </div>
      </div>

      {/* Upload Form */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
          <svg className="h-5 w-5 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Upload Complaint
        </h2>
        <form onSubmit={submitIssue} className="grid gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Description</label>
            <textarea
              className="input"
              rows={4}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Explain the issue clearly (min 10 characters)…"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Photo (optional)</label>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-brand-red hover:file:bg-red-100 transition-all"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file && (
              <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                {file.name}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting…
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Submit
                </>
              )}
            </button>
            <span className="text-xs text-gray-400">Status will be pending until admin approves.</span>
          </div>
          {err && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 flex items-start gap-2">
              <svg className="h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {err}
            </div>
          )}
        </form>
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {tab === 'approved' ? 'Approved Issues' : 'Pending Issues'}
          </h2>
          <button className="btn-ghost text-sm" onClick={load} disabled={loading}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="card p-6">
                <div className="shimmer h-4 w-24 rounded mb-3" />
                <div className="shimmer h-3 w-full rounded mb-2" />
                <div className="shimmer h-3 w-2/3 rounded" />
              </div>
            ))}
          </div>
        ) : issues.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-sm text-gray-500">No {tab} issues found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {issues.map((i) => <IssueRow key={i._id} issue={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}
