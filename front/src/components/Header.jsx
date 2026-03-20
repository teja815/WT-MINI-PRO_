import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AccessibilityToolsDialog from './accessibility/AccessibilityToolsDialog'

export default function Header() {
  const { me, firebaseUser } = useAuth()
  const [a11yOpen, setA11yOpen] = useState(false)

  const role = me?.role || 'student'
  const roleLabels = { student: 'Student', teacher: 'Faculty', admin: 'Administrator' }
  const roleColors = { student: 'text-brand-sky', teacher: 'text-amber-600', admin: 'text-brand-red' }
  const roleBg = { student: 'bg-sky-50', teacher: 'bg-amber-50', admin: 'bg-red-50' }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-lg" role="banner">
        <div className="flex items-center justify-between gap-4 px-6 py-3">
          {/* Left: Welcome + role indicator */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-gray-900">
                  {me?.name || firebaseUser?.displayName || 'User'}
                </h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleBg[role]} ${roleColors[role]}`}>
                  {roleLabels[role]}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{me?.email || firebaseUser?.email || '—'}</p>
            </div>
          </div>

          {/* Center: Breadcrumb hint */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-gray-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Complaint Portal</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-600 font-medium">{roleLabels[role]} Dashboard</span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5">
            {/* Quick action based on role */}
            {role !== 'admin' && (
              <Link
                to="/classroom"
                className="hidden sm:flex items-center gap-1.5 rounded-xl bg-brand-red px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                New Complaint
              </Link>
            )}
            {role === 'admin' && (
              <Link
                to="/admin"
                className="hidden sm:flex items-center gap-1.5 rounded-xl bg-brand-red px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Review Queue
              </Link>
            )}

            {/* Notifications */}
            <button
              className="relative rounded-xl p-2.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              title="Notifications"
              aria-label="Notifications"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-red animate-pulse-dot" />
            </button>

            {/* Accessibility */}
            <button
              className="rounded-xl p-2.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              onClick={() => setA11yOpen(true)}
              title="Accessibility Tools"
              aria-label="Open accessibility tools"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>

            {/* User avatar */}
            <Link to="/profile" className="shrink-0">
              {firebaseUser?.photoURL ? (
                <img
                  src={firebaseUser.photoURL}
                  alt={me?.name || 'User avatar'}
                  className="h-9 w-9 rounded-full border-2 border-brand-yellow shadow-sm hover:shadow-md transition-shadow"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-red text-white text-sm font-bold border-2 border-brand-yellow">
                  {(me?.name || me?.email || '?')[0].toUpperCase()}
                </div>
              )}
            </Link>
          </div>
        </div>
      </header>

      {a11yOpen && <AccessibilityToolsDialog onClose={() => setA11yOpen(false)} />}
    </>
  )
}
