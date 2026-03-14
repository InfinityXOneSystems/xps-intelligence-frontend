import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="p-8 max-w-md w-full text-center space-y-4">
        <h1 className="text-3xl font-bold">Welcome to Spark</h1>
        <p className="text-muted-foreground">
          Your app is ready to build!
        </p>
        <Button>Get Started</Button>
      </Card>
    </div>
  )
}

export default App
