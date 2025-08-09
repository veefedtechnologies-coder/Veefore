import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mic, MicOff, Send, X, ChevronDown, MessageSquare, User, Bot, Paperclip, Edit, Search, MoreHorizontal, ChevronLeft, ChevronRight, Zap, BarChart3, Share, Archive, Trash2, Square } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { apiRequest, queryClient } from '@/lib/queryClient'
import veeforeLogo from '@assets/output-onlinepngtools_1754726286825.png'

// TypewriterText component for simulating typing
const TypewriterText = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 20) // Adjust speed here
      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, onComplete])

  return <span>{displayText}</span>
}

export default function VeeGPT() {
  // Basic state
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false)
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null)
  const [inputText, setInputText] = useState('')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [hoveredChatId, setHoveredChatId] = useState<number | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [typewriterMessageIds, setTypewriterMessageIds] = useState(new Set<number>())
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentEventSource, setCurrentEventSource] = useState<EventSource | null>(null)
  
  // Refs
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Quick prompts for getting started
  const quickPrompts = [
    "What can you help me with?",
    "Write a blog post about AI",
    "Explain quantum computing",
    "Create a marketing strategy"
  ]

  // Fetch conversations
  const { data: conversations } = useQuery({
    queryKey: ['/api/chat/conversations'],
    queryFn: () => apiRequest('/api/chat/conversations')
  })

  // Fetch messages for current conversation
  const { data: messages } = useQuery({
    queryKey: ['/api/chat/conversations', currentConversationId, 'messages'],
    queryFn: () => apiRequest(`/api/chat/conversations/${currentConversationId}/messages`),
    enabled: !!currentConversationId
  })

  // Streaming message handler
  const handleStreamingMessage = async (content: string, conversationId: number) => {
    setIsGenerating(true)
    
    try {
      // Get Firebase auth token
      const { getAuth } = await import('firebase/auth')
      const auth = getAuth()
      const user = auth.currentUser
      
      if (!user) {
        throw new Error('No authenticated user')
      }
      
      const token = await user.getIdToken()
      console.log('VeeGPT: Starting streaming request')

      // Use fetch for streaming response
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

      // Set up cancellation
      setCurrentEventSource({ close: () => reader.cancel() } as any)

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
                  // Ignore parse errors for incomplete data
                }
              }
            }
          }
        } catch (error) {
          console.error('VeeGPT: Stream reading error:', error)
          throw error
        } finally {
          setIsGenerating(false)
        }
      }

      await readStream()
      return { success: true }

    } catch (error) {
      console.error('VeeGPT: Streaming error:', error)
      setIsGenerating(false)
      if (currentEventSource) {
        currentEventSource.close()
        setCurrentEventSource(null)
      }
      throw error
    }
  }

  const handleStreamEvent = (data: any) => {
    console.log('VeeGPT: Stream event:', data)

    switch (data.type) {
      case 'userMessage':
        // Refresh messages to show user message
        if (currentConversationId) {
          queryClient.invalidateQueries({ 
            queryKey: ['/api/chat/conversations', currentConversationId, 'messages'] 
          })
        }
        break

      case 'aiMessageStart':
        // AI message created, refresh to show placeholder
        if (currentConversationId) {
          queryClient.invalidateQueries({ 
            queryKey: ['/api/chat/conversations', currentConversationId, 'messages'] 
          })
        }
        break

      case 'chunk':
        // Update the AI message content in real-time
        if (data.messageId && data.content && currentConversationId) {
          updateMessageContentInCache(data.messageId, data.content)
        }
        break

      case 'complete':
        // Final refresh to ensure consistency
        if (currentConversationId) {
          queryClient.invalidateQueries({ 
            queryKey: ['/api/chat/conversations', currentConversationId, 'messages'] 
          })
          queryClient.invalidateQueries({ 
            queryKey: ['/api/chat/conversations'] 
          })
        }
        setIsGenerating(false)
        break

      case 'error':
        console.error('VeeGPT: Stream error:', data.error)
        setIsGenerating(false)
        if (currentConversationId) {
          queryClient.invalidateQueries({ 
            queryKey: ['/api/chat/conversations', currentConversationId, 'messages'] 
          })
        }
        break
    }
  }

  const updateMessageContentInCache = (messageId: number, newContent: string) => {
    queryClient.setQueryData(
      ['/api/chat/conversations', currentConversationId, 'messages'], 
      (oldMessages: any[] | undefined) => {
        if (!oldMessages) return oldMessages
        
        return oldMessages.map(msg => 
          msg.id === messageId 
            ? { ...msg, content: newContent }
            : msg
        )
      }
    )
  }

  // Create new conversation with streaming
  const createConversationMutation = useMutation({
    mutationFn: async (content: string) => {
      // Create conversation with first message content (backend will generate title)
      const newConv = await apiRequest('/api/chat/conversations', {
        method: 'POST',
        body: JSON.stringify({ content })
      })

      setCurrentConversationId(newConv.id)
      setHasSentFirstMessage(true)
      
      return newConv
    },
    onMutate: () => {
      setHasSentFirstMessage(true)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations'] })
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations', data.id, 'messages'] })
    },
    onError: () => {
      setHasSentFirstMessage(false)
      setCurrentConversationId(null)
      setIsGenerating(false)
      if (currentEventSource) {
        currentEventSource.close()
        setCurrentEventSource(null)
      }
    }
  })

  // Send message to existing conversation with streaming
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!currentConversationId) throw new Error('No conversation selected')
      await handleStreamingMessage(content, currentConversationId)
      return { success: true }
    },
    onError: (error) => {
      console.error('VeeGPT: Error sending message:', error)
      setIsGenerating(false)
      if (currentEventSource) {
        currentEventSource.close()
        setCurrentEventSource(null)
      }
    }
  })

  // Stop generation mutation
  const stopGenerationMutation = useMutation({
    mutationFn: async () => {
      if (!currentConversationId) return
      return apiRequest(`/api/chat/conversations/${currentConversationId}/stop`, {
        method: 'POST'
      })
    }
  })

  const handleSendMessage = async () => {
    if (!inputText.trim()) return
    
    const content = inputText.trim()
    setInputText('')
    
    try {
      if (!hasSentFirstMessage || !currentConversationId) {
        console.log('VeeGPT: Creating new conversation with streaming')
        // The backend will handle both conversation creation AND AI response streaming
        await createConversationMutation.mutateAsync(content)
      } else {
        console.log('VeeGPT: Sending to existing conversation:', currentConversationId)
        await sendMessageMutation.mutateAsync(content)
      }
    } catch (error) {
      console.error('VeeGPT: Error sending message:', error)
    }
    
    // Focus back to input
    inputRef.current?.focus()
  }

  const handleStopGeneration = () => {
    console.log('VeeGPT: Stopping streaming generation')
    setIsGenerating(false)
    if (currentEventSource) {
      currentEventSource.close()
      setCurrentEventSource(null)
    }

    if (currentConversationId) {
      console.log('VeeGPT: Stopping generation for conversation:', currentConversationId)
      stopGenerationMutation.mutate()
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
    setIsGenerating(false)
    setTypewriterMessageIds(new Set())
  }

  const selectConversation = (conversationId: number) => {
    setCurrentConversationId(conversationId)
    setIsGenerating(false)
    setTypewriterMessageIds(new Set())
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Check if there are any messages with typewriter animation
  useEffect(() => {
    if (messages) {
      const latestAiMessage = messages
        .filter((msg: any) => msg.role === 'assistant')
        .pop()
      
      if (latestAiMessage && !typewriterMessageIds.has(latestAiMessage.id)) {
        setTypewriterMessageIds(prev => new Set(prev).add(latestAiMessage.id))
      }
    }
  }, [messages, typewriterMessageIds])

  // Initialize conversation state when conversations load
  useEffect(() => {
    if (conversations && conversations.length > 0 && !currentConversationId) {
      setHasSentFirstMessage(true)
      setCurrentConversationId(conversations[0].id)
    } else if (conversations && conversations.length === 0 && currentConversationId) {
      setHasSentFirstMessage(false)
      setCurrentConversationId(null)
    }
  }, [conversations, currentConversationId])

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-white">
      {/* Sidebar */}
      <div className={`bg-[#0f0f14] border-r border-gray-800/50 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-80'
      }`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <img src={veeforeLogo} alt="VeeFore" className="w-8 h-8" />
              <div>
                <h1 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  VeeGPT
                </h1>
                <p className="text-xs text-gray-400">AI Assistant</p>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* New Chat Button */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-gray-800/50">
            <button
              onClick={startNewChat}
              className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium"
            >
              <MessageSquare size={18} />
              New Chat
            </button>
          </div>
        )}

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {!sidebarCollapsed && conversations?.map((conversation: any) => (
            <div
              key={conversation.id}
              className={`group relative cursor-pointer px-4 py-3 border-b border-gray-800/30 hover:bg-gray-800/30 transition-colors ${
                currentConversationId === conversation.id ? 'bg-gray-800/50 border-l-2 border-l-blue-500' : ''
              }`}
              onClick={() => selectConversation(conversation.id)}
              onMouseEnter={() => setHoveredChatId(conversation.id)}
              onMouseLeave={() => setHoveredChatId(null)}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                  <MessageSquare size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-200 truncate">
                    {conversation.title || 'New Chat'}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {conversation.messageCount || 0} messages
                  </p>
                </div>
                
                {hoveredChatId === conversation.id && (
                  <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-gray-700 rounded">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800/50 bg-black/20 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            {sidebarCollapsed && (
              <div className="flex items-center gap-3">
                <img src={veeforeLogo} alt="VeeFore" className="w-8 h-8" />
                <div>
                  <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    VeeGPT
                  </h1>
                  <p className="text-sm text-gray-400">AI Assistant</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors text-sm"
              >
                <Zap size={16} />
                VeeGPT 4.0
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Messages or Welcome Screen */}
        <div className="flex-1 overflow-y-auto">
          {!hasSentFirstMessage ? (
            // Welcome Screen
            <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto px-6">
              <div className="text-center mb-12">
                <div className="mb-6">
                  <img src={veeforeLogo} alt="VeeFore" className="w-24 h-24 mx-auto mb-4" />
                </div>
                <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                  VeeGPT
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  Your intelligent AI assistant for creative content, strategic insights, and more
                </p>
              </div>
              
              {/* Quick Prompts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mb-8">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="p-4 text-left border border-gray-700 rounded-xl hover:border-gray-600 hover:bg-gray-800/30 transition-all duration-200 group"
                  >
                    <p className="text-gray-300 group-hover:text-white transition-colors">
                      {prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Chat Messages
            <div className="flex-1 p-6 space-y-6">
              {messages?.map((message: any) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                      <Bot size={16} />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white ml-auto'
                        : 'bg-gray-800/50 text-gray-100'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">
                      {typewriterMessageIds.has(message.id) ? (
                        <TypewriterText 
                          text={message.content || '...'} 
                          onComplete={() => {
                            setTypewriterMessageIds(prev => {
                              const newSet = new Set(prev)
                              newSet.delete(message.id)
                              return newSet
                            })
                          }}
                        />
                      ) : (
                        message.content || '...'
                      )}
                    </div>
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-bold">
                      <User size={16} />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-gray-800/50">
          <div className="relative max-w-4xl mx-auto">
            <div 
              className="relative bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 transition-all duration-200 hover:border-gray-600/50 focus-within:border-blue-500/50"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="flex items-end gap-3">
                <button className="text-gray-400 hover:text-gray-300 transition-colors">
                  <Paperclip size={20} />
                </button>
                
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Message VeeGPT"
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400 resize-none min-h-[24px] text-base"
                  disabled={createConversationMutation.isPending || sendMessageMutation.isPending || isGenerating || typewriterMessageIds.size > 0}
                  style={{
                    background: 'transparent',
                  }}
                  data-placeholder={inputText.length === 0 ? "Message VeeGPT" : ""}
                />
              </div>
              
              {(createConversationMutation.isPending || sendMessageMutation.isPending || isGenerating || typewriterMessageIds.size > 0) ? (
                <button
                  onClick={handleStopGeneration}
                  style={{
                    background: 'transparent',
                    border: '1px solid #ef4444',
                    borderRadius: '8px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    right: '16px',
                    bottom: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: '#ef4444'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
                    e.currentTarget.style.borderColor = '#dc2626'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = '#ef4444'
                  }}
                >
                  <Square size={16} fill="currentColor" />
                </button>
              ) : (
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  style={{
                    background: inputText.trim() ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(107, 114, 128, 0.3)',
                    border: 'none',
                    borderRadius: '8px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    right: '16px',
                    bottom: '16px',
                    cursor: inputText.trim() ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                    color: 'white'
                  }}
                >
                  <Send size={16} />
                </button>
              )}
            </div>
            
            <p className="text-center text-xs text-gray-500 mt-3">
              VeeGPT can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}