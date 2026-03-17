import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { apiGet, apiPost } from '../lib/api'

const AuthContext = createContext(null)
const LOCAL_ROLE_KEY = 'cp_role'

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [me, setMe] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user || null)
      setMe(null)
      if (!user) {
        try {
          localStorage.removeItem(LOCAL_ROLE_KEY)
        } catch {
          // ignore
        }
        setLoading(false)
        return
      }
      try {
        const data = await apiGet('/api/me')
        setMe(data.user)
      } catch {
        // Backend might be down / not configured yet.
        // Keep app usable by falling back to locally stored role.
        let role = ''
        try {
          role = localStorage.getItem(LOCAL_ROLE_KEY) || ''
        } catch {
          role = ''
        }
        if (role && ['student', 'teacher', 'admin'].includes(role)) {
          setMe({
            role,
            name: user.displayName || '',
            email: user.email || '',
            photoURL: user.photoURL || ''
          })
        }
      } finally {
        setLoading(false)
      }
    })
    return () => unsub()
  }, [])

  async function registerRole(role) {
    try {
      const data = await apiPost('/api/register', { role })
      setMe(data.user)
      try {
        localStorage.setItem(LOCAL_ROLE_KEY, data.user?.role || role)
      } catch {
        // ignore
      }
      return data.user
    } catch {
      // allow navigation even if backend isn't ready yet
      const user = auth.currentUser
      try {
        localStorage.setItem(LOCAL_ROLE_KEY, role)
      } catch {
        // ignore
      }
      const fallback = {
        role,
        name: user?.displayName || '',
        email: user?.email || '',
        photoURL: user?.photoURL || ''
      }
      setMe(fallback)
      return fallback
    }
  }

  async function logout() {
    await signOut(auth)
    setFirebaseUser(null)
    setMe(null)
    try {
      localStorage.removeItem(LOCAL_ROLE_KEY)
    } catch {
      // ignore
    }
  }

  const value = useMemo(
    () => ({
      firebaseUser,
      me,
      loading,
      registerRole,
      logout
    }),
    [firebaseUser, me, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

