import React, { useEffect, useState } from 'react'
import { apiGet, apiPost } from '../lib/api'

function AdminIssueCard({ issue, onApprove, onReject, busyId }) {
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [reason, setReason] = useState('')
  const isBusy = busyId === issue._id

  return (
    <>
      <div className={`card p-5 transition-all ${isBusy ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="badge-yellow">{issue.category}</span>
              <span className="text-xs text-gray-400">{new Date(issue.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-800 leading-relaxed">{issue.description}</p>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {issue.createdBy?.name || issue.createdBy?.email || 'User'}
            </div>
            {issue.photoUrl && (
              <a className="link mt-2 inline-flex items-center gap-1 text-sm" href={issue.photoUrl} target="_blank" rel="noreferrer">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                View Photo
              </a>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="btn-success text-sm" onClick={() => onApprove(issue._id)} disabled={isBusy}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Approve
            </button>
            <button className="btn-danger text-sm" onClick={() => setShowRejectModal(true)} disabled={isBusy}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reject
            </button>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowRejectModal(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-md mx-4 card p-6 animate-fadeInUp" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Reject Complaint</h3>
            <p className="text-sm text-gray-500 mb-4">Provide a reason for rejecting this complaint (optional).</p>
            <textarea
              className="input mb-4"
              rows={3}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Reason for rejection..."
            />
            <div className="flex gap-3 justify-end">
              <button className="btn-ghost" onClick={() => setShowRejectModal(false)}>Cancel</button>
              <button
                className="btn-danger"
                onClick={() => {
                  setShowRejectModal(false)
                  onReject(issue._id, reason)
                  setReason('')
                }}
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function AdminPage() {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [busyId, setBusyId] = useState('')
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 })
  const [filter, setFilter] = useState('all') // all, classroom, mess, hostel

  async function load() {
    setErr('')
    setLoading(true)
    try {
      const [issueData, statsData] = await Promise.all([
        apiGet('/api/admin/pending'),
        apiGet('/api/admin/stats')
      ])
      setIssues(issueData.issues)
      setStats(statsData.stats)
    } catch (e) {
      setErr(e?.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function approve(id) {
    setBusyId(id)
    setErr('')
    try {
      await apiPost(`/api/admin/issues/${id}/approve`, {})
      await load()
    } catch (e) {
      setErr(e?.message || 'Approve failed')
    } finally {
      setBusyId('')
    }
  }

  async function reject(id, reason) {
    setBusyId(id)
    setErr('')
    try {
      await apiPost(`/api/admin/issues/${id}/reject`, { reason })
      await load()
    } catch (e) {
      setErr(e?.message || 'Reject failed')
    } finally {
      setBusyId('')
    }
  }

  const filteredIssues = filter === 'all' ? issues : issues.filter(i => i.category === filter)

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <svg className="h-7 w-7 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">Verify pending complaints. Approve or reject to manage the queue.</p>
        </div>
        <button className="btn-outline" onClick={load} disabled={loading}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="stat-card" onClick={() => {}}>
          <div className="text-3xl font-extrabold text-amber-600 animate-countUp">{stats.pending}</div>
          <div className="text-xs text-gray-500 mt-1 font-medium">Pending</div>
          <div className="mt-2 h-1 rounded-full bg-amber-100">
            <div className="h-1 rounded-full bg-amber-500 transition-all" style={{ width: stats.total ? `${(stats.pending / stats.total) * 100}%` : '0%' }} />
          </div>
        </div>
        <div className="stat-card">
          <div className="text-3xl font-extrabold text-emerald-600 animate-countUp">{stats.approved}</div>
          <div className="text-xs text-gray-500 mt-1 font-medium">Approved</div>
          <div className="mt-2 h-1 rounded-full bg-emerald-100">
            <div className="h-1 rounded-full bg-emerald-500 transition-all" style={{ width: stats.total ? `${(stats.approved / stats.total) * 100}%` : '0%' }} />
          </div>
        </div>
        <div className="stat-card">
          <div className="text-3xl font-extrabold text-red-600 animate-countUp">{stats.rejected}</div>
          <div className="text-xs text-gray-500 mt-1 font-medium">Rejected</div>
          <div className="mt-2 h-1 rounded-full bg-red-100">
            <div className="h-1 rounded-full bg-red-500 transition-all" style={{ width: stats.total ? `${(stats.rejected / stats.total) * 100}%` : '0%' }} />
          </div>
        </div>
        <div className="stat-card">
          <div className="text-3xl font-extrabold text-gray-900 animate-countUp">{stats.total}</div>
          <div className="text-xs text-gray-500 mt-1 font-medium">Total</div>
          <div className="mt-2 h-1 rounded-full bg-gray-200">
            <div className="h-1 rounded-full bg-brand-red transition-all" style={{ width: '100%' }} />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {['all', 'classroom', 'mess', 'hostel'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`${filter === cat ? 'btn-primary' : 'btn-ghost'} text-xs capitalize`}
          >
            {cat === 'all' ? 'All Categories' : cat}
            {cat !== 'all' && (
              <span className="ml-1 bg-white/20 rounded-full px-1.5 py-0.5 text-[10px]">
                {issues.filter(i => i.category === cat).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Error */}
      {err && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 flex items-start gap-2">
          <svg className="h-5 w-5 shrink-0 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {err}
        </div>
      )}

      {/* Issues List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-6">
              <div className="shimmer h-4 w-24 rounded mb-3" />
              <div className="shimmer h-3 w-full rounded mb-2" />
              <div className="shimmer h-3 w-2/3 rounded" />
            </div>
          ))}
        </div>
      ) : filteredIssues.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-lg font-bold text-gray-900">All clear!</h3>
          <p className="text-sm text-gray-500 mt-1">No pending issues to review.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredIssues.map(i => (
            <AdminIssueCard key={i._id} issue={i} onApprove={approve} onReject={reject} busyId={busyId} />
          ))}
        </div>
      )}
    </div>
  )
}
