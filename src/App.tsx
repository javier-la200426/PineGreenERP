import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useThemeStore } from './store/themeStore'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute, { RoleBasedRedirect } from './components/ProtectedRoute'

// Manager Routes
import ManagerDashboard from './pages/manager/Dashboard'
import ManagerJobs from './pages/manager/Jobs'
import ManagerWorkers from './pages/manager/Workers'
import ManagerClients from './pages/manager/Clients'
import ManagerReports from './pages/manager/Reports'

// Client Routes
import ClientAppointment from './pages/client/Appointment'
import ClientPayment from './pages/client/Payment'
import ClientReceipt from './pages/client/Receipt'

// Worker Routes
import WorkerJobList from './pages/worker/JobList'
import WorkerRouteView from './pages/worker/RouteView'
import WorkerJobCompletion from './pages/worker/JobCompletion'

// Shared Routes
import Settings from './pages/Settings'
import Login from './pages/Login'

function App() {
  const { isDarkMode } = useThemeStore()

  // Apply dark mode class to html element
  if (isDarkMode) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Default redirect based on role */}
          <Route path="/" element={<RoleBasedRedirect />} />

          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Manager Routes */}
          <Route path="/manager/dashboard" element={
            <ProtectedRoute allowedRoles={['manager']}><ManagerDashboard /></ProtectedRoute>
          } />
          <Route path="/manager/jobs" element={
            <ProtectedRoute allowedRoles={['manager']}><ManagerJobs /></ProtectedRoute>
          } />
          <Route path="/manager/workers" element={
            <ProtectedRoute allowedRoles={['manager']}><ManagerWorkers /></ProtectedRoute>
          } />
          <Route path="/manager/clients" element={
            <ProtectedRoute allowedRoles={['manager']}><ManagerClients /></ProtectedRoute>
          } />
          <Route path="/manager/reports" element={
            <ProtectedRoute allowedRoles={['manager']}><ManagerReports /></ProtectedRoute>
          } />

          {/* Client Routes */}
          <Route path="/client/appointment" element={
            <ProtectedRoute allowedRoles={['client']}><ClientAppointment /></ProtectedRoute>
          } />
          <Route path="/client/payment" element={
            <ProtectedRoute allowedRoles={['client']}><ClientPayment /></ProtectedRoute>
          } />
          <Route path="/client/receipt" element={
            <ProtectedRoute allowedRoles={['client']}><ClientReceipt /></ProtectedRoute>
          } />

          {/* Worker Routes */}
          <Route path="/worker/jobs" element={
            <ProtectedRoute allowedRoles={['worker']}><WorkerJobList /></ProtectedRoute>
          } />
          <Route path="/worker/route" element={
            <ProtectedRoute allowedRoles={['worker']}><WorkerRouteView /></ProtectedRoute>
          } />
          <Route path="/worker/job/:id/complete" element={
            <ProtectedRoute allowedRoles={['worker']}><WorkerJobCompletion /></ProtectedRoute>
          } />

          {/* Settings (shared across all roles) */}
          <Route path="/settings" element={
            <ProtectedRoute allowedRoles={['manager', 'worker', 'client']}><Settings /></ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
