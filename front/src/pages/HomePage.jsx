import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiGet } from '../lib/api'

/* ─── Shared stat box ─── */
const StatBox = ({ label, value, icon, color }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`rounded-2xl p-3 ${color}`}>{icon}</div>
    <div>
      <div className="text-2xl font-extrabold text-gray-900 animate-countUp">{value}</div>
      <div className="text-xs text-gray-500 font-medium">{label}</div>
    </div>
  </div>
)

/* ─── Category card with icon ─── */
const CategoryCard = ({ title, description, to, icon, color }) => (
  <Link to={to} className="card-hover block p-6 group">
    <div className={`inline-flex items-center justify-center rounded-2xl p-3 mb-4 ${color} transition-transform group-hover:scale-110 duration-300`}>
      {icon}
    </div>
    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
    <p className="mt-2 text-sm text-gray-500 leading-relaxed">{description}</p>
    <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-sky group-hover:gap-3 transition-all duration-300">
      Go to dashboard
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </div>
  </Link>
)

/* ════════════════════════════════════════════════════════
   STUDENT HOME — only compliant submission + counts
   ════════════════════════════════════════════════════════ */
function StudentHome({ stats }) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl gradient-red p-8 lg:p-10 text-white">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-brand-yellow/15 animate-float" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-brand-sky/10 animate-float delay-300" />
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 text-xs font-semibold mb-4">
            <span className="h-2 w-2 rounded-full bg-brand-yellow animate-pulse-dot" />
            Student Portal
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight">
            Report Campus Issues 📋
          </h1>
          <p className="mt-3 text-white/80 text-sm leading-relaxed">
            Submit complaints about classroom, mess, or hostel issues. Your complaint will be reviewed by the admin and forwarded to faculty for resolution.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/add-structured-complaint" className="btn bg-brand-yellow text-black hover:bg-yellow-400 font-bold">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Submit Complaint
            </Link>
          </div>
        </div>
      </div>

      {/* Counts only — no dashboard for students */}
      <div className="grid gap-4 sm:grid-cols-2">
        <StatBox
          label="My Approved (Fixed)"
          value={stats.approvedByMe}
          color="bg-emerald-50 text-emerald-600"
          icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatBox
          label="My Pending"
          value={stats.pendingByMe}
          color="bg-amber-50 text-amber-600"
          icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      {/* Submit in any category */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Submit a Complaint</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <CategoryCard
            title="Classroom"
            description="Projector, benches, cleanliness, and infrastructure problems."
            to="/add-structured-complaint"
            color="bg-sky-50 text-brand-sky"
            icon={<svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
          />
          <CategoryCard
            title="Mess"
            description="Food quality, hygiene, menu issues, and timing problems."
            to="/add-structured-complaint"
            color="bg-amber-50 text-amber-600"
            icon={<svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>}
          />
          <CategoryCard
            title="Hostel"
            description="Room maintenance, water, electricity, and safety concerns."
            to="/add-structured-complaint"
            color="bg-red-50 text-brand-red"
            icon={<svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
          />
        </div>
      </div>

      {/* How it works */}
      <div className="card p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">How It Works</h2>
        <div className="grid gap-6 sm:grid-cols-4">
          {[
            { step: '01', title: 'Submit', desc: 'File a complaint with description and optional photo.', icon: '📝' },
            { step: '02', title: 'Pending', desc: 'Your complaint is queued for admin review.', icon: '⏳' },
            { step: '03', title: 'Admin Review', desc: 'Admin verifies and approves or rejects.', icon: '🛡️' },
            { step: '04', title: 'Resolution', desc: 'Approved complaints reach faculty for action.', icon: '✅' }
          ].map((item, i) => (
            <div key={item.step} className="text-center animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="text-4xl mb-3">{item.icon}</div>
              <div className="text-xs font-bold text-brand-red mb-1">STEP {item.step}</div>
              <div className="text-sm font-bold text-gray-900">{item.title}</div>
              <div className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   TEACHER HOME — can submit + see dashboard + counts
   ════════════════════════════════════════════════════════ */
function TeacherHome({ stats, me }) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl gradient-red p-8 lg:p-10 text-white">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-brand-yellow/15 animate-float" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-brand-sky/10 animate-float delay-300" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 text-xs font-semibold mb-4">
              <span className="h-2 w-2 rounded-full bg-brand-yellow animate-pulse-dot" />
              Faculty Dashboard
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight">
              Welcome, <span className="text-brand-yellow">{me?.name || 'Teacher'}</span> 👋
            </h1>
            <p className="mt-3 text-white/80 text-sm leading-relaxed">
              Submit complaints, view approved issues, and track resolutions. You have access to the complaint dashboard.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/complaints" className="btn bg-white/10 text-white border border-white/20 hover:bg-white hover:text-brand-red backdrop-blur-sm">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Complaint Dashboard
            </Link>
            <Link to="/add-structured-complaint" className="btn bg-brand-yellow text-black hover:bg-yellow-400 font-bold">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Submit Complaint
            </Link>
          </div>
        </div>
      </div>

      {/* Stats with dashboard links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/complaints?status=approved" className="stat-card group">
          <div className="text-3xl font-extrabold text-emerald-600 animate-countUp">{stats.approvedByMe}</div>
          <div className="text-xs text-gray-500 mt-1 font-medium">My Approved</div>
          <div className="mt-2 text-xs text-brand-sky font-semibold group-hover:underline">View →</div>
        </Link>
        <Link to="/complaints?status=pending" className="stat-card group">
          <div className="text-3xl font-extrabold text-amber-600 animate-countUp">{stats.pendingByMe}</div>
          <div className="text-xs text-gray-500 mt-1 font-medium">My Pending</div>
          <div className="mt-2 text-xs text-brand-sky font-semibold group-hover:underline">View →</div>
        </Link>
        <div className="card p-5 text-center">
          <div className="text-3xl font-extrabold text-brand-sky animate-countUp">3</div>
          <div className="text-xs text-gray-500 mt-1 font-medium">Categories</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl font-extrabold text-brand-red animate-countUp">Active</div>
          <div className="text-xs text-gray-500 mt-1 font-medium">Status</div>
        </div>
      </div>

      {/* Category cards */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Submit a Complaint</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <CategoryCard
            title="Classroom" description="Projector, benches, cleanliness, and infrastructure problems." to="/add-structured-complaint"
            color="bg-sky-50 text-brand-sky"
            icon={<svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
          />
          <CategoryCard
            title="Mess" description="Food quality, hygiene, menu issues, and timing problems." to="/add-structured-complaint"
            color="bg-amber-50 text-amber-600"
            icon={<svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>}
          />
          <CategoryCard
            title="Hostel" description="Room maintenance, water, electricity, and safety concerns." to="/add-structured-complaint"
            color="bg-red-50 text-brand-red"
            icon={<svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
          />
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   ADMIN HOME — only review/approve/reject + dashboard
   ════════════════════════════════════════════════════════ */
function AdminHome({ me, adminStats }) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gray-900 p-8 lg:p-10 text-white">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-brand-red/20 animate-float" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-brand-yellow/10 animate-float delay-300" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-red/20 backdrop-blur-sm border border-brand-red/30 px-4 py-1.5 text-xs font-semibold mb-4">
              <span className="h-2 w-2 rounded-full bg-brand-red animate-pulse-dot" />
              Administrator
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight">
              Admin Dashboard 🛡️
            </h1>
            <p className="mt-3 text-white/70 text-sm leading-relaxed">
              Review and manage complaints submitted by students and teachers. Approve or reject pending complaints.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/admin" className="btn bg-brand-red text-white hover:bg-red-700 font-bold shadow-lg shadow-red-900/30">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Review Complaints
            </Link>
            <Link to="/complaints" className="btn bg-white/10 text-white border border-white/20 hover:bg-white hover:text-gray-900 backdrop-blur-sm">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              All Complaints
            </Link>
          </div>
        </div>
      </div>

      {/* Admin Stats — clickable */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Link to="/admin" className="stat-card group border-amber-200 bg-amber-50/50">
          <div className="text-3xl font-extrabold text-amber-600 animate-countUp">{adminStats.pending}</div>
          <div className="text-xs text-amber-600 mt-1 font-medium">Pending Review</div>
          <div className="mt-2 text-xs text-brand-sky font-semibold group-hover:underline">Review now →</div>
        </Link>
        <Link to="/complaints?status=approved" className="stat-card group border-emerald-200 bg-emerald-50/50">
          <div className="text-3xl font-extrabold text-emerald-600 animate-countUp">{adminStats.approved}</div>
          <div className="text-xs text-emerald-600 mt-1 font-medium">Approved</div>
          <div className="mt-2 text-xs text-brand-sky font-semibold group-hover:underline">View →</div>
        </Link>
        <Link to="/complaints?status=rejected" className="stat-card group border-red-200 bg-red-50/50">
          <div className="text-3xl font-extrabold text-red-600 animate-countUp">{adminStats.rejected}</div>
          <div className="text-xs text-red-600 mt-1 font-medium">Rejected</div>
          <div className="mt-2 text-xs text-brand-sky font-semibold group-hover:underline">View →</div>
        </Link>
        <div className="stat-card border-gray-200">
          <div className="text-3xl font-extrabold text-gray-900 animate-countUp">{adminStats.total}</div>
          <div className="text-xs text-gray-500 mt-1 font-medium">Total</div>
        </div>
      </div>

      {/* Quick access */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link to="/admin" className="btn-primary rounded-2xl py-3 text-center">
            🛡️ Review Pending
          </Link>
          <Link to="/complaints" className="btn-outline rounded-2xl py-3 text-center">
            📊 All Complaints
          </Link>
          <Link to="/faculty" className="btn-outline rounded-2xl py-3 text-center">
            📋 Faculty View
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
        <svg className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-amber-800">
          As an admin, you can only <strong>review and manage</strong> complaints. To submit complaints, use a student or teacher account.
        </p>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   MAIN COMPONENT — routes to the correct home
   ════════════════════════════════════════════════════════ */
export default function HomePage() {
  const { me } = useAuth()
  const [stats, setStats] = useState({ approvedByMe: 0, pendingByMe: 0 })
  const [adminStats, setAdminStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 })

  useEffect(() => {
    let mounted = true
    async function run() {
      try {
        const data = await apiGet('/api/my-stats')
        if (mounted) setStats(data.stats)
      } catch {}
      if (me?.role === 'admin') {
        try {
          const data = await apiGet('/api/admin/stats')
          if (mounted) setAdminStats(data.stats)
        } catch {}
      }
    }
    run()
    return () => { mounted = false }
  }, [me?.role])

  if (me?.role === 'admin') {
    return <AdminHome me={me} adminStats={adminStats} />
  }
  if (me?.role === 'teacher') {
    return <TeacherHome me={me} stats={stats} />
  }
  return <StudentHome stats={stats} />
}
