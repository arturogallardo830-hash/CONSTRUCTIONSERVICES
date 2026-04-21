import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { WorkersProvider } from './context/WorkersContext'
import { AppProvider } from './context/AppContext'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Messages from './pages/Messages'
import Workers from './pages/Workers'
import Machinery from './pages/Machinery'
import Attendance from './pages/Attendance'
import DailyReport from './pages/DailyReport'
import Sidebar from './components/Sidebar'

function AppShell() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/workers" element={<Workers />} />
          <Route path="/machinery" element={<Machinery />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/report" element={<DailyReport />} />
        </Routes>
      </div>
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/*" element={<AppShell />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  useEffect(() => {
    const saved = localStorage.getItem('hnd_theme') || 'light'
    document.documentElement.setAttribute('data-theme', saved)
  }, [])

  return (
    <BrowserRouter>
      <AuthProvider>
        <WorkersProvider>
          <AppProvider>
            <AppRoutes />
          </AppProvider>
        </WorkersProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
