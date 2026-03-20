import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { apiGet } from '../lib/api'

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' }
]

const CATEGORY_OPTIONS = [
  { value: '', label: 'All Categories' },
  { value: 'classroom', label: 'Classroom' },
  { value: 'mess', label: 'Mess' },
  { value: 'hostel', label: 'Hostel' }
]

const statusBadge = {
  pending: 'badge-yellow',
  approved: 'badge-green',
  rejected: 'badge-red'
}

function ComplaintRow({ issue }) {
  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={statusBadge[issue.status] || 'badge-gray'}>{issue.status.toUpperCase()}</span>
            <span className="badge-gray">{issue.category}</span>
            <span className="text-xs text-gray-400">{new Date(issue.createdAt).toLocaleString()}</span>
          </div>
          <p className="text-sm text-gray-800 leading-relaxed">{issue.description}</p>
          <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {issue.createdBy?.name || issue.createdBy?.email || 'User'}
            </span>
            {issue.rejectionReason && (
              <span className="text-red-500">Reason: {issue.rejectionReason}</span>
            )}
          </div>
        </div>
        {issue.photoUrl && (
          <a className="link text-sm shrink-0 flex items-center gap-1" href={issue.photoUrl} target="_blank" rel="noreferrer">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Photo
          </a>
        )}
      </div>
    </div>
  )
}

export default function ComplaintDashboard() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const status = searchParams.get('status') || ''
  const category = searchParams.get('category') || ''

  async function load() {
    setErr('')
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (status) params.set('status', status)
      if (category) params.set('category', category)
      const data = await apiGet(`/api/complaints?${params.toString()}`)
      setIssues(data.issues)
    } catch (e) {
      setErr(e?.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [status, category])

  function updateFilter(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    setSearchParams(next)
  }

  const counts = {
    total: issues.length,
    pending: issues.filter(i => i.status === 'pending').length,
    approved: issues.filter(i => i.status === 'approved').length,
    rejected: issues.filter(i => i.status === 'rejected').length
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <svg className="h-7 w-7 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Complaint Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">All complaints across categories with filters.</p>
        </div>
        <button className="btn-outline" onClick={load} disabled={loading}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Mini Stats */}
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-extrabold text-gray-900">{counts.total}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
        <div className="card p-4 text-center border-amber-200 bg-amber-50">
          <div className="text-2xl font-extrabold text-amber-600">{counts.pending}</div>
          <div className="text-xs text-amber-600">Pending</div>
        </div>
        <div className="card p-4 text-center border-emerald-200 bg-emerald-50">
          <div className="text-2xl font-extrabold text-emerald-600">{counts.approved}</div>
          <div className="text-xs text-emerald-600">Approved</div>
        </div>
        <div className="card p-4 text-center border-red-200 bg-red-50">
          <div className="text-2xl font-extrabold text-red-600">{counts.rejected}</div>
          <div className="text-xs text-red-600">Rejected</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          className="input w-auto min-w-[160px]"
          value={status}
          onChange={e => updateFilter('status', e.target.value)}
        >
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select
          className="input w-auto min-w-[160px]"
          value={category}
          onChange={e => updateFilter('category', e.target.value)}
        >
          {CATEGORY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Error */}
      {err && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 flex items-start gap-2">
          <svg className="h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {err}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-6">
              <div className="shimmer h-4 w-32 rounded mb-3" />
              <div className="shimmer h-3 w-full rounded mb-2" />
              <div className="shimmer h-3 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : issues.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-lg font-bold text-gray-900">No complaints found</h3>
          <p className="text-sm text-gray-500 mt-1">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {issues.map(i => <ComplaintRow key={i._id} issue={i} />)}
        </div>
      )}
    </div>
  )
}
