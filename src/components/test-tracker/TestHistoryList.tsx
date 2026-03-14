import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Pencil, Trash, Clock } from '@phosphor-icons/react'
import { TestEntry } from '@/types/test'
import { formatTimestamp, getRelativeTime, getScoreColor } from '@/lib/test-utils'
import { useState } from 'react'

interface TestHistoryListProps {
  tests: TestEntry[]
  onEdit: (test: TestEntry) => void
  onDelete: (id: string) => void
}

export function TestHistoryList({ tests, onEdit, onDelete }: TestHistoryListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  if (tests.length === 0) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-2xl font-semibold mb-2">No tests yet</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Start tracking your test performance by adding your first test result above.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {tests.map((test, index) => (
          <Card 
            key={test.id} 
            className="hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 animate-slide-in border-l-4"
            style={{ 
              animationDelay: `${index * 50}ms`,
              borderLeftColor: test.score >= 90 ? 'oklch(0.60 0.20 145)' : test.score >= 70 ? 'oklch(0.62 0.18 200)' : test.score >= 60 ? 'oklch(0.75 0.15 75)' : 'oklch(0.55 0.22 25)'
            }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-1">{test.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-xs">
                    <Clock size={14} />
                    <span>{getRelativeTime(test.timestamp)}</span>
                    <span className="text-muted-foreground/50">•</span>
                    <span>{formatTimestamp(test.timestamp)}</span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(test)}
                    className="hover:bg-accent/10"
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(test.id)}
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground mb-1">Score</div>
                  <div className={`text-4xl font-bold font-mono ${getScoreColor(test.score)}`}>
                    {test.score}%
                  </div>
                </div>
                {test.score >= 90 && (
                  <Badge className="bg-success text-success-foreground">Excellent</Badge>
                )}
                {test.score >= 80 && test.score < 90 && (
                  <Badge className="bg-accent text-accent-foreground">Great</Badge>
                )}
                {test.score >= 70 && test.score < 80 && (
                  <Badge variant="secondary">Good</Badge>
                )}
                {test.score >= 60 && test.score < 70 && (
                  <Badge variant="outline" className="border-warning text-warning">Fair</Badge>
                )}
                {test.score < 60 && (
                  <Badge variant="destructive">Needs Work</Badge>
                )}
              </div>
              {test.notes && (
                <div className="pt-2 border-t">
                  <div className="text-sm text-muted-foreground mb-1">Notes</div>
                  <p className="text-sm">{test.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Test?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the test entry from your history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  onDelete(deleteId)
                  setDeleteId(null)
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
