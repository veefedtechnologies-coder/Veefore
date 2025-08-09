import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mic, MicOff, Send, X } from 'lucide-react'
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
  }

  const selectConversation = (conversationId: number) => {
    setCurrentConversationId(conversationId)
    setIsGenerating(false)
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-white">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800/50 bg-black/20 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <img src={veeforeLogo} alt="VeeFore" className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                VeeGPT
              </h1>
              <p className="text-sm text-gray-400">AI Assistant</p>
            </div>
          </div>
          
          <button
            onClick={startNewChat}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium"
          >
            New Chat
          </button>
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
                      AI
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
                      {message.content || '...'}
                    </div>
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-bold">
                      U
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
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Message VeeGPT"
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400 resize-none min-h-[24px] text-base"
                  disabled={createConversationMutation.isPending || sendMessageMutation.isPending || isGenerating}
                  style={{
                    background: 'transparent',
                  }}
                  data-placeholder={inputText.length === 0 ? "Message VeeGPT" : ""}
                />
              </div>
              
              {(createConversationMutation.isPending || sendMessageMutation.isPending || isGenerating) ? (
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
                  <X size={16} />
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