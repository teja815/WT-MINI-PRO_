import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const HomeIcon = () => (
  <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)
const ClassroomIcon = () => (
  <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
)
const MessIcon = () => (
  <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
  </svg>
)
const HostelIcon = () => (
  <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
)
const ProfileIcon = () => (
  <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)
const AdminIcon = () => (
  <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)
const FacultyIcon = () => (
  <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
)
const ComplaintsIcon = () => (
  <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)
const CollapseIcon = ({ collapsed }) => (
  <svg className={`h-5 w-5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
  </svg>
)
const LogoutIcon = () => (
  <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)

export default function Sidebar() {
  const { me, firebaseUser, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const role = me?.role || 'student'

  const linkClass = ({ isActive }) =>
    `sidebar-link ${isActive ? 'active' : ''}`

  // Build nav items based on role
  const navItems = []

  // Everyone gets Home and Profile
  navItems.push({ to: '/', label: 'Home', icon: <HomeIcon /> })

  // Students & Teachers: can submit complaints (category pages)
  if (role === 'student' || role === 'teacher') {
    navItems.push({ to: '/classroom', label: 'Classroom', icon: <ClassroomIcon /> })
    navItems.push({ to: '/mess', label: 'Mess', icon: <MessIcon /> })
    navItems.push({ to: '/hostel', label: 'Hostel', icon: <HostelIcon /> })
  }

  // Teachers & Admins: can view complaint dashboard
  if (role === 'teacher' || role === 'admin') {
    navItems.push({ to: '/complaints', label: 'Complaints', icon: <ComplaintsIcon /> })
  }

  navItems.push({ to: '/profile', label: 'Profile', icon: <ProfileIcon /> })

  // Admin only: admin panel
  if (role === 'admin') {
    navItems.push({ to: '/admin', label: 'Admin Panel', icon: <AdminIcon /> })
  }

  // Teacher & Admin: faculty view
  if (role === 'teacher' || role === 'admin') {
    navItems.push({ to: '/faculty', label: 'Faculty', icon: <FacultyIcon /> })
  }

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  const roleBadge = {
    student: { label: 'Student', bg: 'bg-sky-500/20 text-sky-300' },
    teacher: { label: 'Faculty', bg: 'bg-amber-500/20 text-amber-300' },
    admin: { label: 'Admin', bg: 'bg-red-500/20 text-red-300' }
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-red text-white font-bold text-lg shadow-lg shadow-red-900/30">
          CP
        </div>
        {!collapsed && (
          <div className="min-w-0 animate-fadeIn">
            <div className="text-sm font-bold text-white truncate">Complaint Portal</div>
            <div className={`text-[10px] px-2 py-0.5 rounded-full mt-0.5 inline-block font-semibold ${roleBadge[role]?.bg || ''}`}>
              {roleBadge[role]?.label || role}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Main navigation">
        {!collapsed && (
          <div className="px-4 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Navigation</div>
        )}
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={linkClass}
            onClick={() => setMobileOpen(false)}
            title={collapsed ? item.label : undefined}
          >
            {item.icon}
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle (desktop only) */}
      <div className="hidden md:block px-3 py-2">
        <button
          onClick={() => setCollapsed(c => !c)}
          className="sidebar-link w-full justify-center"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <CollapseIcon collapsed={collapsed} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>

      {/* User section */}
      <div className="border-t border-white/10 px-3 py-4">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2">
          {firebaseUser?.photoURL ? (
            <img
              src={firebaseUser.photoURL}
              alt=""
              className="h-9 w-9 rounded-full border-2 border-brand-yellow shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-red text-white text-sm font-bold">
              {(me?.name || me?.email || '?')[0].toUpperCase()}
            </div>
          )}
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-white truncate">
                {me?.name || firebaseUser?.displayName || 'User'}
              </div>
              <div className="text-xs text-gray-400 truncate">{me?.email || '—'}</div>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-link w-full mt-1 text-red-400 hover:text-red-300 hover:bg-red-900/30"
          title="Logout"
        >
          <LogoutIcon />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="fixed top-20 left-4 z-50 rounded-xl bg-gray-900 p-2.5 text-white shadow-lg md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation menu"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {mobileOpen
            ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          }
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={[
          'sidebar',
          collapsed ? 'md:w-20' : 'md:w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        ].join(' ')}
        aria-label="Sidebar navigation"
      >
        {sidebarContent}
      </aside>

      {/* Spacer */}
      <div className={`hidden md:block shrink-0 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`} />
    </>
  )
}
