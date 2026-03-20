import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiGet } from '../lib/api'

function StatCard({ label, count, to, icon, color, badge, clickable }) {
  const inner = (
    <div className="stat-card group">
      <div className={`inline-flex items-center justify-center rounded-2xl p-3 mb-3 ${color} transition-transform group-hover:scale-110 duration-300`}>
        {icon}
      </div>
      <div className="text-3xl font-extrabold text-gray-900 animate-countUp">{count}</div>
      <div className="text-sm font-medium text-gray-500 mt-1">{label}</div>
      {badge && (
        <span className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge}`}>
          {count > 0 ? 'Active' : 'None'}
        </span>
      )}
      {clickable && (
        <div className="mt-3 text-xs font-semibold text-brand-sky group-hover:gap-2 transition-all flex items-center justify-center gap-1">
          View Dashboard
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      )}
    </div>
  )

  if (clickable && to) {
    return <Link to={to}>{inner}</Link>
  }
  return inner
}

export default function ProfilePage() {
  const { me, firebaseUser } = useAuth()
  const [stats, setStats] = useState({ approvedByMe: 0, pendingByMe: 0 })
  const [loading, setLoading] = useState(true)
  const role = me?.role || 'student'

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
    return () => { mounted = false }
  }, [])

  const roleColors = {
    student: 'bg-sky-100 text-brand-sky',
    teacher: 'bg-amber-100 text-amber-700',
    admin: 'bg-red-100 text-brand-red'
  }

  // Students: show counts only (no dashboard links)
  // Teachers & Admins: show counts with dashboard links
  const canViewDashboard = role === 'teacher' || role === 'admin'

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Profile Card */}
      <div className="card overflow-hidden">
        <div className="h-32 gradient-red relative">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-yellow/20 animate-float" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-brand-sky/15 animate-float delay-300" />
        </div>

        <div className="px-6 pb-6 relative">
          <div className="-mt-12 flex items-end gap-4">
            {firebaseUser?.photoURL ? (
              <img
                src={firebaseUser.photoURL}
                alt={me?.name || 'Profile'}
                className="h-24 w-24 rounded-2xl border-4 border-white shadow-xl object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-brand-red text-white text-3xl font-bold shadow-xl">
                {(me?.name || me?.email || '?')[0].toUpperCase()}
              </div>
            )}
            <div className="pb-1">
              <h1 className="text-2xl font-extrabold text-gray-900">
                {me?.name || firebaseUser?.displayName || 'User'}
              </h1>
              <p className="text-sm text-gray-500">{me?.email || firebaseUser?.email || '—'}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${roleColors[role] || roleColors.student}`}>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
            <span className="badge-gray">
              <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {me?.email || '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="rounded-2xl border border-brand-sky/30 bg-sky-50 p-4 flex items-start gap-3">
        <svg className="h-5 w-5 text-brand-sky shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-gray-700">
          {canViewDashboard
            ? 'Click on the stat cards below to open the complaint dashboard filtered by status.'
            : 'Your complaint counts are shown below. Complaints are tracked in real-time and managed by the admin.'}
        </p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card p-8"><div className="shimmer h-20 w-full rounded-xl" /></div>
          <div className="card p-8"><div className="shimmer h-20 w-full rounded-xl" /></div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <StatCard
            label="Approved Issues"
            count={stats.approvedByMe}
            to="/complaints?status=approved"
            clickable={canViewDashboard}
            color="bg-emerald-50 text-emerald-600"
            badge="bg-emerald-100 text-emerald-700"
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Pending Issues"
            count={stats.pendingByMe}
            to="/complaints?status=pending"
            clickable={canViewDashboard}
            color="bg-amber-50 text-amber-600"
            badge="bg-amber-100 text-amber-700"
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>
      )}

      {/* Quick Actions — role specific */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {role !== 'admin' && (
            <>
              <Link to="/classroom" className="btn-outline rounded-2xl py-3 text-center">📚 Classroom Issue</Link>
              <Link to="/mess" className="btn-outline rounded-2xl py-3 text-center">🍽️ Mess Complaint</Link>
              <Link to="/hostel" className="btn-outline rounded-2xl py-3 text-center">🏢 Hostel Issue</Link>
            </>
          )}
          {role === 'admin' && (
            <>
              <Link to="/admin" className="btn-primary rounded-2xl py-3 text-center">🛡️ Review Pending</Link>
              <Link to="/complaints" className="btn-outline rounded-2xl py-3 text-center">📊 All Complaints</Link>
              <Link to="/faculty" className="btn-outline rounded-2xl py-3 text-center">📋 Faculty View</Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
