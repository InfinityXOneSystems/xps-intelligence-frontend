export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="glass-card p-12 rounded-lg text-center">
        <p className="text-lg text-muted-foreground">
          This feature is coming soon
        </p>
      </div>
    </div>
  )
}
