import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { wsClient } from '@/lib/websocket'
import type { Lead } from '@/types/lead'

export function useRealtimeLeads() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const handleLeadUpdate = (data: unknown) => {
      const lead = data as Lead
      queryClient.setQueryData(['leads', lead.id], lead)
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    }

    const handleLeadCreate = (data: unknown) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    }

    const handleLeadDelete = (data: unknown) => {
      const { id } = data as { id: string }
      queryClient.removeQueries({ queryKey: ['leads', id] })
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    }

    const handleMetricsUpdate = (data: unknown) => {
      queryClient.setQueryData(['leads', 'metrics'], data)
    }

    try {
      wsClient.connect()
      
      wsClient.on('lead:updated', handleLeadUpdate)
      wsClient.on('lead:created', handleLeadCreate)
      wsClient.on('lead:deleted', handleLeadDelete)
      wsClient.on('metrics:updated', handleMetricsUpdate)
    } catch (error) {
      console.warn('WebSocket connection failed, real-time updates disabled')
    }

    return () => {
      wsClient.off('lead:updated', handleLeadUpdate)
      wsClient.off('lead:created', handleLeadCreate)
      wsClient.off('lead:deleted', handleLeadDelete)
      wsClient.off('metrics:updated', handleMetricsUpdate)
    }
  }, [queryClient])
}
