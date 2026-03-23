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
import ComplaintDashboard from './pages/ComplaintDashboard'
import AddStructuredComplaint from './pages/structured-flow/AddStructuredComplaint'
import CategoryGrievance from './pages/structured-flow/CategoryGrievance'
import ClassroomBlock from './pages/structured-flow/ClassroomBlock'
import BlockFloors from './pages/structured-flow/BlockFloors'
import FloorDetails from './pages/structured-flow/FloorDetails'
import WashroomSelection from './pages/structured-flow/WashroomSelection'
import ClassroomDesks from './pages/structured-flow/ClassroomDesks'
import FinalComplaintForm from './pages/structured-flow/FinalComplaintForm'

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

          <Route path="/add-structured-complaint" element={<ProtectedRoute allowRoles={['student', 'teacher', 'admin']}><AddStructuredComplaint /></ProtectedRoute>} />
          <Route path="/hostel-grievance" element={<ProtectedRoute allowRoles={['student', 'teacher', 'admin']}><CategoryGrievance category="Hostel" /></ProtectedRoute>} />
          <Route path="/mess-grievance" element={<ProtectedRoute allowRoles={['student', 'teacher', 'admin']}><CategoryGrievance category="Mess" /></ProtectedRoute>} />
          <Route path="/classroom-grievance" element={<ProtectedRoute allowRoles={['student', 'teacher', 'admin']}><ClassroomBlock /></ProtectedRoute>} />
          <Route path="/classroom-grievance/:block" element={<ProtectedRoute allowRoles={['student', 'teacher', 'admin']}><BlockFloors /></ProtectedRoute>} />
          
          <Route path="/ground-classes" element={<ProtectedRoute allowRoles={['student', 'teacher', 'admin']}><FloorDetails floorPrefix="g" /></ProtectedRoute>} />
          <Route path="/first-classes" element={<ProtectedRoute allowRoles={['student', 'teacher', 'admin']}><FloorDetails floorPrefix="f" /></ProtectedRoute>} />
          <Route path="/second-classes" element={<ProtectedRoute allowRoles={['student', 'teacher', 'admin']}><FloorDetails floorPrefix="s" /></ProtectedRoute>} />
          <Route path="/third-classes" element={<ProtectedRoute allowRoles={['student', 'teacher', 'admin']}><FloorDetails floorPrefix="t" /></ProtectedRoute>} />

          <Route path="/washroom-ff" element={<ProtectedRoute allowRoles={['student', 'teacher', 'admin']}><WashroomSelection /></ProtectedRoute>} />
          <Route path="/male-wash" element={<ProtectedRoute allowRoles={['student', 'teacher', 'admin']}><FinalComplaintForm hidePhotoUpload={false} /></ProtectedRoute>} />
          <Route path="/female-wash" element={<ProtectedRoute allowRoles={['student', 'teacher', 'admin']}><FinalComplaintForm hidePhotoUpload={true} /></ProtectedRoute>} />

          <Route path="/gf-classroom" element={<ProtectedRoute allowRoles={['student', 'teacher', 'admin']}><ClassroomDesks floorName="Ground Floor" /></ProtectedRoute>} />
          <Route path="/ff-classroom" element={<ProtectedRoute allowRoles={['student', 'teacher', 'admin']}><ClassroomDesks floorName="First Floor" /></ProtectedRoute>} />
          <Route path="/sf-classroom" element={<ProtectedRoute allowRoles={['student', 'teacher', 'admin']}><ClassroomDesks floorName="Second Floor" /></ProtectedRoute>} />
          <Route path="/tf-classroom" element={<ProtectedRoute allowRoles={['student', 'teacher', 'admin']}><ClassroomDesks floorName="Third Floor" /></ProtectedRoute>} />
          
          <Route
            path="/classroom"
            element={
              <ProtectedRoute allowRoles={['student', 'teacher', 'admin']}>
                <FinalComplaintForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/complaints"
            element={
              <ProtectedRoute allowRoles={['student', 'teacher', 'admin']}>
                <ComplaintDashboard />
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
