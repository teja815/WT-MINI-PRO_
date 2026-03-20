import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import Footer from './Footer'
import AccessibilityBar from './accessibility/AccessibilityBar'

export default function Layout() {
  return (
    <div className="min-h-dvh bg-gray-50">
      {/* Accessibility bar at very top */}
      <AccessibilityBar />

      <div className="flex min-h-[calc(100dvh-28px)]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex flex-1 flex-col min-w-0">
          <Header />
          <main id="main-content" className="flex-1 px-4 py-6 md:px-8" tabIndex="-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  )
}
