import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster } from '@/components/ui/sonner'
import { Sidebar } from '@/components/Sidebar'
import { AIChatPanel } from '@/components/AIChatPanel'
import { CommandBar } from '@/components/CommandBar'
import { DashboardPage } from '@/pages/DashboardPage'
import { LeadsPage } from '@/pages/LeadsPage'
import { ScraperPage } from '@/pages/ScraperPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { mockLeads } from '@/lib/mockData'
import type { Lead } from '@/types/lead'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [showChat, setShowChat] = useState(true)
  const [leads, setLeads] = useKV<Lead[]>('leads-data', mockLeads)

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads((currentLeads) => 
      (currentLeads || []).map((lead) => (lead.id === updatedLead.id ? updatedLead : lead))
    )
  }

  const handleDeleteLead = (id: string) => {
    setLeads((currentLeads) => (currentLeads || []).filter((lead) => lead.id !== id))
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
      case 'pipeline':
        return <PlaceholderPage title="Sales Pipeline" description="Track deals through your sales funnel" />
      case 'outreach':
        return <PlaceholderPage title="Outreach" description="Manage email campaigns and outreach efforts" />
      case 'analytics':
        return <PlaceholderPage title="Analytics" description="Deep dive into your lead generation metrics" />
      case 'team':
        return <PlaceholderPage title="Team" description="Manage team members and permissions" />
      case 'settings':
        return <PlaceholderPage title="Settings" description="Configure your dashboard preferences" />
      default:
        return <DashboardPage leads={safeLeads} />
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {renderPage()}
        </main>

        {showChat && <AIChatPanel onClose={() => setShowChat(false)} />}
      </div>

      <CommandBar onCommand={(cmd) => console.log('Command:', cmd)} />
      <Toaster position="top-right" />
    </div>
  )
}

export default App