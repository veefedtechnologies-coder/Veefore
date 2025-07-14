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
  ChevronDown
} from 'lucide-react'

export default function VeeGPT() {
  const [inputText, setInputText] = useState('')
  const [brandVoice, setBrandVoice] = useState('Brand voice')
  const inputRef = useRef<HTMLTextAreaElement>(null)

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

  const handleSendMessage = () => {
    if (!inputText.trim()) return
    // Handle send logic here
    console.log('Sending message:', inputText)
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
              disabled={!inputText.trim()}
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
          {/* First Row - 4 buttons (full width) */}
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
            Like all AI tools, OwlyGPT may not always be accurate. Verify important details.
          </p>
        </div>
      </div>
    </div>
  )
}