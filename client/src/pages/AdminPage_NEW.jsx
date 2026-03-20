import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiGet, apiPost } from '../lib/api'
import { useAuth } from '../context/AuthContext'

function AdminIssueCard({ issue, onApprove, onReject, busyId }) {
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectBusy, setRejectBusy] = useState(false)

  const isBusy = busyId === issue._id

  async function handleReject() {
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason')
      return
    }
    setRejectBusy(true)
    try {
      await onReject(issue._id, rejectReason)
      setShowRejectForm(false)
      setRejectReason('')
    } finally {
      setRejectBusy(false)
    }
  }

  return (
    <div className={`rounded-xl border-2 border-gray-200 bg-white shadow-sm transition-all ${isBusy ? 'opacity-60 pointer-events-none' : ''}`}>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Header with category and date */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 rounded-lg bg-brand-yellow px-3 py-1 text-xs font-semibold text-black">
                {issue.category === 'classroom' && '🎓'}
                {issue.category === 'mess' && '🍽️'}
                {issue.category === 'hostel' && '🏠'}
                {issue.category.charAt(0).toUpperCase() + issue.category.slice(1)}
              </span>
              <span className="text-xs font-medium text-gray-500">{new Date(issue.createdAt).toLocaleDateString()}</span>
              <span className="text-xs text-gray-400">at {new Date(issue.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            {/* Issue Description */}
            <p className="text-sm text-gray-800 font-medium leading-relaxed mb-2">{issue.description}</p>

            {/* Submitted By */}
            <div className="mt-3 rounded-lg bg-gray-50 p-3 text-xs">
              <div className="font-semibold text-gray-900">📤 Submitted by</div>
              <div className="mt-1 text-gray-700">
                <div className="font-medium">{issue.createdBy?.name || 'Unknown'}</div>
                <div className="text-gray-600">{issue.createdBy?.email || 'No email'}</div>
              </div>
            </div>

            {/* Photo */}
            {issue.photoUrl && (
              <div className="mt-3">
                <a
                  href={issue.photoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-brand-sky bg-sky-50 px-3 py-2 text-sm font-semibold text-brand-sky hover:bg-sky-100 transition-colors"
                >
                  📸 View Attached Photo
                </a>
              </div>
            )}
          </div>

          {/* Action Buttons - Sticky on right */}
          <div className="flex shrink-0 flex-col gap-2 w-full sm:w-auto">
            <button
              className="btn-primary py-2 whitespace-nowrap"
              onClick={() => onApprove(issue._id)}
              disabled={isBusy}
              aria-label={`Approve complaint from ${issue.createdBy?.name || 'user'}`}
            >
              ✅ Approve
            </button>
            <button
              className="rounded-lg border-2 border-red-200 bg-red-50 px-4 py-2 font-semibold text-red-700 transition-all hover:bg-red-100 active:scale-95 disabled:opacity-50 whitespace-nowrap text-sm"
              onClick={() => setShowRejectForm(!showRejectForm)}
              disabled={isBusy}
              aria-label={`Reject complaint from ${issue.createdBy?.name || 'user'}`}
            >
              ❌ Reject
            </button>
          </div>
        </div>

        {/* Reject Form */}
        {showRejectForm && (
          <div className="mt-4 rounded-lg border-2 border-red-200 bg-red-50 p-4">
            <label className="block text-sm font-semibold text-red-900 mb-2">
              Why are you rejecting this complaint?
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Provide constructive feedback to the student..."
              className="w-full rounded-lg border border-red-200 bg-white p-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              rows={3}
            />
            <div className="mt-3 flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowRejectForm(false)
                  setRejectReason('')
                }}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                disabled={rejectBusy}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={rejectBusy || !rejectReason.trim()}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {rejectBusy ? 'Rejecting…' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminPage() {
  const { me } = useAuth()
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [busyId, setBusyId] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const navigate = useNavigate()

  // Redirect if not admin
  useEffect(() => {
    if (me && me.role !== 'admin') {
      navigate('/')
    }
  }, [me, navigate])

  async function load() {
    setErr('')
    setSuccessMsg('')
    setLoading(true)
    try {
      const data = await apiGet('/api/admin/pending')
      setIssues(data.issues)
    } catch (e) {
      setErr(e?.message || 'Failed to load complaints')
      setIssues([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // Auto-refresh every 30 seconds
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [])

  async function approve(id) {
    setBusyId(id)
    setErr('')
    setSuccessMsg('')
    try {
      await apiPost(`/api/admin/issues/${id}/approve`, {})
      setSuccessMsg('✅ Complaint approved successfully!')
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
    setSuccessMsg('')
    try {
      await apiPost(`/api/admin/issues/${id}/reject`, { reason })
      setSuccessMsg('❌ Complaint rejected. Feedback sent to student.')
      await load()
    } catch (e) {
      setErr(e?.message || 'Rejection failed')
    } finally {
      setBusyId('')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
              <span>🛡️</span> Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-700">
              Review and manage all pending complaints. Approve complaints for faculty review or reject with feedback.
            </p>
          </div>
          <button
            className="btn-primary shrink-0 whitespace-nowrap"
            onClick={load}
            disabled={loading}
            aria-label="Refresh complaints list"
          >
            {loading ? '⟳ Refreshing…' : '⟳ Refresh'}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4 text-green-800" role="status" aria-live="polite">
          <div className="font-semibold">{successMsg}</div>
        </div>
      )}

      {/* Error Message */}
      {err && (
        <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4 text-red-800" role="alert" aria-live="assertive">
          <div className="font-semibold">❌ Error</div>
          <div className="mt-1 text-sm">{err}</div>
        </div>
      )}

      {/* Statistics */}
      {!loading && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5">
            <div className="text-4xl">📋</div>
            <div className="mt-2 text-sm font-semibold text-gray-600">PENDING REVIEW</div>
            <div className="mt-1 text-3xl font-extrabold text-brand-red">{issues.length}</div>
          </div>
          <div className="rounded-lg border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5">
            <div className="text-4xl">🎓</div>
            <div className="mt-2 text-sm font-semibold text-gray-600">CLASSROOM</div>
            <div className="mt-1 text-3xl font-extrabold text-brand-red">
              {issues.filter((i) => i.category === 'classroom').length}
            </div>
          </div>
          <div className="rounded-lg border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5">
            <div className="text-4xl">🍽️</div>
            <div className="mt-2 text-sm font-semibold text-gray-600">MESS & HOSTEL</div>
            <div className="mt-1 text-3xl font-extrabold text-brand-red">
              {issues.filter((i) => i.category === 'mess' || i.category === 'hostel').length}
            </div>
          </div>
        </div>
      )}

      {/* Complaints List */}
      {loading ? (
        <div className="rounded-lg border-2 border-gray-200 bg-white p-8 text-center">
          <div className="inline-block">
            <svg className="h-8 w-8 animate-spin text-brand-red" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
              <path
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <div className="mt-3 text-gray-700">Loading complaints…</div>
        </div>
      ) : issues.length === 0 ? (
        <div className="rounded-lg border-2 border-green-200 bg-green-50 p-8 text-center">
          <div className="text-4xl">✨</div>
          <div className="mt-2 font-semibold text-green-900">All Clear!</div>
          <div className="mt-1 text-green-800">No pending complaints to review. Great work!</div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 border border-gray-200">
            <div className="font-semibold text-gray-900">
              {issues.length} complaint{issues.length !== 1 ? 's' : ''} waiting for review
            </div>
            <div className="text-sm text-gray-600">Most recent first</div>
          </div>

          <div className="grid gap-4">
            {issues.map((i) => (
              <AdminIssueCard
                key={i._id}
                issue={i}
                onApprove={approve}
                onReject={reject}
                busyId={busyId}
              />
            ))}
          </div>
        </div>
      )}

      {/* Accessibility Note */}
      <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">♿</span>
          <div>
            <h3 className="font-semibold text-amber-900">Accessibility Features</h3>
            <ul className="mt-2 space-y-1 text-sm text-amber-800">
              <li>✓ Keyboard navigable - Tab through all buttons and controls</li>
              <li>✓ Screen reader optimized - All actions labeled and announced</li>
              <li>✓ High contrast mode available in header accessibility tools</li>
              <li>✓ All forms are clearly marked with labels and error messages</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
