import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useThemeStore } from './store/themeStore'

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
      <Routes>
        {/* Default redirect to manager dashboard */}
        <Route path="/" element={<Navigate to="/manager/dashboard" replace />} />
        
        {/* Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Manager Routes */}
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/manager/jobs" element={<ManagerJobs />} />
        <Route path="/manager/workers" element={<ManagerWorkers />} />
        <Route path="/manager/clients" element={<ManagerClients />} />
        <Route path="/manager/reports" element={<ManagerReports />} />
        
        {/* Client Routes */}
        <Route path="/client/appointment" element={<ClientAppointment />} />
        <Route path="/client/payment" element={<ClientPayment />} />
        <Route path="/client/receipt" element={<ClientReceipt />} />
        
        {/* Worker Routes */}
        <Route path="/worker/jobs" element={<WorkerJobList />} />
        <Route path="/worker/route" element={<WorkerRouteView />} />
        <Route path="/worker/job/:id/complete" element={<WorkerJobCompletion />} />
        
        {/* Settings (shared across all roles) */}
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  )
}

export default App

