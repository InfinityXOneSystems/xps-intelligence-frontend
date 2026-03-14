import { useState, useEffect } from 'react'
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
import { useIsMobile } from '@/hooks/use-mobile'
import { useRealtimeLeads } from '@/hooks/useRealtimeLeads'
import { api } from '@/lib/api'

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMobile = useIsMobile()
  
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

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
    setMobileMenuOpen(false)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />
      case 'leads':
        return <LeadsPage onNavigate={handleNavigate} />
      case 'contractors':
        return <ContractorsPage onNavigate={handleNavigate} />
      case 'prospects':
        return <ProspectsPage onNavigate={handleNavigate} />
      case 'pipeline':
        return <PipelinePage onNavigate={handleNavigate} />
      case 'leaderboard':
        return <LeaderboardPage onNavigate={handleNavigate} />
      case 'diagnostics':
        return <DiagnosticsPage onNavigate={handleNavigate} />
      case 'automation':
        return <AutomationPage onNavigate={handleNavigate} />
      case 'settings':
        return <SettingsPage onNavigate={handleNavigate} />
      case 'docs':
        return <DocsPage onNavigate={handleNavigate} />
      case 'logs':
        return <SystemLogsPage onNavigate={handleNavigate} />
      case 'queue':
        return <TaskQueuePage onNavigate={handleNavigate} />
      case 'code':
        return <CodeEditorPage onNavigate={handleNavigate} />
      case 'canvas':
        return <CanvasPage onNavigate={handleNavigate} />
      case 'reports':
        return <ReportsPage onNavigate={handleNavigate} />
      case 'roadmap':
        return <RoadmapPage onNavigate={handleNavigate} />
      case 'scheduler':
        return <AutomationSchedulerPage onNavigate={handleNavigate} />
      case 'scraper':
        return <ScraperPage onNavigate={handleNavigate} />
      case 'agent':
        return <AgentPage onNavigate={handleNavigate} />
      case 'system-health':
        return <SystemHealthPage onNavigate={handleNavigate} />
      default:
        return <HomePage onNavigate={handleNavigate} />
    }
  }

  return (
    <>
      <div className="min-h-screen bg-background flex">
        {!isMobile && (
          <Sidebar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            collapsed={sidebarCollapsed}
          />
        )}
        
        <div className="flex-1 flex flex-col">
          <TopBar onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
          <ConnectionStatus />
          
          <main className="flex-1 overflow-auto p-6 md:p-8">
            {renderPage()}
          </main>
        </div>

        {isMobile && (
          <MobileMenu
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            currentPage={currentPage}
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
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
