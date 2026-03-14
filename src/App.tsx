import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Toaster, toast } from 'sonner'
import { ThemeProvider } from '@/hooks/use-theme'
import { Sidebar } from '@/components/Sidebar'
import { TopBar } from '@/components/TopBar'
import { MobileMenu } from '@/components/MobileMenu'
import { ConnectionStatus } from '@/components/ConnectionStatus'
import { HomePage } from '@/pages/HomePage'
import { LeadsPage } from '@/pages/LeadsPage'
import { ContractorsPage } from '@/pages/ContractorsPage'
import { ProspectsPage } from '@/pages/ProspectsPage'
import { PipelinePage } from '@/pages/PipelinePage'
import { LeaderboardPage } from '@/pages/LeaderboardPage'
import { DiagnosticsPage } from '@/pages/DiagnosticsPage'
import { AutomationPage } from '@/pages/AutomationPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { DocsPage } from '@/pages/DocsPage'
import { SystemLogsPage } from '@/pages/SystemLogsPage'
import { TaskQueuePage } from '@/pages/TaskQueuePage'
import { CodeEditorPage } from '@/pages/CodeEditorPage'
import { CanvasPage } from '@/pages/CanvasPage'
import { ReportsPage } from '@/pages/ReportsPage'
import { RoadmapPage } from '@/pages/RoadmapPage'
import { AutomationSchedulerPage } from '@/pages/AutomationSchedulerPage'
import { ScraperPage } from '@/pages/ScraperPage'
import { AgentPage } from '@/pages/AgentPage'
import { SystemHealthPage } from '@/pages/SystemHealthPage'
import { SandboxPage } from '@/pages/SandboxPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { useIsMobile } from '@/hooks/use-mobile'
import { useRealtimeLeads } from '@/hooks/useRealtimeLeads'
import { api } from '@/lib/api'
import { useState } from 'react'

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMobile = useIsMobile()
  const location = useLocation()
  const navigate = useNavigate()
  
  useRealtimeLeads()

  useEffect(() => {
    const checkBackendHealth = async () => {
      const isAvailable = await api.checkHealth()
      if (!isAvailable) {
        toast.info('Running in offline mode with local data', {
          duration: 4000,
        })
      }
    }
    checkBackendHealth()
  }, [])

  const getCurrentPage = () => {
    const path = location.pathname.slice(1) || 'home'
    return path
  }

  const handleNavigate = (page: string) => {
    navigate(`/${page === 'home' ? '' : page}`)
    setMobileMenuOpen(false)
  }

  return (
    <>
      <div className="min-h-screen bg-background flex">
        {!isMobile && (
          <Sidebar
            currentPage={getCurrentPage()}
            onNavigate={handleNavigate}
            collapsed={false}
          />
        )}
        
        <div className="flex-1 flex flex-col">
          <TopBar onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
          <ConnectionStatus />
          
          <main className="flex-1 overflow-auto p-6 md:p-8">
            <Routes>
              <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
              <Route path="/leads" element={<LeadsPage onNavigate={handleNavigate} />} />
              <Route path="/contractors" element={<ContractorsPage onNavigate={handleNavigate} />} />
              <Route path="/prospects" element={<ProspectsPage onNavigate={handleNavigate} />} />
              <Route path="/pipeline" element={<PipelinePage onNavigate={handleNavigate} />} />
              <Route path="/leaderboard" element={<LeaderboardPage onNavigate={handleNavigate} />} />
              <Route path="/diagnostics" element={<DiagnosticsPage onNavigate={handleNavigate} />} />
              <Route path="/automation" element={<AutomationPage onNavigate={handleNavigate} />} />
              <Route path="/settings" element={<SettingsPage onNavigate={handleNavigate} />} />
              <Route path="/docs" element={<DocsPage onNavigate={handleNavigate} />} />
              <Route path="/logs" element={<SystemLogsPage onNavigate={handleNavigate} />} />
              <Route path="/queue" element={<TaskQueuePage onNavigate={handleNavigate} />} />
              <Route path="/code" element={<CodeEditorPage onNavigate={handleNavigate} />} />
              <Route path="/canvas" element={<CanvasPage onNavigate={handleNavigate} />} />
              <Route path="/reports" element={<ReportsPage onNavigate={handleNavigate} />} />
              <Route path="/roadmap" element={<RoadmapPage onNavigate={handleNavigate} />} />
              <Route path="/scheduler" element={<AutomationSchedulerPage onNavigate={handleNavigate} />} />
              <Route path="/scraper" element={<ScraperPage onNavigate={handleNavigate} />} />
              <Route path="/agent" element={<AgentPage onNavigate={handleNavigate} />} />
              <Route path="/system-health" element={<SystemHealthPage onNavigate={handleNavigate} />} />
              <Route path="/sandbox" element={<SandboxPage onNavigate={handleNavigate} />} />
              <Route path="/dashboard" element={<DashboardPage onNavigate={handleNavigate} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>

        {isMobile && (
          <MobileMenu
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            currentPage={getCurrentPage()}
            onNavigate={handleNavigate}
          />
        )}
      </div>
      <Toaster position="top-right" />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Layout />
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
