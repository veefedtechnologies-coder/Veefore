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

export default function AutomationBasic() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [selectedContentType, setSelectedContentType] = useState('')
  const [keywords, setKeywords] = useState(['info', 'price', 'link'])
  const [newKeyword, setNewKeyword] = useState('')
  const [commentReply, setCommentReply] = useState('Check your DMs for more info! 📩')
  const [dmMessage, setDmMessage] = useState('Thanks for your interest! Here\'s more information about our services.')
  const [previewComment, setPreviewComment] = useState('Amazing content! info please!')
  const [userName, setUserName] = useState('your_account')

  console.log('AutomationBasic component rendering:', { currentStep, selectedPlatform, selectedContentType })

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
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">{userName}</span> {commentReply}
                </p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-xs text-gray-500">1m</span>
                  <button className="text-xs text-gray-500 hover:text-gray-700">Like</button>
                  <button className="text-xs text-gray-500 hover:text-gray-700">Reply</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* DM Indicator */}
        {dmMessage && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <Send className="w-2 h-2 text-white" />
              </div>
              <span className="text-xs font-medium text-blue-700">Direct Message Sent</span>
            </div>
            <p className="text-xs text-blue-600 italic">"{dmMessage.substring(0, 50)}..."</p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 py-16 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="relative inline-flex items-center justify-center w-24 h-24 mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-40 animate-pulse" />
            <div className="relative w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
              <Bot className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-4">
            Automation Studio
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Create intelligent social media automations with AI-powered responses and real-time preview
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="text-center">
                  <div className={`relative w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                    currentStep >= step.number 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-2xl' 
                      : 'bg-white/10 backdrop-blur-sm border border-white/20'
                  }`}>
                    {currentStep > step.number ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      React.createElement(step.icon, { className: `w-6 h-6 ${currentStep >= step.number ? 'text-white' : 'text-gray-400'}` })
                    )}
                  </div>
                  <div className="text-sm font-medium text-gray-300 mb-1">{step.title}</div>
                  <div className="text-xs text-gray-500">Step {step.number}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-4 h-px bg-gradient-to-r from-white/20 to-white/5" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Configuration */}
          <div className="space-y-8">
            {/* Current Step Indicator */}
            {currentStep > 1 && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl" />
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                      {React.createElement(steps[currentStep - 1].icon, { className: "w-5 h-5 text-white" })}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {steps[currentStep - 1].title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Configure your automation settings
                      </p>
                    </div>
                  </div>
                </div>
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