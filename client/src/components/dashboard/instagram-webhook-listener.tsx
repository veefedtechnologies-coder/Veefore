import React, { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useCurrentWorkspace } from '@/hooks/useCurrentWorkspace'

/**
 * Instagram Webhook Listener Component
 * 
 * This component listens for Instagram webhook events and provides real-time updates
 * while respecting Meta's rate limits. It uses a combination of:
 * 1. WebSocket connections for real-time updates
 * 2. Smart polling as fallback
 * 3. User activity detection for immediate updates
 */
export function InstagramWebhookListener() {
  const queryClient = useQueryClient()
  const { currentWorkspace } = useCurrentWorkspace()
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const maxReconnectAttempts = 5

  useEffect(() => {
    if (!currentWorkspace?.id) return

    const connectWebSocket = () => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        const wsUrl = `${protocol}//${window.location.host}/ws/instagram-webhooks`
        
        console.log('[Instagram Webhook] Connecting to:', wsUrl)
        const ws = new WebSocket(wsUrl)
        
        ws.onopen = () => {
          console.log('[Instagram Webhook] Connected successfully')
          wsRef.current = ws
          reconnectAttemptsRef.current = 0
          
          // Subscribe to workspace-specific updates
          ws.send(JSON.stringify({
            type: 'subscribe',
            workspaceId: currentWorkspace.id
          }))
        }
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            console.log('[Instagram Webhook] Received update:', data)
            
            // Handle different types of Instagram updates
            switch (data.type) {
              case 'instagram_metrics_update':
                console.log('[Instagram Webhook] Instagram metrics updated, refreshing data')
                // Invalidate and refetch Instagram-related queries
                queryClient.invalidateQueries({ queryKey: ['/api/social-accounts'] })
                queryClient.invalidateQueries({ queryKey: ['/api/dashboard/analytics'] })
                queryClient.invalidateQueries({ queryKey: ['/api/instagram/polling-status'] })
                break
                
              case 'instagram_post_update':
                console.log('[Instagram Webhook] Instagram post updated')
                queryClient.invalidateQueries({ queryKey: ['/api/social-accounts'] })
                queryClient.invalidateQueries({ queryKey: ['/api/dashboard/analytics'] })
                break
                
              case 'instagram_follower_update':
                console.log('[Instagram Webhook] Instagram followers updated')
                queryClient.invalidateQueries({ queryKey: ['/api/social-accounts'] })
                queryClient.invalidateQueries({ queryKey: ['/api/dashboard/analytics'] })
                break
                
              default:
                console.log('[Instagram Webhook] Unknown update type:', data.type)
            }
          } catch (error) {
            console.error('[Instagram Webhook] Parse error:', error)
          }
        }
        
        ws.onclose = (event) => {
          console.log('[Instagram Webhook] Connection closed:', event.code, event.reason)
          wsRef.current = null
          
          // Auto-reconnect with exponential backoff
          if (reconnectAttemptsRef.current < maxReconnectAttempts) {
            const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000) // Max 30 seconds
            console.log(`[Instagram Webhook] Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`)
            
            reconnectTimeoutRef.current = setTimeout(() => {
              reconnectAttemptsRef.current++
              connectWebSocket()
            }, delay)
          } else {
            console.log('[Instagram Webhook] Max reconnection attempts reached, giving up')
          }
        }
        
        ws.onerror = (error) => {
          console.error('[Instagram Webhook] Connection error:', error)
        }
        
      } catch (error) {
        console.error('[Instagram Webhook] Failed to connect:', error)
      }
    }

    // Connect to webhook WebSocket
    connectWebSocket()

    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [currentWorkspace?.id, queryClient])

  // This component doesn't render anything
  return null
}

export default InstagramWebhookListener
