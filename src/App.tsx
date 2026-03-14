import { useState, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Plus } from '@phosphor-icons/react'
import { TestEntry } from '@/types/test'
import { calculateStatistics } from '@/lib/test-utils'
import { StatsOverview } from '@/components/test-tracker/StatsOverview'
import { TrendChart } from '@/components/test-tracker/TrendChart'
import { TestHistoryList } from '@/components/test-tracker/TestHistoryList'
import { TestFormDialog } from '@/components/test-tracker/TestFormDialog'
import { FilterSearch } from '@/components/test-tracker/FilterSearch'

function App() {
  const [tests, setTests] = useKV<TestEntry[]>('test-history', [])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTest, setEditingTest] = useState<TestEntry | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const sortedTests = useMemo(() => {
    if (!tests) return []
    return [...tests].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }, [tests])

  const filteredTests = useMemo(() => {
    if (!searchQuery.trim()) return sortedTests
    
    const query = searchQuery.toLowerCase()
    return sortedTests.filter(test => 
      test.name.toLowerCase().includes(query)
    )
  }, [sortedTests, searchQuery])

  const stats = useMemo(() => calculateStatistics(sortedTests), [sortedTests])

  const handleAddTest = (test: TestEntry) => {
    setTests((currentTests) => [...(currentTests || []), test])
    toast.success('Test added successfully', {
      description: `${test.name}: ${test.score}%`,
    })
  }

  const handleEditTest = (test: TestEntry) => {
    setTests((currentTests) =>
      (currentTests || []).map(t => t.id === test.id ? test : t)
    )
    setEditingTest(null)
    toast.success('Test updated successfully')
  }

  const handleDeleteTest = (id: string) => {
    const test = (tests || []).find(t => t.id === id)
    setTests((currentTests) => (currentTests || []).filter(t => t.id !== id))
    toast.success('Test deleted', {
      description: test ? `${test.name} removed from history` : undefined,
    })
  }

  const openEditDialog = (test: TestEntry) => {
    setEditingTest(test)
    setDialogOpen(true)
  }

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      setEditingTest(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.62_0.18_200_/_0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,oklch(0.45_0.15_250_/_0.06),transparent_50%)] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-6 py-12 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Test History Tracker
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your test performance and monitor progress over time
          </p>
        </div>

        <StatsOverview stats={stats} />

        <TrendChart tests={sortedTests} />

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 w-full sm:max-w-md">
              <FilterSearch 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>
            <Button 
              onClick={() => setDialogOpen(true)}
              size="lg"
              className="w-full sm:w-auto hover:scale-105 transition-transform"
            >
              <Plus className="mr-2" />
              Add Test
            </Button>
          </div>

          {searchQuery && (
            <div className="text-sm text-muted-foreground">
              Showing {filteredTests.length} of {(tests || []).length} test{(tests || []).length !== 1 ? 's' : ''}
            </div>
          )}

          <TestHistoryList 
            tests={filteredTests}
            onEdit={openEditDialog}
            onDelete={handleDeleteTest}
          />
        </div>

        <TestFormDialog
          open={dialogOpen}
          onOpenChange={handleDialogClose}
          onSubmit={editingTest ? handleEditTest : handleAddTest}
          editTest={editingTest}
        />

        <Toaster position="top-right" />
      </div>
    </div>
  )
}

export default App
