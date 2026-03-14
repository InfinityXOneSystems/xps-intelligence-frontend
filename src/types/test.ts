export interface TestEntry {
  id: string
  name: string
  score: number
  timestamp: string
  notes?: string
}

export interface TestStatistics {
  totalTests: number
  averageScore: number
  highestScore: number
  lowestScore: number
  trend: 'up' | 'down' | 'stable'
  recentAverage: number
}
