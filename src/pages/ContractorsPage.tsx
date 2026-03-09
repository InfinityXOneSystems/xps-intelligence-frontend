import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Buildings,
  Envelope,
  Phone,
  Star,
  Plus,
  MagnifyingGlass,
  Funnel,
  List,
  SquaresFour,
  Table,
  MapPin,
  Calendar,
  FileText,
  Gear,
  Robot,
  ArrowRight,
  Check,
  X,
  Upload,
  Download,
  Eye,
  Clock,
  ChartBar,
  Users,
  CheckCircle,
  Warning,
  Invoice,
  Brain,
  Kanban,
  Sparkle,
  Trash,
  PaperPlaneTilt,
  CurrencyDollar,
  Camera,
  Briefcase,
  RowsPlusBottom,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { BackButton } from '@/components/BackButton'
import { cn } from '@/lib/utils'

// ─── Type Definitions ────────────────────────────────────────────────────────

type ContractorStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'
type ViewMode = 'list' | 'card' | 'table' | 'kanban'
type EmailStatus = 'pending' | 'scheduled' | 'sent' | 'opened' | 'clicked'
type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue'
type TaskPriority = 'low' | 'medium' | 'high'
type TaskStatus = 'todo' | 'in_progress' | 'done'

interface Contractor {
  id: string
  name: string
  company: string
  title: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  services: string[]
  leadScore: number
  status: ContractorStatus
  source: string
  lastContact: string
  notes: string
  favorite: boolean
  revenue: number
  employees: number
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  type: 'cold' | 'followup1' | 'followup2' | 'proposal'
}

interface EmailQueueItem {
  id: string
  recipient: string
  company: string
  subject: string
  status: EmailStatus
  scheduledAt: string
  openRate: number
  clickRate: number
  templateId: string
}

interface TakeoffItem {
  id: string
  description: string
  quantity: number
  unit: string
  unitPrice: number
}


interface ProjectTask {
  id: string
  name: string
  assignee: string
  dueDate: string
  status: TaskStatus
  priority: TaskPriority
  startOffset: number
  duration: number
}

interface Project {
  id: string
  name: string
  contractorId: string
  status: 'planning' | 'active' | 'on_hold' | 'completed'
  budget: number
  spent: number
  progress: number
  startDate: string
  endDate: string
  tasks: ProjectTask[]
}

interface InvoiceLineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

interface Invoice {
  id: string
  number: string
  contractorId: string
  status: InvoiceStatus
  lineItems: InvoiceLineItem[]
  depositPercent: number
  issuedDate: string
  dueDate: string
  paidDate: string | null
  total: number
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_CONTRACTORS: Contractor[] = [
  {
    id: 'c1', name: 'Marcus Rivera', company: 'Rivera Concrete Solutions', title: 'Owner',
    email: 'marcus@riveraconcrete.com', phone: '(407) 555-0182', address: '1240 Industrial Blvd',
    city: 'Orlando', state: 'FL', services: ['Concrete', 'Epoxy', 'Polishing'],
    leadScore: 92, status: 'qualified', source: 'Google Maps', lastContact: '2024-01-15',
    notes: 'Very interested in epoxy flooring systems. Has a large warehouse project.', favorite: true,
    revenue: 2400000, employees: 18,
  },
  {
    id: 'c2', name: 'Sandra Lee', company: 'Lee Flooring & Surfaces', title: 'CEO',
    email: 'sandra@leeflooring.com', phone: '(305) 555-0247', address: '890 Commerce Dr',
    city: 'Miami', state: 'FL', services: ['Epoxy', 'Terrazzo', 'VCT'],
    leadScore: 78, status: 'contacted', source: 'Yelp', lastContact: '2024-01-12',
    notes: 'Responded to cold email. Wants pricing for residential projects.', favorite: false,
    revenue: 850000, employees: 7,
  },
  {
    id: 'c3', name: 'Derek Thompson', company: 'Thompson Construction Group', title: 'VP Operations',
    email: 'derek@thompsongroup.com', phone: '(813) 555-0361', address: '555 Bay Shore Pkwy',
    city: 'Tampa', state: 'FL', services: ['General Contracting', 'Concrete', 'Masonry'],
    leadScore: 85, status: 'proposal', source: 'Directory', lastContact: '2024-01-18',
    notes: 'Proposal sent for 3 commercial projects. Awaiting response.', favorite: true,
    revenue: 5200000, employees: 42,
  },
  {
    id: 'c4', name: 'Angela Morales', company: 'Morales Tile & Stone', title: 'Owner',
    email: 'angela@moralestile.com', phone: '(561) 555-0493', address: '2100 Palm Beach Blvd',
    city: 'West Palm Beach', state: 'FL', services: ['Tile', 'Stone', 'Marble'],
    leadScore: 61, status: 'new', source: 'Google Maps', lastContact: '2024-01-10',
    notes: 'New lead from scraper. Specializes in high-end residential.', favorite: false,
    revenue: 680000, employees: 5,
  },
  {
    id: 'c5', name: 'Jason Park', company: 'ParkBuild Commercial', title: 'President',
    email: 'jason@parkbuild.com', phone: '(904) 555-0528', address: '3300 Northside Dr',
    city: 'Jacksonville', state: 'FL', services: ['Commercial', 'Industrial', 'Concrete'],
    leadScore: 95, status: 'won', source: 'Referral', lastContact: '2024-01-20',
    notes: 'Signed $180k contract. Excellent customer. Request referrals.', favorite: true,
    revenue: 9100000, employees: 85,
  },
  {
    id: 'c6', name: 'Tina Brooks', company: 'Brooks Residential Floors', title: 'Owner',
    email: 'tina@brooksfloors.com', phone: '(352) 555-0614', address: '400 Oak St',
    city: 'Gainesville', state: 'FL', services: ['Hardwood', 'LVP', 'Carpet'],
    leadScore: 44, status: 'lost', source: 'Yelp', lastContact: '2023-12-28',
    notes: 'Went with a competitor. Price was the main objection.', favorite: false,
    revenue: 320000, employees: 3,
  },
  {
    id: 'c7', name: 'Carlos Mendez', company: 'Mendez Industrial Coatings', title: 'Operations Director',
    email: 'carlos@mendezcoatings.com', phone: '(850) 555-0739', address: '1800 Airport Rd',
    city: 'Tallahassee', state: 'FL', services: ['Industrial Coatings', 'Epoxy', 'Safety Markings'],
    leadScore: 73, status: 'contacted', source: 'LinkedIn', lastContact: '2024-01-14',
    notes: 'Large airport hangar coating project in Q2.', favorite: false,
    revenue: 1750000, employees: 14,
  },
  {
    id: 'c8', name: 'Rachel Kim', company: 'Kim Luxury Surfaces', title: 'Creative Director',
    email: 'rachel@kimluxury.com', phone: '(239) 555-0855', address: '700 Vanderbilt Beach Rd',
    city: 'Naples', state: 'FL', services: ['Decorative Concrete', 'Microtopping', 'Terrazzo'],
    leadScore: 88, status: 'qualified', source: 'Trade Show', lastContact: '2024-01-17',
    notes: 'Highly interested. Works on luxury hotels and residences.', favorite: true,
    revenue: 2900000, employees: 22,
  },
  {
    id: 'c9', name: 'Brian Foster', company: 'Foster Epoxy Systems', title: 'Owner',
    email: 'brian@fosterepoxy.com', phone: '(386) 555-0971', address: '250 Ridgewood Ave',
    city: 'Daytona Beach', state: 'FL', services: ['Epoxy', 'Polyurea', 'Urethane'],
    leadScore: 67, status: 'contacted', source: 'Google Maps', lastContact: '2024-01-11',
    notes: 'Interested in bulk material pricing. Fleet of 3 crews.', favorite: false,
    revenue: 1100000, employees: 9,
  },
  {
    id: 'c10', name: 'Patricia Nguyen', company: 'Nguyen & Associates GC', title: 'Principal',
    email: 'patricia@nguyenassoc.com', phone: '(407) 555-1042', address: '5050 Curry Ford Rd',
    city: 'Orlando', state: 'FL', services: ['General Contracting', 'Project Management', 'Concrete'],
    leadScore: 81, status: 'proposal', source: 'Referral', lastContact: '2024-01-19',
    notes: 'Multiple retail buildout projects lined up for H1 2024.', favorite: false,
    revenue: 4400000, employees: 31,
  },
]

const MOCK_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 't1', name: 'Cold Outreach', type: 'cold',
    subject: 'Premium Flooring Systems for {{company}}',
    body: `Hi {{name}},\n\nI noticed {{company}} does exceptional work in the flooring space and wanted to reach out about our premium epoxy and decorative concrete systems.\n\nWe supply top contractors in Florida with:\n• Commercial-grade epoxy systems\n• Fast-cure polyurea coatings\n• Decorative overlays & microtoppings\n\nWould you have 15 minutes this week to discuss how we can support your projects?\n\nBest,\nXPS Intelligence Team`,
  },
  {
    id: 't2', name: 'First Follow-Up', type: 'followup1',
    subject: 'Following up – XPS Flooring Systems',
    body: `Hi {{name}},\n\nJust wanted to follow up on my previous email. We're currently running a contractor pricing special through the end of the month.\n\nI'd love to send over our product catalog and current pricing sheet.\n\nReply with "YES" and I'll send it right over.\n\nBest,\nXPS Intelligence Team`,
  },
  {
    id: 't3', name: 'Second Follow-Up', type: 'followup2',
    subject: 'Last check-in from XPS',
    body: `Hi {{name}},\n\nI don't want to keep filling your inbox, so this will be my last reach out for now.\n\nIf your flooring material needs ever change, feel free to reach out. We're always here to support great contractors like yourself.\n\nWishing you and {{company}} continued success!\n\nBest,\nXPS Intelligence Team`,
  },
  {
    id: 't4', name: 'Proposal Follow-Up', type: 'proposal',
    subject: 'Checking in on your proposal – any questions?',
    body: `Hi {{name}},\n\nI wanted to check in on the proposal I sent over for your upcoming project. Do you have any questions about pricing, materials, or timelines?\n\nI'm available for a quick call at your convenience.\n\nBest,\nXPS Intelligence Team`,
  },
]

const MOCK_EMAIL_QUEUE: EmailQueueItem[] = [
  { id: 'e1', recipient: 'Marcus Rivera', company: 'Rivera Concrete', subject: 'Premium Flooring Systems for Rivera Concrete', status: 'opened', scheduledAt: '2024-01-20 09:00', openRate: 100, clickRate: 40, templateId: 't1' },
  { id: 'e2', recipient: 'Sandra Lee', company: 'Lee Flooring', subject: 'Following up – XPS Flooring Systems', status: 'sent', scheduledAt: '2024-01-19 10:30', openRate: 0, clickRate: 0, templateId: 't2' },
  { id: 'e3', recipient: 'Angela Morales', company: 'Morales Tile', subject: 'Premium Flooring Systems for Morales Tile', status: 'pending', scheduledAt: '2024-01-21 08:00', openRate: 0, clickRate: 0, templateId: 't1' },
  { id: 'e4', recipient: 'Carlos Mendez', company: 'Mendez Coatings', subject: 'Following up – XPS Flooring Systems', status: 'scheduled', scheduledAt: '2024-01-22 09:00', openRate: 0, clickRate: 0, templateId: 't2' },
  { id: 'e5', recipient: 'Brian Foster', company: 'Foster Epoxy', subject: 'Premium Flooring Systems for Foster Epoxy', status: 'clicked', scheduledAt: '2024-01-18 11:00', openRate: 100, clickRate: 100, templateId: 't1' },
]

const MOCK_PROJECT: Project = {
  id: 'p1', name: 'ParkBuild Warehouse Epoxy', contractorId: 'c5',
  status: 'active', budget: 180000, spent: 62400, progress: 35,
  startDate: '2024-01-15', endDate: '2024-03-28',
  tasks: [
    { id: 'pt1', name: 'Site Preparation', assignee: 'Jason Park', dueDate: '2024-01-22', status: 'done', priority: 'high', startOffset: 0, duration: 7 },
    { id: 'pt2', name: 'Surface Grinding', assignee: 'Field Crew 1', dueDate: '2024-01-29', status: 'done', priority: 'high', startOffset: 7, duration: 7 },
    { id: 'pt3', name: 'Primer Application', assignee: 'Field Crew 1', dueDate: '2024-02-05', status: 'in_progress', priority: 'high', startOffset: 14, duration: 7 },
    { id: 'pt4', name: 'Base Coat Epoxy', assignee: 'Field Crew 2', dueDate: '2024-02-19', status: 'todo', priority: 'medium', startOffset: 21, duration: 14 },
    { id: 'pt5', name: 'Decorative Broadcast', assignee: 'Field Crew 2', dueDate: '2024-02-26', status: 'todo', priority: 'medium', startOffset: 35, duration: 7 },
    { id: 'pt6', name: 'Top Coat & Seal', assignee: 'Field Crew 1', dueDate: '2024-03-11', status: 'todo', priority: 'high', startOffset: 42, duration: 14 },
    { id: 'pt7', name: 'Quality Inspection', assignee: 'Patricia Nguyen', dueDate: '2024-03-18', status: 'todo', priority: 'medium', startOffset: 56, duration: 7 },
    { id: 'pt8', name: 'Final Walkthrough', assignee: 'Jason Park', dueDate: '2024-03-25', status: 'todo', priority: 'low', startOffset: 63, duration: 7 },
  ],
}

const MOCK_INVOICE: Invoice = {
  id: 'inv1', number: 'INV-2024-001', contractorId: 'c5',
  status: 'sent', depositPercent: 25, issuedDate: '2024-01-20',
  dueDate: '2024-02-20', paidDate: null, total: 180000,
  lineItems: [
    { id: 'li1', description: 'Epoxy Floor System – 12,000 sq ft', quantity: 12000, unitPrice: 10 },
    { id: 'li2', description: 'Surface Preparation & Grinding', quantity: 1, unitPrice: 24000 },
    { id: 'li3', description: 'Decorative Quartz Broadcast', quantity: 1, unitPrice: 18000 },
    { id: 'li4', description: 'Polyurea Top Coat', quantity: 12000, unitPrice: 2 },
    { id: 'li5', description: 'Project Management & Supervision', quantity: 1, unitPrice: 14000 },
  ],
}

// ─── Helper Components ────────────────────────────────────────────────────────

function LeadScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? 'text-green-400 bg-green-400/10 border-green-400/30' :
    score >= 60 ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' :
    score >= 40 ? 'text-orange-400 bg-orange-400/10 border-orange-400/30' :
                  'text-red-400 bg-red-400/10 border-red-400/30'
  return (
    <span className={cn('text-xs font-bold px-2 py-0.5 rounded border', color)}>
      {score}
    </span>
  )
}

function StatusBadge({ status }: { status: ContractorStatus }) {
  const map: Record<ContractorStatus, { label: string; className: string }> = {
    new:       { label: 'New Lead',      className: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
    contacted: { label: 'Contacted',     className: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
    qualified: { label: 'Qualified',     className: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
    proposal:  { label: 'Proposal Sent', className: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
    won:       { label: 'Won',           className: 'bg-green-500/15 text-green-400 border-green-500/30' },
    lost:      { label: 'Lost',          className: 'bg-red-500/15 text-red-400 border-red-500/30' },
  }
  const { label, className } = map[status]
  return <Badge variant="outline" className={cn('text-xs', className)}>{label}</Badge>
}

function EmailStatusBadge({ status }: { status: EmailStatus }) {
  const map: Record<EmailStatus, { label: string; className: string }> = {
    pending:   { label: 'Pending',   className: 'bg-muted text-muted-foreground' },
    scheduled: { label: 'Scheduled', className: 'bg-blue-500/15 text-blue-400' },
    sent:      { label: 'Sent',      className: 'bg-purple-500/15 text-purple-400' },
    opened:    { label: 'Opened',    className: 'bg-yellow-500/15 text-yellow-400' },
    clicked:   { label: 'Clicked',   className: 'bg-green-500/15 text-green-400' },
  }
  const { label, className } = map[status]
  return <Badge variant="outline" className={cn('text-xs', className)}>{label}</Badge>
}

function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const map: Record<InvoiceStatus, { label: string; className: string }> = {
    draft:   { label: 'Draft',   className: 'bg-muted text-muted-foreground' },
    sent:    { label: 'Sent',    className: 'bg-blue-500/15 text-blue-400' },
    viewed:  { label: 'Viewed',  className: 'bg-yellow-500/15 text-yellow-400' },
    paid:    { label: 'Paid',    className: 'bg-green-500/15 text-green-400' },
    overdue: { label: 'Overdue', className: 'bg-red-500/15 text-red-400' },
  }
  const { label, className } = map[status]
  return <Badge variant="outline" className={cn('text-xs', className)}>{label}</Badge>
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ContractorsPageProps {
  onNavigate: (page: string) => void
}

export function ContractorsPage({ onNavigate }: ContractorsPageProps) {
  const [activeTab, setActiveTab] = useState('database')

  return (
    <div className="space-y-6">
      <BackButton onBack={() => onNavigate('home')} />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <Buildings size={32} weight="duotone" className="text-primary" />
          <h1 className="text-4xl font-bold">Contractors</h1>
        </div>
        <p className="text-muted-foreground text-base">
          Full lifecycle contractor management — leads, outreach, takeoffs, proposals, projects &amp; billing
        </p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex h-auto flex-wrap gap-1 bg-muted/40 p-1 rounded-xl mb-6">
          {[
            { value: 'database',  label: 'Database',    icon: <Users size={14} /> },
            { value: 'leads',     label: 'Lead Gen',    icon: <Robot size={14} /> },
            { value: 'email',     label: 'Email',       icon: <Envelope size={14} /> },
            { value: 'takeoff',   label: 'Takeoff',     icon: <Camera size={14} /> },
            { value: 'proposal',  label: 'Proposals',   icon: <FileText size={14} /> },
            { value: 'projects',  label: 'Projects',    icon: <Briefcase size={14} /> },
            { value: 'billing',   label: 'Billing',     icon: <Invoice size={14} /> },
          ].map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              {tab.icon}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="database" forceMount className={activeTab !== 'database' ? 'hidden' : ''}>
              <DatabaseTab />
            </TabsContent>
            <TabsContent value="leads" forceMount className={activeTab !== 'leads' ? 'hidden' : ''}>
              <LeadGenTab />
            </TabsContent>
            <TabsContent value="email" forceMount className={activeTab !== 'email' ? 'hidden' : ''}>
              <EmailTab />
            </TabsContent>
            <TabsContent value="takeoff" forceMount className={activeTab !== 'takeoff' ? 'hidden' : ''}>
              <TakeoffTab />
            </TabsContent>
            <TabsContent value="proposal" forceMount className={activeTab !== 'proposal' ? 'hidden' : ''}>
              <ProposalTab />
            </TabsContent>
            <TabsContent value="projects" forceMount className={activeTab !== 'projects' ? 'hidden' : ''}>
              <ProjectsTab />
            </TabsContent>
            <TabsContent value="billing" forceMount className={activeTab !== 'billing' ? 'hidden' : ''}>
              <BillingTab />
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  )
}

// ─── Tab 1: Contractors Database ─────────────────────────────────────────────

function DatabaseTab() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ContractorStatus | 'all' | 'favorites'>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null)
  const [minScore, setMinScore] = useState(0)

  const filtered = MOCK_CONTRACTORS.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' ? true :
      statusFilter === 'favorites' ? c.favorite : c.status === statusFilter
    const matchScore = c.leadScore >= minScore
    return matchSearch && matchStatus && matchScore
  })

  const sidebarFilters: { key: ContractorStatus | 'all' | 'favorites'; label: string; count: number }[] = [
    { key: 'all',       label: 'All Contractors', count: MOCK_CONTRACTORS.length },
    { key: 'favorites', label: 'Favorites',        count: MOCK_CONTRACTORS.filter(c => c.favorite).length },
    { key: 'new',       label: 'New Leads',        count: MOCK_CONTRACTORS.filter(c => c.status === 'new').length },
    { key: 'contacted', label: 'Contacted',        count: MOCK_CONTRACTORS.filter(c => c.status === 'contacted').length },
    { key: 'qualified', label: 'Qualified',        count: MOCK_CONTRACTORS.filter(c => c.status === 'qualified').length },
    { key: 'proposal',  label: 'Proposal Sent',    count: MOCK_CONTRACTORS.filter(c => c.status === 'proposal').length },
    { key: 'won',       label: 'Won',              count: MOCK_CONTRACTORS.filter(c => c.status === 'won').length },
    { key: 'lost',      label: 'Lost',             count: MOCK_CONTRACTORS.filter(c => c.status === 'lost').length },
  ]

  return (
    <div className="flex gap-4">
      {/* Sidebar */}
      <div className="w-52 shrink-0 space-y-1">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
          Filter by Status
        </div>
        {sidebarFilters.map(f => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
              statusFilter === f.key
                ? 'bg-primary/15 text-primary font-semibold'
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            )}
          >
            <span>{f.label}</span>
            <span className={cn('text-xs rounded-full px-1.5 py-0.5',
              statusFilter === f.key ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
            )}>{f.count}</span>
          </button>
        ))}

        <Separator className="my-4" />
        <div className="px-2 space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Min Lead Score: {minScore}</Label>
            <Slider
              value={[minScore]}
              onValueChange={([v]) => setMinScore(v)}
              min={0} max={100} step={5}
              className="mt-2"
            />
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 min-w-0">
        {/* Toolbar */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search contractors..."
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="sm"><Funnel size={14} className="mr-1.5" />Filters</Button>
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            {([['list', <List key="l" size={14} />], ['card', <SquaresFour key="c" size={14} />], ['table', <Table key="t" size={14} />], ['kanban', <Kanban key="k" size={14} />]] as [ViewMode, React.ReactNode][]).map(([mode, icon]) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn('px-2.5 py-1.5 transition-colors', viewMode === mode ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}
              >{icon}</button>
            ))}
          </div>
          <Button size="sm"><Plus size={14} className="mr-1.5" />Add</Button>
        </div>

        <div className="text-xs text-muted-foreground mb-3">{filtered.length} contractors</div>

        {/* Card View */}
        {viewMode === 'card' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map(c => (
              <ContractorCard key={c.id} contractor={c} onSelect={setSelectedContractor} selected={selectedContractor?.id === c.id} />
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-2">
            {filtered.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedContractor(c)}
                className={cn('w-full flex items-center gap-4 p-3 rounded-xl border text-left transition-colors hover:bg-muted/40', selectedContractor?.id === c.id ? 'border-primary/50 bg-primary/5' : 'border-border/50')}
              >
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center font-bold text-primary text-sm shrink-0">
                  {c.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{c.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{c.company} • {c.city}, {c.state}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <LeadScoreBadge score={c.leadScore} />
                  <StatusBadge status={c.status} />
                  {c.favorite && <Star size={14} weight="fill" className="text-yellow-400" />}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="border border-border/50 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border/50">
                <tr>
                  {['Name', 'Company', 'City', 'Services', 'Score', 'Status', 'Last Contact', ''].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c.id} onClick={() => setSelectedContractor(c)}
                    className={cn('border-b border-border/30 cursor-pointer hover:bg-muted/30 transition-colors', i % 2 === 0 ? '' : 'bg-muted/10')}
                  >
                    <td className="px-3 py-2.5 font-medium">{c.name}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{c.company}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{c.city}</td>
                    <td className="px-3 py-2.5"><div className="flex flex-wrap gap-1">{c.services.slice(0,2).map(s => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}</div></td>
                    <td className="px-3 py-2.5"><LeadScoreBadge score={c.leadScore} /></td>
                    <td className="px-3 py-2.5"><StatusBadge status={c.status} /></td>
                    <td className="px-3 py-2.5 text-muted-foreground">{c.lastContact}</td>
                    <td className="px-3 py-2.5"><Button variant="ghost" size="sm" className="h-7 px-2">View</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Kanban View */}
        {viewMode === 'kanban' && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {(['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'] as ContractorStatus[]).map(status => {
              const cols = filtered.filter(c => c.status === status)
              return (
                <div key={status} className="shrink-0 w-52">
                  <div className="flex items-center justify-between mb-2">
                    <StatusBadge status={status} />
                    <span className="text-xs text-muted-foreground">{cols.length}</span>
                  </div>
                  <div className="space-y-2">
                    {cols.map(c => (
                      <button key={c.id} onClick={() => setSelectedContractor(c)}
                        className="w-full p-2.5 rounded-lg border border-border/50 bg-card text-left hover:border-primary/40 transition-colors"
                      >
                        <div className="font-semibold text-xs truncate">{c.name}</div>
                        <div className="text-xs text-muted-foreground truncate mb-1.5">{c.company}</div>
                        <LeadScoreBadge score={c.leadScore} />
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Right Panel */}
      {selectedContractor && (
        <ContractorPanel contractor={selectedContractor} onClose={() => setSelectedContractor(null)} />
      )}
    </div>
  )
}

function ContractorCard({ contractor: c, onSelect, selected }: { contractor: Contractor; onSelect: (c: Contractor) => void; selected: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }}
      onClick={() => onSelect(c)}
      className={cn(
        'p-4 rounded-xl border cursor-pointer transition-colors',
        selected ? 'border-primary/60 bg-primary/5' : 'border-border/50 bg-card hover:border-border hover:bg-muted/20'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center font-bold text-primary text-sm shrink-0">
            {c.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="font-semibold text-sm">{c.name}</div>
            <div className="text-xs text-muted-foreground">{c.title}</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {c.favorite && <Star size={14} weight="fill" className="text-yellow-400" />}
          <LeadScoreBadge score={c.leadScore} />
        </div>
      </div>

      <div className="text-sm font-medium text-foreground/90 mb-1">{c.company}</div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
        <MapPin size={11} />{c.city}, {c.state}
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {c.services.slice(0,3).map(s => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
      </div>

      <div className="flex items-center justify-between">
        <StatusBadge status={c.status} />
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock size={11} />{c.lastContact}
        </div>
      </div>

      <div className="flex gap-1 mt-3 pt-3 border-t border-border/40">
        <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={e => { e.stopPropagation() }}>
          <Envelope size={12} className="mr-1" />Email
        </Button>
        <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={e => { e.stopPropagation() }}>
          <Phone size={12} className="mr-1" />Call
        </Button>
        <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={e => { e.stopPropagation() }}>
          <ArrowRight size={12} />
        </Button>
      </div>
    </motion.div>
  )
}

function ContractorPanel({ contractor: c, onClose }: { contractor: Contractor; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-72 shrink-0 border border-border/50 rounded-xl bg-card p-4 space-y-4 self-start sticky top-4"
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm">Contractor Profile</span>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center font-bold text-primary">
          {c.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <div className="font-bold">{c.name}</div>
          <div className="text-xs text-muted-foreground">{c.title} @ {c.company}</div>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Envelope size={14} /><span className="truncate">{c.email}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone size={14} /><span>{c.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin size={14} /><span>{c.city}, {c.state}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Lead Score</span>
        <LeadScoreBadge score={c.leadScore} />
      </div>
      <Progress value={c.leadScore} className="h-1.5" />

      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Status</span>
        <StatusBadge status={c.status} />
      </div>

      <div>
        <div className="text-xs text-muted-foreground mb-1.5">Services</div>
        <div className="flex flex-wrap gap-1">
          {c.services.map(s => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
        </div>
      </div>

      <Separator />
      <div className="grid grid-cols-2 gap-1.5 text-xs">
        <div className="bg-muted/40 rounded-lg p-2">
          <div className="text-muted-foreground">Revenue</div>
          <div className="font-bold">${(c.revenue / 1000000).toFixed(1)}M</div>
        </div>
        <div className="bg-muted/40 rounded-lg p-2">
          <div className="text-muted-foreground">Employees</div>
          <div className="font-bold">{c.employees}</div>
        </div>
      </div>

      <div className="space-y-1.5">
        {[
          { label: 'Send Email',        icon: <Envelope size={13} /> },
          { label: 'Create Takeoff',    icon: <Camera size={13} /> },
          { label: 'Generate Proposal', icon: <FileText size={13} /> },
          { label: 'Create Invoice',    icon: <Invoice size={13} /> },
          { label: 'Create Project',    icon: <Briefcase size={13} /> },
        ].map(({ label, icon }) => (
          <Button key={label} variant="outline" size="sm" className="w-full justify-start h-8 text-xs">
            {icon}<span className="ml-2">{label}</span>
          </Button>
        ))}
      </div>

      {c.notes && (
        <div className="bg-muted/30 rounded-lg p-3 text-xs text-muted-foreground italic">
          "{c.notes}"
        </div>
      )}
    </motion.div>
  )
}

// ─── Tab 2: Lead Generation ───────────────────────────────────────────────────

function LeadGenTab() {
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState('')
  const [leadsFound, setLeadsFound] = useState(0)
  const [qualified, setQualified] = useState(0)
  const [minScore, setMinScore] = useState([60])
  const [targetCount, setTargetCount] = useState('50')
  const [serviceType, setServiceType] = useState('')
  const [location, setLocation] = useState('')
  const [sources, setSources] = useState({ google: true, yelp: true, directories: false })
  const [done, setDone] = useState(false)

  const previewLeads = [
    { company: 'Apex Concrete Orlando', city: 'Orlando, FL', score: 87, phone: '(407) 555-1234', email: 'info@apexconcrete.com', source: 'Google Maps' },
    { company: 'SunState Epoxy Systems', city: 'Tampa, FL', score: 74, phone: '(813) 555-5678', email: 'contact@sunstateepoxy.com', source: 'Yelp' },
    { company: 'Precision Floor Coatings', city: 'Miami, FL', score: 91, phone: '(305) 555-9012', email: 'info@precisionfloor.com', source: 'Google Maps' },
    { company: 'Gulf Coast Contractors', city: 'Naples, FL', score: 65, phone: '(239) 555-3456', email: 'sales@gulfcoastcontractors.com', source: 'Yelp' },
    { company: 'First Class Flooring', city: 'Jacksonville, FL', score: 79, phone: '(904) 555-7890', email: 'info@firstclassflooring.com', source: 'Google Maps' },
  ]

  const startGeneration = () => {
    setGenerating(true)
    setDone(false)
    setProgress(0)
    setLeadsFound(0)
    setQualified(0)

    const phases = [
      { p: 15, phase: 'Initializing scrapers...', leads: 0, qual: 0 },
      { p: 35, phase: 'Scraping Google Maps...', leads: 12, qual: 0 },
      { p: 55, phase: 'Scraping Yelp listings...', leads: 28, qual: 0 },
      { p: 70, phase: 'Enriching contact data...', leads: 44, qual: 0 },
      { p: 82, phase: 'Scoring & qualifying leads...', leads: 44, qual: 21 },
      { p: 92, phase: 'Removing duplicates...', leads: 44, qual: 38 },
      { p: 100, phase: 'Complete!', leads: 44, qual: 38 },
    ]

    let i = 0
    const tick = () => {
      if (i >= phases.length) {
        setGenerating(false)
        setDone(true)
        return
      }
      const s = phases[i]
      setProgress(s.p)
      setPhase(s.phase)
      setLeadsFound(s.leads)
      setQualified(s.qual)
      i++
      setTimeout(tick, 900)
    }
    tick()
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Config Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Gear size={16} />Generation Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs mb-1.5 block">Service Type</Label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger><SelectValue placeholder="Select service type..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="epoxy">Epoxy Flooring</SelectItem>
                  <SelectItem value="concrete">Concrete Contractors</SelectItem>
                  <SelectItem value="tile">Tile & Stone</SelectItem>
                  <SelectItem value="hardwood">Hardwood Flooring</SelectItem>
                  <SelectItem value="general">General Contractors</SelectItem>
                  <SelectItem value="industrial">Industrial Coatings</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Location (City, State or ZIP)</Label>
              <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Orlando, FL" />
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Target Lead Count</Label>
              <Input value={targetCount} onChange={e => setTargetCount(e.target.value)} type="number" placeholder="50" />
            </div>
            <div>
              <Label className="text-xs mb-2 block">Minimum Lead Score: {minScore[0]}</Label>
              <Slider value={minScore} onValueChange={setMinScore} min={0} max={100} step={5} />
            </div>
            <div>
              <Label className="text-xs mb-2 block">Data Sources</Label>
              <div className="space-y-2">
                {([['google', 'Google Maps'], ['yelp', 'Yelp'], ['directories', 'Business Directories']] as const).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-2">
                    <Checkbox
                      id={key}
                      checked={sources[key]}
                      onCheckedChange={v => setSources(prev => ({ ...prev, [key]: !!v }))}
                    />
                    <Label htmlFor={key} className="text-sm cursor-pointer">{label}</Label>
                  </div>
                ))}
              </div>
            </div>
            <Button
              className="w-full"
              onClick={startGeneration}
              disabled={generating || !serviceType || !location}
            >
              <Robot size={15} className="mr-2" />
              {generating ? 'GENERATING...' : 'START GENERATION'}
            </Button>
          </CardContent>
        </Card>

        {/* Progress Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ChartBar size={16} />Generation Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{phase || 'Ready to start...'}</span>
                <span className="font-bold">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Scraped', value: leadsFound, icon: <Robot size={16} className="text-blue-400" /> },
                { label: 'Qualified', value: qualified, icon: <Check size={16} className="text-green-400" /> },
                { label: 'Duplicates', value: leadsFound > 0 ? leadsFound - qualified - 3 : 0, icon: <X size={16} className="text-red-400" /> },
              ].map(m => (
                <div key={m.label} className="bg-muted/40 rounded-xl p-3 text-center">
                  <div className="flex justify-center mb-1">{m.icon}</div>
                  <div className="text-2xl font-bold">{m.value}</div>
                  <div className="text-xs text-muted-foreground">{m.label}</div>
                </div>
              ))}
            </div>

            {done && (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Avg Lead Score', value: '76', icon: <Brain size={14} className="text-purple-400" /> },
                  { label: 'With Email', value: '41', icon: <Envelope size={14} className="text-blue-400" /> },
                  { label: 'With Phone', value: '38', icon: <Phone size={14} className="text-green-400" /> },
                  { label: 'High Quality', value: '18', icon: <Star size={14} className="text-yellow-400" /> },
                ].map(m => (
                  <div key={m.label} className="flex items-center gap-2 bg-muted/30 rounded-lg p-2.5">
                    {m.icon}
                    <div>
                      <div className="font-bold text-sm">{m.value}</div>
                      <div className="text-xs text-muted-foreground">{m.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results Preview */}
      {done && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-400" />Results Preview (38 leads)
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm"><Download size={13} className="mr-1.5" />Export CSV</Button>
                  <Button size="sm"><Plus size={13} className="mr-1.5" />Import All</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border border-border/50 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 border-b border-border/50">
                    <tr>
                      {['Company', 'Location', 'Score', 'Phone', 'Email', 'Source', ''].map(h => (
                        <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewLeads.map((lead, i) => (
                      <tr key={i} className="border-b border-border/30 hover:bg-muted/20">
                        <td className="px-3 py-2.5 font-medium">{lead.company}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{lead.city}</td>
                        <td className="px-3 py-2.5"><LeadScoreBadge score={lead.score} /></td>
                        <td className="px-3 py-2.5 text-muted-foreground">{lead.phone}</td>
                        <td className="px-3 py-2.5 text-muted-foreground text-xs">{lead.email}</td>
                        <td className="px-3 py-2.5"><Badge variant="outline" className="text-xs">{lead.source}</Badge></td>
                        <td className="px-3 py-2.5"><Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Import</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

// ─── Tab 3: Email Automation ──────────────────────────────────────────────────

function EmailTab() {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>(MOCK_EMAIL_TEMPLATES[0])
  const [emailTab, setEmailTab] = useState<'pending' | 'scheduled' | 'sent'>('pending')

  const filtered = MOCK_EMAIL_QUEUE.filter(e =>
    emailTab === 'pending' ? e.status === 'pending' :
    emailTab === 'scheduled' ? e.status === 'scheduled' :
    ['sent', 'opened', 'clicked'].includes(e.status)
  )

  return (
    <div className="flex gap-4">
      {/* Templates Sidebar */}
      <div className="w-56 shrink-0 space-y-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Templates</span>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><Plus size={13} /></Button>
        </div>
        {MOCK_EMAIL_TEMPLATES.map(t => (
          <button
            key={t.id}
            onClick={() => setSelectedTemplate(t)}
            className={cn('w-full p-3 rounded-xl border text-left transition-colors', selectedTemplate.id === t.id ? 'border-primary/50 bg-primary/5' : 'border-border/50 hover:bg-muted/40')}
          >
            <div className="text-sm font-semibold mb-0.5">{t.name}</div>
            <div className="text-xs text-muted-foreground truncate">{t.subject}</div>
          </button>
        ))}

        <Separator className="my-4" />

        {/* Gmail Sync */}
        <div className="p-3 rounded-xl border border-border/50 bg-muted/20">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold">Gmail Connected</span>
          </div>
          <div className="text-xs text-muted-foreground">Last sync: 2 min ago</div>
        </div>
      </div>

      {/* Main Email Area */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Template Preview */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">{selectedTemplate.name}</CardTitle>
              <Button variant="outline" size="sm" className="h-7 text-xs"><Gear size={12} className="mr-1.5" />Edit Template</Button>
            </div>
            <div className="text-xs font-mono text-muted-foreground bg-muted/40 rounded px-2 py-1">
              Subject: {selectedTemplate.subject}
            </div>
          </CardHeader>
          <CardContent>
            <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed">
              {selectedTemplate.body}
            </pre>
          </CardContent>
        </Card>

        {/* Email Queue */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <button onClick={() => setEmailTab('pending')} className={cn('text-sm px-3 py-1.5 rounded-lg', emailTab === 'pending' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}>
              Pending ({MOCK_EMAIL_QUEUE.filter(e => e.status === 'pending').length})
            </button>
            <button onClick={() => setEmailTab('scheduled')} className={cn('text-sm px-3 py-1.5 rounded-lg', emailTab === 'scheduled' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}>
              Scheduled ({MOCK_EMAIL_QUEUE.filter(e => e.status === 'scheduled').length})
            </button>
            <button onClick={() => setEmailTab('sent')} className={cn('text-sm px-3 py-1.5 rounded-lg', emailTab === 'sent' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}>
              Sent ({MOCK_EMAIL_QUEUE.filter(e => ['sent','opened','clicked'].includes(e.status)).length})
            </button>
          </div>

          <div className="space-y-2">
            {filtered.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">No emails in this queue</div>
            )}
            {filtered.map(e => (
              <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card hover:bg-muted/20 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm">{e.recipient}</span>
                    <span className="text-xs text-muted-foreground">• {e.company}</span>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{e.subject}</div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {(e.status === 'opened' || e.status === 'clicked') && (
                    <div className="text-xs text-muted-foreground space-x-2">
                      <span>Open: <span className="text-foreground font-medium">{e.openRate}%</span></span>
                      <span>Click: <span className="text-foreground font-medium">{e.clickRate}%</span></span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock size={11} />{e.scheduledAt}
                  </div>
                  <EmailStatusBadge status={e.status} />
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><PaperPlaneTilt size={12} /></Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Eye size={12} /></Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400"><Trash size={12} /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="w-52 shrink-0 space-y-3">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Bulk Actions</div>
        {[
          { label: 'AI Generate Emails', icon: <Brain size={13} />, variant: 'default' as const },
          { label: 'Preview All',        icon: <Eye size={13} />,   variant: 'outline' as const },
          { label: 'Send All',           icon: <PaperPlaneTilt size={13} />, variant: 'outline' as const },
          { label: 'Schedule All',       icon: <Calendar size={13} />, variant: 'outline' as const },
        ].map(a => (
          <Button key={a.label} variant={a.variant} size="sm" className="w-full justify-start">
            {a.icon}<span className="ml-2">{a.label}</span>
          </Button>
        ))}

        <Separator />

        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Open Rate</span>
            <span className="font-bold text-green-400">38.2%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Click Rate</span>
            <span className="font-bold text-blue-400">12.7%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Reply Rate</span>
            <span className="font-bold text-purple-400">6.4%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Unsubscribes</span>
            <span className="font-bold text-red-400">1.1%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Tab 4: Takeoff System ────────────────────────────────────────────────────

type TakeoffStep = 'upload' | 'analysis' | 'materials' | 'review'

function TakeoffTab() {
  const [step, setStep] = useState<TakeoffStep>('upload')
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [items, setItems] = useState<TakeoffItem[]>([
    { id: 'ti1', description: 'Epoxy Base Coat', quantity: 12000, unit: 'sq ft', unitPrice: 0.85 },
    { id: 'ti2', description: 'Decorative Quartz Aggregate', quantity: 600, unit: 'lbs', unitPrice: 2.40 },
    { id: 'ti3', description: 'Polyurea Top Coat', quantity: 12000, unit: 'sq ft', unitPrice: 0.65 },
    { id: 'ti4', description: 'Concrete Primer', quantity: 12000, unit: 'sq ft', unitPrice: 0.35 },
    { id: 'ti5', description: 'Diamond Grinding', quantity: 12000, unit: 'sq ft', unitPrice: 0.45 },
  ])

  const materialsTotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
  const laborTotal = materialsTotal * 1.2
  const tax = (materialsTotal + laborTotal) * 0.07
  const grandTotal = materialsTotal + laborTotal + tax

  const startAnalysis = () => {
    setAnalyzing(true)
    let p = 0
    const tick = setInterval(() => {
      p += 8
      setAnalysisProgress(Math.min(p, 100))
      if (p >= 100) { clearInterval(tick); setAnalyzing(false); setStep('materials') }
    }, 200)
  }

  const steps: { key: TakeoffStep; label: string }[] = [
    { key: 'upload', label: '1. Upload Photos' },
    { key: 'analysis', label: '2. AI Analysis' },
    { key: 'materials', label: '3. Materials & Pricing' },
    { key: 'review', label: '4. Review & Save' },
  ]

  return (
    <div className="space-y-5">
      {/* Step Wizard */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <button
              onClick={() => setStep(s.key)}
              className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors', step === s.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}
            >{s.label}</button>
            {i < steps.length - 1 && <ArrowRight size={14} className="text-muted-foreground shrink-0" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 'upload' && (
          <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card>
              <CardContent className="pt-6">
                <div
                  className="border-2 border-dashed border-border/60 rounded-2xl p-16 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => { setStep('analysis') }}
                >
                  <Upload size={40} className="mx-auto text-muted-foreground mb-4" />
                  <div className="font-semibold mb-2">Drop photos here or click to upload</div>
                  <div className="text-sm text-muted-foreground mb-4">Supports JPG, PNG, PDF, DWG — max 50MB each</div>
                  <Button variant="outline"><Upload size={14} className="mr-2" />Choose Files</Button>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {['Site Overview', 'Floor Plan', 'Close-up Detail'].map(label => (
                    <div key={label} className="aspect-video bg-muted/40 rounded-xl flex items-center justify-center border border-border/50">
                      <div className="text-center">
                        <Camera size={24} className="mx-auto text-muted-foreground mb-2" />
                        <div className="text-xs text-muted-foreground">{label}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="mt-4 w-full" onClick={() => setStep('analysis')}>
                  Continue to AI Analysis <ArrowRight size={14} className="ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 'analysis' && (
          <motion.div key="analysis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Brain size={16} className="text-purple-400" />AI Vision Analysis</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" onClick={startAnalysis} disabled={analyzing}>
                    <Sparkle size={15} className="mr-2" />
                    {analyzing ? 'Analyzing...' : 'Run AI Analysis'}
                  </Button>
                  {analyzing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Processing images with computer vision...</span>
                        <span className="font-bold">{analysisProgress}%</span>
                      </div>
                      <Progress value={analysisProgress} className="h-2" />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Square Footage', value: '12,840 sq ft', icon: <Table size={14} className="text-blue-400" /> },
                      { label: 'Room Count', value: '1 main + 2 offices', icon: <Buildings size={14} className="text-green-400" /> },
                      { label: 'Surface Condition', value: 'Fair – some cracks', icon: <Warning size={14} className="text-yellow-400" /> },
                      { label: 'Difficulty', value: 'Medium (7/10)', icon: <ChartBar size={14} className="text-purple-400" /> },
                    ].map(m => (
                      <div key={m.label} className="bg-muted/40 rounded-xl p-3">
                        <div className="flex items-center gap-1.5 mb-1">{m.icon}<span className="text-xs text-muted-foreground">{m.label}</span></div>
                        <div className="text-sm font-bold">{m.value}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">Detected Elements</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { item: 'Floor area', detail: '12,840 sq ft total' },
                      { item: 'Control joints', detail: '48 linear feet' },
                      { item: 'Cracks detected', detail: '3 hairline, 1 structural' },
                      { item: 'Drains', detail: '4 floor drains' },
                      { item: 'Columns', detail: '8 support columns' },
                      { item: 'Loading dock', detail: '2 dock plates' },
                    ].map(e => (
                      <div key={e.item} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
                        <div className="flex items-center gap-2">
                          <Check size={12} className="text-green-400 shrink-0" />
                          <span className="text-sm">{e.item}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{e.detail}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4" onClick={() => setStep('materials')}>
                    Continue to Materials <ArrowRight size={14} className="ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {step === 'materials' && (
          <motion.div key="materials" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Materials &amp; Pricing</CardTitle>
                  <Button variant="outline" size="sm"><Plus size={13} className="mr-1.5" />Add Item</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border border-border/50 rounded-xl overflow-hidden mb-5">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/40 border-b border-border/50">
                      <tr>
                        {['Description', 'Qty', 'Unit', 'Unit Price', 'Total', ''].map(h => (
                          <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(item => (
                        <tr key={item.id} className="border-b border-border/30">
                          <td className="px-3 py-2.5 font-medium">{item.description}</td>
                          <td className="px-3 py-2.5">{item.quantity.toLocaleString()}</td>
                          <td className="px-3 py-2.5 text-muted-foreground">{item.unit}</td>
                          <td className="px-3 py-2.5">${item.unitPrice.toFixed(2)}</td>
                          <td className="px-3 py-2.5 font-semibold">${(item.quantity * item.unitPrice).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className="px-3 py-2.5">
                            <button onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))} className="text-red-400 hover:text-red-300">
                              <Trash size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end">
                  <div className="w-72 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Materials</span><span>${materialsTotal.toLocaleString('en', { maximumFractionDigits: 0 })}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Labor (120%)</span><span>${laborTotal.toLocaleString('en', { maximumFractionDigits: 0 })}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Tax (7%)</span><span>${tax.toLocaleString('en', { maximumFractionDigits: 0 })}</span></div>
                    <Separator />
                    <div className="flex justify-between font-bold text-base"><span>Total</span><span>${grandTotal.toLocaleString('en', { maximumFractionDigits: 0 })}</span></div>
                  </div>
                </div>
                <Button className="mt-4" onClick={() => setStep('review')}>Review &amp; Save <ArrowRight size={14} className="ml-2" /></Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 'review' && (
          <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-400" />Review &amp; Save Takeoff
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Materials Cost', value: `$${materialsTotal.toLocaleString('en', { maximumFractionDigits: 0 })}`, color: 'text-blue-400' },
                    { label: 'Labor Cost',      value: `$${laborTotal.toLocaleString('en', { maximumFractionDigits: 0 })}`, color: 'text-purple-400' },
                    { label: 'Grand Total',     value: `$${grandTotal.toLocaleString('en', { maximumFractionDigits: 0 })}`, color: 'text-green-400' },
                  ].map(m => (
                    <div key={m.label} className="bg-muted/40 rounded-xl p-4 text-center">
                      <div className={cn('text-2xl font-bold', m.color)}>{m.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">{m.label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button><Check size={14} className="mr-1.5" />Save Takeoff</Button>
                  <Button variant="outline"><Envelope size={14} className="mr-1.5" />Email to Customer</Button>
                  <Button variant="outline"><FileText size={14} className="mr-1.5" />Create Proposal</Button>
                  <Button variant="outline"><Download size={14} className="mr-1.5" />Download PDF</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Tab 5: Proposal Generator ────────────────────────────────────────────────

type ProposalStep = 'source' | 'customize' | 'pricing' | 'design' | 'review'

function ProposalTab() {
  const [step, setStep] = useState<ProposalStep>('customize')
  const [title, setTitle] = useState('Warehouse Epoxy Flooring System')
  const [scope, setScope] = useState('Full epoxy flooring system installation including surface preparation, primer, base coat, decorative broadcast, and polyurea top coat for 12,840 sq ft warehouse facility.')
  const [timeline, setTimeline] = useState('6–8 weeks')
  const [materials, setMaterials] = useState(21400)
  const [labor, setLabor] = useState(26880)
  const [markup, setMarkup] = useState(25)
  const [tax, setTax] = useState(7)
  const [discount, setDiscount] = useState(0)
  const [selectedTemplate, setSelectedTemplateProposal] = useState(0)

  const subtotal = materials + labor
  const markupAmt = subtotal * (markup / 100)
  const discountAmt = discount
  const taxAmt = (subtotal + markupAmt - discountAmt) * (tax / 100)
  const total = subtotal + markupAmt - discountAmt + taxAmt

  const proposalSteps: { key: ProposalStep; label: string }[] = [
    { key: 'source', label: '1. Source' },
    { key: 'customize', label: '2. Customize' },
    { key: 'pricing', label: '3. Pricing' },
    { key: 'design', label: '4. Design' },
    { key: 'review', label: '5. Review & Send' },
  ]

  const templates = [
    { name: 'Professional', color: 'bg-blue-500/20 border-blue-500/40' },
    { name: 'Modern Dark', color: 'bg-gray-900 border-gray-600' },
    { name: 'Clean White', color: 'bg-white/10 border-white/30' },
    { name: 'Bold Impact', color: 'bg-orange-500/20 border-orange-500/40' },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        {proposalSteps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <button onClick={() => setStep(s.key)} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors', step === s.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}>
              {s.label}
            </button>
            {i < proposalSteps.length - 1 && <ArrowRight size={13} className="text-muted-foreground shrink-0" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {step === 'source' && (
            <Card>
              <CardHeader><CardTitle className="text-base">Source Data</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs mb-1.5 block">Contractor</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select contractor..." /></SelectTrigger>
                    <SelectContent>
                      {MOCK_CONTRACTORS.map(c => <SelectItem key={c.id} value={c.id}>{c.name} – {c.company}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">Import from Takeoff</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select takeoff..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="t1">ParkBuild Warehouse – $180k</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => setStep('customize')}>Continue <ArrowRight size={13} className="ml-2" /></Button>
              </CardContent>
            </Card>
          )}

          {step === 'customize' && (
            <Card>
              <CardHeader><CardTitle className="text-base">Proposal Details</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs mb-1.5 block">Proposal Title</Label>
                  <Input value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">Scope of Work</Label>
                  <Textarea value={scope} onChange={e => setScope(e.target.value)} rows={5} />
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">Estimated Timeline</Label>
                  <Input value={timeline} onChange={e => setTimeline(e.target.value)} />
                </div>
                <Button onClick={() => setStep('pricing')}>Continue <ArrowRight size={13} className="ml-2" /></Button>
              </CardContent>
            </Card>
          )}

          {step === 'pricing' && (
            <Card>
              <CardHeader><CardTitle className="text-base">Pricing</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'Materials ($)', value: materials, setter: setMaterials },
                  { label: 'Labor ($)', value: labor, setter: setLabor },
                  { label: 'Markup (%)', value: markup, setter: setMarkup },
                  { label: 'Tax (%)', value: tax, setter: setTax },
                  { label: 'Discount ($)', value: discount, setter: setDiscount },
                ].map(({ label, value, setter }) => (
                  <div key={label} className="flex items-center gap-3">
                    <Label className="text-xs w-28 shrink-0">{label}</Label>
                    <Input
                      type="number"
                      value={value}
                      onChange={e => setter(Number(e.target.value))}
                      className="flex-1"
                    />
                  </div>
                ))}
                <Button onClick={() => setStep('design')}>Continue <ArrowRight size={13} className="ml-2" /></Button>
              </CardContent>
            </Card>
          )}

          {step === 'design' && (
            <Card>
              <CardHeader><CardTitle className="text-base">Template Design</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {templates.map((t, i) => (
                    <button
                      key={t.name}
                      onClick={() => setSelectedTemplateProposal(i)}
                      className={cn('aspect-video rounded-xl border-2 transition-all flex items-end p-3', t.color, selectedTemplate === i ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : '')}
                    >
                      <span className="text-xs font-semibold text-foreground/80">{t.name}</span>
                    </button>
                  ))}
                </div>
                <Button className="mt-4" onClick={() => setStep('review')}>Continue <ArrowRight size={13} className="ml-2" /></Button>
              </CardContent>
            </Card>
          )}

          {step === 'review' && (
            <Card>
              <CardHeader><CardTitle className="text-base">Review &amp; Send</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/30 rounded-xl p-4 space-y-2 text-sm">
                  <div className="font-bold text-lg">{title}</div>
                  <div className="text-muted-foreground">{scope}</div>
                  <div className="flex gap-2 mt-2"><Calendar size={14} /><span>{timeline}</span></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button><PaperPlaneTilt size={14} className="mr-1.5" />Send Proposal</Button>
                  <Button variant="outline"><Eye size={14} className="mr-1.5" />Preview</Button>
                  <Button variant="outline"><Download size={14} className="mr-1.5" />Download PDF</Button>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  {[
                    { label: 'Email Opened', value: 'Not yet', icon: <Envelope size={14} className="text-muted-foreground" /> },
                    { label: 'PDF Viewed', value: 'Not yet', icon: <Eye size={14} className="text-muted-foreground" /> },
                    { label: 'Signed', value: 'Pending', icon: <FileText size={14} className="text-muted-foreground" /> },
                  ].map(t => (
                    <div key={t.label} className="bg-muted/30 rounded-xl p-3 text-center">
                      <div className="flex justify-center mb-1">{t.icon}</div>
                      <div className="text-muted-foreground">{t.label}</div>
                      <div className="font-semibold mt-0.5">{t.value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pricing Summary Sidebar */}
        <Card className="self-start">
          <CardHeader><CardTitle className="text-base">Pricing Summary</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Materials</span><span>${materials.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Labor</span><span>${labor.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Markup ({markup}%)</span><span>${markupAmt.toLocaleString('en', { maximumFractionDigits: 0 })}</span></div>
            <div className="flex justify-between text-red-400"><span>Discount</span><span>-${discountAmt.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax ({tax}%)</span><span>${taxAmt.toLocaleString('en', { maximumFractionDigits: 0 })}</span></div>
            <Separator />
            <div className="flex justify-between font-bold text-xl pt-1">
              <span>Total</span>
              <span className="text-green-400">${total.toLocaleString('en', { maximumFractionDigits: 0 })}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ─── Tab 6: Project Management ────────────────────────────────────────────────

function ProjectsTab() {
  const project = MOCK_PROJECT
  const [newTask, setNewTask] = useState('')
  const totalDays = 72

  const statusColor = (s: TaskStatus) =>
    s === 'done' ? 'bg-green-500' : s === 'in_progress' ? 'bg-blue-500' : 'bg-muted'

  const priorityBadge = (p: TaskPriority) => {
    const map: Record<TaskPriority, string> = {
      high: 'text-red-400 bg-red-400/10 border-red-400/20',
      medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
      low: 'text-green-400 bg-green-400/10 border-green-400/20',
    }
    return <Badge variant="outline" className={cn('text-xs capitalize', map[p])}>{p}</Badge>
  }

  return (
    <div className="space-y-5">
      {/* Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Project Status', value: 'Active', icon: <CheckCircle size={18} className="text-green-400" /> },
          { label: 'Budget',  value: `$${(project.budget / 1000).toFixed(0)}k`, icon: <CurrencyDollar size={18} className="text-blue-400" /> },
          { label: 'Spent',   value: `$${(project.spent / 1000).toFixed(1)}k`, icon: <ChartBar size={18} className="text-orange-400" /> },
          { label: 'Progress', value: `${project.progress}%`, icon: <ArrowRight size={18} className="text-purple-400" /> },
        ].map(m => (
          <Card key={m.label}>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">{m.icon}<span className="text-xs text-muted-foreground">{m.label}</span></div>
              <div className="text-2xl font-bold">{m.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Progress value={project.progress} className="flex-1 h-3 mr-4" />
        <span className="text-sm text-muted-foreground shrink-0">{project.startDate} → {project.endDate}</span>
      </div>

      {/* Gantt-style Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2"><Calendar size={15} />Project Timeline</CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-3 h-3 rounded bg-green-500" />Done
              <div className="w-3 h-3 rounded bg-blue-500" />In Progress
              <div className="w-3 h-3 rounded bg-muted" />Todo
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {project.tasks.map(task => (
              <div key={task.id} className="flex items-center gap-3">
                <div className="w-40 shrink-0 text-xs font-medium truncate">{task.name}</div>
                <div className="flex-1 relative h-6 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className={cn('absolute h-full rounded-full transition-all', statusColor(task.status))}
                    style={{
                      left: `${(task.startOffset / totalDays) * 100}%`,
                      width: `${(task.duration / totalDays) * 100}%`,
                    }}
                  />
                </div>
                <div className="w-24 shrink-0 flex justify-end">{priorityBadge(task.priority)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2"><List size={15} />Tasks</CardTitle>
            <div className="flex gap-2">
              <Input
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                placeholder="Add task..."
                className="h-8 w-52 text-sm"
              />
              <Button size="sm" className="h-8" onClick={() => setNewTask('')}>
                <Plus size={13} className="mr-1" />Add
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {project.tasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/30 transition-colors">
                <div className={cn('w-2 h-2 rounded-full shrink-0', statusColor(task.status))} />
                <span className={cn('flex-1 text-sm', task.status === 'done' ? 'line-through text-muted-foreground' : '')}>{task.name}</span>
                <span className="text-xs text-muted-foreground">{task.assignee}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar size={10} />{task.dueDate}</span>
                {priorityBadge(task.priority)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Budget */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><CurrencyDollar size={15} />Budget Tracking</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { label: 'Total Budget', value: project.budget, color: 'text-foreground' },
              { label: 'Spent',        value: project.spent, color: 'text-orange-400' },
              { label: 'Remaining',    value: project.budget - project.spent, color: 'text-green-400' },
            ].map(m => (
              <div key={m.label} className="text-center bg-muted/30 rounded-xl p-3">
                <div className={cn('text-xl font-bold', m.color)}>${m.value.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">{m.label}</div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {[
              { label: 'Materials Purchased', value: 18400, budget: 21400 },
              { label: 'Labor Costs', value: 31200, budget: 50000 },
              { label: 'Equipment Rental', value: 4200, budget: 8600 },
              { label: 'Misc / Overhead', value: 8600, budget: 10000 },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span>${item.value.toLocaleString()} / ${item.budget.toLocaleString()}</span>
                </div>
                <Progress value={(item.value / item.budget) * 100} className="h-1.5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Calendar Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2"><Calendar size={15} />Upcoming Events</CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-blue-400" />Google Calendar Synced
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { date: 'Jan 29', event: 'Surface Grinding Complete – Site Inspection', type: 'milestone' },
              { date: 'Feb 5', event: 'Primer Application Start', type: 'task' },
              { date: 'Feb 12', event: 'Progress Meeting w/ Jason Park', type: 'meeting' },
              { date: 'Feb 19', event: 'Base Coat Application Start', type: 'task' },
              { date: 'Mar 28', event: 'Final Walkthrough & Handoff', type: 'milestone' },
            ].map((ev, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/20">
                <div className="text-xs font-bold text-muted-foreground w-12 shrink-0">{ev.date}</div>
                <div className="flex-1 text-sm">{ev.event}</div>
                <Badge variant="outline" className={cn('text-xs capitalize',
                  ev.type === 'milestone' ? 'text-yellow-400 border-yellow-400/30' :
                  ev.type === 'meeting' ? 'text-blue-400 border-blue-400/30' :
                  'text-muted-foreground'
                )}>{ev.type}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Tab 7: Billing ───────────────────────────────────────────────────────────

function BillingTab() {
  const invoice = MOCK_INVOICE
  const [newDescription, setNewDescription] = useState('')
  const [newQty, setNewQty] = useState('1')
  const [newPrice, setNewPrice] = useState('')
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>(invoice.lineItems)

  const subtotal = lineItems.reduce((sum, li) => sum + li.quantity * li.unitPrice, 0)
  const depositAmount = subtotal * (invoice.depositPercent / 100)

  const addLineItem = () => {
    if (!newDescription || !newPrice) return
    setLineItems(prev => [...prev, {
      id: `li_${Date.now()}`,
      description: newDescription,
      quantity: Number(newQty),
      unitPrice: Number(newPrice),
    }])
    setNewDescription('')
    setNewQty('1')
    setNewPrice('')
  }

  return (
    <div className="space-y-5">
      {/* Report Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Outstanding', value: '$245,000', icon: <Warning size={18} className="text-orange-400" />, color: 'text-orange-400' },
          { label: 'Paid This Month',   value: '$182,000', icon: <CheckCircle size={18} className="text-green-400" />, color: 'text-green-400' },
          { label: 'Overdue Invoices',  value: '3',       icon: <Clock size={18} className="text-red-400" />, color: 'text-red-400' },
          { label: 'Avg Days to Pay',   value: '18 days', icon: <ChartBar size={18} className="text-blue-400" />, color: 'text-blue-400' },
        ].map(m => (
          <Card key={m.label}>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">{m.icon}<span className="text-xs text-muted-foreground">{m.label}</span></div>
              <div className={cn('text-2xl font-bold', m.color)}>{m.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Invoice Builder */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><Invoice size={15} />Invoice {invoice.number}</CardTitle>
              <InvoiceStatusBadge status={invoice.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border border-border/50 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 border-b border-border/50">
                  <tr>
                    {['Description', 'Qty', 'Unit Price', 'Total', ''].map(h => (
                      <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map(li => (
                    <tr key={li.id} className="border-b border-border/30">
                      <td className="px-3 py-2">{li.description}</td>
                      <td className="px-3 py-2">{li.quantity.toLocaleString()}</td>
                      <td className="px-3 py-2">${li.unitPrice.toFixed(2)}</td>
                      <td className="px-3 py-2 font-semibold">${(li.quantity * li.unitPrice).toLocaleString()}</td>
                      <td className="px-3 py-2">
                        <button onClick={() => setLineItems(prev => prev.filter(i => i.id !== li.id))} className="text-red-400 hover:text-red-300">
                          <Trash size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-muted/10">
                    <td className="px-3 py-2">
                      <Input value={newDescription} onChange={e => setNewDescription(e.target.value)} placeholder="Description..." className="h-7 text-xs" />
                    </td>
                    <td className="px-3 py-2">
                      <Input value={newQty} onChange={e => setNewQty(e.target.value)} type="number" className="h-7 text-xs w-16" />
                    </td>
                    <td className="px-3 py-2">
                      <Input value={newPrice} onChange={e => setNewPrice(e.target.value)} type="number" placeholder="0.00" className="h-7 text-xs w-24" />
                    </td>
                    <td className="px-3 py-2" />
                    <td className="px-3 py-2">
                      <button onClick={addLineItem} className="text-green-400 hover:text-green-300"><Plus size={14} /></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <div className="w-64 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toLocaleString()}</span></div>
                <Separator />
                <div className="flex justify-between font-bold text-base"><span>Total</span><span>${subtotal.toLocaleString()}</span></div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button size="sm"><PaperPlaneTilt size={13} className="mr-1.5" />Send Invoice</Button>
              <Button variant="outline" size="sm"><Download size={13} className="mr-1.5" />Download PDF</Button>
              <Button variant="outline" size="sm"><Eye size={13} className="mr-1.5" />Preview</Button>
            </div>
          </CardContent>
        </Card>

        {/* Phased Billing & Settings */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><RowsPlusBottom size={15} />Phased Billing</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { phase: 'Deposit (25%)', amount: depositAmount, status: 'paid', due: '2024-01-22' },
                { phase: 'Materials (50%)', amount: subtotal * 0.5, status: 'sent', due: '2024-02-05' },
                { phase: 'Completion (25%)', amount: subtotal * 0.25, status: 'pending', due: '2024-03-28' },
              ].map(p => (
                <div key={p.phase} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{p.phase}</div>
                    <div className="text-xs text-muted-foreground">Due: {p.due}</div>
                  </div>
                  <div className="text-sm font-bold">${p.amount.toLocaleString('en', { maximumFractionDigits: 0 })}</div>
                  <Badge variant="outline" className={cn('text-xs',
                    p.status === 'paid' ? 'text-green-400 border-green-400/30' :
                    p.status === 'sent' ? 'text-blue-400 border-blue-400/30' :
                    'text-muted-foreground'
                  )}>{p.status}</Badge>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full"><Check size={13} className="mr-1.5" />Record Payment</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Gear size={15} />Automatic Reminders</CardTitle></CardHeader>
            <CardContent className="space-y-2.5">
              {[
                { label: '3 days before due', enabled: true },
                { label: 'On due date', enabled: true },
                { label: '7 days overdue', enabled: true },
                { label: '14 days overdue', enabled: false },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between">
                  <span className="text-sm">{r.label}</span>
                  <Badge variant="outline" className={cn('text-xs', r.enabled ? 'text-green-400 border-green-400/30' : 'text-muted-foreground')}>
                    {r.enabled ? 'On' : 'Off'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Invoice List */}
          <Card>
            <CardHeader><CardTitle className="text-base">Recent Invoices</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[
                { num: 'INV-2024-001', client: 'ParkBuild Commercial', total: 180000, status: 'sent' as InvoiceStatus },
                { num: 'INV-2023-048', client: 'Rivera Concrete', total: 34200, status: 'paid' as InvoiceStatus },
                { num: 'INV-2023-047', client: 'Kim Luxury Surfaces', total: 72800, status: 'overdue' as InvoiceStatus },
                { num: 'INV-2023-046', client: 'Thompson Construction', total: 48500, status: 'paid' as InvoiceStatus },
              ].map(inv => (
                <div key={inv.num} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/20 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-mono font-semibold">{inv.num}</div>
                    <div className="text-xs text-muted-foreground truncate">{inv.client}</div>
                  </div>
                  <span className="text-sm font-bold">${(inv.total / 1000).toFixed(0)}k</span>
                  <InvoiceStatusBadge status={inv.status} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
