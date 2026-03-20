import React, { useEffect, useMemo, useState } from 'react'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import { useAuth } from '../context/AuthContext'

const ROLE_OPTIONS = [
  {
    id: 'student',
    label: 'Student',
    desc: 'Submit issues and track their status in real-time.',
    icon: '📚',
    color: 'blue'
  },
  {
    id: 'teacher',
    label: 'Faculty',
    desc: 'View approved complaints and provide resolutions.',
    icon: '👨‍🏫',
    color: 'purple'
  },
  {
    id: 'admin',
    label: 'Administrator',
    desc: 'Review, approve, and manage all complaints.',
    icon: '🛡️',
    color: 'red'
  }
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
    <div className="min-h-dvh bg-gradient-to-br from-red-50 to-white">
      {/* Header with branding */}
      <div className="border-b border-red-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red text-white font-bold text-lg">
            📋
          </div>
          <div>
            <div className="text-lg font-extrabold text-gray-900">Complaint Portal</div>
            <div className="text-xs text-gray-600">Official Issue Management System</div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid min-h-[calc(100dvh-73px)] max-w-6xl grid-cols-1 items-stretch gap-0 md:grid-cols-2">
        {/* Left: official banner with info */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-red to-red-800 p-8 text-white md:flex md:flex-col md:justify-between">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-yellow/20 blur-3xl"></div>
          <div className="absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-brand-sky/10 blur-3xl"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-brand-yellow animate-pulse"></span>
              Official Portal v1.0
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight">
              Report Issues Instantly
            </h1>
            <p className="mt-4 text-lg text-white/90">
              A seamless system to report and track complaints for your academic institution.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-start gap-3 rounded-lg bg-white/5 p-4 backdrop-blur-sm">
                <span className="text-2xl">✅</span>
                <div>
                  <div className="font-semibold">Instant Submission</div>
                  <div className="text-sm text-white/80">Report issues with photos and details</div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-white/5 p-4 backdrop-blur-sm">
                <span className="text-2xl">🔒</span>
                <div>
                  <div className="font-semibold">Admin Verification</div>
                  <div className="text-sm text-white/80">Complaints verified by administrators</div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-white/5 p-4 backdrop-blur-sm">
                <span className="text-2xl">📊</span>
                <div>
                  <div className="font-semibold">Real-time Tracking</div>
                  <div className="text-sm text-white/80">Monitor your complaints from submission to resolution</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 rounded-lg border border-white/20 bg-white/5 p-4 backdrop-blur-sm">
            <div className="font-semibold">📋 Workflow</div>
            <div className="mt-2 space-y-1 text-sm text-white/90">
              <div>Submit Issue → Admin Review → Approval/Rejection</div>
              <div>→ Faculty Dashboard → Resolution</div>
            </div>
          </div>
        </div>

        {/* Right: login form */}
        <div className="flex flex-col items-center justify-center px-4 py-8 md:py-12">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            {/* Form Header */}
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Welcome Back</h2>
              <p className="mt-2 text-sm text-gray-600">
                Sign in with your Google account and select your role to continue.
              </p>
            </div>

            {/* Role Selection */}
            <div className="mt-7 space-y-3">
              <label className="block text-xs font-semibold uppercase text-gray-700">
                I am a:
              </label>
              {ROLE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setRole(opt.id)}
                  className={[
                    'group relative w-full overflow-hidden rounded-xl border-2 p-4 text-left transition-all duration-300',
                    role === opt.id
                      ? 'border-brand-red bg-red-50 shadow-md'
                      : 'border-gray-200 hover:border-brand-yellow hover:bg-yellow-50/30'
                  ].join(' ')}
                  aria-pressed={role === opt.id}
                  aria-label={`Select ${opt.label} role`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{opt.icon}</span>
                        <div className="text-sm font-extrabold text-gray-900">{opt.label}</div>
                      </div>
                      <div className="mt-1 text-xs text-gray-600">{opt.desc}</div>
                    </div>
                    <div
                      className={[
                        'mt-1 h-5 w-5 rounded-full border-2 transition-all',
                        role === opt.id
                          ? 'border-brand-red bg-brand-red'
                          : 'border-gray-300 bg-white group-hover:border-brand-yellow'
                      ].join(' ')}
                      aria-hidden="true"
                    >
                      {role === opt.id && (
                        <svg className="h-full w-full p-0.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Error message */}
            {error && (
              <div
                className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                role="alert"
              >
                <div className="font-semibold">❌ Error</div>
                <div className="mt-1">{error}</div>
              </div>
            )}

            {/* Login Button */}
            <button
              className={[
                'btn-primary mt-7 w-full py-3 font-semibold transition-all duration-300',
                busy ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg active:scale-95'
              ].join(' ')}
              disabled={busy}
              onClick={doLogin}
              aria-busy={busy}
            >
              {busy ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </span>
              )}
            </button>

            {/* Info Box */}
            <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="text-xs font-semibold uppercase text-blue-900">ℹ️ Security Note</div>
              <ul className="mt-2 space-y-1 text-xs text-blue-800">
                <li>✓ Secure Firebase Authentication</li>
                <li>✓ Email verification required for Admin/Faculty</li>
                <li>✓ All data encrypted and verified</li>
              </ul>
            </div>

            {/* Accessibility note */}
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <div className="text-xs font-semibold text-amber-900">♿ Accessibility</div>
              <div className="mt-1 text-xs text-amber-800">
                Use Tab to navigate. Press Space/Enter to select roles. Accessibility tools available in header.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
