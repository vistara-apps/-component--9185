import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Polls from './pages/Polls'
import CreatePoll from './pages/CreatePoll'
import Analytics from './pages/Analytics'
import { PollProvider } from './context/PollContext'
import { ToastProvider } from './components/Toast'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ToastProvider>
      <PollProvider>
        <div className="min-h-screen bg-slate-950 flex">
          {/* Background gradient */}
          <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-slate-950 pointer-events-none" />
          
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          
          <main className="flex-1 lg:ml-64 relative">
            <div className="p-4 sm:p-6 lg:p-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/polls" element={<Polls />} />
                <Route path="/create-poll" element={<CreatePoll />} />
                <Route path="/analytics" element={<Analytics />} />
              </Routes>
            </div>
          </main>
        </div>
      </PollProvider>
    </ToastProvider>
  )
}

export default App
