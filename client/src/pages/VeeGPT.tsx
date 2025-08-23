import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Mic,
  Send,
  Lightbulb,
  TrendingUp,
  Camera,
  Target,
  Rocket,
  Edit3,
  Calendar,
  ChevronDown,
  MessageSquare,
  User,
  Bot,
  Paperclip,
  Edit,
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Zap,
  BarChart3,
  Share,
  Archive,
  Trash2,
  Square,
  Edit2
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '@/lib/queryClient'
import { getAuth } from 'firebase/auth'
// import veeforeLogo from '@assets/output-onlinepngtools_1754726286825.png' // Commented out to fix build error

// Real-time streaming - no animation, chunks appear immediately as they arrive

type ChatConversation = {
  id: number
  userId: string
  workspaceId: string
  title: string
  messageCount: number
  lastMessageAt: Date
  createdAt: Date
  updatedAt: Date
}

type ChatMessage = {
  id: number
  conversationId: number
  role: 'user' | 'assistant'
  content: string
  tokensUsed: number
  createdAt: Date
}

// Helper function to format last interaction date
const formatLastInteractionDate = (dateString: string | Date | null) => {
  if (!dateString) return 'No activity'
  
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = diffMs / (1000 * 60)
  const diffHours = diffMs / (1000 * 60 * 60)
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  
  if (diffMinutes < 1) {
    return 'Just now'
  } else if (diffMinutes < 60) {
    return `${Math.floor(diffMinutes)}m ago`
  } else if (diffHours < 24) {
    return `${Math.floor(diffHours)}h ago`
  } else if (diffDays < 7) {
    return `${Math.floor(diffDays)}d ago`
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }
}

export default function VeeGPT() {
  const [inputText, setInputText] = useState('')
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null)
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [hoveredChatId, setHoveredChatId] = useState<number | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchInput, setShowSearchInput] = useState(false)
  const [renamingChatId, setRenamingChatId] = useState<number | null>(null)
  const [newChatTitle, setNewChatTitle] = useState('')
  const [hasUserStartedNewChat, setHasUserStartedNewChat] = useState(false)
  // Removed typewriter animation for real streaming
  const [isGenerating, setIsGenerating] = useState(false)
  const isGeneratingRef = useRef(false)
  const streamResolveRef = useRef<((value: any) => void) | null>(null)
  // WebSocket for real-time streaming
  const wsRef = useRef<WebSocket | null>(null)
  const [streamingContent, setStreamingContent] = useState<{[key: number]: string}>({})
  // Optimistic messages to show immediately while request is processing
  const [optimisticMessages, setOptimisticMessages] = useState<ChatMessage[]>([])
  const inputRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()
  
  // console.log('VeeGPT state:', { hasSentFirstMessage, currentConversationId })

  // WebSocket connection management
  useEffect(() => {
    // Connect to WebSocket server (same port as HTTP server with WebSocket upgrade)
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}`
    
    console.log('[WebSocket] Connecting to:', wsUrl)
    const ws = new WebSocket(wsUrl)
    
    ws.onopen = () => {
      console.log('[WebSocket] Connected successfully for streaming')
      wsRef.current = ws
      
      // Subscribe to current conversation if we have one
      if (currentConversationId) {
        ws.send(JSON.stringify({
          type: 'subscribe',
          conversationId: currentConversationId
        }))
        console.log(`[WebSocket] Auto-subscribed to conversation ${currentConversationId}`)
      }
    }
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('[WebSocket] Received:', data)
        
        // Use the unified stream event handler
        handleStreamEvent(data)
      } catch (error) {
        console.error('[WebSocket] Parse error:', error)
      }
    }
    
    ws.onclose = (event) => {
      console.log('[WebSocket] Connection closed:', event.code, event.reason)
      wsRef.current = null
      
      // Auto-reconnect after 2 seconds if not a normal closure
      if (event.code !== 1000 && event.code !== 1001) {
        console.log('[WebSocket] Attempting to reconnect in 2 seconds...')
        setTimeout(() => {
          if (!wsRef.current) {
            // This will trigger a re-render and reconnection
            setStreamingContent({})
          }
        }, 2000)
      }
    }
    
    ws.onerror = (error) => {
      console.error('[WebSocket] Connection error:', error)
      console.log('[WebSocket] Error details:', {
        readyState: ws.readyState,
        url: wsUrl,
        protocol: window.location.protocol,
        host: window.location.host
      })
    }
    
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, [queryClient])

  // Subscribe to conversation when it changes or WebSocket connects
  useEffect(() => {
    const subscribe = () => {
      if (currentConversationId && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'subscribe',
          conversationId: currentConversationId
        }))
        console.log(`[WebSocket] Subscribing to conversation ${currentConversationId}`)
      }
    }

    subscribe()
    
    // Subscribe after a small delay to ensure WebSocket is ready
    setTimeout(subscribe, 200)
  }, [currentConversationId])

  const quickPrompts = [
    { icon: Lightbulb, text: "Inspire me!" },
    { icon: TrendingUp, text: "What's trending in my industry?" },
    { icon: Camera, text: "Caption an image" },
    { icon: Target, text: "I need a campaign idea" },
    { icon: Rocket, text: "How can I boost engagement?" },
    { icon: Edit3, text: "Draft a TikTok script" },
    { icon: Edit3, text: "Write an Instagram post" },
    { icon: Calendar, text: "Draft a posting schedule for next month" }
  ]

  // Fetch conversations - only if authenticated
  const { data: conversations = [] } = useQuery<ChatConversation[]>({
    queryKey: ['/api/chat/conversations'],
    queryFn: () => apiRequest('/api/chat/conversations'),
    enabled: true // Enable to load conversation history
  })


  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conv => 
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Fetch current conversation messages - only if authenticated
  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: ['/api/chat/conversations', currentConversationId, 'messages'],
    queryFn: () => apiRequest(`/api/chat/conversations/${currentConversationId}/messages`),
    enabled: !!currentConversationId // Enable when conversation is selected
  })

  // Combine real messages, optimistic messages, and streaming messages for display
  let displayMessages = [...messages]
  
  // Add optimistic messages if we have them and either no conversation ID or no real messages yet
  if (optimisticMessages.length > 0 && (!currentConversationId || messages.length === 0)) {
    displayMessages = [...optimisticMessages]
  }
  
  // Clear optimistic messages when real messages have loaded (prevents flashing)
  useEffect(() => {
    if (currentConversationId && messages.length > 0 && optimisticMessages.length > 0) {
      setOptimisticMessages([])
    }
  }, [currentConversationId, messages.length, optimisticMessages.length])

  // Clear streaming content when real messages have loaded (prevents flashing during stop)
  useEffect(() => {
    if (currentConversationId && messages.length > 0) {
      // Check if any streaming message ID now exists in real messages
      setStreamingContent(prev => {
        if (Object.keys(prev).length === 0) return prev
        
        const streamingMessageIds = Object.keys(prev).map(id => parseInt(id))
        const realMessageIds = messages.map(m => m.id)
        
        console.log('VeeGPT: Checking streaming content cleanup:', {
          streamingIds: streamingMessageIds,
          realIds: realMessageIds,
          isGenerating: isGeneratingRef.current
        })
        
        let hasChanges = false
        const updated = { ...prev }
        
        streamingMessageIds.forEach(streamingId => {
          const realMessage = messages.find(m => m.id === streamingId)
          // Only clear if the real message exists AND has actual content (not empty placeholder)
          if (realMessage && realMessage.content && realMessage.content.trim() !== '') {
            // This streaming message now exists as a real message with content, safe to clear streaming content
            delete updated[streamingId]
            hasChanges = true
            console.log('VeeGPT: Cleared completed streaming content for message:', streamingId, 'Real content length:', realMessage.content.length)
          }
        })
        
        return hasChanges ? updated : prev
      })
    }
  }, [currentConversationId, messages])

  // Add temporary streaming message if we have streaming content for a message not in the list
  Object.keys(streamingContent).forEach(messageId => {
    const numericMessageId = parseInt(messageId)
    if (!displayMessages.some(msg => msg.id === numericMessageId)) {
      displayMessages.push({
        id: numericMessageId,
        conversationId: currentConversationId || 0,
        role: 'assistant' as const,
        content: '',
        tokensUsed: 0,
        createdAt: new Date()
      })
    }
  })

  // Create new conversation with streaming
  const createConversationMutation = useMutation({
    mutationFn: async (content: string) => {
      // Set up streaming state before making the request
      setIsGenerating(true)
      console.log('VeeGPT: REF SET TO TRUE in createConversation')
      isGeneratingRef.current = true

      // Create a new conversation with the initial message content
      const response = await apiRequest('/api/chat/conversations', {
        method: 'POST',
        body: JSON.stringify({ content }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      // Set conversation ID immediately so WebSocket events can be handled
      setCurrentConversationId(response.conversation.id)
      setHasSentFirstMessage(true)
      
      // WebSocket should already be connected and will handle streaming
      return response
    },
    onMutate: async (content: string) => {
      // Create optimistic user message immediately for seamless UI transition
      const optimisticUserMessage = {
        id: Date.now(), // Temporary ID
        conversationId: 0, // Will be updated when real conversation is created
        role: 'user' as const,
        content: content,
        tokensUsed: 0,
        createdAt: new Date()
      }
      
      // Show optimistic message and transition to chat view immediately
      setOptimisticMessages([optimisticUserMessage])
      setHasSentFirstMessage(true)
    },
    onSuccess: (data) => {
      // Don't clear optimistic messages immediately - let them show until real messages load
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations'] })
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations', data.conversation.id, 'messages'] })
    },
    onError: () => {
      // Revert optimistic updates on error
      setHasSentFirstMessage(false)
      setCurrentConversationId(null)
      setIsGenerating(false)
      setOptimisticMessages([])
      console.log('VeeGPT: REF SET TO FALSE in createConversation mutation error')
      isGeneratingRef.current = false
    }
  })

  // Rename conversation mutation
  const renameConversationMutation = useMutation({
    mutationFn: async ({ conversationId, newTitle }: { conversationId: number, newTitle: string }) => {
      return apiRequest(`/api/chat/conversations/${conversationId}`, {
        method: 'PATCH',
        body: JSON.stringify({ title: newTitle })
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations'] })
      setRenamingChatId(null)
      setNewChatTitle('')
    }
  })

  // Delete conversation mutation
  const deleteConversationMutation = useMutation({
    mutationFn: async (conversationId: number) => {
      return apiRequest(`/api/chat/conversations/${conversationId}`, {
        method: 'DELETE'
      })
    },
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations'] })
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null)
        setHasSentFirstMessage(false)
      }
    }
  })

  // Archive conversation mutation
  const archiveConversationMutation = useMutation({
    mutationFn: async (conversationId: number) => {
      return apiRequest(`/api/chat/conversations/${conversationId}/archive`, {
        method: 'POST'
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations'] })
    }
  })

  // Stop generation mutation
  const stopGenerationMutation = useMutation({
    mutationFn: async (conversationId: number) => {
      const response = await apiRequest(`/api/chat/conversations/${conversationId}/stop`, {
        method: 'POST'
      })
      return response
    },
    onSuccess: () => {
      // Refresh messages to get the truncated response
      if (currentConversationId) {
        queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations', currentConversationId, 'messages'] })
      }
    }
  })

  // WebSocket-based message sending (simplified)
  const handleStreamingMessage = async (content: string, conversationId: number): Promise<any> => {
    console.log('[WebSocket] Sending message via WebSocket streaming')
    
    // Add user message optimistically
    const tempUserMessage = {
      id: Date.now(), // temporary ID
      conversationId,
      role: 'user' as const,
      content: content.trim(),
      tokensUsed: 0,
      createdAt: new Date().toISOString()
    }
    
    queryClient.setQueryData(
      ['/api/chat/conversations', conversationId, 'messages'],
      (old: any) => old ? [...old, tempUserMessage] : [tempUserMessage]
    )
    
    try {
      // Use same auth approach as apiRequest
      const auth = getAuth()
      const user = auth.currentUser
      
      if (!user) {
        throw new Error('Please sign in to continue')
      }

      const token = await user.getIdToken()

      // Send message to server (response will be streamed via WebSocket)
      const response = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('[WebSocket] Message sent, streaming will happen via WebSocket')
      return result

    } catch (error) {
      console.error('[WebSocket] Send message error:', error)
      setIsGenerating(false)
      isGeneratingRef.current = false
      throw error
    }
  }

  const handleStreamEvent = (data: any) => {
    console.log('VeeGPT: ====== STREAM EVENT RECEIVED ======', data)
    console.log('VeeGPT: Event type:', data.type, 'Timestamp:', Date.now())
    console.log('VeeGPT: Generation state during stream event:', {
      isGenerating,
      isGeneratingRef: isGeneratingRef.current,
      eventType: data.type
    })

    switch (data.type) {
      case 'userMessage':
        // Add user message to cache immediately
        if (currentConversationId && data.message) {
          queryClient.setQueryData(
            ['/api/chat/conversations', currentConversationId, 'messages'],
            (oldMessages: any[]) => {
              if (!oldMessages) return [data.message]
              // Check if message already exists to avoid duplicates
              const messageExists = oldMessages.some(msg => msg.id === data.message.id)
              if (messageExists) return oldMessages
              return [...oldMessages, data.message]
            }
          )
        }
        break

      case 'aiMessageStart':
        // Initialize streaming content for this message
        if (data.messageId) {
          console.log('VeeGPT: Starting AI message stream for ID:', data.messageId)
          setStreamingContent(prev => ({
            ...prev,
            [data.messageId]: ''
          }))
          // Ensure generation state is set for proper UI updates
          setIsGenerating(true)
          isGeneratingRef.current = true
          
          // Add placeholder AI message to cache
          if (currentConversationId) {
            const placeholderMessage = {
              id: data.messageId,
              conversationId: currentConversationId,
              role: 'assistant' as const,
              content: '',
              tokensUsed: 0,
              createdAt: new Date().toISOString()
            }
            
            queryClient.setQueryData(
              ['/api/chat/conversations', currentConversationId, 'messages'],
              (oldMessages: any[]) => {
                if (!oldMessages) return [placeholderMessage]
                // Check if message already exists to avoid duplicates
                const messageExists = oldMessages.some(msg => msg.id === data.messageId)
                if (messageExists) return oldMessages
                return [...oldMessages, placeholderMessage]
              }
            )
          }
        }
        break

      case 'chunk':
        console.log('VeeGPT: CHUNK RECEIVED:', {
          messageId: data.messageId,
          content: data.content,
          timestamp: data.timestamp,
          isGenerating,
          isGeneratingRef: isGeneratingRef.current
        })
        // Ensure isGenerating state is true during chunks to show stop button
        setIsGenerating(true)
        isGeneratingRef.current = true
        
        // Update streaming content for real-time display - accumulate chunks
        if (data.messageId && data.content !== undefined) {
          console.log('VeeGPT: PROCESSING CHUNK - MessageId:', data.messageId, 'Content:', `"${data.content}"`)
          
          // Force immediate state update with React's flushSync for real-time streaming
          setStreamingContent(prev => {
            // Initialize if not exists to catch first chunks that arrive before aiMessageStart
            const currentContent = prev[data.messageId] || ''
            const newContent = currentContent + data.content
            console.log('VeeGPT: STREAMING UPDATE - Message:', data.messageId, 'Current:', `"${currentContent}"`, 'Adding:', `"${data.content}"`, 'New Total:', `"${newContent}"`)
            
            // Return completely new object to ensure React re-renders
            const newState = { ...prev }
            newState[data.messageId] = newContent
            return newState
          })
          
          // Ensure placeholder message exists in cache if not already there
          if (currentConversationId) {
            queryClient.setQueryData(
              ['/api/chat/conversations', currentConversationId, 'messages'],
              (oldMessages: any[]) => {
                if (!oldMessages) {
                  const placeholderMessage = {
                    id: data.messageId,
                    conversationId: currentConversationId,
                    role: 'assistant' as const,
                    content: '',
                    tokensUsed: 0,
                    createdAt: new Date().toISOString()
                  }
                  return [placeholderMessage]
                }
                
                // Check if message already exists
                const messageExists = oldMessages.some(msg => msg.id === data.messageId)
                if (!messageExists) {
                  const placeholderMessage = {
                    id: data.messageId,
                    conversationId: currentConversationId,
                    role: 'assistant' as const,
                    content: '',
                    tokensUsed: 0,
                    createdAt: new Date().toISOString()
                  }
                  return [...oldMessages, placeholderMessage]
                }
                return oldMessages
              }
            )
          }
        } else {
          console.log('VeeGPT: CHUNK IGNORED - Missing messageId or content:', { messageId: data.messageId, content: data.content })
        }
        break

      case 'complete':
        console.log('VeeGPT: Streaming message completed')
        console.log('VeeGPT: Resetting generation state to FALSE')
        
        // Generation completed - reset generation state
        setIsGenerating(false)
        console.log('VeeGPT: REF SET TO FALSE in complete event')
        isGeneratingRef.current = false
        
        // Don't clear streaming content immediately - wait for backend queries to complete
        // The useEffect will clear it once the real message loads from the backend
        console.log('VeeGPT: Keeping streaming content until backend message loads')
        
        // Invalidate queries to get final message state from backend
        if (currentConversationId) {
          queryClient.invalidateQueries({ 
            queryKey: ['/api/chat/conversations', currentConversationId, 'messages'] 
          })
          queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations'] })
        }
        
        // Resolve the streaming Promise
        if (streamResolveRef.current) {
          streamResolveRef.current({ success: true })
          streamResolveRef.current = null
        }
        break

      case 'error':
        console.error('VeeGPT: Stream error:', data.error)
        setIsGenerating(false)
        console.log('VeeGPT: REF SET TO FALSE in error event')
        isGeneratingRef.current = false
        break
    }
  }

  // Removed updateMessageContentInCache - now using direct streaming content updates in event handler

  // Send message mutation with streaming
  const sendMessageMutation = useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: number, content: string }) => {
      return await handleStreamingMessage(content, conversationId)
    },
    onSuccess: () => {
      // Stream handling manages state updates
      console.log('VeeGPT: Streaming message completed')
    },
    onError: (error) => {
      console.error('VeeGPT: Error sending streaming message:', error)
      setIsGenerating(false)
      console.log('VeeGPT: REF SET TO FALSE in sendMessage mutation error')
      isGeneratingRef.current = false

    }
  })

  const handleSendMessage = async () => {
    await handleSendMessageWithContent()
  }

  const handleStopGeneration = async () => {
    console.log('VeeGPT: Stopping streaming generation')
    
    // Stop streaming state immediately for UI feedback
    setIsGenerating(false)
    console.log('VeeGPT: REF SET TO FALSE in handleStopGeneration')
    isGeneratingRef.current = false
    
    // DON'T clear streaming content yet - let it persist until backend confirms stop
    // This prevents the text from disappearing while waiting for stop confirmation
    
    // Call backend to stop generation
    if (currentConversationId) {
      console.log('VeeGPT: Stopping generation for conversation:', currentConversationId)
      try {
        await stopGenerationMutation.mutateAsync(currentConversationId)
        // After successful stop, invalidate queries to get the final state
        queryClient.invalidateQueries({ 
          queryKey: ['/api/chat/conversations', currentConversationId, 'messages'] 
        })
        queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations'] })
      } catch (error) {
        console.error('VeeGPT: Error stopping generation:', error)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    setInputText(prompt)
    if (textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.value = prompt
      // Auto-resize textarea to fit content
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.max(48, textareaRef.current.scrollHeight) + 'px'
    }
    // Don't send automatically - just populate the input field
  }

  const handleSendMessageWithContent = async (content?: string) => {
    const messageContent = content || inputText.trim()
    
    if (!messageContent) {
      console.log('VeeGPT: No message content to send')
      return
    }

    console.log('VeeGPT: Sending message:', messageContent)
    
    // Clear input immediately for responsive UI
    setInputText('')
    
    // Clear contenteditable div if using it
    if (inputRef.current) {
      inputRef.current.innerText = ''
    }
    
    // Clear textarea
    if (textareaRef.current) {
      textareaRef.current.value = ''
    }
    
    try {
      if (!currentConversationId) {
        // Create new conversation
        console.log('VeeGPT: Creating new conversation')
        await createConversationMutation.mutateAsync(messageContent)
      } else {
        // Send message to existing conversation
        console.log('VeeGPT: Sending to existing conversation:', currentConversationId)
        await sendMessageMutation.mutateAsync({ 
          conversationId: currentConversationId, 
          content: messageContent 
        })
      }
    } catch (error) {
      console.error('VeeGPT: Error sending message:', error)
      // Restore input text if there was an error
      setInputText(messageContent)
      if (inputRef.current) {
        inputRef.current.innerText = messageContent
      }
      if (textareaRef.current) {
        textareaRef.current.value = messageContent
      }
      
      // Revert optimistic updates handled by mutation onError
    }
  }

  const startNewChat = () => {
    setCurrentConversationId(null)
    setHasSentFirstMessage(false)
    setHasUserStartedNewChat(true)
    setInputText('')
    setSearchQuery('')
    setShowSearchInput(false)
    setRenamingChatId(null)
    setNewChatTitle('')
    // Clear streaming content and optimistic messages when starting new chat
    setStreamingContent({})
    setOptimisticMessages([])
  }

  const selectConversation = (conversationId: number) => {
    setCurrentConversationId(conversationId)
    // Clear streaming content and optimistic messages when switching conversations
    setStreamingContent({})
    setOptimisticMessages([])
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  // Removed previousMessageCount - no longer needed for streaming
  
  // No typewriter animation - streaming content updates in real-time

  // Initialize with first conversation if user has existing chats (but only on first load)
  // This ensures consistent behavior between refresh and new chat
  useEffect(() => {
    if (conversations.length > 0 && !currentConversationId && !hasUserStartedNewChat && !hasSentFirstMessage) {
      setHasSentFirstMessage(true)
      setCurrentConversationId(conversations[0].id)
    }
  }, [conversations, currentConversationId, hasUserStartedNewChat, hasSentFirstMessage])



  // Always show sidebar if conversations exist, regardless of whether it's a new chat or refresh
  const shouldShowSidebar = conversations.length > 0
  
  // Show welcome screen when starting a new chat or when no conversation is selected
  // Always show sidebar if conversations exist, regardless of new chat state
  // Don't show welcome screen if we have optimistic messages (instant UI transition)
  const showWelcomeScreen = !currentConversationId && (!hasSentFirstMessage || hasUserStartedNewChat) && optimisticMessages.length === 0
  
  if (showWelcomeScreen) {
    return (
      <div className="h-full w-full bg-gray-50 flex relative overflow-hidden" style={{ height: '100%', display: 'flex' }}>
        {/* Static Background - No Scroll Animations */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Static background elements - no scroll interaction */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50"></div>
          
          {/* Static stars - slow automatic animation only */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full animate-slow-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 3}s`,
                  animationDuration: `${18 + Math.random() * 10}s`
                }}
              />
            ))}
          </div>
          
          {/* Static analytics bars */}
          <div className="absolute bottom-0 left-0 w-full h-32 opacity-10">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute bottom-0 bg-gradient-to-t from-blue-500/40 to-purple-500/20 rounded-t-lg animate-slow-pulse"
                style={{
                  left: `${10 + i * 10}%`,
                  width: '6%',
                  height: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 2}s`
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Content - Above Background */}
        <div className="relative z-10 w-full h-full flex">
        {/* Sidebar - show if conversations exist */}
        {shouldShowSidebar && (
          <div className={`${sidebarCollapsed ? 'w-16' : 'w-72'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-sm`}>
            {/* Top Logo/Brand with Toggle */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  {!sidebarCollapsed && (
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">VeeGPT</h1>
                      <p className="text-xs text-gray-500 font-medium">AI Assistant</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 group"
                >
                  {sidebarCollapsed ? (
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
                  ) : (
                    <ChevronLeft className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="p-4 space-y-2">
              <button
                onClick={startNewChat}
                className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-all duration-200 shadow-sm group"
                title={sidebarCollapsed ? "New chat" : ""}
              >
                <Edit className="w-4 h-4 flex-shrink-0" />
                {!sidebarCollapsed && <span>New Chat</span>}
              </button>
              
              <button 
                onClick={() => setShowSearchInput(!showSearchInput)}
                className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title={sidebarCollapsed ? "Search chats" : ""}
              >
                <Search className="w-4 h-4 flex-shrink-0" />
                {!sidebarCollapsed && <span>Search Chats</span>}
              </button>
              
              <div className="h-px bg-gray-200 my-3"></div>
              
              <button 
                className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title={sidebarCollapsed ? "Content Assistant" : ""}
              >
                <Zap className="w-4 h-4 flex-shrink-0 text-amber-500" />
                {!sidebarCollapsed && <span>Content Assistant</span>}
              </button>
              
              <button 
                className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title={sidebarCollapsed ? "Analytics" : ""}
              >
                <BarChart3 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                {!sidebarCollapsed && <span>Analytics</span>}
              </button>
            </div>

            {/* Search Input */}
            {showSearchInput && !sidebarCollapsed && (
              <div className="px-4 pb-4">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
            )}

            {/* Conversations Section */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-3">
                {!sidebarCollapsed && (
                  <div className="text-xs font-semibold text-gray-500 mb-4 px-2 uppercase tracking-wider">
                    Recent Chats
                  </div>
                )}
                <div className="space-y-2">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className="relative"
                      onMouseEnter={() => setHoveredChatId(conversation.id)}
                      onMouseLeave={() => {
                        setHoveredChatId(null)
                        if (dropdownOpen === conversation.id) {
                          setTimeout(() => setDropdownOpen(null), 200)
                        }
                      }}
                    >
                      <button
                        onClick={() => selectConversation(conversation.id)}
                        className={`w-full text-left px-3 py-3 text-sm rounded-lg transition-colors group ${
                          currentConversationId === conversation.id
                            ? 'bg-blue-50 text-blue-900 border border-blue-200 shadow-sm font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        title={sidebarCollapsed ? conversation.title : ""}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <MessageSquare className="w-4 h-4 flex-shrink-0" />
                            {!sidebarCollapsed && (
                              <div className="truncate text-base font-medium">
                                {renamingChatId === conversation.id ? (
                                  <input
                                    type="text"
                                    value={newChatTitle}
                                    onChange={(e) => setNewChatTitle(e.target.value)}
                                    onBlur={() => {
                                      if (newChatTitle.trim()) {
                                        renameConversationMutation.mutate({
                                          conversationId: conversation.id,
                                          newTitle: newChatTitle.trim()
                                        })
                                      }
                                      setRenamingChatId(null)
                                      setNewChatTitle('')
                                    }}
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        if (newChatTitle.trim()) {
                                          renameConversationMutation.mutate({
                                            conversationId: conversation.id,
                                            newTitle: newChatTitle.trim()
                                          })
                                        }
                                        setRenamingChatId(null)
                                        setNewChatTitle('')
                                      }
                                    }}
                                    className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm"
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                ) : (
                                  conversation.title
                                )}
                              </div>
                            )}
                          </div>
                          {(hoveredChatId === conversation.id || dropdownOpen === conversation.id) && !sidebarCollapsed && renamingChatId !== conversation.id && (
                            <div className="relative ml-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setDropdownOpen(dropdownOpen === conversation.id ? null : conversation.id)
                                }}
                                className="p-1 hover:bg-gray-200 rounded"
                              >
                                <MoreHorizontal className="w-4 h-4 text-gray-500" />
                              </button>
                              
                              {dropdownOpen === conversation.id && (
                                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[140px]">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setRenamingChatId(conversation.id)
                                      setNewChatTitle(conversation.title)
                                      setDropdownOpen(null)
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                    <span>Rename</span>
                                  </button>
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      archiveConversationMutation.mutate(conversation.id)
                                      setDropdownOpen(null)
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                                  >
                                    <Archive className="w-4 h-4" />
                                    <span>Archive</span>
                                  </button>
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      if (confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
                                        deleteConversationMutation.mutate(conversation.id)
                                      }
                                      setDropdownOpen(null)
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom User Section */}
            <div className="p-3 border-t border-gray-200">
              <div className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                {!sidebarCollapsed && (
                  <>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">Arpit Choudhary</div>
                      <div className="text-xs text-gray-500">Business Plan</div>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-4xl">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-semibold text-gray-900 mb-3">
                How can VeeGPT help?
                <span className="ml-3 px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded">
                  Beta
                </span>
              </h1>
            </div>

            {/* Main Input */}
            <div 
              className="owlygpt-chatbox bg-white rounded-2xl shadow-sm mb-8"
              style={{
                border: '1px solid #d1d5db',
                borderRadius: '16px',
                boxSizing: 'border-box'
              }}
            >
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value)
                  // Auto-resize textarea
                  const textarea = e.target as HTMLTextAreaElement
                  textarea.style.height = 'auto'
                  textarea.style.height = Math.max(48, textarea.scrollHeight) + 'px'
                }}
                onKeyDown={handleKeyPress}
                placeholder="Ask VeeGPT a question"
                className="w-full px-5 py-3 text-gray-900 placeholder-gray-500 bg-transparent border-0 resize-none focus:outline-none focus:ring-0 focus:border-0 outline-none overflow-hidden"
                style={{ 
                  fontSize: '16px',
                  height: '48px',
                  lineHeight: '24px',
                  border: 'none',
                  boxShadow: 'none',
                  wordBreak: 'break-all',
                  overflowWrap: 'anywhere',
                  whiteSpace: 'pre-wrap'
                }}
                rows={1}
              />
            
              {/* Input Controls */}
              <div className="flex items-center justify-between px-5 pb-4">
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                  
                  <div className="flex items-center space-x-3">
                    <button 
                      className="flex items-center space-x-2 px-5 py-2.5 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition-colors"
                      onClick={() => {/* Handle brand voice dropdown */}}
                    >
                      <span className="text-base font-semibold">Brand voice</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    <button 
                      className="flex items-center px-5 py-2.5 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      <span className="text-base font-semibold">Image generation</span>
                    </button>
                  </div>
                </div>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || createConversationMutation.isPending}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    inputText.trim()
                      ? 'bg-gray-900 hover:bg-gray-800 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="space-y-3">
              {/* First Row - 4 buttons */}
              <div className="flex flex-wrap gap-2 justify-center">
                {quickPrompts.slice(0, 4).map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt.text)}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition-colors whitespace-nowrap"
                  >
                    <prompt.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-base font-semibold">
                      {prompt.text}
                    </span>
                  </button>
                ))}
              </div>
              
              {/* Second Row - 3 buttons */}
              <div className="flex flex-wrap gap-2 justify-center">
                {quickPrompts.slice(4, 7).map((prompt, index) => (
                  <button
                    key={index + 4}
                    onClick={() => handleQuickPrompt(prompt.text)}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition-colors whitespace-nowrap"
                  >
                    <prompt.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-base font-semibold">
                      {prompt.text}
                    </span>
                  </button>
                ))}
              </div>
              
              {/* Third Row - 1 button */}
              <div className="flex justify-center">
                {quickPrompts[7] && (() => {
                  const IconComponent = quickPrompts[7].icon;
                  return (
                    <button
                      onClick={() => handleQuickPrompt(quickPrompts[7].text)}
                      className="flex items-center space-x-2 px-4 py-2.5 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition-colors whitespace-nowrap"
                    >
                      <IconComponent className="w-4 h-4 flex-shrink-0" />
                      <span className="text-base font-semibold">
                        {quickPrompts[7].text}
                      </span>
                    </button>
                  );
                })()}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-10">
              <p className="text-sm text-gray-500">
                VeeGPT can make mistakes. Check important info.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }

  // Chat interface layout (after first message)
  return (
    <div className="h-full w-full bg-gray-50 flex relative overflow-hidden" style={{ height: '100%', display: 'flex' }}>
      {/* Static Background - No Scroll Animations */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Static background elements - no scroll interaction */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50"></div>
        
        {/* Static stars - slow automatic animation only */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full animate-slow-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 3}s`,
                animationDuration: `${18 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
        
        {/* Static analytics bars */}
        <div className="absolute bottom-0 left-0 w-full h-32 opacity-10">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute bottom-0 bg-gradient-to-t from-blue-500/40 to-purple-500/20 rounded-t-lg animate-slow-pulse"
              style={{
                left: `${10 + i * 10}%`,
                width: '6%',
                height: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 2}s`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Content - Above Background */}
      <div className="relative z-10 w-full h-full flex">
        {/* Sidebar - show if conversations exist */}
        {shouldShowSidebar && (
          <div className={`${sidebarCollapsed ? 'w-16' : 'w-72'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-sm`}>
            {/* Top Logo/Brand with Toggle */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  {!sidebarCollapsed && (
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">VeeGPT</h1>
                      <p className="text-xs text-gray-500 font-medium">AI Assistant</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 group"
                >
                  {sidebarCollapsed ? (
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
                  ) : (
                    <ChevronLeft className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="p-4 space-y-2">
              <button
                onClick={startNewChat}
                className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-all duration-200 shadow-sm group"
                title={sidebarCollapsed ? "New chat" : ""}
              >
                <Edit className="w-4 h-4 flex-shrink-0" />
                {!sidebarCollapsed && <span>New Chat</span>}
              </button>
              
              <button 
                onClick={() => setShowSearchInput(!showSearchInput)}
                className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title={sidebarCollapsed ? "Search chats" : ""}
              >
                <Search className="w-4 h-4 flex-shrink-0" />
                {!sidebarCollapsed && <span>Search Chats</span>}
              </button>
              
              <div className="h-px bg-gray-200 my-3"></div>
              
              <button 
                className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title={sidebarCollapsed ? "Content Assistant" : ""}
              >
                <Zap className="w-4 h-4 flex-shrink-0 text-amber-500" />
                {!sidebarCollapsed && <span>Content Assistant</span>}
              </button>
              
              <button 
                className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title={sidebarCollapsed ? "Analytics" : ""}
              >
                <BarChart3 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                {!sidebarCollapsed && <span>Analytics</span>}
              </button>
            </div>

            {/* Search Input */}
            {showSearchInput && !sidebarCollapsed && (
              <div className="px-4 pb-4">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
            )}

            {/* Conversations Section */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-4">
                {!sidebarCollapsed && (
                  <div className="text-xs font-semibold text-slate-400 mb-4 px-2 uppercase tracking-wider">
                    Recent Chats
                  </div>
                )}
                <div className="space-y-1">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className="relative"
                      onMouseEnter={() => setHoveredChatId(conversation.id)}
                      onMouseLeave={() => {
                        setHoveredChatId(null)
                        if (dropdownOpen === conversation.id) {
                          setTimeout(() => setDropdownOpen(null), 200)
                        }
                      }}
                    >
                      <button
                        onClick={() => selectConversation(conversation.id)}
                        className={`w-full text-left px-4 py-3 text-sm rounded-xl transition-all duration-200 group ${
                          currentConversationId === conversation.id
                            ? 'bg-blue-50 text-blue-900 border border-blue-200 shadow-sm font-medium'
                            : 'text-gray-700 hover:bg-gray-100 border border-transparent'
                        }`}
                        title={sidebarCollapsed ? conversation.title : ""}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <MessageSquare className={`w-4 h-4 flex-shrink-0 ${
                              currentConversationId === conversation.id
                                ? 'text-blue-600'
                                : 'text-gray-400 group-hover:text-gray-600'
                            }`} />
                            {!sidebarCollapsed && (
                              <div className="flex-1 min-w-0">
                                <div className="truncate text-sm font-medium">
                                  {renamingChatId === conversation.id ? (
                                    <input
                                      type="text"
                                      value={newChatTitle}
                                      onChange={(e) => setNewChatTitle(e.target.value)}
                                      onBlur={() => {
                                        if (newChatTitle.trim()) {
                                          renameConversationMutation.mutate({
                                            conversationId: conversation.id,
                                            newTitle: newChatTitle.trim()
                                          })
                                        } else {
                                          setRenamingChatId(null)
                                          setNewChatTitle('')
                                        }
                                      }}
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          if (newChatTitle.trim()) {
                                            renameConversationMutation.mutate({
                                              conversationId: conversation.id,
                                              newTitle: newChatTitle.trim()
                                            })
                                          } else {
                                            setRenamingChatId(null)
                                            setNewChatTitle('')
                                          }
                                        } else if (e.key === 'Escape') {
                                          setRenamingChatId(null)
                                          setNewChatTitle('')
                                        }
                                      }}
                                      className="w-full text-sm bg-slate-700/50 border border-slate-500/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                                      autoFocus
                                    />
                                  ) : (
                                    conversation.title
                                  )}
                                </div>
                                <div className="text-xs text-slate-400 mt-1">
                                  {formatLastInteractionDate(conversation.lastMessageAt || conversation.updatedAt)}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {!sidebarCollapsed && (hoveredChatId === conversation.id || dropdownOpen === conversation.id) && (
                            <div className="relative">
                              <div
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setDropdownOpen(dropdownOpen === conversation.id ? null : conversation.id)
                                }}
                                className="p-1 hover:bg-slate-600/50 rounded transition-colors cursor-pointer"
                              >
                                <MoreHorizontal className="w-4 h-4 text-slate-400" />
                              </div>
                              
                              {dropdownOpen === conversation.id && (
                                <div className="absolute right-0 top-8 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-600 py-2 z-50">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      console.log('Share conversation:', conversation.id)
                                      setDropdownOpen(null)
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white flex items-center space-x-3"
                                  >
                                    <Share className="w-4 h-4" />
                                    <span>Share</span>
                                  </button>
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setRenamingChatId(conversation.id)
                                      setNewChatTitle(conversation.title)
                                      setDropdownOpen(null)
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white flex items-center space-x-3"
                                  >
                                    <Edit className="w-4 h-4" />
                                    <span>Rename</span>
                                  </button>
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      archiveConversationMutation.mutate(conversation.id)
                                      setDropdownOpen(null)
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white flex items-center space-x-3"
                                  >
                                    <Archive className="w-4 h-4" />
                                    <span>Archive</span>
                                  </button>
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      if (confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
                                        deleteConversationMutation.mutate(conversation.id)
                                      }
                                      setDropdownOpen(null)
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 flex items-center space-x-3"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white relative">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-semibold text-gray-900">VeeGPT</h1>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Share className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 bg-gradient-to-b from-gray-50/30 to-white" style={{ paddingBottom: '140px' }}>
          <div className="max-w-4xl mx-auto space-y-8 overflow-x-hidden">
            {displayMessages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col space-y-2 ${
                  message.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div className={`${
                  message.role === 'user' 
                    ? 'max-w-sm w-fit' 
                    : 'max-w-4xl w-full'
                }`} style={{
                  minWidth: 0,
                  overflow: 'hidden'
                }}>
                  {message.role === 'user' && (
                    <div className="text-xs font-medium text-gray-600 mb-2 flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      You
                    </div>
                  )}
                  {message.role === 'assistant' && (
                    <div className="text-xs font-medium text-blue-600 mb-2 flex items-center">
                      <Bot className="w-3 h-3 mr-1" />
                      VeeGPT
                    </div>
                  )}
                  <div className={`px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-gray-200 text-gray-900 inline-block'
                      : 'bg-transparent text-gray-900'
                  }`} style={{
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    maxWidth: '100%'
                  }}>
                    {message.role === 'assistant' ? (
                      <div 
                        className="leading-relaxed"
                        style={{
                          wordWrap: 'break-word',
                          wordBreak: 'break-all',
                          overflowWrap: 'anywhere',
                          whiteSpace: 'pre-wrap',
                          maxWidth: '100%',
                          width: '100%',
                          hyphens: 'auto',
                          lineBreak: 'anywhere'
                        }}
                      >
                        {streamingContent[message.id] !== undefined ? (
                          <span>
                            {streamingContent[message.id] || ''}
                            {isGenerating && streamingContent[message.id] !== undefined && (
                              <span className="animate-pulse text-blue-500 ml-1">▋</span>
                            )}
                          </span>
                        ) : message.content}

                      </div>
                    ) : (
                      <div 
                        className="leading-relaxed"
                        style={{
                          wordWrap: 'break-word',
                          wordBreak: 'break-all',
                          overflowWrap: 'anywhere',
                          whiteSpace: 'pre-wrap',
                          maxWidth: '100%',
                          width: '100%',
                          hyphens: 'auto',
                          lineBreak: 'anywhere'
                        }}
                      >
                        {message.content}
                      </div>
                    )}
                  </div>
                  {/* Show timestamp for all messages */}
                  {(
                    <div className={`mt-2 text-xs text-gray-500 ${
                      message.role === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      }) : new Date().toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Truly floating transparent input - absolute position within chat area */}
        <div style={{ 
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '48rem',
          padding: '0 24px',
          pointerEvents: 'none',
          zIndex: 1000
        }}>
          {/* Pill-shaped transparent container */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '12px 16px',
            border: '1px solid rgba(209, 213, 219, 0.2)',
            borderRadius: '25px',
            background: 'rgba(255, 255, 255, 0.05)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s ease',
            pointerEvents: 'auto',
            minHeight: '44px'
          }}>
              <button style={{
                background: 'transparent',
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                padding: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '2px'
              }}>
                <Paperclip style={{ 
                  width: '20px', 
                  height: '20px',
                  color: '#6b7280'
                }} />
              </button>
              
              <div style={{
                flex: 1,
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-start',
                minHeight: '20px'
              }}>
                <div
                  ref={inputRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => {
                    const text = e.currentTarget.innerText
                    setInputText(text)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  style={{
                    width: '100%',
                    minHeight: '20px',
                    maxHeight: '120px',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    outline: 'none',
                    border: 'none',
                    background: 'transparent',
                    backgroundColor: 'transparent',
                    color: '#374151',
                    fontSize: '16px',
                    lineHeight: '24px',
                    padding: '0',
                    margin: '0',
                    boxShadow: 'none',
                    borderRadius: 0,
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    appearance: 'none',
                    position: 'relative',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word'
                  }}
                  data-placeholder={inputText.length === 0 ? "Message VeeGPT" : ""}
                />
              </div>
              
              {(() => {
                // Show stop button during streaming chunks
                const shouldShowStop = isGenerating || isGeneratingRef.current
                // console.log('VeeGPT: Stop button visibility check:', {
                //   isGenerating,
                //   isGeneratingRef: isGeneratingRef.current,
                //   renderTrigger,
                //   shouldShowStop
                // })
                return shouldShowStop
              })() ? (
                <button
                  onClick={handleStopGeneration}
                  style={{
                    background: 'transparent',
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    padding: '4px',
                    cursor: 'pointer',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '2px'
                  }}
                  title="Stop generation"
                >
                  <Square style={{ width: '18px', height: '18px' }} />
                </button>
              ) : (
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  style={{
                    background: 'transparent',
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    padding: '4px',
                    cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                    color: inputText.trim() ? '#1f2937' : '#9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '2px'
                  }}
                >
                  <Send style={{ width: '20px', height: '20px' }} />
                </button>
              )}

              <button style={{
                background: 'transparent',
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                padding: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Mic style={{ 
                  width: '20px', 
                  height: '20px',
                  color: '#6b7280'
                }} />
              </button>
            </div>
        </div>
        
        {/* Footer text positioned below the floating input */}
        <div style={{ 
          position: 'absolute',
          bottom: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 999
        }}>
          <div style={{ 
            fontSize: '12px', 
            color: '#9ca3af',
            background: 'rgba(255, 255, 255, 0.95)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '6px 12px',
            borderRadius: '6px',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(229, 231, 235, 0.3)'
          }}>
            VeeGPT can make mistakes. Check important info.
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}