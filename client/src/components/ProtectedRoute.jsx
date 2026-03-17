import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, allowRoles }) {
  const { firebaseUser, me, loading } = useAuth()

  if (loading) return <div className="text-sm text-gray-700">Loading…</div>
  if (!firebaseUser) return <Navigate to="/login" replace />
  if (!me) return <Navigate to="/login" replace />
  if (Array.isArray(allowRoles) && allowRoles.length > 0 && !allowRoles.includes(me.role)) {
    return <Navigate to="/" replace />
  }
  return children
}

