import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/hooks/use-theme'
import { useIsMobile } from '@/hooks/use-mobile'
import { Sidebar } from '@/components/Sidebar'
import { TopBar } from '@/components/TopBar'
import { MobileMenu } from '@/components/MobileMenu'
import { AIChatPanel } from '@/components/AIChatPanel'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { LeadsPage } from '@/pages/LeadsPage'
import { ScraperPage } from '@/pages/ScraperPage'
import { CanvasPage } from '@/pages/CanvasPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { mockLeads } from '@/lib/mockData'
import type { Lead } from '@/types/lead'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useKV<boolean>('is-logged-in', false)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [showChat, setShowChat] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [leads, setLeads] = useKV<Lead[]>('leads-data', mockLeads)
  const isMobile = useIsMobile()

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads((currentLeads) => 
      (currentLeads || []).map((lead) => (lead.id === updatedLead.id ? updatedLead : lead))
    )
  }

  const handleDeleteLead = (id: string) => {
    setLeads((currentLeads) => (currentLeads || []).filter((lead) => lead.id !== id))
  }

  const handleLogin = () => {
    setIsLoggedIn(() => true)
  }

  const renderPage = () => {
    const safeLeads = leads || []
    
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage leads={safeLeads} />
      case 'leads':
        return <LeadsPage leads={safeLeads} onUpdateLead={handleUpdateLead} onDeleteLead={handleDeleteLead} />
      case 'scraper':
        return <ScraperPage />
      case 'canvas':
        return <CanvasPage />
      case 'pipeline':
        return <PlaceholderPage title="Sales Pipeline" description="Track deals through your sales funnel" />
      case 'outreach':
        return <PlaceholderPage title="Outreach" description="Manage email campaigns and outreach efforts" />
      case 'analytics':
        return <PlaceholderPage title="Analytics" description="Deep dive into your lead generation metrics" />
      case 'team':
        return <PlaceholderPage title="Team" description="Manage team members and permissions" />
      case 'settings':
        return <SettingsPage />
      default:
        return <DashboardPage leads={safeLeads} />
    }
  }

  if (!isLoggedIn) {
    return (
      <ThemeProvider>
        <LoginPage onLogin={handleLogin} />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden relative transition-colors duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(212,175,55,0.08),transparent_60%)] pointer-events-none dark:opacity-100 opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(192,192,192,0.06),transparent_40%)] pointer-events-none dark:opacity-80 opacity-40" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(212,175,55,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,175,55,0.025)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
        
        <div className="relative flex-1 flex overflow-hidden">
          {!isMobile && <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />}
          
          {isMobile && (
            <MobileMenu 
              isOpen={mobileMenuOpen}
              onClose={() => setMobileMenuOpen(false)}
              currentPage={currentPage}
              onNavigate={setCurrentPage}
            />
          )}
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <TopBar onMenuClick={() => setMobileMenuOpen(true)} />
            
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
              <div className="max-w-[1800px] mx-auto">
                {renderPage()}
              </div>
            </main>
          </div>

          {showChat && !isMobile && (
            <AIChatPanel 
              onClose={() => setShowChat(false)}
            />
          )}
        </div>

        <Toaster position="top-right" />
      </div>
    </ThemeProvider>
  )
}

export default App