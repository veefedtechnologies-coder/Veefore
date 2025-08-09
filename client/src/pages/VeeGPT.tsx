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
  Plus,
  MessageSquare,
  User,
  Bot,
  Paperclip
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '@/lib/queryClient'

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

  // Create new conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest('/api/chat/conversations', {
        method: 'POST',
        body: JSON.stringify({ content })
      })
      return response
    },
    onSuccess: (data) => {
      setCurrentConversationId(data.conversation.id)
      setHasSentFirstMessage(true)
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations'] })
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations', data.conversation.id, 'messages'] })
    }
  })

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: number, content: string }) => {
      const response = await apiRequest(`/api/chat/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content })
      })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations', currentConversationId, 'messages'] })
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations'] })
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
  }

  const selectConversation = (conversationId: number) => {
    setCurrentConversationId(conversationId)
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
    <div className="h-full w-full bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">VeeGPT</h2>
              <p className="text-xs text-gray-500">AI Assistant</p>
            </div>
          </div>
          <button
            onClick={startNewChat}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>New Conversation</span>
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 space-y-2">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              Recent Conversations
            </div>
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => selectConversation(conversation.id)}
                className={`w-full text-left p-3 rounded-xl transition-all duration-200 group hover:shadow-sm ${
                  currentConversationId === conversation.id
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 shadow-sm'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    currentConversationId === conversation.id
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                  }`}>
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-medium truncate ${
                      currentConversationId === conversation.id
                        ? 'text-gray-900'
                        : 'text-gray-700 group-hover:text-gray-900'
                    }`}>
                      {conversation.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {conversation.messageCount} messages
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="text-xs text-gray-500 text-center">
            🤖 VeeGPT can make mistakes. Verify important information.
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50/30 to-white">
          <div className="max-w-4xl mx-auto space-y-8">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex space-x-4 ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                    : 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <Bot className="w-5 h-5" />
                  )}
                </div>
                <div className={`flex-1 max-w-3xl`}>
                  <div className={`px-6 py-4 rounded-2xl shadow-sm border ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-200 ml-auto max-w-2xl'
                      : 'bg-white text-gray-900 border-gray-100'
                  }`}>
                    <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                  </div>
                  <div className={`mt-2 text-xs text-gray-500 ${
                    message.role === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    {new Date(message.createdAt).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
            {(createConversationMutation.isPending || sendMessageMutation.isPending) && (
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Floating transparent input like ChatGPT - no containers */}
        <div className="veegpt-input-container" style={{ 
          padding: '24px', 
          background: 'none',
          backgroundColor: 'transparent'
        }}>
          <div style={{ 
            maxWidth: '48rem', 
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'none',
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none'
          }}>
            <div style={{
              background: 'none',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              padding: '6px',
              cursor: 'pointer'
            }}>
              <Paperclip style={{ 
                width: '20px', 
                height: '20px',
                color: '#6b7280'
              }} />
            </div>
            
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
                flex: 1,
                minHeight: '24px',
                maxHeight: '120px',
                overflow: 'auto',
                outline: 'none',
                border: 'none',
                background: 'none',
                backgroundColor: 'transparent',
                color: '#374151',
                fontSize: '16px',
                lineHeight: '1.5',
                padding: '8px 0',
                margin: 0,
                boxShadow: 'none',
                borderRadius: 0,
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                appearance: 'none'
              }}
              data-placeholder={inputText.length === 0 ? "Message VeeGPT" : ""}
            />
            
            <div
              onClick={handleSendMessage}
              style={{
                background: 'none',
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                padding: '6px',
                cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                color: inputText.trim() && !createConversationMutation.isPending && !sendMessageMutation.isPending ? '#1f2937' : '#9ca3af'
              }}
            >
              {(createConversationMutation.isPending || sendMessageMutation.isPending) ? (
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  border: '2px solid #9ca3af', 
                  borderTop: '2px solid transparent', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite' 
                }} />
              ) : (
                <Send style={{ width: '20px', height: '20px' }} />
              )}
            </div>

            <div style={{
              background: 'none',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              padding: '6px',
              cursor: 'pointer'
            }}>
              <Mic style={{ 
                width: '20px', 
                height: '20px',
                color: '#6b7280'
              }} />
            </div>
          </div>
          
          <div style={{ 
            textAlign: 'center', 
            marginTop: '16px',
            background: 'none',
            backgroundColor: 'transparent'
          }}>
            <div style={{ 
              fontSize: '12px', 
              color: '#9ca3af',
              background: 'none',
              backgroundColor: 'transparent'
            }}>
              VeeGPT can make mistakes. Check important info.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}