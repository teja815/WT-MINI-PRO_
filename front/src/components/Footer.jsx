import React from 'react'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white" role="contentinfo">
      <div className="px-6 py-8 md:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-red text-white text-sm font-bold">
                CP
              </div>
              <span className="font-bold text-gray-900">Complaint Portal</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Official platform for reporting and tracking campus issues. All complaints are verified by admin before reaching faculty.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="/" className="hover:text-brand-red transition-colors">Home</a></li>
              <li><a href="/classroom" className="hover:text-brand-red transition-colors">Classroom Issues</a></li>
              <li><a href="/mess" className="hover:text-brand-red transition-colors">Mess Complaints</a></li>
              <li><a href="/hostel" className="hover:text-brand-red transition-colors">Hostel Issues</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                support@complaintportal.edu
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +91 12345 67890
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Complaint Portal. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-brand-red"></span> Red
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-brand-yellow"></span> Yellow
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-brand-sky"></span> Sky Blue
            </span>
            <span>on White</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
