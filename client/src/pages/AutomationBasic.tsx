import React, { useState } from 'react'
import { 
  Instagram, 
  Bot, 
  MessageCircle, 
  User, 
  Heart, 
  Send, 
  Bookmark, 
  Camera, 
  MoreHorizontal, 
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Settings,
  Brain,
  Sparkles,
  Plus,
  X,
  Eye,
  Hash,
  Facebook,
  Twitter,
  Linkedin,
  Youtube
} from 'lucide-react'

export default function AutomationBasic() {
  console.log('AutomationBasic component loaded successfully')
  
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [selectedContentType, setSelectedContentType] = useState('')
  const [keywords, setKeywords] = useState(['info', 'price', 'link'])
  const [newKeyword, setNewKeyword] = useState('')
  const [commentReply, setCommentReply] = useState('Check your DMs for more info! 📩')
  const [dmMessage, setDmMessage] = useState('Thanks for your interest! Here\'s more information about our services.')
  const [previewComment, setPreviewComment] = useState('Amazing content! info please!')
  const [userName, setUserName] = useState('your_account')
  
  const totalSteps = 5

  const platforms = [
    { 
      name: 'Instagram', 
      icon: Instagram, 
      color: 'bg-gradient-to-r from-pink-500 to-purple-500',
      lightColor: 'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100'
    },
    { 
      name: 'Facebook', 
      icon: Facebook, 
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      lightColor: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
    },
    { 
      name: 'Twitter', 
      icon: Twitter, 
      color: 'bg-gradient-to-r from-sky-400 to-sky-500',
      lightColor: 'bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100'
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      lightColor: 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
    },
    { 
      name: 'YouTube', 
      icon: Youtube, 
      color: 'bg-gradient-to-r from-red-500 to-red-600',
      lightColor: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
    }
  ]

  const contentTypes = [
    { name: 'Post', description: 'Regular feed posts', icon: '📸' },
    { name: 'Story', description: 'Temporary stories', icon: '🎬' },
    { name: 'Reel', description: 'Short video content', icon: '🎥' },
    { name: 'Video', description: 'Long-form videos', icon: '▶️' },
    { name: 'Carousel', description: 'Multiple images/videos', icon: '🔄' }
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

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedPlatform !== ''
      case 2: return selectedContentType !== ''
      case 3: return keywords.length > 0
      case 4: return commentReply.trim() !== '' && dmMessage.trim() !== ''
      case 5: return true
      default: return false
    }
  }

  const steps = [
    { id: 1, title: 'Platform', description: 'Choose your platform' },
    { id: 2, title: 'Content Type', description: 'Select content type' },
    { id: 3, title: 'Keywords', description: 'Set trigger words' },
    { id: 4, title: 'Responses', description: 'Configure replies' },
    { id: 5, title: 'Review', description: 'Test & deploy' }
  ]

  const InstagramPreview = () => (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-w-sm mx-auto transform hover:scale-105 transition-transform duration-300">
      {/* Instagram Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm text-gray-900">{userName}</div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
              Live
            </div>
          </div>
        </div>
        <MoreHorizontal className="w-6 h-6 text-gray-400 hover:text-gray-600 cursor-pointer" />
      </div>

      {/* Instagram Post Image */}
      <div className="aspect-square bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20"></div>
        <Camera className="w-16 h-16 text-gray-400 relative z-10" />
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-xs font-medium">
          {selectedContentType}
        </div>
      </div>

      {/* Instagram Actions */}
      <div className="p-4 bg-gradient-to-b from-white to-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-5">
            <Heart className="w-7 h-7 text-gray-700 hover:text-red-500 cursor-pointer transition-colors duration-200 hover:scale-110" />
            <MessageCircle className="w-7 h-7 text-gray-700 hover:text-blue-500 cursor-pointer transition-colors duration-200 hover:scale-110" />
            <Send className="w-7 h-7 text-gray-700 hover:text-green-500 cursor-pointer transition-colors duration-200 hover:scale-110" />
          </div>
          <Bookmark className="w-7 h-7 text-gray-700 hover:text-yellow-500 cursor-pointer transition-colors duration-200 hover:scale-110" />
        </div>

        <div className="text-sm text-gray-900 mb-3">
          <span className="font-bold">2,847 likes</span>
        </div>

        <div className="text-sm text-gray-900 mb-4">
          <span className="font-bold">{userName}</span> 
          <span className="ml-1">🚀 Exciting announcement! Our new automation features are live! What are your thoughts? #automation #socialmedia</span>
        </div>

        {/* Comments Section */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex-shrink-0"></div>
            <div className="flex-1">
              <div className="text-sm">
                <span className="font-bold text-gray-900">follower123</span>
                <span className="text-gray-700 ml-1">{previewComment}</span>
              </div>
            </div>
          </div>

          {/* Automated Reply Preview */}
          <div className="flex items-start gap-3 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-xl border-2 border-blue-200 shadow-sm">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full flex-shrink-0 flex items-center justify-center shadow-lg">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm">
                <span className="font-bold text-gray-900">{userName}</span>
                <span className="text-gray-700 ml-1">{commentReply}</span>
                <div className="flex items-center gap-1 mt-1">
                  <Bot className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-blue-500 font-medium">AI Response</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 font-medium">Just now</div>
        </div>
      </div>
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Platform</h2>
              <p className="text-lg text-gray-600">Select the social media platform where you want to create automation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {platforms.map((platform) => {
                const Icon = platform.icon
                return (
                  <button
                    key={platform.name}
                    onClick={() => setSelectedPlatform(platform.name)}
                    className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      selectedPlatform === platform.name
                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-xl'
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${platform.color} shadow-lg group-hover:shadow-xl transition-shadow`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-xl text-gray-900">{platform.name}</div>
                        <div className="text-sm text-gray-600 mt-1">Create automated responses</div>
                      </div>
                    </div>
                    {selectedPlatform === platform.name && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle className="w-6 h-6 text-blue-500" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mb-6 shadow-lg">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Select Content Type</h2>
              <p className="text-lg text-gray-600">Choose what type of content will trigger your automation</p>
            </div>

            <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
              {contentTypes.map((type) => (
                <button
                  key={type.name}
                  onClick={() => setSelectedContentType(type.name)}
                  className={`group p-6 rounded-xl border-2 text-left transition-all duration-300 transform hover:scale-102 ${
                    selectedContentType === type.name
                      ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-2xl group-hover:from-gray-200 group-hover:to-gray-300 transition-all">
                      {type.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg text-gray-900">{type.name}</div>
                      <div className="text-sm text-gray-500">{type.description}</div>
                    </div>
                    {selectedContentType === type.name && (
                      <CheckCircle className="w-6 h-6 text-emerald-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg">
                <Hash className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Set Trigger Keywords</h2>
              <p className="text-lg text-gray-600">Add keywords that will trigger your automation when mentioned in comments</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Add keyword..."
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                />
                <button
                  onClick={addKeyword}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {keywords.map((keyword) => (
                  <div
                    key={keyword}
                    className="group flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-full px-4 py-2 hover:shadow-md transition-all duration-200"
                  >
                    <span className="text-sm font-semibold text-gray-700">{keyword}</span>
                    <button
                      onClick={() => removeKeyword(keyword)}
                      className="text-gray-400 hover:text-red-500 transition-colors group-hover:scale-110"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mb-6 shadow-lg">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Configure Responses</h2>
              <p className="text-lg text-gray-600">Set up your automated comment replies and DM messages</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Public Comment Reply
                </label>
                <textarea
                  value={commentReply}
                  onChange={(e) => setCommentReply(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                  rows={3}
                  placeholder="This will be posted as a public comment reply..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Private DM Message
                </label>
                <textarea
                  value={dmMessage}
                  onChange={(e) => setDmMessage(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                  rows={4}
                  placeholder="This will be sent as a private message..."
                />
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mb-6 shadow-lg">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Review & Test</h2>
              <p className="text-lg text-gray-600">Review your automation settings and test before deploying</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Settings Summary */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Automation Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform:</span>
                    <span className="font-semibold">{selectedPlatform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Content Type:</span>
                    <span className="font-semibold">{selectedContentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Keywords:</span>
                    <span className="font-semibold">{keywords.length} keywords</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="text-sm text-gray-600 mb-2">Trigger words:</div>
                    <div className="flex flex-wrap gap-2">
                      {keywords.map((keyword) => (
                        <span key={keyword} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Live Preview</h3>
                {selectedPlatform === 'Instagram' && <InstagramPreview />}
                
                {selectedPlatform !== 'Instagram' && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Eye className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600">{selectedPlatform} preview coming soon</p>
                  </div>
                )}
              </div>
            </div>

            {/* Test Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Test Your Automation</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Test Comment
                  </label>
                  <input
                    type="text"
                    value={previewComment}
                    onChange={(e) => setPreviewComment(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="Type a test comment..."
                  />
                </div>

                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
                  <div className="text-sm font-bold text-gray-700 mb-2">Will trigger automation:</div>
                  <div className="text-lg">
                    {keywords.some(keyword => 
                      previewComment.toLowerCase().includes(keyword.toLowerCase())
                    ) ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Yes - Contains trigger keyword
                      </span>
                    ) : (
                      <span className="text-gray-500 font-medium flex items-center gap-2">
                        <X className="w-5 h-5" />
                        No matching keywords found
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Automation Studio
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  currentStep >= step.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-blue-500 text-white shadow-lg'
                    : 'border-gray-300 text-gray-400 bg-white'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span className="font-bold">{step.id}</span>
                  )}
                </div>
                <div className="ml-3 text-left">
                  <div className={`text-sm font-bold ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'}`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-6 ${currentStep > step.id ? 'bg-blue-500' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-12">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 ${
              currentStep === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="text-sm text-gray-500">
            Step {currentStep} of {totalSteps}
          </div>

          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                canProceed()
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                canProceed()
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              Deploy Automation
            </button>
          )}
        </div>
      </div>
    </div>
  )
}