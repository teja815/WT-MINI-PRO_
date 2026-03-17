import React from 'react'

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 sm:flex-row">
        <p className="text-sm text-gray-700">
          © {new Date().getFullYear()} Complaint Portal
        </p>
        <p className="text-sm">
          <span className="font-semibold text-brand-red">Red</span>,{' '}
          <span className="font-semibold text-brand-yellow">Yellow</span>,{' '}
          <span className="font-semibold text-brand-sky">Sky Blue</span> on{' '}
          <span className="font-semibold">White</span>.
        </p>
      </div>
    </footer>
  )
}

