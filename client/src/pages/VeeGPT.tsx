import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Mic,
  Send,
  Settings2,
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
  Share,
  MoreHorizontal,
  User,
  Bot
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '@/lib/queryClient'
import { ChatConversation, ChatMessage } from '@shared/schema'

interface ConversationWithMessages extends ChatConversation {
  messages?: ChatMessage[]
}

export default function VeeGPT() {
  const [inputText, setInputText] = useState('')
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null)
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

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
    enabled: hasSentFirstMessage
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
    if (conversations.length > 0 && !currentConversationId && !hasSentFirstMessage) {
      setHasSentFirstMessage(true)
      setCurrentConversationId(conversations[0].id)
    }
  }, [conversations, currentConversationId, hasSentFirstMessage])

  // Welcome screen layout (when no conversation is active)
  if (!hasSentFirstMessage) {
    return (
      <div className="h-full bg-gray-50 flex flex-col items-center justify-center px-4">
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
    <div className="h-full bg-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <button
            onClick={startNewChat}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium">New chat</span>
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => selectConversation(conversation.id)}
                className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${
                  currentConversationId === conversation.id
                    ? 'bg-gray-700'
                    : 'hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <span className="text-sm truncate">{conversation.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div className="p-4 border-t border-gray-700">
          <div className="text-xs text-gray-400">
            VeeGPT can make mistakes. Check important info.
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-semibold text-gray-900">VeeGPT</h1>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
              Beta
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Share className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex space-x-4 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-xl px-4 py-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white ml-auto'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            {(createConversationMutation.isPending || sendMessageMutation.isPending) && (
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 px-4 py-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end space-x-4">
              <div className="flex-1 border border-gray-300 rounded-lg">
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
                  placeholder="Message VeeGPT..."
                  className="w-full px-4 py-3 border-0 resize-none focus:outline-none focus:ring-0 rounded-lg"
                  style={{ 
                    height: '48px',
                    maxHeight: '200px'
                  }}
                  rows={1}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || createConversationMutation.isPending || sendMessageMutation.isPending}
                className="px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}