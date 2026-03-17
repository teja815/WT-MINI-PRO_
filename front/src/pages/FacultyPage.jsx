import React, { useEffect, useState } from 'react'
import { apiGet } from '../lib/api'

function Issue({ issue }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="badge-yellow">{issue.category}</span>
        <span className="text-xs text-gray-500">{new Date(issue.approvedAt || issue.updatedAt).toLocaleString()}</span>
      </div>
      <p className="mt-2 text-sm text-gray-800">{issue.description}</p>
      {issue.photoUrl ? (
        <a className="link mt-2 inline-block text-sm" href={issue.photoUrl} target="_blank" rel="noreferrer">
          View Photo
        </a>
      ) : (
        <div className="mt-2 text-xs text-gray-400">No photo</div>
      )}
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

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-red">Faculty Dashboard</h1>
          <p className="text-sm text-gray-700">
            Approved issues (verified by admin). Use this list as your action queue.
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
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700">No approved issues yet.</div>
      ) : (
        <div className="grid gap-3">
          {issues.map((i) => (
            <Issue key={i._id} issue={i} />
          ))}
        </div>
      )}
    </div>
  )
}

