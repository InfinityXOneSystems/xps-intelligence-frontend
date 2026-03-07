import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { PencilSimple, Trash, UserPlus, Envelope, Phone, MagnifyingGlass } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { Lead, LeadRating } from '@/types/lead'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface LeadsPageProps {
  leads: Lead[]
  onUpdateLead?: (lead: Lead) => void
  onDeleteLead?: (id: string) => void
}

const ratingColors: Record<LeadRating, string> = {
  'A+': 'bg-primary/20 text-primary border-primary/30',
  'A': 'bg-green-500/20 text-green-500 border-green-500/30',
  'B+': 'bg-blue-500/20 text-blue-500 border-blue-500/30',
  'B': 'bg-blue-400/20 text-blue-400 border-blue-400/30',
  'C': 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
  'D': 'bg-red-500/20 text-red-500 border-red-500/30'
}

export function LeadsPage({ leads, onUpdateLead, onDeleteLead }: LeadsPageProps) {
  const [search, setSearch] = useState('')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const filteredLeads = useMemo(() => {
    if (!search) return leads
    const query = search.toLowerCase()
    return leads.filter(
      (lead) =>
        lead.company.toLowerCase().includes(query) ||
        lead.city.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.phone.includes(query)
    )
  }, [leads, search])

  const handleDelete = (id: string) => {
    onDeleteLead?.(id)
    toast.success('Lead deleted successfully')
  }

  const handleGenerateEmail = async (lead: Lead) => {
    toast.info('Generating email...')
    try {
      const prompt = window.spark.llmPrompt`Generate a professional contractor outreach email for:
      
Company: ${lead.company}
City: ${lead.city}
Category: ${lead.category || 'contractor'}

Keep it under 150 words, friendly but professional. Include a compelling subject line.`

      const email = await window.spark.llm(prompt, 'gpt-4o-mini')
      toast.success('Email generated! Check AI chat panel.')
      console.log(email)
    } catch (error) {
      toast.error('Failed to generate email')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your contractor leads
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <MagnifyingGlass
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads..."
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="font-mono text-xs">Company</TableHead>
                <TableHead className="font-mono text-xs">City</TableHead>
                <TableHead className="font-mono text-xs">Phone</TableHead>
                <TableHead className="font-mono text-xs">Email</TableHead>
                <TableHead className="font-mono text-xs">Rating</TableHead>
                <TableHead className="font-mono text-xs text-right">Score</TableHead>
                <TableHead className="font-mono text-xs">Rep</TableHead>
                <TableHead className="font-mono text-xs">Status</TableHead>
                <TableHead className="font-mono text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead, index) => (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={cn(
                    'border-border/50 cursor-pointer transition-all',
                    'hover:bg-muted/30 hover:shadow-[inset_3px_0_0_0_oklch(0.85_0.15_85)]'
                  )}
                  onClick={() => setSelectedLead(lead)}
                >
                  <TableCell className="font-medium">{lead.company}</TableCell>
                  <TableCell className="text-muted-foreground">{lead.city}</TableCell>
                  <TableCell className="font-mono text-sm">{lead.phone}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{lead.email}</TableCell>
                  <TableCell>
                    <Badge className={cn('border font-mono', ratingColors[lead.rating])}>
                      {lead.rating}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-mono text-primary font-semibold">
                      {lead.opportunityScore}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{lead.assignedRep || '—'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleGenerateEmail(lead)
                        }}
                      >
                        <Envelope size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          toast.info(`Calling ${lead.phone}...`)
                        }}
                      >
                        <Phone size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(lead.id)
                        }}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredLeads.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No leads found</p>
          </div>
        )}
      </motion.div>

      <Sheet open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <SheetContent className="glass-card border-l border-border/50 w-[500px]">
          {selectedLead && (
            <>
              <SheetHeader>
                <SheetTitle className="text-2xl">{selectedLead.company}</SheetTitle>
                <SheetDescription>
                  Lead Profile • ID: {selectedLead.id}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase">
                      Rating
                    </label>
                    <Badge className={cn('mt-1 border font-mono', ratingColors[selectedLead.rating])}>
                      {selectedLead.rating}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase">
                      Opportunity Score
                    </label>
                    <p className="text-2xl font-bold text-primary mt-1 font-mono">
                      {selectedLead.opportunityScore}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase">
                      Phone
                    </label>
                    <p className="text-sm font-mono mt-1">{selectedLead.phone}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase">
                      Email
                    </label>
                    <p className="text-sm mt-1">{selectedLead.email}</p>
                  </div>
                  {selectedLead.website && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase">
                        Website
                      </label>
                      <p className="text-sm text-primary mt-1">{selectedLead.website}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase">
                      Location
                    </label>
                    <p className="text-sm mt-1">
                      {selectedLead.city}{selectedLead.state ? `, ${selectedLead.state}` : ''}
                    </p>
                  </div>
                  {selectedLead.category && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase">
                        Category
                      </label>
                      <p className="text-sm mt-1">{selectedLead.category}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase">
                      Status
                    </label>
                    <Badge variant="outline" className="capitalize mt-1">
                      {selectedLead.status}
                    </Badge>
                  </div>
                  {selectedLead.assignedRep && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase">
                        Assigned Rep
                      </label>
                      <p className="text-sm mt-1">{selectedLead.assignedRep}</p>
                    </div>
                  )}
                  {selectedLead.notes && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase">
                        Notes
                      </label>
                      <p className="text-sm mt-1 text-muted-foreground">{selectedLead.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleGenerateEmail(selectedLead)}
                    className="flex-1"
                  >
                    <Envelope size={16} className="mr-2" />
                    Generate Email
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => toast.info(`Calling ${selectedLead.phone}...`)}
                  >
                    <Phone size={16} />
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
