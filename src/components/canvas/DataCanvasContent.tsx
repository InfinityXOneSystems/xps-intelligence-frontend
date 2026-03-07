import { Table, ChartBar, MapPin } from '@phosphor-icons/react'
import type { DataCanvasData } from '@/types/canvas'

interface DataCanvasContentProps {
  data: DataCanvasData
}

export function DataCanvasContent({ data }: DataCanvasContentProps) {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center text-muted-foreground space-y-4">
        {data.type === 'table' && (
          <>
            <Table size={64} weight="duotone" className="mx-auto opacity-50" />
            <div>
              <p className="text-sm font-medium">Data Table View</p>
              <p className="text-xs mt-1">Tabular data will be displayed here</p>
            </div>
          </>
        )}
        {data.type === 'chart' && (
          <>
            <ChartBar size={64} weight="duotone" className="mx-auto opacity-50" />
            <div>
              <p className="text-sm font-medium">Data Visualization</p>
              <p className="text-xs mt-1">Interactive charts will appear here</p>
            </div>
          </>
        )}
        {data.type === 'map' && (
          <>
            <MapPin size={64} weight="duotone" className="mx-auto opacity-50" />
            <div>
              <p className="text-sm font-medium">Geographic Map View</p>
              <p className="text-xs mt-1">Location-based data will be visualized here</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
