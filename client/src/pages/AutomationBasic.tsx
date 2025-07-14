import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { 
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Linkedin,
  Bot,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Heart,
  MessageCircle,
  User,
  Eye,
  Globe,
  Settings,
  Brain,
  Sparkles,
  Play,
  Send,
  Bookmark,
  Share,
  MoreHorizontal,
  Camera,
  Smile,
  Hash,
  AtSign,
  Zap,
  Target,
  Clock,
  Filter,
  Wand2,
  TrendingUp,
  Users,
  Activity,
  Star,
  ChevronRight,
  ChevronDown,
  Plus,
  X,
  Search,
  Bell,
  Home,
  Compass,
  Mail,
  PlusSquare,
  Menu
} from 'lucide-react'

interface SocialAccount {
  id: string
  username: string
  platform: string
  profilePictureUrl?: string
  followers?: number
  isConnected: boolean
}

interface AutomationRule {
  id: string
  name: string
  platform: string
  contentType: string
  automationType: string
  status: 'active' | 'paused' | 'draft'
  triggers: number
  created: string
  engagement: number
  lastRun: string
}

interface AutomationFormData {
  name: string
  platform: string
  contentType: string
  automationType: string
  selectedPost?: string
  responseType: string
  keywords: string[]
  replyText: string
  commentReplies: string[]
  dmMessage: string
  buttonText: string
  websiteUrl: string
  delay: number
  timeRestrictions: {
    enabled: boolean
    startTime: string
    endTime: string
    days: string[]
  }
  aiEnabled: boolean
  targetAudience: string
  engagementThreshold: number
}

export default function AutomationBasic() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPlatform, setSelectedPlatform] = useState('instagram')
  const [selectedAutomationType, setSelectedAutomationType] = useState('comment-to-dm')
  const [keywords, setKeywords] = useState(['info', 'price', 'link'])
  const [dmMessage, setDmMessage] = useState('Thanks for your interest! Here\'s more information about our services.')
  const [commentReply, setCommentReply] = useState('Check your DMs for more info! 📩')
  const [newKeyword, setNewKeyword] = useState('')
  const [previewComment, setPreviewComment] = useState('Amazing content! info please!')
  const [isAiEnabled, setIsAiEnabled] = useState(false)
  const [userName, setUserName] = useState('your_account')

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, gradient: 'from-pink-500 to-purple-600', color: '#E1306C' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, gradient: 'from-red-500 to-red-600', color: '#FF0000' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, gradient: 'from-blue-600 to-blue-700', color: '#1877F2' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, gradient: 'from-sky-500 to-sky-600', color: '#1DA1F2' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, gradient: 'from-blue-700 to-blue-800', color: '#0077B5' }
  ]

  const automationTypes = [
    { 
      id: 'comment-to-dm', 
      name: 'Comment to DM', 
      description: 'Send automatic DMs when users comment with specific keywords',
      icon: MessageCircle,
      color: 'from-blue-500 to-blue-600',
      features: ['Keyword Detection', 'Auto DM Response', 'Lead Capture', 'Comment Reply']
    },
    { 
      id: 'keyword-response', 
      name: 'Keyword Response', 
      description: 'Automatically reply to comments containing specific keywords',
      icon: Hash,
      color: 'from-green-500 to-green-600',
      features: ['Smart Matching', 'Instant Replies', 'Engagement Boost', 'Custom Messages']
    },
    { 
      id: 'engagement-boost', 
      name: 'Engagement Boost', 
      description: 'Automatically engage with your audience to increase interaction',
      icon: Heart,
      color: 'from-red-500 to-red-600',
      features: ['Auto Likes', 'Smart Following', 'Story Views', 'Engagement Analysis']
    },
    { 
      id: 'lead-capture', 
      name: 'Lead Capture', 
      description: 'Capture and qualify leads from social media interactions',
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      features: ['Lead Qualification', 'CRM Integration', 'Follow-up Sequences', 'Analytics']
    }
  ]

  const steps = [
    { number: 1, title: 'Platform Selection', description: 'Choose your platform', icon: Globe },
    { number: 2, title: 'Automation Type', description: 'Select automation behavior', icon: Bot },
    { number: 3, title: 'Configure & Preview', description: 'Set up rules with live preview', icon: Settings },
    { number: 4, title: 'AI & Advanced', description: 'Configure AI and targeting', icon: Brain },
    { number: 5, title: 'Deploy & Test', description: 'Launch your automation', icon: Sparkles }
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
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const InstagramPostPreview = () => (
    <div className="max-w-sm mx-auto bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200 transform hover:scale-105 transition-all duration-300">
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
        <div className="space-y-3 max-h-48 overflow-y-auto">
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
          {selectedAutomationType === 'comment-to-dm' && commentReply && (
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
          {selectedAutomationType === 'comment-to-dm' && (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Auto DM Sent</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                "{dmMessage.substring(0, 50)}..."
              </p>
            </div>
          )}
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Choose Your Platform
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Select the social media platform where you want to deploy your automation
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {platforms.map((platform) => {
                const Icon = platform.icon
                return (
                  <div
                    key={platform.id}
                    className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 ${
                      selectedPlatform === platform.id 
                        ? 'scale-105 shadow-2xl ring-4 ring-blue-500 ring-opacity-50' 
                        : 'hover:scale-105 hover:shadow-xl'
                    }`}
                    onClick={() => setSelectedPlatform(platform.id)}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${platform.gradient} opacity-90`} />
                    <div className="relative p-8 text-center text-white">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{platform.name}</h3>
                      <p className="text-sm opacity-90 mb-4">
                        Automate {platform.name} interactions and engagement
                      </p>
                      {selectedPlatform === platform.id && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Selected</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-6 shadow-lg">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Select Automation Type
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose how you want to automate your social media interactions
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {automationTypes.map((type) => {
                const Icon = type.icon
                return (
                  <div
                    key={type.id}
                    className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 border-2 ${
                      selectedAutomationType === type.id 
                        ? 'border-purple-500 scale-105 shadow-2xl bg-gradient-to-r from-purple-50 to-pink-50' 
                        : 'border-gray-200 hover:border-purple-300 hover:scale-105 hover:shadow-xl bg-white'
                    }`}
                    onClick={() => setSelectedAutomationType(type.id)}
                  >
                    <div className="p-8">
                      <div className="flex items-center gap-6 mb-6">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${type.color} flex items-center justify-center shadow-lg`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{type.name}</h3>
                          <p className="text-gray-600">{type.description}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {type.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      {selectedAutomationType === type.id && (
                        <div className="mt-6 p-4 bg-purple-100 rounded-lg border border-purple-200">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-purple-600" />
                            <span className="font-medium text-purple-800">Selected for Configuration</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Configuration Panel */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-4 shadow-lg">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  Configure & Preview
                </h2>
                <p className="text-lg text-gray-600">
                  Set up your automation rules and see them in action
                </p>
              </div>

              <div className="space-y-6">
                {/* Keywords Configuration */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Hash className="w-5 h-5 text-blue-600" />
                    Trigger Keywords
                  </h3>
                  <div className="flex gap-2 mb-4">
                    <Input
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="Enter keyword..."
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                    />
                    <Button 
                      onClick={addKeyword}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {keyword}
                        <button
                          onClick={() => removeKeyword(keyword)}
                          className="hover:text-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Response Configuration */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                    Response Messages
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="comment-reply" className="text-sm font-medium text-gray-700">
                        Comment Reply
                      </Label>
                      <Input
                        id="comment-reply"
                        value={commentReply}
                        onChange={(e) => setCommentReply(e.target.value)}
                        placeholder="Public reply to the comment..."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dm-message" className="text-sm font-medium text-gray-700">
                        DM Message
                      </Label>
                      <Textarea
                        id="dm-message"
                        value={dmMessage}
                        onChange={(e) => setDmMessage(e.target.value)}
                        placeholder="Private message sent to user..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* AI Configuration */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-600" />
                      AI Enhancement
                    </h3>
                    <Switch
                      checked={isAiEnabled}
                      onCheckedChange={setIsAiEnabled}
                    />
                  </div>
                  {isAiEnabled && (
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-800">AI-Powered Responses</span>
                      </div>
                      <p className="text-sm text-purple-700">
                        Responses will be personalized based on user context and conversation history
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Live Preview Panel */}
            <div className="space-y-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-4 shadow-lg">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Live Preview
                </h2>
                <p className="text-lg text-gray-600">
                  See how your automation will work in real-time
                </p>
              </div>

              <div className="flex justify-center">
                <InstagramPostPreview />
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Automation Flow
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <span className="text-sm text-gray-700">User comments with keyword: "{keywords[0] || 'keyword'}"</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    <span className="text-sm text-gray-700">Bot replies to comment publicly</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    <span className="text-sm text-gray-700">Bot sends private DM with detailed info</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-6 shadow-lg">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                AI & Advanced Settings
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Configure advanced AI features and targeting options
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">AI Configuration</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Smart Responses</p>
                      <p className="text-sm text-gray-600">Generate contextual replies using AI</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Sentiment Analysis</p>
                      <p className="text-sm text-gray-600">Analyze user emotion and respond appropriately</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Learning Mode</p>
                      <p className="text-sm text-gray-600">Improve responses over time</p>
                    </div>
                    <Switch checked={false} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Targeting Options</h3>
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Target Audience</Label>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="audience" defaultChecked />
                        <span className="text-sm text-gray-700">All Users</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="audience" />
                        <span className="text-sm text-gray-700">Followers Only</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="audience" />
                        <span className="text-sm text-gray-700">Verified Accounts</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Response Delay</Label>
                    <Input type="number" defaultValue="30" className="mt-1" />
                    <p className="text-xs text-gray-500 mt-1">Seconds before responding</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-6 shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Deploy & Test
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Your automation is ready to launch
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Automation Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Platform:</span>
                      <span className="font-medium capitalize">{selectedPlatform}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{automationTypes.find(t => t.id === selectedAutomationType)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Keywords:</span>
                      <span className="font-medium">{keywords.length} configured</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">AI Enabled:</span>
                      <span className="font-medium">{isAiEnabled ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Ready to Deploy</span>
                      </div>
                      <p className="text-sm text-green-700">
                        All configurations are valid and automation is ready to launch
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-12 py-3 text-lg shadow-lg"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Launch Automation
                  </Button>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-2xl">
            <Bot className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Automation Studio
          </h1>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
            Create intelligent social media automations with AI-powered responses and real-time preview
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-8">
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={step.number} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500 ${
                        currentStep >= step.number 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110' 
                          : 'bg-white text-gray-400 border-2 border-gray-200 shadow-md'
                      }`}>
                        {currentStep > step.number ? (
                          <CheckCircle className="w-8 h-8" />
                        ) : (
                          <Icon className="w-8 h-8" />
                        )}
                      </div>
                      <div className="mt-3 text-center">
                        <div className="text-sm font-semibold text-gray-900">{step.title}</div>
                        <div className="text-xs text-gray-500">{step.description}</div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-24 h-1 mx-8 rounded-full transition-all duration-500 ${
                        currentStep > step.number 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                          : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="max-w-2xl mx-auto">
            <Progress value={(currentStep / steps.length) * 100} className="h-3 rounded-full" />
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-12">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 text-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </Button>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            Step {currentStep} of {steps.length}
          </div>
          
          <Button 
            onClick={nextStep}
            disabled={currentStep === steps.length}
            className="flex items-center gap-2 px-6 py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
          >
            {currentStep === steps.length ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Complete
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}