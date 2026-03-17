import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiGet } from '../lib/api'

function CountCard({ label, count, to }) {
  return (
    <Link to={to} className="card block p-5 hover:shadow-md transition-shadow">
      <div className="text-sm font-semibold text-gray-700">{label}</div>
      <div className="mt-2 text-3xl font-extrabold text-brand-red">{count}</div>
      <div className="mt-2 text-sm font-semibold text-brand-sky">Open dashboard →</div>
    </Link>
  )
}

export default function ProfilePage() {
  const { me, firebaseUser } = useAuth()
  const [stats, setStats] = useState({ approvedByMe: 0, pendingByMe: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function run() {
      setLoading(true)
      try {
        const data = await apiGet('/api/my-stats')
        if (mounted) setStats(data.stats)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-extrabold text-brand-red">Profile</h1>
        <div className="mt-3 grid gap-2 text-sm text-gray-700">
          <div>
            <span className="font-semibold">Name:</span> {me?.name || firebaseUser?.displayName || '—'}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {me?.email || firebaseUser?.email || '—'}
          </div>
          <div>
            <span className="font-semibold">Role:</span> <span className="badge-yellow">{me?.role || '—'}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-brand-sky bg-sky-50 p-5">
        <div className="text-sm text-gray-800">
          Click the count cards to open your dashboards. Important numbers are highlighted in{' '}
          <span className="font-semibold text-brand-yellow">yellow</span>.
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-gray-700">Loading stats…</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <CountCard label="My Approved Issues" count={stats.approvedByMe} to="/" />
          <CountCard label="My Pending Issues" count={stats.pendingByMe} to="/" />
        </div>
      )}
    </div>
  )
}

