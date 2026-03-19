import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-surface font-body">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 md:ml-16">
        <Header />
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
