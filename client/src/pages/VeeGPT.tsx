import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '@/lib/queryClient'
import { 
  Send, 
  Plus, 
  Search, 
  MessageSquare,
  Settings,
  User,
  Sparkles,
  Edit2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface ChatConversation {
  id: number
  title: string
  userId: number
  workspaceId: number
  createdAt: Date
  updatedAt: Date
}

interface VeeGPTMessage {
  id: number
  conversationId: number
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

interface ChatState {
  currentConversationId: number | null
  hasStartedChat: boolean
  sidebarOpen: boolean
}

export default function VeeGPT() {
  const [inputText, setInputText] = useState('')
  const [chatState, setChatState] = useState<ChatState>({
    currentConversationId: null,
    hasStartedChat: false,
    sidebarOpen: false
  })
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  // Quick prompts for initial page
  const quickPrompts = [
    "Create an Instagram post for my fitness brand",
    "Write a trending TikTok script about productivity", 
    "Generate hashtags for a food blog",
    "Draft a YouTube video description",
    "Create a LinkedIn post about entrepreneurship",
    "Write a Facebook ad copy for an online course"
  ]

  // Fetch conversations
  const { data: conversations = [] } = useQuery<ChatConversation[]>({
    queryKey: ['/api/chat/conversations'],
    queryFn: () => apiRequest('/api/chat/conversations'),
    enabled: chatState.hasStartedChat
  })

  // Fetch messages for current conversation
  const { data: messages = [], isLoading: messagesLoading } = useQuery<VeeGPTMessage[]>({
    queryKey: ['/api/chat/messages', chatState.currentConversationId],
    queryFn: () => apiRequest(`/api/chat/messages/${chatState.currentConversationId}`),
    enabled: !!chatState.currentConversationId
  })

  // Create new conversation
  const createConversationMutation = useMutation({
    mutationFn: (data: { title: string; message: string }) => 
      apiRequest('/api/chat/conversations', { 
        method: 'POST', 
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }),
    onSuccess: (newConversation: ChatConversation) => {
      setChatState({
        currentConversationId: newConversation.id,
        hasStartedChat: true,
        sidebarOpen: true
      })
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations'] })
      queryClient.invalidateQueries({ queryKey: ['/api/chat/messages', newConversation.id] })
    }
  })

  // Send message
  const sendMessageMutation = useMutation({
    mutationFn: (data: { conversationId: number; message: string }) => 
      apiRequest('/api/chat/send', { 
        method: 'POST', 
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/messages', chatState.currentConversationId] })
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations'] })
    }
  })

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    if (!chatState.currentConversationId) {
      // Create new conversation with first message
      const title = inputText.slice(0, 50) + (inputText.length > 50 ? '...' : '')
      createConversationMutation.mutate({ title, message: inputText })
    } else {
      // Send message to existing conversation
      sendMessageMutation.mutate({ 
        conversationId: chatState.currentConversationId, 
        message: inputText 
      })
    }

    setInputText('')
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
    setChatState({
      currentConversationId: null,
      hasStartedChat: false,
      sidebarOpen: false
    })
    setInputText('')
  }

  const selectConversation = (conversationId: number) => {
    setChatState({
      currentConversationId: conversationId,
      hasStartedChat: true,
      sidebarOpen: true
    })
  }

  const toggleSidebar = () => {
    setChatState(prev => ({
      ...prev,
      sidebarOpen: !prev.sidebarOpen
    }))
  }

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // If chat hasn't started, show the initial prompt interface
  if (!chatState.hasStartedChat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                VeeGPT
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Your AI-powered social media assistant. Create engaging content, optimize strategies, and grow your online presence.
            </p>
          </div>

          {/* Main Chat Input */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  <textarea
                    ref={inputRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask me anything about social media marketing, content creation, or growth strategies..."
                    className="w-full bg-transparent text-white placeholder-gray-400 border-none resize-none focus:outline-none text-lg min-h-[100px]"
                    rows={4}
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || createConversationMutation.isPending}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-none min-w-[50px] h-[50px] rounded-xl"
                >
                  {createConversationMutation.isPending ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              Try these prompts to get started:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="group bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left transition-all duration-200 border border-white/10 hover:border-white/20"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-white group-hover:text-purple-300 transition-colors">
                      {prompt}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Full chat interface
  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div className={`${chatState.sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-gray-900 border-r border-gray-700 flex flex-col overflow-hidden`}>
        {chatState.sidebarOpen && (
          <>
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">VeeGPT</h2>
                <Button
                  onClick={toggleSidebar}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={startNewChat}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => selectConversation(conversation.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    chatState.currentConversationId === conversation.id
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate text-sm">{conversation.title}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center space-x-2 text-gray-400">
                <User className="h-4 w-4" />
                <span className="text-sm">Social Media Assistant</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-4">
            {!chatState.sidebarOpen && (
              <Button
                onClick={toggleSidebar}
                variant="ghost"
                size="sm"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                VeeGPT
              </h1>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messagesLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))
            )}
            
            {/* Typing indicators */}
            {(createConversationMutation.isPending || sendMessageMutation.isPending) && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-4">
              <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600 p-4">
                <textarea
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Message VeeGPT..."
                  className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-500 border-none resize-none focus:outline-none"
                  rows={1}
                  style={{ minHeight: '24px', maxHeight: '200px' }}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || sendMessageMutation.isPending}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-none w-12 h-12 rounded-xl"
              >
                {sendMessageMutation.isPending ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}