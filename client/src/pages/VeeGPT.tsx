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
  Square
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '@/lib/queryClient'
import { getAuth } from 'firebase/auth'
import veeforeLogo from '@assets/output-onlinepngtools_1754726286825.png'

// TypewriterText component for AI responses
function TypewriterText({ text, speed = 30, onComplete }: { text: string, speed?: number, onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [initialText] = useState(text) // Store initial text to prevent re-animation

  useEffect(() => {
    // Only animate if not completed and text matches initial text
    if (!isCompleted && text === initialText && currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(currentIndex + 1)
      }, speed)
      return () => clearTimeout(timer)
    } else if (!isCompleted && currentIndex === text.length && text === initialText) {
      setIsCompleted(true)
      if (onComplete) {
        onComplete()
      }
    }
  }, [currentIndex, text, speed, onComplete, isCompleted, initialText])

  return (
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
      {isCompleted ? text : displayedText}
      {!isCompleted && currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </div>
  )
}

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

export default function VeeGPT() {
  console.log('VeeGPT component rendering')
  const [inputText, setInputText] = useState('')
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null)
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [hoveredChatId, setHoveredChatId] = useState<number | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null)
  const [typewriterMessageIds, setTypewriterMessageIds] = useState<Set<number>>(new Set())
  const [isGenerating, setIsGenerating] = useState(false)
  const isGeneratingRef = useRef(false)
  const streamResolveRef = useRef<((value: any) => void) | null>(null)
  const [currentEventSource, setCurrentEventSource] = useState<any>(null)
  const [streamingContent, setStreamingContent] = useState<{[key: number]: string}>({})
  const inputRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()
  
  console.log('VeeGPT state:', { hasSentFirstMessage, currentConversationId })

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

  // Fetch conversations  
  const { data: conversations = [] } = useQuery<ChatConversation[]>({
    queryKey: ['/api/chat/conversations'],
    queryFn: () => apiRequest('/api/chat/conversations'),
    enabled: true // Always fetch conversations to show history
  })

  // Fetch current conversation messages
  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: ['/api/chat/conversations', currentConversationId, 'messages'],
    queryFn: () => apiRequest(`/api/chat/conversations/${currentConversationId}/messages`),
    enabled: !!currentConversationId
  })

  // Create new conversation with streaming
  const createConversationMutation = useMutation({
    mutationFn: async (content: string) => {
      // First create a new conversation
      const newConv = await apiRequest('/api/chat/conversations', {
        method: 'POST',
        body: { title: 'New Chat' }
      })

      setCurrentConversationId(newConv.id)
      setHasSentFirstMessage(true)
      
      // Then send the message with streaming
      await handleStreamingMessage(content, newConv.id)
      
      return newConv
    },
    onMutate: async (content) => {
      // Show the user message immediately by transitioning to chat view
      setHasSentFirstMessage(true)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations'] })
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations', data.id, 'messages'] })
    },
    onError: (err) => {
      // Revert optimistic updates on error
      setHasSentFirstMessage(false)
      setCurrentConversationId(null)
      setIsGenerating(false)
      if (currentEventSource) {
        currentEventSource.close()
        setCurrentEventSource(null)
      }
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

  // Streaming helper functions
  const handleStreamingMessage = async (content: string, conversationId: number): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      setIsGenerating(true)
      isGeneratingRef.current = true
      
      // Store resolve function for completion handler
      streamResolveRef.current = resolve
      
      try {
        // Use same auth approach as apiRequest
        const auth = getAuth()
        const user = auth.currentUser
        
        if (!user) {
          throw new Error('Please sign in to continue')
        }

        const token = await user.getIdToken()
        console.log('VeeGPT: Got auth token for streaming request')

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

        if (!response.body) {
          throw new Error('No response body')
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        const readStream = async () => {
          try {
            while (true) {
              const { done, value } = await reader.read()
              
              if (done) break

              const chunk = decoder.decode(value, { stream: true })
              const lines = chunk.split('\n')

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  try {
                    const data = JSON.parse(line.slice(6))
                    handleStreamEvent(data)
                  } catch (e) {
                    console.log('VeeGPT: Parse error for line:', line)
                    // Ignore parse errors for incomplete data
                  }
                }
              }
            }
          } catch (error) {
            console.error('VeeGPT: Stream reading error:', error)
            setIsGenerating(false)
            isGeneratingRef.current = false
            streamResolveRef.current = null
            reject(error)
          }
        }

        readStream()
        setCurrentEventSource({ close: () => reader.cancel() })

      } catch (error) {
        console.error('VeeGPT: Fetch error:', error)
        setIsGenerating(false)
        isGeneratingRef.current = false
        streamResolveRef.current = null
        reject(error)
      }
    })
  }

  const handleStreamEvent = (data: any) => {
    console.log('VeeGPT: Stream event:', data)

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
        // Add AI message placeholder to cache immediately
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

      case 'chunk':
        // Update the AI message content in real-time
        if (data.messageId && data.content && currentConversationId) {
          updateMessageContentInCache(data.messageId, data.content)
        }
        break

      case 'complete':
        console.log('VeeGPT: Streaming message completed')
        // Generation completed - reset generation state
        setIsGenerating(false)
        isGeneratingRef.current = false
        // Clear streaming content for this message
        if (data.messageId) {
          setStreamingContent(prev => {
            const newContent = { ...prev }
            delete newContent[data.messageId]
            return newContent
          })
        }
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
        isGeneratingRef.current = false
        break
    }
  }

  const updateMessageContentInCache = (messageId: number, newChunk: string) => {
    if (!currentConversationId) return

    // Update streaming content state for real-time display
    setStreamingContent(prev => ({
      ...prev,
      [messageId]: (prev[messageId] || '') + newChunk
    }))

    // Also update query cache
    queryClient.setQueryData(
      ['/api/chat/conversations', currentConversationId, 'messages'],
      (oldData: any) => {
        if (!oldData) return oldData

        return oldData.map((message: any) => {
          if (message.id === messageId) {
            return {
              ...message,
              content: (message.content || '') + newChunk
            }
          }
          return message
        })
      }
    )
  }

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
      isGeneratingRef.current = false
      if (currentEventSource) {
        currentEventSource.close()
        setCurrentEventSource(null)
      }
    }
  })

  const handleSendMessage = async () => {
    if (!inputText.trim()) return
    
    const content = inputText.trim()
    console.log('VeeGPT: Sending message:', content)
    setInputText('')
    
    // Clear contenteditable div
    if (inputRef.current) {
      inputRef.current.innerText = ''
    }
    
    try {
      if (!hasSentFirstMessage || !currentConversationId) {
        // Create new conversation
        console.log('VeeGPT: Creating new conversation')
        await createConversationMutation.mutateAsync(content)
      } else {
        // Send message to existing conversation
        console.log('VeeGPT: Sending to existing conversation:', currentConversationId)
        await sendMessageMutation.mutateAsync({ 
          conversationId: currentConversationId, 
          content 
        })
      }
    } catch (error) {
      console.error('VeeGPT: Error sending message:', error)
      // Restore input text if there was an error
      setInputText(content)
      if (inputRef.current) {
        inputRef.current.innerText = content
      }
    }
  }

  const handleStopGeneration = async () => {
    console.log('VeeGPT: Stopping streaming generation')
    
    // Stop streaming immediately
    setIsGenerating(false)
    isGeneratingRef.current = false
    if (currentEventSource) {
      currentEventSource.close()
      setCurrentEventSource(null)
    }
    
    // Also stop typewriter animations if any
    setTypewriterMessageIds(new Set())
    
    // Call backend to stop generation
    if (currentConversationId) {
      console.log('VeeGPT: Stopping generation for conversation:', currentConversationId)
      try {
        await stopGenerationMutation.mutateAsync(currentConversationId)
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
    inputRef.current?.focus()
  }

  const startNewChat = () => {
    setCurrentConversationId(null)
    setHasSentFirstMessage(false)
    setInputText('')
    // Clear typewriter state when starting new chat
    setTypewriterMessageIds(new Set())
    // Reset message count tracking
    setPreviousMessageCount(0)
  }

  const selectConversation = (conversationId: number) => {
    setCurrentConversationId(conversationId)
    // Clear typewriter state when switching conversations
    setTypewriterMessageIds(new Set())
    // Reset message count tracking
    setPreviousMessageCount(0)
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  // Track the previous message count to detect truly new messages
  const [previousMessageCount, setPreviousMessageCount] = useState(0)
  
  // Track new AI messages for typewriter effect (only for truly new messages)
  useEffect(() => {
    if (messages.length > previousMessageCount) {
      // Only animate if this is a new message (not loaded from database)
      const newMessages = messages.slice(previousMessageCount)
      const newAIMessage = newMessages.find(msg => msg.role === 'assistant')
      
      if (newAIMessage && !typewriterMessageIds.has(newAIMessage.id)) {
        setTypewriterMessageIds(prev => new Set([...prev, newAIMessage.id]))
      }
    }
    setPreviousMessageCount(messages.length)
  }, [messages, typewriterMessageIds, previousMessageCount])

  // Check if we have any conversations to determine initial state
  useEffect(() => {
    if (conversations.length > 0 && !currentConversationId) {
      setHasSentFirstMessage(true)
      setCurrentConversationId(conversations[0].id)
    }
  }, [conversations, currentConversationId])

  // Welcome screen layout (when no conversation is active)
  if (!hasSentFirstMessage) {
    return (
      <div className="h-full w-full bg-gray-50 flex flex-col items-center justify-center px-4">
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
              ref={inputRef}
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
    )
  }

  // Chat interface layout (after first message)
  return (
    <div className="h-screen w-full bg-gray-50 flex" style={{ minHeight: '100vh', display: 'flex' }}>
      {/* VeeGPT Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300`}>
        {/* Top Logo/Brand with Toggle */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-md flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              {!sidebarCollapsed && <span className="text-lg font-medium text-gray-900">VeeGPT</span>}
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="px-3 pb-4 space-y-2">
          <button
            onClick={startNewChat}
            className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title={sidebarCollapsed ? "New chat" : ""}
          >
            <Edit className="w-4 h-4 flex-shrink-0" />
            {!sidebarCollapsed && <span>New chat</span>}
          </button>
          
          <button 
            className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title={sidebarCollapsed ? "Search chats" : ""}
          >
            <Search className="w-4 h-4 flex-shrink-0" />
            {!sidebarCollapsed && <span>Search chats</span>}
          </button>
          
          <button 
            className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title={sidebarCollapsed ? "Content Assistant" : ""}
          >
            <Zap className="w-4 h-4 flex-shrink-0" />
            {!sidebarCollapsed && <span>Content Assistant</span>}
          </button>
          
          <button 
            className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title={sidebarCollapsed ? "Analytics" : ""}
          >
            <BarChart3 className="w-4 h-4 flex-shrink-0" />
            {!sidebarCollapsed && <span>Analytics</span>}
          </button>
        </div>

        {/* Conversations Section */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-3">
            {!sidebarCollapsed && (
              <div className="text-xs font-medium text-gray-500 mb-2 px-3">
                Recent Chats
              </div>
            )}
            <div className="space-y-2">
              {conversations.map((conversation) => (
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
                        ? 'bg-gray-200 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    title={sidebarCollapsed ? conversation.title : ""}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <MessageSquare className="w-4 h-4 flex-shrink-0" />
                        {!sidebarCollapsed && (
                          <div className="truncate text-base font-medium">{conversation.title}</div>
                        )}
                      </div>
                      
                      {!sidebarCollapsed && (hoveredChatId === conversation.id || dropdownOpen === conversation.id) && (
                        <div className="relative">
                          <div
                            onClick={(e) => {
                              e.stopPropagation()
                              setDropdownOpen(dropdownOpen === conversation.id ? null : conversation.id)
                            }}
                            className="p-1 hover:bg-gray-200 rounded transition-colors cursor-pointer"
                          >
                            <MoreHorizontal className="w-4 h-4 text-gray-500" />
                          </div>
                          
                          {dropdownOpen === conversation.id && (
                            <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  console.log('Share conversation:', conversation.id)
                                  setDropdownOpen(null)
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                              >
                                <Share className="w-4 h-4" />
                                <span>Share</span>
                              </button>
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  console.log('Rename conversation:', conversation.id)
                                  setDropdownOpen(null)
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                              >
                                <Edit className="w-4 h-4" />
                                <span>Rename</span>
                              </button>
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  console.log('Archive conversation:', conversation.id)
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
                                  console.log('Delete conversation:', conversation.id)
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
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex space-x-4 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-transparent">
                    <img 
                      src={veeforeLogo} 
                      alt="VeeFore AI" 
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                )}
                <div className={`${
                  message.role === 'user' 
                    ? 'max-w-md ml-auto' 
                    : 'flex-1 max-w-3xl'
                }`} style={{
                  minWidth: 0,
                  overflow: 'hidden'
                }}>
                  <div className={`px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-gray-200 text-gray-900'
                      : 'bg-transparent text-gray-900'
                  }`} style={{
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    maxWidth: '100%'
                  }}>
                    {message.role === 'assistant' && typewriterMessageIds.has(message.id) ? (
                      <TypewriterText 
                        text={message.content} 
                        speed={25}
                        onComplete={() => {
                          // Remove from typewriter set when animation completes
                          setTypewriterMessageIds(prev => {
                            const newSet = new Set(prev)
                            newSet.delete(message.id)
                            return newSet
                          })
                        }}
                      />
                    ) : message.role === 'assistant' ? (
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
                        {streamingContent[message.id] || message.content}
                        {streamingContent[message.id] && isGenerating && (
                          <span className="animate-pulse text-gray-400">|</span>
                        )}
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
                  {/* Hide timestamp during typewriter animation for AI messages */}
                  {!(message.role === 'assistant' && typewriterMessageIds.has(message.id)) && (
                    <div className={`mt-2 text-xs text-gray-500 ${
                      message.role === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {new Date().toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  )}
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-600 text-white">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {(createConversationMutation.isPending || sendMessageMutation.isPending) && (
              <div className="flex space-x-4 justify-start">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-transparent">
                  <img 
                    src={veeforeLogo} 
                    alt="VeeFore AI" 
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div className="bg-transparent px-4 py-3 rounded-2xl">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
                const shouldShowStop = createConversationMutation.isPending || sendMessageMutation.isPending || isGenerating || isGeneratingRef.current
                console.log('VeeGPT: Stop button visibility check:', {
                  createPending: createConversationMutation.isPending,
                  sendPending: sendMessageMutation.isPending,
                  isGenerating,
                  isGeneratingRef: isGeneratingRef.current,
                  shouldShowStop
                })
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
  )
}