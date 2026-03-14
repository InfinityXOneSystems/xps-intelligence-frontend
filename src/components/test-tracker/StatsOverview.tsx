import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendUp, TrendDown, Minus } from '@phosphor-icons/react'
import { TestStatistics } from '@/types/test'

interface StatsOverviewProps {
  stats: TestStatistics
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const getTrendIcon = () => {
    if (stats.trend === 'up') {
      return <TrendUp className="text-success" />
    } else if (stats.trend === 'down') {
      return <TrendDown className="text-destructive" />
    }
    return <Minus className="text-muted-foreground" />
  }

  const getTrendText = () => {
    if (stats.trend === 'up') return 'Improving'
    if (stats.trend === 'down') return 'Declining'
    return 'Stable'
  }

  const getTrendColor = () => {
    if (stats.trend === 'up') return 'text-success'
    if (stats.trend === 'down') return 'text-destructive'
    return 'text-muted-foreground'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="hover:shadow-lg transition-all duration-300 border-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-mono animate-count-up">{stats.totalTests}</div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-all duration-300 border-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-mono animate-count-up">{stats.averageScore}%</div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-all duration-300 border-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Score Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-mono animate-count-up">
            {stats.lowestScore} - {stats.highestScore}
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-all duration-300 border-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-3xl">{getTrendIcon()}</div>
            <div className={`text-xl font-semibold ${getTrendColor()}`}>{getTrendText()}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
