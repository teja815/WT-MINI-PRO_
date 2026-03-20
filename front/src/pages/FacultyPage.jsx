import React, { useEffect, useState } from 'react'
import { apiGet } from '../lib/api'

function Issue({ issue }) {
  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <span className="badge-yellow">{issue.category}</span>
        <span className="text-xs text-gray-400">{new Date(issue.approvedAt || issue.updatedAt).toLocaleString()}</span>
      </div>
      <p className="text-sm text-gray-800 leading-relaxed">{issue.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {issue.createdBy?.name || issue.createdBy?.email || 'Student'}
        </div>
        {issue.photoUrl ? (
          <a className="link text-sm flex items-center gap-1" href={issue.photoUrl} target="_blank" rel="noreferrer">
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

export default function FacultyPage() {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  async function load() {
    setErr('')
    setLoading(true)
    try {
      const data = await apiGet('/api/faculty/approved')
      setIssues(data.issues)
    } catch (e) {
      setErr(e?.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <svg className="h-7 w-7 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Faculty Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">Approved issues verified by admin. This is your action queue.</p>
        </div>
        <button className="btn-outline" onClick={load} disabled={loading}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="card p-4 flex items-center gap-3 bg-emerald-50 border-emerald-200">
        <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <span className="text-2xl font-extrabold text-emerald-700">{issues.length}</span>
          <span className="text-sm text-emerald-600 ml-2">approved issues in queue</span>
        </div>
      </div>

      {err && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {err}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-6">
              <div className="shimmer h-4 w-24 rounded mb-3" />
              <div className="shimmer h-3 w-full rounded mb-2" />
              <div className="shimmer h-3 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : issues.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-lg font-bold text-gray-900">No approved issues</h3>
          <p className="text-sm text-gray-500 mt-1">Waiting for admin to approve pending complaints.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {issues.map((i) => <Issue key={i._id} issue={i} />)}
        </div>
      )}
    </div>
  )
}
