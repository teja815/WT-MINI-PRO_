import React, { useEffect, useMemo, useState } from 'react'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import { useAuth } from '../context/AuthContext'

const ROLE_OPTIONS = [
  {
    id: 'student',
    label: 'Student',
    desc: 'Submit issues and track status.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    )
  },
  {
    id: 'teacher',
    label: 'Teacher',
    desc: 'View approved issues and take action.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    )
  },
  {
    id: 'admin',
    label: 'Admin',
    desc: 'Verify and approve/reject complaints.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    )
  }
]

const WORKFLOW_STEPS = [
  { label: 'Submit', desc: 'File a complaint', icon: '📝' },
  { label: 'Pending', desc: 'Awaiting review', icon: '⏳' },
  { label: 'Admin Review', desc: 'Verify & approve', icon: '🛡️' },
  { label: 'Faculty Action', desc: 'Issue resolved', icon: '✅' }
]

export default function LoginPage() {
  const { firebaseUser, me, registerRole } = useAuth()
  const [role, setRole] = useState('student')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  const provider = useMemo(() => new GoogleAuthProvider(), [])

  async function doLogin() {
    setError('')
    setBusy(true)
    try {
      await signInWithPopup(auth, provider)
      await registerRole(role)
      navigate('/')
    } catch (e) {
      setError(e?.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    if (firebaseUser && me) navigate('/')
  }, [firebaseUser, me, navigate])

  return (
    <div className="min-h-dvh bg-gray-50">
      {/* Accessibility mini-bar */}
      <div className="bg-gray-800 text-white text-xs py-1.5 px-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <span className="text-gray-400">Official Complaint Portal</span>
          <div className="flex items-center gap-3">
            <a href="#login-form" className="hover:text-brand-yellow transition-colors">Skip to form</a>
          </div>
        </div>
      </div>

      <div className="mx-auto grid min-h-[calc(100dvh-36px)] max-w-7xl grid-cols-1 items-stretch gap-0 lg:grid-cols-2">
        {/* Left — Hero Panel */}
        <div className="relative overflow-hidden gradient-hero p-8 lg:p-12 text-white flex flex-col justify-center">
          {/* Decorative shapes */}
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-yellow/10 animate-float" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-brand-sky/10 animate-float delay-300" />
          <div className="absolute right-1/4 top-1/3 h-20 w-20 rounded-full bg-white/5 animate-float delay-500" />

          <div className="relative z-10 animate-fadeInUp">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold border border-white/20">
              <span className="h-2 w-2 rounded-full bg-brand-yellow animate-pulse-dot" />
              Official Platform
            </div>

            <h1 className="mt-6 text-4xl lg:text-5xl font-extrabold leading-tight">
              Complaint
              <span className="block text-brand-yellow">Management Portal</span>
            </h1>
            <p className="mt-4 max-w-lg text-base text-white/80 leading-relaxed">
              A secure platform for students and faculty to report, track, and resolve campus issues.
              All complaints are{' '}
              <span className="font-bold text-brand-yellow">verified by Admin</span>{' '}
              before reaching the Faculty dashboard.
            </p>

            {/* Stats */}
            <div className="mt-8 flex gap-6">
              <div className="animate-fadeInUp delay-200">
                <div className="text-3xl font-extrabold text-brand-yellow">3</div>
                <div className="text-xs text-white/60 mt-1">Categories</div>
              </div>
              <div className="animate-fadeInUp delay-300">
                <div className="text-3xl font-extrabold text-brand-yellow">24/7</div>
                <div className="text-xs text-white/60 mt-1">Available</div>
              </div>
              <div className="animate-fadeInUp delay-400">
                <div className="text-3xl font-extrabold text-brand-yellow">100%</div>
                <div className="text-xs text-white/60 mt-1">Verified</div>
              </div>
            </div>

            {/* Workflow */}
            <div className="mt-10 animate-fadeInUp delay-500">
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">How It Works</h3>
              <div className="flex flex-wrap gap-3">
                {WORKFLOW_STEPS.map((step, i) => (
                  <div key={step.label} className="flex items-center gap-2">
                    <div className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 px-3 py-2">
                      <span className="text-lg">{step.icon}</span>
                      <div>
                        <div className="text-xs font-bold">{step.label}</div>
                        <div className="text-[10px] text-white/60">{step.desc}</div>
                      </div>
                    </div>
                    {i < WORKFLOW_STEPS.length - 1 && (
                      <svg className="h-4 w-4 text-white/30 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right — Login Form */}
        <div className="flex items-center justify-center p-6 lg:p-12 bg-white" id="login-form">
          <div className="w-full max-w-md animate-slideInRight">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-red text-white font-bold text-xl shadow-lg shadow-red-200">
                  CP
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900">Sign in</h2>
                  <p className="text-sm text-gray-500">to Complaint Portal</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Choose your role and sign in with Google. Admin/Teacher access may be restricted by email allow-list.
              </p>
            </div>

            {/* Role Selection */}
            <div className="space-y-3 mb-6">
              <label className="text-sm font-semibold text-gray-700">Select your role</label>
              <div className="grid gap-3">
                {ROLE_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setRole(opt.id)}
                    className={[
                      'group w-full rounded-2xl border-2 p-4 text-left transition-all duration-300',
                      role === opt.id
                        ? 'border-brand-red bg-red-50 shadow-lg shadow-red-100'
                        : 'border-gray-200 hover:border-brand-sky hover:bg-sky-50 hover:shadow-md'
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-4">
                      <div className={[
                        'rounded-xl p-2 transition-colors',
                        role === opt.id ? 'bg-brand-red text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-sky-100 group-hover:text-brand-sky'
                      ].join(' ')}>
                        {opt.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-900">{opt.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
                      </div>
                      <div className={[
                        'h-5 w-5 rounded-full border-2 transition-all flex items-center justify-center',
                        role === opt.id
                          ? 'border-brand-red bg-brand-red'
                          : 'border-gray-300 group-hover:border-brand-sky'
                      ].join(' ')}>
                        {role === opt.id && (
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              className="btn w-full py-3.5 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 hover:shadow-xl hover:shadow-gray-200 transition-all duration-300 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={busy}
              onClick={doLogin}
            >
              {busy ? (
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in…
                </div>
              ) : (
                <>
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google as {role.charAt(0).toUpperCase() + role.slice(1)}
                </>
              )}
            </button>

            {/* Error */}
            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 animate-fadeInUp flex items-start gap-2">
                <svg className="h-5 w-5 shrink-0 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}

            {/* Security badge */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secured with Firebase Authentication
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
