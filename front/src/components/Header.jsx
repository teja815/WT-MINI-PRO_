import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AccessibilityToolsDialog from './accessibility/AccessibilityToolsDialog'

const navLinkClass = ({ isActive }) =>
  [
    'rounded-md px-3 py-2 text-sm font-semibold transition-colors',
    isActive ? 'bg-brand-yellow text-black' : 'text-white hover:bg-red-700'
  ].join(' ')

export default function Header() {
  const { me, firebaseUser, logout } = useAuth()
  const [a11yOpen, setA11yOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 border-b border-red-800 bg-brand-red">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-lg font-extrabold tracking-wide text-white">
            Complaint Portal
          </Link>
          <span className="badge-yellow hidden sm:inline">India.gov.in style</span>
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/classroom" className={navLinkClass}>
            Classroom
          </NavLink>
          <NavLink to="/mess" className={navLinkClass}>
            Mess
          </NavLink>
          <NavLink to="/hostel" className={navLinkClass}>
            Hostel
          </NavLink>
          <NavLink to="/profile" className={navLinkClass}>
            Profile
          </NavLink>
          {me?.role === 'admin' && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          )}
          {(me?.role === 'teacher' || me?.role === 'admin') && (
            <NavLink to="/faculty" className={navLinkClass}>
              Faculty
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            className="btn-outline bg-white/0 text-white border-white/30 hover:bg-white hover:text-brand-red"
            onClick={() => setA11yOpen(true)}
          >
            Accessibility
          </button>
          {!firebaseUser ? (
            <Link className="btn-primary" to="/login">
              Login
            </Link>
          ) : (
            <button
              className="btn-primary"
              onClick={async () => {
                await logout()
                navigate('/login')
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {a11yOpen && <AccessibilityToolsDialog onClose={() => setA11yOpen(false)} />}
    </header>
  )
}

