import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Card({ title, description, to }) {
  return (
    <Link to={to} className="card block p-6 transition-shadow hover:shadow-md hover:border-brand-sky">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-brand-red">{title}</h2>
          <p className="mt-1 text-sm text-gray-700">{description}</p>
        </div>
        <span className="badge-yellow">Open</span>
      </div>
      <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-sky">
        Go to dashboard <span aria-hidden="true">→</span>
      </div>
    </Link>
  )
}

export default function HomePage() {
  const { me } = useAuth()

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-yellow/30"></div>
        <div className="absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-brand-sky/25"></div>

        <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-brand-red">
              Verified Workflow
              <span className="h-1.5 w-1.5 rounded-full bg-brand-yellow"></span>
              Admin → Faculty
            </div>
            <h1 className="mt-3 text-2xl font-extrabold text-gray-900">
              Welcome{me?.name ? `, ` : ''}
              <span className="text-brand-red">{me?.name || ''}</span>
            </h1>
            <p className="mt-1 text-sm text-gray-700">
              Submit issues and track approvals. Important items are highlighted in{' '}
              <span className="font-semibold text-brand-yellow">yellow</span>.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link to="/profile" className="btn-outline">
              Profile
            </Link>
            <Link to="/classroom" className="btn-primary">
              Create Complaint
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <Card title="Classroom" description="Projector, benches, cleanliness, class infra problems." to="/classroom" />
        <Card title="Mess" description="Food quality, hygiene, menu issues, timings." to="/mess" />
        <Card title="Hostel" description="Room maintenance, water, electricity, safety." to="/hostel" />
      </div>
    </div>
  )
}

