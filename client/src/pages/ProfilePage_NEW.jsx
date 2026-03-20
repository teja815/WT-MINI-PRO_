import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiGet } from '../lib/api'

function StatCard({ icon, label, count, to, loading, onClick }) {
  const CardComponent = to ? Link : 'div'
  const cardProps = to ? { to } : onClick ? { onClick, role: 'button', tabIndex: 0, onKeyDown: (e) => (e.key === 'Enter' || e.key === ' ') && onClick() } : {}

  return (
    <CardComponent
      {...cardProps}
      className={[
        'group relative overflow-hidden rounded-xl border-2 p-6 transition-all duration-300',
        to || onClick ? 'cursor-pointer hover:shadow-lg hover:border-brand-red active:scale-95' : '',
        'border-gray-200 bg-white shadow-sm'
      ].join(' ')}
    >
      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-brand-yellow/5 transition-transform group-hover:scale-150"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm font-semibold uppercase text-gray-600 tracking-wide">{label}</div>
            <div className="mt-3 text-4xl font-extrabold text-brand-red">
              {loading ? (
                <span className="inline-block h-10 w-10 animate-pulse rounded bg-gray-200"></span>
              ) : (
                count
              )}
            </div>
          </div>
          <div className="text-4xl">{icon}</div>
        </div>

        {(to || onClick) && (
          <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-brand-sky transition-transform group-hover:translate-x-1">
            <span>View Details</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>
    </CardComponent>
  )
}

function ProfileCard({ me, firebaseUser }) {
  return (
    <div className="rounded-xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm">
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        {/* Profile Picture */}
        <div className="shrink-0">
          {firebaseUser?.photoURL ? (
            <img
              src={firebaseUser.photoURL}
              alt={me?.name || 'Profile'}
              className="h-24 w-24 rounded-full border-4 border-brand-yellow shadow-md"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-brand-yellow bg-brand-red text-white text-2xl font-bold">
              {me?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-extrabold text-gray-900">{me?.name || firebaseUser?.displayName || 'User'}</h1>
          <p className="mt-1 text-sm text-gray-600">{me?.email || firebaseUser?.email || 'No email'}</p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <div className="inline-flex items-center gap-2 rounded-lg bg-brand-yellow/20 px-3 py-2">
              <span className="text-2xl">
                {me?.role === 'student' && '📚'}
                {me?.role === 'teacher' && '👨‍🏫'}
                {me?.role === 'admin' && '🛡️'}
              </span>
              <div className="text-sm font-semibold text-gray-900">
                {me?.role === 'student' && 'Student'}
                {me?.role === 'teacher' && 'Faculty Member'}
                {me?.role === 'admin' && 'Administrator'}
              </div>
            </div>

            <div className="rounded-lg border border-brand-sky bg-sky-50 px-3 py-2">
              <div className="text-xs font-semibold text-brand-sky uppercase">Verified Member</div>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-700 leading-relaxed">
            {me?.role === 'student' &&
              'Submit and track issues related to classroom, mess, or hostel facilities.'}
            {me?.role === 'teacher' &&
              'Review and respond to complaints approved by administrators. Help resolve student issues.'}
            {me?.role === 'admin' &&
              'Manage and approve all incoming complaints. Verify information and delegate to appropriate faculty.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { me, firebaseUser } = useAuth()
  const [stats, setStats] = useState({ approvedByMe: 0, pendingByMe: 0, totalPending: 0, totalApproved: 0 })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    async function run() {
      setLoading(true)
      try {
        const data = await apiGet('/api/my-stats')
        if (mounted) {
          // For admin, also load total stats
          if (me?.role === 'admin') {
            setStats({
              ...data.stats,
              totalPending: data.stats.totalPending || 0,
              totalApproved: data.stats.totalApproved || 0
            })
          } else {
            setStats(data.stats)
          }
        }
      } catch (e) {
        console.error('Failed to load stats:', e)
        if (mounted) setStats({ approvedByMe: 0, pendingByMe: 0, totalPending: 0, totalApproved: 0 })
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [me?.role])

  const handleAdminDashboardClick = () => {
    navigate('/admin')
  }

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <ProfileCard me={me} firebaseUser={firebaseUser} />

      {/* Info Banner */}
      <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 flex items-start gap-3">
        <span className="text-2xl">ℹ️</span>
        <div>
          <h3 className="font-semibold text-blue-900">How This Works</h3>
          <p className="mt-1 text-sm text-blue-800">
            Click on the stat cards below to view detailed dashboards. Admins can review and approve
            complaints, while students and faculty can track their submissions.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      {me?.role === 'student' && (
        <div>
          <h2 className="mb-4 text-lg font-extrabold text-gray-900 flex items-center gap-2">
            <span>📊</span> Your Statistics
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <StatCard
              icon="✅"
              label="Approved Issues"
              count={stats.approvedByMe}
              loading={loading}
              to="/"
            />
            <StatCard
              icon="⏳"
              label="Pending Issues"
              count={stats.pendingByMe}
              loading={loading}
              to="/"
            />
          </div>
        </div>
      )}

      {me?.role === 'teacher' && (
        <div>
          <h2 className="mb-4 text-lg font-extrabold text-gray-900 flex items-center gap-2">
            <span>📋</span> Your Assignments
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <StatCard
              icon="✅"
              label="Resolved Issues"
              count={stats.approvedByMe}
              loading={loading}
              to="/faculty"
            />
            <StatCard
              icon="📨"
              label="Pending Responses"
              count={stats.pendingByMe}
              loading={loading}
              to="/faculty"
            />
          </div>
        </div>
      )}

      {me?.role === 'admin' && (
        <div>
          <h2 className="mb-4 text-lg font-extrabold text-gray-900 flex items-center gap-2">
            <span>🛡️</span> Admin Dashboard
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <StatCard
              icon="⏳"
              label="Pending Review"
              count={stats.totalPending}
              loading={loading}
              onClick={handleAdminDashboardClick}
            />
            <StatCard
              icon="✅"
              label="Total Approved"
              count={stats.totalApproved}
              loading={loading}
            />
          </div>

          <div className="mt-6 rounded-lg border-2 border-brand-red bg-red-50 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔔</span>
                <div>
                  <div className="font-semibold text-gray-900">Pending Complaints Waiting Review</div>
                  <div className="mt-1 text-sm text-gray-700">
                    {stats.totalPending} complaint{stats.totalPending !== 1 ? 's' : ''} need{stats.totalPending === 1 ? 's' : ''} your attention
                  </div>
                </div>
              </div>
              <button
                onClick={handleAdminDashboardClick}
                className="btn-primary shrink-0 whitespace-nowrap"
                aria-label="Go to admin dashboard to review complaints"
              >
                Review Now →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accessibility Info */}
      <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
        <span className="text-2xl">♿</span>
        <div>
          <h3 className="font-semibold text-amber-900">Accessibility Features</h3>
          <ul className="mt-2 space-y-1 text-sm text-amber-800">
            <li>✓ Fully keyboard navigable - use Tab to move between cards</li>
            <li>✓ Screen reader compatible - proper ARIA labels on all elements</li>
            <li>✓ High contrast mode available in the header accessibility tools</li>
            <li>✓ Text size adjustment available in accessibility menu</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
