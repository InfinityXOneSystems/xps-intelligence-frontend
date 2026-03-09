import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MagnifyingGlass,
  FunnelSimple,
  Phone,
  Envelope,
  Globe,
  Star,
  Buildings,
  MapPin,
  Tag,
  ArrowsDownUp,
  SquaresFour,
  Rows,
  Table,
  X,
  CheckSquare,
  Square,
  Export,
  CaretDown,
  CaretUp,
  ArrowsClockwise,
  Clock,
  Note,
  ChartBar,
  Warning,
  SlidersHorizontal,
  User,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { BackButton } from '@/components/BackButton'
import { toast } from 'sonner'
import type { Contractor, ContractorLeadStatus, ContractorViewMode } from '@/types/contractor'
import {
  LEAD_STATUS_LABELS,
  LEAD_STATUS_COLORS,
} from '@/types/contractor'
import {
  useContractors,
  useContractorFilters,
  useFilteredContractors,
  ALL_INDUSTRIES,
  ALL_DATA_SOURCES,
  ALL_STATES,
} from '@/hooks/useContractors'

interface ContractorsPageProps {
  onNavigate: (page: string) => void
}

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={12}
          weight={i < Math.round(value) ? 'fill' : 'regular'}
          className={i < Math.round(value) ? 'text-yellow-400' : 'text-muted-foreground/40'}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground font-mono">{value.toFixed(1)}</span>
    </span>
  )
}

// ─── Lead Score Bar ───────────────────────────────────────────────────────────

function LeadScoreBar({ score }: { score: number }) {
  const color =
    score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-yellow-500' : score >= 40 ? 'bg-orange-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full', color)} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-mono font-semibold">{score}</span>
    </div>
  )
}

// ─── Lead Status Badge ────────────────────────────────────────────────────────

function LeadStatusBadge({ status }: { status: ContractorLeadStatus }) {
  return (
    <Badge className={cn('border text-xs capitalize', LEAD_STATUS_COLORS[status])}>
      {LEAD_STATUS_LABELS[status]}
    </Badge>
  )
}

// ─── Filter Sidebar ───────────────────────────────────────────────────────────

interface FilterSidebarProps {
  filters: ReturnType<typeof useContractorFilters>['filters']
  updateFilter: ReturnType<typeof useContractorFilters>['updateFilter']
  resetFilters: () => void
  totalCount: number
  filteredCount: number
}

function FilterSidebar({
  filters,
  updateFilter,
  resetFilters,
  totalCount,
  filteredCount,
}: FilterSidebarProps) {
  const toggleArrayFilter = <K extends 'industries' | 'states' | 'priceRanges' | 'leadStatuses' | 'dataSources' | 'tags'>(
    key: K,
    value: string
  ) => {
    const current = filters[key] as string[]
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    updateFilter(key, next as never)
  }

  const hasActiveFilters =
    filters.search ||
    filters.industries.length > 0 ||
    filters.states.length > 0 ||
    filters.minRating > 0 ||
    filters.maxRating < 5 ||
    filters.priceRanges.length > 0 ||
    filters.leadStatuses.length > 0 ||
    filters.minLeadScore > 0 ||
    filters.maxLeadScore < 100 ||
    filters.dataSources.length > 0 ||
    filters.verifiedOnly

  return (
    <div className="w-64 flex-shrink-0 border-r border-border/40 flex flex-col h-full">
      <div className="p-4 border-b border-border/40">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-primary" />
            <span className="text-sm font-semibold">Filters</span>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={resetFilters}>
              Reset
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Showing {filteredCount} of {totalCount}
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Industry */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Industry / Trade
            </h4>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {ALL_INDUSTRIES.slice(0, 12).map((ind) => (
                <label key={ind} className="flex items-center gap-2 cursor-pointer group">
                  <Checkbox
                    checked={filters.industries.includes(ind)}
                    onCheckedChange={() => toggleArrayFilter('industries', ind)}
                    className="h-3.5 w-3.5"
                  />
                  <span className="text-xs group-hover:text-foreground transition-colors">
                    {ind}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <Separator className="opacity-40" />

          {/* Rating */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Min Rating
            </h4>
            <div className="px-1">
              <Slider
                min={0}
                max={5}
                step={0.5}
                value={[filters.minRating]}
                onValueChange={([v]) => updateFilter('minRating', v)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0</span>
                <span className="text-primary font-semibold">{filters.minRating}+</span>
                <span>5</span>
              </div>
            </div>
          </div>

          <Separator className="opacity-40" />

          {/* Lead Score */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Lead Score
            </h4>
            <div className="px-1">
              <Slider
                min={0}
                max={100}
                step={5}
                value={[filters.minLeadScore, filters.maxLeadScore]}
                onValueChange={([min, max]) => {
                  updateFilter('minLeadScore', min)
                  updateFilter('maxLeadScore', max)
                }}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{filters.minLeadScore}</span>
                <span>{filters.maxLeadScore}</span>
              </div>
            </div>
          </div>

          <Separator className="opacity-40" />

          {/* Lead Status */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Lead Status
            </h4>
            <div className="space-y-1.5">
              {(Object.keys(LEAD_STATUS_LABELS) as ContractorLeadStatus[]).map((status) => (
                <label key={status} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={filters.leadStatuses.includes(status)}
                    onCheckedChange={() => toggleArrayFilter('leadStatuses', status)}
                    className="h-3.5 w-3.5"
                  />
                  <LeadStatusBadge status={status} />
                </label>
              ))}
            </div>
          </div>

          <Separator className="opacity-40" />

          {/* Price Range */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Price Range
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['$', '$$', '$$$', '$$$$'].map((range) => (
                <button
                  key={range}
                  onClick={() => toggleArrayFilter('priceRanges', range)}
                  className={cn(
                    'px-2 py-1 rounded text-xs font-mono border transition-colors',
                    filters.priceRanges.includes(range)
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'border-border/40 text-muted-foreground hover:border-border'
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <Separator className="opacity-40" />

          {/* Data Source */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Data Source
            </h4>
            <div className="space-y-1.5">
              {ALL_DATA_SOURCES.map((src) => (
                <label key={src} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={filters.dataSources.includes(src)}
                    onCheckedChange={() => toggleArrayFilter('dataSources', src)}
                    className="h-3.5 w-3.5"
                  />
                  <span className="text-xs capitalize">{src.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator className="opacity-40" />

          {/* State */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              State
            </h4>
            <div className="flex flex-wrap gap-1">
              {ALL_STATES.slice(0, 20).map((s) => (
                <button
                  key={s}
                  onClick={() => toggleArrayFilter('states', s)}
                  className={cn(
                    'px-1.5 py-0.5 rounded text-xs font-mono border transition-colors',
                    filters.states.includes(s)
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'border-border/40 text-muted-foreground hover:border-border'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <Separator className="opacity-40" />

          {/* Verified Only */}
          <div className="flex items-center gap-2">
            <Switch
              checked={filters.verifiedOnly}
              onCheckedChange={(v) => updateFilter('verifiedOnly', v)}
              id="verified-only"
            />
            <Label htmlFor="verified-only" className="text-xs cursor-pointer">
              Verified contacts only
            </Label>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

// ─── Contractor Detail Sheet ──────────────────────────────────────────────────

function ContractorDetailSheet({
  contractor,
  onClose,
  onStatusChange,
}: {
  contractor: Contractor | null
  onClose: () => void
  onStatusChange: (id: string, status: ContractorLeadStatus) => void
}) {
  if (!contractor) return null

  const formatSource = (s: string) => s.replace('_', ' ').toUpperCase()

  return (
    <Sheet open={!!contractor} onOpenChange={onClose}>
      <SheetContent className="glass-card border-l border-border/50 w-[520px] p-0 flex flex-col">
        <SheetHeader className="p-6 border-b border-border/40">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-xl leading-tight truncate">
                {contractor.name}
              </SheetTitle>
              <SheetDescription className="mt-1">
                {contractor.industry.join(' · ')} · ID: {contractor.id}
              </SheetDescription>
            </div>
            <LeadStatusBadge status={contractor.lead_status} />
          </div>

          <div className="flex items-center gap-4 mt-3">
            <StarRating value={contractor.rating.average} />
            <span className="text-xs text-muted-foreground">
              {contractor.review_count} reviews
            </span>
            <LeadScoreBar score={contractor.lead_score} />
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Quick actions */}
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 gap-1.5"
                onClick={() => {
                  toast.info(`Calling ${contractor.phone}…`)
                }}
              >
                <Phone size={14} />
                Call
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 gap-1.5"
                onClick={() => {
                  toast.info('Opening email compose…')
                }}
              >
                <Envelope size={14} />
                Email
              </Button>
              {contractor.website && (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  onClick={() => window.open(contractor.website, '_blank')}
                >
                  <Globe size={14} />
                  Site
                </Button>
              )}
            </div>

            {/* Status change */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Update Status
              </label>
              <Select
                value={contractor.lead_status}
                onValueChange={(v) => onStatusChange(contractor.id, v as ContractorLeadStatus)}
              >
                <SelectTrigger className="mt-1.5 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(LEAD_STATUS_LABELS) as [ContractorLeadStatus, string][]).map(
                    ([val, label]) => (
                      <SelectItem key={val} value={val}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Contact info */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Contact Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-muted-foreground flex-shrink-0" />
                  <span className="font-mono">{contractor.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Envelope size={14} className="text-muted-foreground flex-shrink-0" />
                  <span className="text-primary">{contractor.email}</span>
                </div>
                {contractor.website && (
                  <div className="flex items-center gap-2">
                    <Globe size={14} className="text-muted-foreground flex-shrink-0" />
                    <a
                      href={contractor.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline truncate"
                    >
                      {contractor.website}
                    </a>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{contractor.office_address}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock size={14} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{contractor.hours_of_operation}</span>
                </div>
              </div>
            </div>

            <Separator className="opacity-40" />

            {/* Business info */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Business Info
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground">Type</span>
                  <p className="font-medium">{contractor.business_type}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Years Active</span>
                  <p className="font-medium">{contractor.years_in_business} yrs</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Employees</span>
                  <p className="font-medium">{contractor.employee_count}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Est. Revenue</span>
                  <p className="font-medium text-primary">{contractor.estimated_revenue}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Price Range</span>
                  <p className="font-mono font-bold">{contractor.price_range}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Credit</span>
                  <p className="font-medium">{contractor.credit_rating}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">License #</span>
                  <p className="font-mono text-xs">{contractor.license_number}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Service Radius</span>
                  <p className="font-medium">{contractor.service_radius} mi</p>
                </div>
              </div>
            </div>

            <Separator className="opacity-40" />

            {/* Ratings breakdown */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Ratings
              </h3>
              <div className="space-y-2">
                {(['google', 'yelp', 'bbb', 'trustpilot'] as const).map((platform) => {
                  const val = contractor.rating[platform]
                  if (!val) return null
                  return (
                    <div key={platform} className="flex items-center justify-between text-sm">
                      <span className="capitalize text-muted-foreground w-20">{platform}</span>
                      <StarRating value={val} />
                    </div>
                  )
                })}
              </div>
            </div>

            <Separator className="opacity-40" />

            {/* Services */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Services Offered
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {contractor.services_offered.map((s) => (
                  <Badge key={s} variant="secondary" className="text-xs">
                    {s}
                  </Badge>
                ))}
              </div>
              {contractor.certifications.length > 0 && (
                <div className="mt-3">
                  <span className="text-xs text-muted-foreground">Certifications: </span>
                  <span className="text-xs">{contractor.certifications.join(', ')}</span>
                </div>
              )}
            </div>

            {/* Service areas */}
            {contractor.service_areas.length > 0 && (
              <>
                <Separator className="opacity-40" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Service Areas
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {contractor.service_areas.map((a) => (
                      <Badge key={a} variant="outline" className="text-xs">
                        {a}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Tags */}
            {contractor.tags.length > 0 && (
              <>
                <Separator className="opacity-40" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {contractor.tags.map((t) => (
                      <Badge
                        key={t}
                        className="text-xs bg-primary/10 text-primary border-primary/20"
                      >
                        <Tag size={10} className="mr-1" />
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Notes */}
            {contractor.notes && (
              <>
                <Separator className="opacity-40" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Notes
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{contractor.notes}</p>
                </div>
              </>
            )}

            {/* Contact history */}
            {contractor.contact_history.length > 0 && (
              <>
                <Separator className="opacity-40" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    Contact History
                  </h3>
                  <div className="space-y-3">
                    {contractor.contact_history.map((rec) => (
                      <div
                        key={rec.id}
                        className="rounded-lg border border-border/40 p-3 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs capitalize">
                            {rec.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{rec.date}</span>
                        </div>
                        <p className="text-xs font-medium">{rec.subject}</p>
                        <p className="text-xs text-muted-foreground">{rec.notes}</p>
                        {rec.duration && (
                          <p className="text-xs text-muted-foreground">{rec.duration} min</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Metadata */}
            <Separator className="opacity-40" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Metadata
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>
                  <span>Source: </span>
                  <span className="capitalize">{formatSource(contractor.data_source)}</span>
                </div>
                <div>
                  <span>Confidence: </span>
                  <span className="font-mono text-primary">{contractor.confidence_score}%</span>
                </div>
                <div>
                  <span>Scraped: </span>
                  <span>{contractor.scraped_at}</span>
                </div>
                <div>
                  <span>Website Score: </span>
                  <span className="font-mono">{contractor.website_quality_score}</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

// ─── Contractor Card (Card View) ──────────────────────────────────────────────

function ContractorCard({
  contractor,
  selected,
  onSelect,
  onOpen,
}: {
  contractor: Contractor
  selected: boolean
  onSelect: (id: string) => void
  onOpen: (c: Contractor) => void
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'glass-card rounded-xl border p-4 space-y-3 cursor-pointer transition-all relative',
        selected ? 'border-primary/60 bg-primary/5' : 'border-border/40 hover:border-border/80'
      )}
      onClick={() => onOpen(contractor)}
    >
      {/* Checkbox */}
      <div
        className="absolute top-3 right-3"
        onClick={(e) => {
          e.stopPropagation()
          onSelect(contractor.id)
        }}
      >
        <Checkbox checked={selected} className="h-3.5 w-3.5" />
      </div>

      {/* Header */}
      <div className="pr-6">
        <h3 className="font-semibold text-sm leading-tight line-clamp-1">{contractor.name}</h3>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
          {contractor.industry.join(', ')}
        </p>
      </div>

      {/* Rating + Score */}
      <div className="flex items-center justify-between">
        <StarRating value={contractor.rating.average} />
        <LeadScoreBar score={contractor.lead_score} />
      </div>

      {/* Contact */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Phone size={11} />
          <span className="font-mono">{contractor.phone}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
          <MapPin size={11} className="flex-shrink-0" />
          <span className="truncate">{contractor.office_address}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <LeadStatusBadge status={contractor.lead_status} />
        <span className="text-xs font-mono text-muted-foreground">{contractor.price_range}</span>
      </div>
    </motion.div>
  )
}

// ─── Sort Icon helper ─────────────────────────────────────────────────────────

function SortIcon({ sortKey, activeKey, sortDir }: { sortKey: SortKey; activeKey: SortKey; sortDir: SortDir }) {
  if (sortKey !== activeKey) return <ArrowsDownUp size={12} className="text-muted-foreground/40" />
  return sortDir === 'asc'
    ? <CaretUp size={12} className="text-primary" />
    : <CaretDown size={12} className="text-primary" />
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type SortKey = 'name' | 'rating' | 'lead_score' | 'scraped_at' | 'review_count'
type SortDir = 'asc' | 'desc'

export function ContractorsPage({ onNavigate }: ContractorsPageProps) {
  const allContractors = useContractors()
  const { filters, updateFilter, resetFilters } = useContractorFilters()
  const filtered = useFilteredContractors(allContractors, filters)

  const [viewMode, setViewMode] = useState<ContractorViewMode>('list')
  const [showFilters, setShowFilters] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('lead_score')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 50

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av: number | string = 0
      let bv: number | string = 0
      if (sortKey === 'name') { av = a.name; bv = b.name }
      else if (sortKey === 'rating') { av = a.rating.average; bv = b.rating.average }
      else if (sortKey === 'lead_score') { av = a.lead_score; bv = b.lead_score }
      else if (sortKey === 'review_count') { av = a.review_count; bv = b.review_count }
      else if (sortKey === 'scraped_at') { av = a.scraped_at; bv = b.scraped_at }
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      }
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number)
    })
  }, [filtered, sortKey, sortDir])

  const paginated = useMemo(
    () => sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sorted, page]
  )

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  // Selection
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const selectAll = () => setSelectedIds(new Set(paginated.map((c) => c.id)))
  const clearSelection = () => setSelectedIds(new Set())
  const allSelected = paginated.length > 0 && paginated.every((c) => selectedIds.has(c.id))

  // Bulk actions
  const handleBulkStatusUpdate = (status: ContractorLeadStatus) => {
    toast.success(`Updated ${selectedIds.size} contractors to "${LEAD_STATUS_LABELS[status]}"`)
    clearSelection()
  }

  const handleExportCSV = () => {
    const rows = (selectedIds.size > 0 ? sorted.filter((c) => selectedIds.has(c.id)) : sorted)
    const header = 'Name,Industry,Phone,Email,City,Rating,Lead Score,Status,Revenue'
    const lines = rows.map((c) =>
      [
        `"${c.name}"`,
        `"${c.industry.join('; ')}"`,
        c.phone,
        c.email,
        `"${c.office_address}"`,
        c.rating.average.toFixed(1),
        c.lead_score,
        c.lead_status,
        c.estimated_revenue,
      ].join(',')
    )
    const csv = [header, ...lines].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'contractors.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`Exported ${rows.length} contractors`)
  }

  const handleStatusChange = (id: string, status: ContractorLeadStatus) => {
    toast.success(`Status updated to ${LEAD_STATUS_LABELS[status]}`)
    if (selectedContractor?.id === id) {
      setSelectedContractor((prev) => prev ? { ...prev, lead_status: status } : null)
    }
  }

  // Stats
  const stats = useMemo(() => ({
    total: allContractors.length,
    new: allContractors.filter((c) => c.lead_status === 'new').length,
    active: allContractors.filter((c) => ['contacted', 'interested', 'qualified', 'proposal', 'negotiating'].includes(c.lead_status)).length,
    won: allContractors.filter((c) => c.lead_status === 'won').length,
    avgScore: Math.round(allContractors.reduce((s, c) => s + c.lead_score, 0) / allContractors.length),
  }), [allContractors])

  return (
    <div className="flex flex-col h-full min-h-0 space-y-4">
      <BackButton onBack={() => onNavigate('home')} />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Contractor Database</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Enterprise contractor intelligence & lead management
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 flex-wrap">
          {[
            { label: 'Total', value: stats.total, icon: Buildings },
            { label: 'New', value: stats.new, icon: ArrowsClockwise },
            { label: 'Active', value: stats.active, icon: User },
            { label: 'Won', value: stats.won, icon: ChartBar },
            { label: 'Avg Score', value: stats.avgScore, icon: Star },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="glass-card rounded-lg border border-border/40 px-3 py-2 flex items-center gap-2"
            >
              <Icon size={14} className="text-primary" />
              <div>
                <p className="text-xs text-muted-foreground leading-none">{label}</p>
                <p className="text-sm font-bold font-mono leading-tight">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-48 max-w-sm">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            placeholder="Search name, phone, email, service…"
            className="pl-9 h-9 text-sm"
          />
          {filters.search && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => updateFilter('search', '')}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Toggle filters */}
        <Button
          variant={showFilters ? 'default' : 'outline'}
          size="sm"
          className="gap-1.5 h-9"
          onClick={() => setShowFilters((v) => !v)}
        >
          <FunnelSimple size={14} />
          Filters
        </Button>

        {/* Sort */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 h-9">
              <ArrowsDownUp size={14} />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {([
              ['lead_score', 'Lead Score'],
              ['rating', 'Rating'],
              ['name', 'Name'],
              ['review_count', 'Reviews'],
              ['scraped_at', 'Scraped Date'],
            ] as [SortKey, string][]).map(([key, label]) => (
              <DropdownMenuItem key={key} onClick={() => toggleSort(key)} className="gap-2">
                <SortIcon sortKey={sortKey} activeKey={key} sortDir={sortDir} />
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View mode */}
        <div className="flex items-center border border-border/40 rounded-md overflow-hidden">
          {([
            ['list', Rows],
            ['card', SquaresFour],
            ['table', Table],
          ] as [ContractorViewMode, typeof Rows][]).map(([mode, Icon]) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                'px-2.5 py-1.5 transition-colors',
                viewMode === mode
                  ? 'bg-primary/20 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>

        {/* Export */}
        <Button variant="outline" size="sm" className="gap-1.5 h-9 ml-auto" onClick={handleExportCSV}>
          <Export size={14} />
          Export CSV
        </Button>
      </div>

      {/* Bulk actions bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-primary/30 bg-primary/5"
          >
            <CheckSquare size={16} className="text-primary" />
            <span className="text-sm font-medium">
              {selectedIds.size} selected
            </span>
            <Separator orientation="vertical" className="h-5 opacity-40" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                  Update Status <CaretDown size={11} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {(Object.entries(LEAD_STATUS_LABELS) as [ContractorLeadStatus, string][]).map(
                  ([val, label]) => (
                    <DropdownMenuItem key={val} onClick={() => handleBulkStatusUpdate(val)}>
                      {label}
                    </DropdownMenuItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={handleExportCSV}
            >
              <Export size={11} />
              Export
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs ml-auto"
              onClick={clearSelection}
            >
              Clear
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main layout */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Filter sidebar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 256 }}
              exit={{ opacity: 0, x: -20, width: 0 }}
              className="flex-shrink-0 overflow-hidden"
            >
              <div className="glass-card rounded-xl border border-border/40 h-full overflow-hidden flex flex-col" style={{ minHeight: 400 }}>
                <FilterSidebar
                  filters={filters}
                  updateFilter={updateFilter}
                  resetFilters={resetFilters}
                  totalCount={allContractors.length}
                  filteredCount={filtered.length}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content area */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* Select all / count */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <button
              onClick={allSelected ? clearSelection : selectAll}
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              {allSelected ? (
                <CheckSquare size={14} className="text-primary" />
              ) : (
                <Square size={14} />
              )}
              <span className="text-xs">Select all</span>
            </button>
            <span className="text-xs">
              {sorted.length} contractor{sorted.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Empty state */}
          {sorted.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Warning size={40} className="text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground">No contractors match your filters.</p>
              <Button variant="ghost" size="sm" className="mt-2" onClick={resetFilters}>
                Reset filters
              </Button>
            </div>
          )}

          {/* List view */}
          {viewMode === 'list' && sorted.length > 0 && (
            <div className="space-y-2">
              {paginated.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className={cn(
                    'glass-card rounded-xl border px-4 py-3 flex items-center gap-4 cursor-pointer transition-all',
                    selectedIds.has(c.id)
                      ? 'border-primary/60 bg-primary/5'
                      : 'border-border/40 hover:border-border/80'
                  )}
                  onClick={() => setSelectedContractor(c)}
                >
                  {/* Checkbox */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSelect(c.id)
                    }}
                  >
                    <Checkbox checked={selectedIds.has(c.id)} className="h-3.5 w-3.5" />
                  </div>

                  {/* Name + industry */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{c.name}</span>
                      <LeadStatusBadge status={c.lead_status} />
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {c.industry.join(', ')} · {c.office_address}
                    </p>
                  </div>

                  {/* Contact */}
                  <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="font-mono">{c.phone}</span>
                    <span className="max-w-[140px] truncate">{c.email}</span>
                  </div>

                  {/* Rating */}
                  <div className="hidden lg:block">
                    <StarRating value={c.rating.average} />
                  </div>

                  {/* Score */}
                  <div className="hidden lg:block">
                    <LeadScoreBar score={c.lead_score} />
                  </div>

                  {/* Price + revenue */}
                  <div className="hidden xl:flex flex-col items-end text-xs">
                    <span className="font-mono font-bold">{c.price_range}</span>
                    <span className="text-muted-foreground">{c.estimated_revenue}</span>
                  </div>

                  {/* Actions */}
                  <div
                    className="flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => toast.info(`Calling ${c.phone}…`)}
                    >
                      <Phone size={13} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => toast.info('Opening email compose…')}
                    >
                      <Envelope size={13} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setSelectedContractor(c)}
                    >
                      <Note size={13} />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Card view */}
          {viewMode === 'card' && sorted.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {paginated.map((c) => (
                <ContractorCard
                  key={c.id}
                  contractor={c}
                  selected={selectedIds.has(c.id)}
                  onSelect={toggleSelect}
                  onOpen={setSelectedContractor}
                />
              ))}
            </div>
          )}

          {/* Table view */}
          {viewMode === 'table' && sorted.length > 0 && (
            <div className="glass-card rounded-xl border border-border/40 overflow-hidden">
              <div className="overflow-x-auto">
                <UITable>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border/50">
                      <TableHead className="w-8">
                        <button onClick={allSelected ? clearSelection : selectAll}>
                          {allSelected ? (
                            <CheckSquare size={14} className="text-primary" />
                          ) : (
                            <Square size={14} />
                          )}
                        </button>
                      </TableHead>
                      <TableHead
                        className="font-mono text-xs cursor-pointer hover:text-foreground"
                        onClick={() => toggleSort('name')}
                      >
                        <span className="flex items-center gap-1">Company <SortIcon sortKey={sortKey} activeKey="name" sortDir={sortDir} /></span>
                      </TableHead>
                      <TableHead className="font-mono text-xs">Industry</TableHead>
                      <TableHead className="font-mono text-xs">Phone</TableHead>
                      <TableHead className="font-mono text-xs">Email</TableHead>
                      <TableHead
                        className="font-mono text-xs cursor-pointer hover:text-foreground"
                        onClick={() => toggleSort('rating')}
                      >
                        <span className="flex items-center gap-1">Rating <SortIcon sortKey={sortKey} activeKey="rating" sortDir={sortDir} /></span>
                      </TableHead>
                      <TableHead
                        className="font-mono text-xs text-right cursor-pointer hover:text-foreground"
                        onClick={() => toggleSort('lead_score')}
                      >
                        <span className="flex items-center justify-end gap-1">Score <SortIcon sortKey={sortKey} activeKey="lead_score" sortDir={sortDir} /></span>
                      </TableHead>
                      <TableHead className="font-mono text-xs">Status</TableHead>
                      <TableHead className="font-mono text-xs">Revenue</TableHead>
                      <TableHead className="font-mono text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map((c, i) => (
                      <motion.tr
                        key={c.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className={cn(
                          'border-border/50 cursor-pointer transition-all',
                          'hover:bg-muted/30',
                          selectedIds.has(c.id) && 'bg-primary/5'
                        )}
                        onClick={() => setSelectedContractor(c)}
                      >
                        <TableCell
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleSelect(c.id)
                          }}
                        >
                          <Checkbox checked={selectedIds.has(c.id)} className="h-3.5 w-3.5" />
                        </TableCell>
                        <TableCell className="font-medium text-sm">{c.name}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {c.industry[0]}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{c.phone}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{c.email}</TableCell>
                        <TableCell>
                          <StarRating value={c.rating.average} />
                        </TableCell>
                        <TableCell className="text-right">
                          <LeadScoreBar score={c.lead_score} />
                        </TableCell>
                        <TableCell>
                          <LeadStatusBadge status={c.lead_status} />
                        </TableCell>
                        <TableCell className="text-xs font-mono text-primary">
                          {c.estimated_revenue}
                        </TableCell>
                        <TableCell className="text-right">
                          <div
                            className="flex items-center justify-end gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => toast.info(`Calling ${c.phone}…`)}
                            >
                              <Phone size={13} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => toast.info('Opening email compose…')}
                            >
                              <Envelope size={13} />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </UITable>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </Button>
              <span className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Detail sheet */}
      <ContractorDetailSheet
        contractor={selectedContractor}
        onClose={() => setSelectedContractor(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}

// Re-export Skeleton for use in App.tsx loading state
export function ContractorsPageSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-full" />
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}
