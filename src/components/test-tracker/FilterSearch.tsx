import { Input } from '@/components/ui/input'
import { MagnifyingGlass } from '@phosphor-icons/react'

interface FilterSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function FilterSearch({ searchQuery, onSearchChange }: FilterSearchProps) {
  return (
    <div className="relative">
      <MagnifyingGlass 
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
        size={20}
      />
      <Input
        placeholder="Search tests by name..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  )
}
