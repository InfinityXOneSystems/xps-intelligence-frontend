import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { TestEntry } from '@/types/test'
import { generateId } from '@/lib/test-utils'

interface TestFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (test: TestEntry) => void
  editTest?: TestEntry | null
}

export function TestFormDialog({ open, onOpenChange, onSubmit, editTest }: TestFormDialogProps) {
  const [name, setName] = useState(editTest?.name || '')
  const [score, setScore] = useState(editTest?.score.toString() || '')
  const [notes, setNotes] = useState(editTest?.notes || '')
  const [errors, setErrors] = useState<{ name?: string; score?: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: { name?: string; score?: string } = {}
    
    if (!name.trim()) {
      newErrors.name = 'Test name is required'
    }
    
    const scoreNum = parseFloat(score)
    if (!score || isNaN(scoreNum)) {
      newErrors.score = 'Score is required'
    } else if (scoreNum < 0 || scoreNum > 100) {
      newErrors.score = 'Score must be between 0 and 100'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const testEntry: TestEntry = {
      id: editTest?.id || generateId(),
      name: name.trim(),
      score: scoreNum,
      timestamp: editTest?.timestamp || new Date().toISOString(),
      notes: notes.trim() || undefined,
    }

    onSubmit(testEntry)
    handleClose()
  }

  const handleClose = () => {
    setName('')
    setScore('')
    setNotes('')
    setErrors({})
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editTest ? 'Edit Test' : 'Add New Test'}</DialogTitle>
          <DialogDescription>
            {editTest ? 'Update the test details below.' : 'Enter test details to track your performance.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="test-name">Test Name</Label>
            <Input
              id="test-name"
              placeholder="e.g., Math Quiz Chapter 5"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors({ ...errors, name: undefined })
              }}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="test-score">Score (0-100)</Label>
            <Input
              id="test-score"
              type="number"
              min="0"
              max="100"
              step="0.1"
              placeholder="85"
              value={score}
              onChange={(e) => {
                setScore(e.target.value)
                if (errors.score) setErrors({ ...errors, score: undefined })
              }}
              className={errors.score ? 'border-destructive' : ''}
            />
            {errors.score && (
              <p className="text-sm text-destructive">{errors.score}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="test-notes">Notes (Optional)</Label>
            <Textarea
              id="test-notes"
              placeholder="Add any additional notes about this test..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editTest ? 'Update Test' : 'Add Test'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
