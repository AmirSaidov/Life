import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { queryClient } from '@/lib/queryClient'
import useAuthStore from '@/store/authStore'
import Layout from '@/components/Layout/Layout'
import ToastProvider from '@/components/UI/Toast'
import Dashboard from '@/pages/Dashboard'
import Tasks from '@/pages/Tasks'
import Shopping from '@/pages/Shopping'
import Finance from '@/pages/Finance'
import Habits from '@/pages/Habits'
import Settings from '@/pages/Settings'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'

function ProtectedRoute({ children }) {
  const token = useAuthStore((s) => s.token)
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastProvider />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="shopping" element={<Shopping />} />
            <Route path="finance" element={<Finance />} />
            <Route path="habits" element={<Habits />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
