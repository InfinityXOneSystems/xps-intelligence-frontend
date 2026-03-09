import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  MagnifyingGlass,
  Plus,
  HardHat,
  Phone,
  Envelope,
  Star,
  Pencil,
  Trash,
  MapPin,
  Buildings,
  X,
  CheckCircle,
} from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BackButton } from '@/components/BackButton'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  getContractors,
  addContractor,
  deleteContractor,
  type Contractor,
} from '@/services/contractorService'

interface ContractorsPageProps {
  onNavigate: (page: string) => void
}

const statusColors: Record<Contractor['status'], string> = {
  active: 'bg-green-500/15 text-green-400 border-green-500/30',
  inactive: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
  pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
}

const SPECIALTIES = [
  'All Specialties',
  'General Contractor',
  'Roofing',
  'Electrical',
  'Plumbing',
  'HVAC',
  'Concrete & Foundation',
  'Landscaping',
  'Interior Remodeling',
  'Painting',
  'Tile & Flooring',
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star size={14} weight="fill" className="text-yellow-400" />
      <span className="text-sm font-medium text-white">{rating.toFixed(1)}</span>
    </div>
  )
}

interface AddContractorDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (contractor: Omit<Contractor, 'id' | 'createdAt'>) => void
}

function AddContractorDialog({ open, onClose, onAdd }: AddContractorDialogProps) {
  const [form, setForm] = useState({
    name: '',
    company: '',
    specialty: '',
    location: '',
    phone: '',
    email: '',
    rating: 4.0,
    status: 'active' as Contractor['status'],
    website: '',
    notes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.company || !form.email) {
      toast.error('Name, company and email are required')
      return
    }
    onAdd(form)
    setForm({ name: '', company: '', specialty: '', location: '', phone: '', email: '', rating: 4.0, status: 'active', website: '', notes: '' })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg mx-4 bg-background border border-white/12 rounded-2xl shadow-2xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/8">
          <div className="flex items-center gap-3">
            <HardHat size={20} className="text-yellow-400" />
            <h2 className="text-lg font-bold text-white">Add Contractor</h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/60 mb-1.5 block">Full Name *</label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Smith" className="bg-black/40 border-white/20 text-white" />
            </div>
            <div>
              <label className="text-xs text-white/60 mb-1.5 block">Company *</label>
              <Input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Smith Construction LLC" className="bg-black/40 border-white/20 text-white" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/60 mb-1.5 block">Specialty</label>
              <Input value={form.specialty} onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))} placeholder="General Contractor" className="bg-black/40 border-white/20 text-white" />
            </div>
            <div>
              <label className="text-xs text-white/60 mb-1.5 block">Location</label>
              <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Houston, TX" className="bg-black/40 border-white/20 text-white" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/60 mb-1.5 block">Email *</label>
              <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="john@smithconst.com" className="bg-black/40 border-white/20 text-white" />
            </div>
            <div>
              <label className="text-xs text-white/60 mb-1.5 block">Phone</label>
              <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="(555) 123-4567" className="bg-black/40 border-white/20 text-white" />
            </div>
          </div>
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Website</label>
            <Input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://smithconst.com" className="bg-black/40 border-white/20 text-white" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-white/20 text-white/70 hover:bg-white/5">Cancel</Button>
            <Button type="submit" className="flex-1 bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/30">
              <Plus size={16} className="mr-2" /> Add Contractor
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export function ContractorsPage({ onNavigate }: ContractorsPageProps) {
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [search, setSearch] = useState('')
  const [specialty, setSpecialty] = useState('All Specialties')
  const [showAdd, setShowAdd] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getContractors().then(r => {
      setContractors(r.contractors)
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    let list = contractors
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
      )
    }
    if (specialty !== 'All Specialties') {
      list = list.filter(c => c.specialty === specialty)
    }
    return list
  }, [contractors, search, specialty])

  const stats = useMemo(() => ({
    total: contractors.length,
    active: contractors.filter(c => c.status === 'active').length,
    newThisMonth: contractors.filter(c => {
      const d = new Date(c.createdAt)
      if (isNaN(d.getTime())) return false
      const now = new Date()
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length,
    avgRating: contractors.length
      ? (contractors.reduce((sum, c) => sum + c.rating, 0) / contractors.length).toFixed(1)
      : '0.0',
  }), [contractors])

  const handleAdd = async (contractor: Omit<Contractor, 'id' | 'createdAt'>) => {
    const created = await addContractor(contractor)
    setContractors(prev => [created, ...prev])
    setShowAdd(false)
    toast.success(`${contractor.name} added successfully`)
  }

  const handleDelete = async (id: string, name: string) => {
    await deleteContractor(id)
    setContractors(prev => prev.filter(c => c.id !== id))
    toast.success(`${name} removed`)
  }

  const cardStyle = {
    background: 'var(--card)',
    backdropFilter: 'blur(32px) saturate(180%)',
    border: '1px solid rgba(255,255,255,0.08)',
  }

  return (
    <div className="space-y-8">
      <BackButton onBack={() => onNavigate('home')} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Contractor Database</h1>
          <p className="text-white/50 mt-2 text-base">Manage your vetted contractor network</p>
        </div>
        <Button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/30"
        >
          <Plus size={18} />
          Add Contractor
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Contractors', value: stats.total, icon: HardHat, color: 'text-blue-400' },
          { label: 'Active', value: stats.active, icon: CheckCircle, color: 'text-green-400' },
          { label: 'Added This Month', value: stats.newThisMonth, icon: Plus, color: 'text-yellow-400' },
          { label: 'Avg Rating', value: stats.avgRating, icon: Star, color: 'text-amber-400' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <Card style={cardStyle}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <Icon size={20} className={stat.color} />
                    <div>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-white/50">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Filters */}
      <Card style={cardStyle}>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search contractors by name, company, location..."
                className="pl-9 bg-black/40 border-white/20 text-white placeholder:text-white/30"
              />
            </div>
            <select
              value={specialty}
              onChange={e => setSpecialty(e.target.value)}
              className="px-3 py-2 rounded-md bg-black/40 border border-white/20 text-white/70 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500/50"
            >
              {SPECIALTIES.map(s => (
                <option key={s} value={s} className="bg-zinc-900">{s}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card style={cardStyle}>
        <CardHeader className="pb-3 border-b border-white/8">
          <CardTitle className="text-white text-base">
            {filtered.length} contractor{filtered.length !== 1 ? 's' : ''}
            {search || specialty !== 'All Specialties' ? ' (filtered)' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-white/40">
              <HardHat size={32} className="mx-auto mb-3 opacity-30" />
              <p>No contractors found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/8">
                    {['Name & Company', 'Specialty', 'Location', 'Contact', 'Rating', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider px-5 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => (
                    <motion.tr
                      key={c.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-white/5 hover:bg-white/3 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-white">{c.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Buildings size={11} className="text-white/40" />
                          <p className="text-xs text-white/50">{c.company}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-white/70">{c.specialty || '—'}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <MapPin size={12} className="text-white/40" />
                          <span className="text-sm text-white/70">{c.location || '—'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          {c.email && (
                            <div className="flex items-center gap-1">
                              <Envelope size={11} className="text-white/40" />
                              <span className="text-xs text-white/60 truncate max-w-[160px]">{c.email}</span>
                            </div>
                          )}
                          {c.phone && (
                            <div className="flex items-center gap-1">
                              <Phone size={11} className="text-white/40" />
                              <span className="text-xs text-white/60">{c.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <StarRating rating={c.rating} />
                      </td>
                      <td className="px-5 py-4">
                        <Badge className={cn('text-xs border', statusColors[c.status])}>
                          {c.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toast.info(`Editing ${c.name}`)}
                            className="p-1.5 text-white/40 hover:text-white/80 transition-colors rounded"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id, c.name)}
                            className="p-1.5 text-white/40 hover:text-red-400 transition-colors rounded"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddContractorDialog open={showAdd} onClose={() => setShowAdd(false)} onAdd={handleAdd} />
    </div>
  )
}
