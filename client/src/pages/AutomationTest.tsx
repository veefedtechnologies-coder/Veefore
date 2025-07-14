import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Instagram,
  Bot,
  Heart,
  MessageCircle,
  User,
  Send,
  Bookmark,
  Camera,
  MoreHorizontal,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Globe,
  Settings,
  Brain,
  Sparkles,
  Plus,
  X,
  Eye,
  Smile,
  Activity,
  Hash
} from 'lucide-react'

export default function AutomationTest() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [selectedContentType, setSelectedContentType] = useState('')
  const [keywords, setKeywords] = useState(['info', 'price', 'link'])
  const [newKeyword, setNewKeyword] = useState('')
  const [commentReply, setCommentReply] = useState('Check your DMs for more info! 📩')
  const [dmMessage, setDmMessage] = useState('Thanks for your interest! Here\'s more information about our services.')
  const [previewComment, setPreviewComment] = useState('Amazing content! info please!')
  const [userName, setUserName] = useState('your_account')

  const steps = [
    { number: 1, title: 'Platform Selection', icon: Globe },
    { number: 2, title: 'Automation Type', icon: Bot },
    { number: 3, title: 'Configure & Preview', icon: Settings },
    { number: 4, title: 'AI & Advanced', icon: Brain },
    { number: 5, title: 'Deploy & Test', icon: Sparkles }
  ]

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()])
      setNewKeyword('')
    }
  }

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword))
  }

  const InstagramPostPreview = () => (
    <div className="max-w-sm mx-auto bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200">
      {/* Instagram Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500">2 hours ago</p>
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-gray-500" />
      </div>

      {/* Instagram Post Image */}
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <Camera className="w-16 h-16 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Your Post Image</p>
        </div>
      </div>

      {/* Instagram Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <Heart className="w-6 h-6 text-gray-700 hover:text-red-500 cursor-pointer transition-colors" />
            <MessageCircle className="w-6 h-6 text-gray-700 hover:text-blue-500 cursor-pointer transition-colors" />
            <Send className="w-6 h-6 text-gray-700 hover:text-blue-500 cursor-pointer transition-colors" />
          </div>
          <Bookmark className="w-6 h-6 text-gray-700 hover:text-gray-900 cursor-pointer transition-colors" />
        </div>

        <div className="mb-3">
          <p className="text-sm text-gray-900">
            <span className="font-semibold">{userName}</span> Check out our latest product! What do you think? 🚀
          </p>
        </div>

        {/* Comments Section */}
        <div className="space-y-3">
          {/* User Comment */}
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-3 h-3 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                <span className="font-semibold">username</span> {previewComment}
              </p>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-xs text-gray-500">2m</span>
                <button className="text-xs text-gray-500 hover:text-gray-700">Like</button>
                <button className="text-xs text-gray-500 hover:text-gray-700">Reply</button>
              </div>
            </div>
          </div>

          {/* Bot Reply */}
          {commentReply && (
            <div className="flex items-start space-x-2 ml-8">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">{userName}</span> {commentReply}
                </p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-xs text-gray-500">now</span>
                  <span className="text-xs text-blue-500 font-medium">✓ Automated</span>
                </div>
              </div>
            </div>
          )}

          {/* DM Preview Indicator */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Auto DM Sent</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              "{dmMessage.substring(0, 50)}..."
            </p>
          </div>
        </div>

        {/* Add Comment Input */}
        <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-gray-100">
          <Smile className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Add a comment..."
            value={previewComment}
            onChange={(e) => setPreviewComment(e.target.value)}
            className="flex-1 text-sm text-gray-600 placeholder-gray-400 border-none outline-none"
          />
          <button className="text-sm font-semibold text-blue-500 hover:text-blue-700">
            Post
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10" />
      
      {/* Animated Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute top-32 right-20 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl opacity-30 animate-bounce" />
      <div className="absolute bottom-20 left-32 w-40 h-40 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full blur-3xl opacity-15 animate-pulse" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="relative inline-flex items-center justify-center w-32 h-32 mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-40 animate-pulse" />
            <div className="relative w-28 h-28 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
              <Bot className="w-14 h-14 text-white" />
            </div>
          </div>
          <h1 className="text-7xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6 tracking-tight">
            Automation Studio
          </h1>
          <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Create intelligent social media automations with <span className="text-blue-400 font-semibold">real-time preview</span> and <span className="text-purple-400 font-semibold">AI-powered responses</span>
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-10">
            <div className="flex items-center space-x-12">
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={step.number} className="flex items-center">
                    <div className="flex flex-col items-center group">
                      <div className="relative">
                        <div className={`absolute inset-0 rounded-full blur-lg transition-all duration-500 ${
                          currentStep >= step.number 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 opacity-40' 
                            : 'bg-white/20 opacity-0'
                        }`} />
                        <div className={`relative w-20 h-20 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500 ${
                          currentStep >= step.number 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-2xl scale-110' 
                            : 'bg-white/10 backdrop-blur-sm border-2 border-white/20 text-gray-400 shadow-lg'
                        }`}>
                          {currentStep > step.number ? (
                            <CheckCircle className="w-10 h-10" />
                          ) : (
                            <Icon className="w-10 h-10" />
                          )}
                        </div>
                      </div>
                      <div className="mt-4 text-center">
                        <div className={`text-sm font-semibold transition-colors duration-300 ${
                          currentStep >= step.number ? 'text-white' : 'text-gray-400'
                        }`}>
                          {step.title}
                        </div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-32 h-1 mx-10 rounded-full transition-all duration-500 ${
                        currentStep > step.number 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg' 
                          : 'bg-white/20'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="relative h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-700 shadow-lg"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-8">
            {currentStep === 1 && (
              <div className="text-center lg:text-left">
                <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-40 animate-pulse" />
                  <div className="relative w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-3">
                  Platform Selection
                </h2>
                <p className="text-xl text-gray-400">
                  Choose your social media platform and content type
                </p>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="text-center lg:text-left">
                <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full blur-xl opacity-40 animate-pulse" />
                  <div className="relative w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-3">
                  Automation Type
                </h2>
                <p className="text-xl text-gray-400">
                  Select the type of automation you want to create
                </p>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="text-center lg:text-left">
                <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-600 rounded-full blur-xl opacity-40 animate-pulse" />
                  <div className="relative w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
                    <Settings className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-3">
                  Configure & Preview
                </h2>
                <p className="text-xl text-gray-400">
                  Set up your automation rules and see them in action
                </p>
              </div>
            )}
            
            {currentStep === 4 && (
              <div className="text-center lg:text-left">
                <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full blur-xl opacity-40 animate-pulse" />
                  <div className="relative w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-3">
                  AI & Advanced
                </h2>
                <p className="text-xl text-gray-400">
                  Configure AI responses and advanced settings
                </p>
              </div>
            )}
            
            {currentStep === 5 && (
              <div className="text-center lg:text-left">
                <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-600 rounded-full blur-xl opacity-40 animate-pulse" />
                  <div className="relative w-16 h-16 bg-gradient-to-r from-pink-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-3">
                  Deploy & Test
                </h2>
                <p className="text-xl text-gray-400">
                  Deploy your automation and test it with real scenarios
                </p>
              </div>
            )}

            <div className="space-y-8">
              {/* Step 1: Platform Selection */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  {/* Platform Selection */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl" />
                    <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                          <Globe className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">
                          Choose Platform
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['Instagram', 'Facebook', 'Twitter', 'LinkedIn'].map((platform) => (
                          <div
                            key={platform}
                            onClick={() => setSelectedPlatform(platform)}
                            className={`relative cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 ${
                              selectedPlatform === platform
                                ? 'border-blue-500 bg-blue-500/20 scale-105'
                                : 'border-white/20 bg-white/5 hover:bg-white/10'
                            }`}
                          >
                            <div className="text-center">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Instagram className="w-6 h-6 text-white" />
                              </div>
                              <h4 className="text-white font-semibold">{platform}</h4>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Content Type Selection */}
                  {selectedPlatform && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl" />
                      <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                            <Camera className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-white">
                            Content Type
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {['Post', 'Story', 'Reel', 'Video', 'Carousel'].map((type) => (
                            <div
                              key={type}
                              onClick={() => setSelectedContentType(type)}
                              className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 ${
                                selectedContentType === type
                                  ? 'border-purple-500 bg-purple-500/20 scale-105'
                                  : 'border-white/20 bg-white/5 hover:bg-white/10'
                              }`}
                            >
                              <div className="text-center">
                                <h4 className="text-white font-medium">{type}</h4>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Automation Type */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl" />
                    <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                          <Bot className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">
                          Automation Types
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { name: 'Comment to DM', description: 'Auto-reply to comments and send DMs' },
                          { name: 'Auto Follow', description: 'Automatically follow users who engage' },
                          { name: 'Story Replies', description: 'Respond to story reactions automatically' },
                          { name: 'Hashtag Monitoring', description: 'Track and respond to hashtag mentions' }
                        ].map((automation) => (
                          <div
                            key={automation.name}
                            className="cursor-pointer p-6 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-300"
                          >
                            <div className="text-center">
                              <h4 className="text-white font-semibold mb-2">{automation.name}</h4>
                              <p className="text-gray-400 text-sm">{automation.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Configure & Preview */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  {/* Keywords Configuration */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl" />
                    <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                          <Hash className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">
                          Trigger Keywords
                        </h3>
                      </div>
                      <div className="flex gap-3 mb-6">
                        <Input
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          placeholder="Enter keyword..."
                          className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                          onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                        />
                        <Button 
                          onClick={addKeyword}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
                        >
                          <Plus className="w-5 h-5" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {keywords.map((keyword) => (
                          <span
                            key={keyword}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 text-white rounded-full text-sm font-medium hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300"
                          >
                            {keyword}
                            <button
                              onClick={() => removeKeyword(keyword)}
                              className="hover:text-red-400 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Response Configuration */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-3xl blur-xl" />
                    <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                          <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">
                          Response Messages
                        </h3>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <Label htmlFor="comment-reply" className="text-sm font-medium text-gray-300 mb-2 block">
                            Comment Reply
                          </Label>
                          <Input
                            id="comment-reply"
                            value={commentReply}
                            onChange={(e) => setCommentReply(e.target.value)}
                            placeholder="Public reply to the comment..."
                            className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="dm-message" className="text-sm font-medium text-gray-300 mb-2 block">
                            DM Message
                          </Label>
                          <Textarea
                            id="dm-message"
                            value={dmMessage}
                            onChange={(e) => setDmMessage(e.target.value)}
                            placeholder="Private message sent to user..."
                            className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                            rows={4}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Live Preview Panel - Only show after platform selection */}
          {selectedPlatform && selectedContentType && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur-xl opacity-40 animate-pulse" />
                  <div className="relative w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-3">
                  Live Preview
                </h2>
                <p className="text-lg text-gray-400">
                  {selectedPlatform} {selectedContentType} automation preview
                </p>
              </div>

              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-3xl blur-xl" />
                  <div className="relative">
                    <InstagramPostPreview />
                  </div>
                </div>
              </div>

              {/* Automation Flow */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl" />
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      Automation Flow
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">1</span>
                      </div>
                      <span className="text-sm text-gray-300">User comments with keyword: "{keywords[0] || 'keyword'}"</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">2</span>
                      </div>
                      <span className="text-sm text-gray-300">Bot replies to comment publicly</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">3</span>
                      </div>
                      <span className="text-sm text-gray-300">Bot sends private DM with detailed info</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Platform & Content Type Info */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-3xl blur-xl" />
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      Platform Setup
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Instagram className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm text-gray-300">Platform: {selectedPlatform}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Camera className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm text-gray-300">Content Type: {selectedContentType}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Placeholder when no platform selected */}
          {!selectedPlatform && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full blur-xl opacity-20" />
                  <div className="relative w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center shadow-2xl">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-3">
                  Preview
                </h2>
                <p className="text-lg text-gray-400">
                  Select a platform to see live preview
                </p>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-3xl blur-xl" />
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 shadow-2xl">
                  <div className="text-center text-gray-400">
                    <Globe className="w-16 h-16 mx-auto mb-4 opacity-40" />
                    <p className="text-lg">Choose a platform and content type to see real-time preview</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center max-w-6xl mx-auto mt-16">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-500 rounded-2xl blur-lg opacity-40" />
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="relative flex items-center gap-3 px-8 py-4 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </Button>
          </div>
          
          <div className="flex items-center gap-3 text-lg text-gray-300">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
              Step {currentStep} of {steps.length}
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-60" />
            <Button 
              onClick={() => {
                if (currentStep === 1 && (!selectedPlatform || !selectedContentType)) {
                  return // Don't proceed if platform/content type not selected
                }
                setCurrentStep(Math.min(steps.length, currentStep + 1))
              }}
              disabled={currentStep === steps.length || (currentStep === 1 && (!selectedPlatform || !selectedContentType))}
              className="relative flex items-center gap-3 px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl text-white font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === steps.length ? 'Complete' : 'Next'}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}