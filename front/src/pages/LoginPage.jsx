import React, { useEffect, useMemo, useState } from 'react'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import { useAuth } from '../context/AuthContext'

const ROLE_OPTIONS = [
  { id: 'student', label: 'Student', desc: 'Submit issues and track status.' },
  { id: 'teacher', label: 'Teacher', desc: 'View approved issues and take action.' },
  { id: 'admin', label: 'Admin', desc: 'Verify and approve complaints.' }
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
    <div className="min-h-dvh bg-white">
      <div className="mx-auto grid min-h-dvh max-w-6xl grid-cols-1 items-stretch gap-0 px-4 py-8 md:grid-cols-2 md:py-12">
        <div className="relative overflow-hidden rounded-2xl border border-red-200 bg-brand-red p-8 text-white shadow-sm">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-yellow/25"></div>
          <div className="absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-brand-sky/25"></div>

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-brand-yellow"></span>
              Official Complaint Portal
            </div>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight">
              Report & Track Issues for
              <span className="block text-brand-yellow">Classroom • Mess • Hostel</span>
            </h1>
            <p className="mt-3 max-w-md text-sm text-white/90">
              Sign in using Firebase Authentication. Your complaint will be{' '}
              <span className="font-semibold text-brand-yellow">verified by Admin</span> before it reaches the Faculty dashboard.
            </p>

            <div className="mt-6 grid gap-3">
              <div className="rounded-xl border border-white/20 bg-white/10 p-4">
                <div className="text-sm font-bold">Workflow</div>
                <div className="mt-1 text-sm text-white/90">
                  Submit → Pending → Admin Approval → Approved → Faculty Dashboard
                </div>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 p-4">
                <div className="text-sm font-bold">Theme</div>
                <div className="mt-1 text-sm text-white/90">
                  Red buttons, white background, <span className="font-semibold text-brand-yellow">yellow highlights</span>, sky-blue links.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">Sign in</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Choose a role to continue. <span className="font-semibold text-brand-yellow">Important</span>: Admin/Teacher can be restricted by email allow-list.
                </p>
              </div>
              <div className="hidden rounded-xl border border-brand-sky bg-sky-50 px-3 py-2 text-xs font-semibold text-brand-sky md:block">
                Secure Login
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              {ROLE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setRole(opt.id)}
                  className={[
                    'group w-full rounded-xl border p-4 text-left transition-all',
                    role === opt.id ? 'border-brand-red bg-red-50 shadow-sm' : 'border-gray-200 hover:border-brand-sky hover:bg-sky-50'
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-extrabold text-brand-red">{opt.label}</div>
                      <div className="mt-1 text-sm text-gray-700">{opt.desc}</div>
                    </div>
                    <div
                      className={[
                        'mt-1 h-4 w-4 rounded-full border-2',
                        role === opt.id ? 'border-brand-red bg-brand-red' : 'border-gray-300 bg-white group-hover:border-brand-sky'
                      ].join(' ')}
                      aria-hidden="true"
                    ></div>
                  </div>
                </button>
              ))}
            </div>

            <button className="btn-primary mt-6 w-full py-2.5" disabled={busy} onClick={doLogin}>
              {busy ? 'Signing in…' : `Continue with Google as ${role}`}
            </button>

            {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}

            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
              <div className="font-semibold text-brand-red">Tip</div>
              <div className="mt-1">
                If the backend isn’t configured yet, you can still enter the site, but complaint submission/approval will work only after Firebase Admin + MongoDB are set correctly.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

