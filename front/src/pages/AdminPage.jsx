import React, { useEffect, useState } from 'react'
import { apiGet, apiPost } from '../lib/api'

function AdminIssueCard({ issue, onApprove }) {
  return (
    <div className="card p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge-yellow">{issue.category}</span>
            <span className="text-xs text-gray-500">{new Date(issue.createdAt).toLocaleString()}</span>
          </div>
          <p className="mt-2 text-sm text-gray-800">{issue.description}</p>
          <p className="mt-1 text-xs text-gray-500">By: {issue.createdBy?.name || issue.createdBy?.email || 'User'}</p>
          {issue.photoUrl ? (
            <a className="link mt-2 inline-block text-sm" href={issue.photoUrl} target="_blank" rel="noreferrer">
              View Photo
            </a>
          ) : (
            <div className="mt-2 text-xs text-gray-400">No photo</div>
          )}
        </div>
        <button className="btn-primary shrink-0" onClick={() => onApprove(issue._id)}>
          Approve
        </button>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [busyId, setBusyId] = useState('')

  async function load() {
    setErr('')
    setLoading(true)
    try {
      const data = await apiGet('/api/admin/pending')
      setIssues(data.issues)
    } catch (e) {
      setErr(e?.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-red">Admin Dashboard</h1>
          <p className="text-sm text-gray-700">
            Verify pending complaints. After approval, they appear for faculty and in category dashboards.
          </p>
        </div>
        <button className="btn-outline" onClick={load} disabled={loading}>
          Refresh
        </button>
      </div>

      {err && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{err}</div>}

      {loading ? (
        <div className="text-sm text-gray-700">Loading…</div>
      ) : issues.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700">No pending issues.</div>
      ) : (
        <div className="grid gap-3">
          {issues.map((i) => (
            <div key={i._id} className={busyId === i._id ? 'opacity-60 pointer-events-none' : ''}>
              <AdminIssueCard issue={i} onApprove={approve} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

