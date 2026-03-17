import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import FacultyPage from './pages/FacultyPage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <ProtectedRoute allowRoles={['student', 'teacher', 'admin']}>
                <HomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/classroom"
            element={
              <ProtectedRoute allowRoles={['student', 'teacher', 'admin']}>
                <CategoryPage category="classroom" title="Classroom Issues" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mess"
            element={
              <ProtectedRoute allowRoles={['student', 'teacher', 'admin']}>
                <CategoryPage category="mess" title="Mess Complaints" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hostel"
            element={
              <ProtectedRoute allowRoles={['student', 'teacher', 'admin']}>
                <CategoryPage category="hostel" title="Hostel Issues" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute allowRoles={['student', 'teacher', 'admin']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowRoles={['admin']}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/faculty"
            element={
              <ProtectedRoute allowRoles={['teacher', 'admin']}>
                <FacultyPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

