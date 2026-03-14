import { TestEntry, TestStatistics } from '@/types/test'

export function calculateStatistics(tests: TestEntry[]): TestStatistics {
  if (tests.length === 0) {
    return {
      totalTests: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      trend: 'stable',
      recentAverage: 0,
    }
  }

  const scores = tests.map(t => t.score)
  const totalTests = tests.length
  const averageScore = scores.reduce((a, b) => a + b, 0) / totalTests
  const highestScore = Math.max(...scores)
  const lowestScore = Math.min(...scores)

  const recentCount = Math.min(5, totalTests)
  const recentTests = tests.slice(0, recentCount)
  const recentAverage = recentTests.reduce((sum, t) => sum + t.score, 0) / recentCount

  const olderCount = Math.min(5, totalTests - recentCount)
  let trend: 'up' | 'down' | 'stable' = 'stable'
  
  if (olderCount > 0 && totalTests > 5) {
    const olderTests = tests.slice(recentCount, recentCount + olderCount)
    const olderAverage = olderTests.reduce((sum, t) => sum + t.score, 0) / olderCount
    const difference = recentAverage - olderAverage
    
    if (difference > 2) {
      trend = 'up'
    } else if (difference < -2) {
      trend = 'down'
    }
  }

  return {
    totalTests,
    averageScore: Math.round(averageScore * 10) / 10,
    highestScore,
    lowestScore,
    trend,
    recentAverage: Math.round(recentAverage * 10) / 10,
  }
}

export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function getRelativeTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`
  return formatTimestamp(timestamp)
}

export function getScoreColor(score: number): string {
  if (score >= 90) return 'text-success'
  if (score >= 80) return 'text-accent'
  if (score >= 70) return 'text-primary'
  if (score >= 60) return 'text-warning'
  return 'text-destructive'
}

export function getScoreBadgeVariant(score: number): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (score >= 90) return 'default'
  if (score >= 70) return 'secondary'
  if (score >= 60) return 'outline'
  return 'destructive'
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
