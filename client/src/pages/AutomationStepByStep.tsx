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
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  Eye,
  Hash,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  UserPlus,
  Share2,
  PlayCircle,
  Target,
  Clock,
  Brain,
  Shield,
  BarChart3,
  Globe,
  FileText,
  MessageSquare,
  Settings
} from 'lucide-react'

export default function AutomationStepByStep() {
  console.log('AutomationStepByStep component loaded successfully')
  
  // Step flow state
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [selectedAccount, setSelectedAccount] = useState('')
  const [contentType, setContentType] = useState('')
  const [automationType, setAutomationType] = useState('')
  const [selectedPost, setSelectedPost] = useState('')
  
  // Automation-specific states
  const [keywords, setKeywords] = useState([])
  const [newKeyword, setNewKeyword] = useState('')
  const [commentReply, setCommentReply] = useState('')
  const [dmMessage, setDmMessage] = useState('')
  const [previewComment, setPreviewComment] = useState('Amazing content! info please!')
  
  // DM-only automation
  const [dmKeywords, setDmKeywords] = useState([])
  const [dmAutoReply, setDmAutoReply] = useState('')
  
  // Comment-only automation
  const [commentKeywords, setCommentKeywords] = useState([])
  const [publicReply, setPublicReply] = useState('')
  

  
  // Advanced settings (shown for all types)
  const [maxRepliesPerDay, setMaxRepliesPerDay] = useState(50)
  const [cooldownPeriod, setCooldownPeriod] = useState(60)
  const [aiPersonality, setAiPersonality] = useState('professional')
  const [activeHours, setActiveHours] = useState({ start: '09:00', end: '18:00' })
  
  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-5 h-5" />, color: 'bg-pink-500' },
    { id: 'youtube', name: 'YouTube', icon: <Youtube className="w-5 h-5" />, color: 'bg-red-600' },
    { id: 'tiktok', name: 'TikTok', icon: <PlayCircle className="w-5 h-5" />, color: 'bg-black' },
    { id: 'twitter', name: 'Twitter', icon: <Twitter className="w-5 h-5" />, color: 'bg-blue-400' },
    { id: 'facebook', name: 'Facebook', icon: <Facebook className="w-5 h-5" />, color: 'bg-blue-600' },
    { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, color: 'bg-blue-700' }
  ]

  const getContentTypesByPlatform = (platform) => {
    switch (platform) {
      case 'instagram':
        return [
          { id: 'post', name: 'Post', icon: <Camera className="w-5 h-5" />, description: 'Regular Instagram posts', color: 'bg-blue-500' },
          { id: 'reel', name: 'Reel', icon: <PlayCircle className="w-5 h-5" />, description: 'Instagram Reels', color: 'bg-purple-500' },
          { id: 'story', name: 'Story', icon: <Eye className="w-5 h-5" />, description: 'Instagram Stories', color: 'bg-green-500' }
        ]
      case 'youtube':
        return [
          { id: 'video', name: 'Video', icon: <PlayCircle className="w-5 h-5" />, description: 'YouTube Videos', color: 'bg-red-500' },
          { id: 'short', name: 'Short', icon: <Camera className="w-5 h-5" />, description: 'YouTube Shorts', color: 'bg-orange-500' },
          { id: 'live', name: 'Live Stream', icon: <Eye className="w-5 h-5" />, description: 'YouTube Live Streams', color: 'bg-red-600' }
        ]
      case 'tiktok':
        return [
          { id: 'video', name: 'Video', icon: <PlayCircle className="w-5 h-5" />, description: 'TikTok Videos', color: 'bg-gray-800' },
          { id: 'live', name: 'Live', icon: <Eye className="w-5 h-5" />, description: 'TikTok Live', color: 'bg-gray-600' }
        ]
      case 'twitter':
        return [
          { id: 'tweet', name: 'Tweet', icon: <MessageCircle className="w-5 h-5" />, description: 'Twitter Posts', color: 'bg-blue-400' },
          { id: 'thread', name: 'Thread', icon: <MessageSquare className="w-5 h-5" />, description: 'Twitter Threads', color: 'bg-blue-500' }
        ]
      case 'facebook':
        return [
          { id: 'post', name: 'Post', icon: <Camera className="w-5 h-5" />, description: 'Facebook Posts', color: 'bg-blue-600' },
          { id: 'story', name: 'Story', icon: <Eye className="w-5 h-5" />, description: 'Facebook Stories', color: 'bg-blue-500' },
          { id: 'reel', name: 'Reel', icon: <PlayCircle className="w-5 h-5" />, description: 'Facebook Reels', color: 'bg-blue-700' }
        ]
      case 'linkedin':
        return [
          { id: 'post', name: 'Post', icon: <Camera className="w-5 h-5" />, description: 'LinkedIn Posts', color: 'bg-blue-700' },
          { id: 'article', name: 'Article', icon: <FileText className="w-5 h-5" />, description: 'LinkedIn Articles', color: 'bg-blue-600' }
        ]
      default:
        return []
    }
  }

  const automationTypes = [
    { 
      id: 'comment_dm', 
      name: 'Comment → DM', 
      icon: <MessageCircle className="w-5 h-5" />, 
      description: 'Reply to comments publicly, then send private DM',
      color: 'bg-blue-500'
    },
    { 
      id: 'dm_only', 
      name: 'DM Only', 
      icon: <Send className="w-5 h-5" />, 
      description: 'Send direct messages only (no public replies)',
      color: 'bg-purple-500'
    },
    { 
      id: 'comment_only', 
      name: 'Comment Only', 
      icon: <MessageCircle className="w-5 h-5" />, 
      description: 'Reply to comments publicly only',
      color: 'bg-green-500'
    }
  ]

  const mockAccounts = [
    { id: 'acc1', name: '@arpit9996363', followers: '9 followers', platform: 'Instagram', avatar: 'https://picsum.photos/40/40?random=1' },
    { id: 'acc2', name: '@rahulc1020', followers: '4 followers', platform: 'Instagram', avatar: 'https://picsum.photos/40/40?random=2' },
    { id: 'acc3', name: '@business_account', followers: '1.2K followers', platform: 'Instagram', avatar: 'https://picsum.photos/40/40?random=3' }
  ]

  const mockPosts = [
    { 
      id: 'post1', 
      title: 'New Product Launch', 
      type: 'post', 
      image: 'https://picsum.photos/300/300?random=1',
      likes: 124,
      comments: 23,
      caption: 'Excited to announce our latest product! What do you think? 🚀'
    },
    { 
      id: 'post2', 
      title: 'Behind the Scenes', 
      type: 'reel', 
      image: 'https://picsum.photos/300/300?random=2',
      likes: 89,
      comments: 12,
      caption: 'Behind the scenes of our creative process 🎬'
    },
    { 
      id: 'post3', 
      title: 'Team Update', 
      type: 'story', 
      image: 'https://picsum.photos/300/300?random=3',
      likes: 45,
      comments: 8,
      caption: 'Team working hard on exciting new features! 💪'
    }
  ]

  const steps = [
    { id: 1, title: 'Select account', description: 'Choose your account' },
    { id: 2, title: 'Content type', description: 'Pick content type' },
    { id: 3, title: 'Automation type', description: 'Select automation' },
    { id: 4, title: 'Configuration', description: 'Set up rules' },
    { id: 5, title: 'Advanced Settings', description: 'Fine-tune timing' },
    { id: 6, title: 'Review and save', description: 'Review and activate' }
  ]

  const addKeyword = () => {
    if (newKeyword.trim()) {
      const currentKeywords = getCurrentKeywords()
      const setCurrentKeywords = getCurrentKeywordsSetter()
      if (!currentKeywords.includes(newKeyword.trim())) {
        setCurrentKeywords([...currentKeywords, newKeyword.trim()])
        setNewKeyword('')
      }
    }
  }

  const removeKeyword = (keywordToRemove) => {
    const currentKeywords = getCurrentKeywords()
    const setCurrentKeywords = getCurrentKeywordsSetter()
    setCurrentKeywords(currentKeywords.filter(k => k !== keywordToRemove))
  }

  const getCurrentKeywords = () => {
    switch (automationType) {
      case 'comment_dm':
      case 'comment_only':
        return keywords
      case 'dm_only':
        return dmKeywords
      default:
        return keywords
    }
  }

  const getCurrentKeywordsSetter = () => {
    switch (automationType) {
      case 'comment_dm':
      case 'comment_only':
        return setKeywords
      case 'dm_only':
        return setDmKeywords
      default:
        return setKeywords
    }
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return selectedAccount
      case 2:
        return contentType
      case 3:
        return automationType
      case 4:
        return true // Post selection is optional
      case 5:
        return getCurrentKeywords().length > 0 // Keywords required for configuration
      case 6:
        return true // Advanced settings are optional
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceedToNext() && currentStep < 6) {
      // Reset content type when account changes and auto-set platform
      if (currentStep === 1) {
        setContentType('')
        // Auto-set platform based on selected account
        const selectedAccountData = mockAccounts.find(a => a.id === selectedAccount)
        if (selectedAccountData) {
          setSelectedPlatform(selectedAccountData.platform.toLowerCase())
        }
      }
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinish = () => {
    const automationConfig = {
      selectedAccount,
      contentType,
      automationType,
      selectedPost,
      keywords: getCurrentKeywords(),
      commentReply: automationType === 'comment_dm' ? commentReply : publicReply,
      dmMessage: automationType === 'dm_only' ? dmAutoReply : dmMessage,
      maxRepliesPerDay,
      cooldownPeriod,
      aiPersonality,
      activeHours
    }
    
    console.log('Automation configured:', automationConfig)
    alert('Automation configured successfully!')
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md">
                  <User className="w-4 h-4 text-white" />
                </div>
                Select Account
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {mockAccounts.map(account => (
                  <button
                    key={account.id}
                    onClick={() => setSelectedAccount(account.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md ${
                      selectedAccount === account.id 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-blue-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={account.avatar} alt={account.name} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border border-white rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 truncate">{account.name}</div>
                        <div className="text-xs text-gray-600">{account.followers} • {account.platform}</div>
                      </div>
                      {selectedAccount === account.id && (
                        <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 2:
        const selectedAccountData = mockAccounts.find(a => a.id === selectedAccount)
        const accountPlatform = selectedAccountData?.platform.toLowerCase() || ''
        const contentTypes = getContentTypesByPlatform(accountPlatform)
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                Select Content Type
              </h3>
              <p className="text-lg text-gray-600 mb-6 font-medium">Choose the type of content for automation on {selectedAccountData?.platform}</p>
              <div className="grid grid-cols-1 gap-4">
                {contentTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setContentType(type.id)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left transform hover:scale-[1.02] hover:shadow-lg ${
                      contentType === type.id 
                        ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-xl scale-[1.02]' 
                        : 'border-gray-200 hover:border-purple-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`p-4 rounded-xl ${type.color} text-white shadow-lg transform transition-transform hover:scale-110`}>
                        {type.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-xl text-gray-800">{type.name}</div>
                        <div className="text-sm text-gray-600 mt-2 font-medium">{type.description}</div>
                      </div>
                      {contentType === type.id && (
                        <div className="p-2 bg-purple-500 rounded-full shadow-lg">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                Choose Automation Type
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {automationTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setAutomationType(type.id)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left transform hover:scale-[1.02] hover:shadow-lg ${
                      automationType === type.id 
                        ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-xl scale-[1.02]' 
                        : 'border-gray-200 hover:border-emerald-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`p-4 rounded-xl ${type.color} text-white shadow-lg transform transition-transform hover:scale-110`}>
                        {type.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-xl text-gray-800">{type.name}</div>
                        <div className="text-sm text-gray-600 mt-2 font-medium">{type.description}</div>
                      </div>
                      {automationType === type.id && (
                        <div className="p-2 bg-emerald-500 rounded-full shadow-lg">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Posts (Optional)</h3>
              <p className="text-gray-600 mb-4">Choose specific posts to apply automation to, or leave empty to apply to all posts</p>
              <div className="space-y-3">
                {mockPosts.map(post => (
                  <button
                    key={post.id}
                    onClick={() => setSelectedPost(selectedPost === post.id ? '' : post.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedPost === post.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <img src={post.image} alt={post.title} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <div className="font-medium">{post.title}</div>
                        <div className="text-sm text-gray-600 mt-1">{post.caption}</div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {post.comments}
                          </span>
                        </div>
                      </div>
                      {selectedPost === post.id && (
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            {renderAutomationSpecificConfig()}
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Settings</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Replies per Day</label>
                  <input
                    type="number"
                    value={maxRepliesPerDay}
                    onChange={(e) => setMaxRepliesPerDay(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    min="1"
                    max="500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cooldown Period (minutes)</label>
                  <input
                    type="number"
                    value={cooldownPeriod}
                    onChange={(e) => setCooldownPeriod(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    min="1"
                    max="1440"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">AI Personality</label>
                <select
                  value={aiPersonality}
                  onChange={(e) => setAiPersonality(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="casual">Casual</option>
                  <option value="enthusiastic">Enthusiastic</option>
                  <option value="witty">Witty</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Active Start Time</label>
                  <input
                    type="time"
                    value={activeHours.start}
                    onChange={(e) => setActiveHours({...activeHours, start: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Active End Time</label>
                  <input
                    type="time"
                    value={activeHours.end}
                    onChange={(e) => setActiveHours({...activeHours, end: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Automation</h3>
              
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Account:</span>
                    <div className="font-medium">{mockAccounts.find(a => a.id === selectedAccount)?.name || 'Not selected'}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Content Type:</span>
                    <div className="font-medium capitalize">{contentType || 'Not selected'}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Automation Type:</span>
                    <div className="font-medium">{automationTypes.find(t => t.id === automationType)?.name || 'Not selected'}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Keywords:</span>
                    <div className="font-medium">{getCurrentKeywords().length} keywords</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Daily Limit:</span>
                    <div className="font-medium">{maxRepliesPerDay} replies</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">AI Personality:</span>
                    <div className="font-medium capitalize">{aiPersonality}</div>
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

  const renderAutomationSpecificConfig = () => {
    const currentKeywords = getCurrentKeywords()
    
    switch (automationType) {
      case 'comment_dm':
        return (
          <>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Comment → DM Configuration</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Trigger Keywords</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {keywords.map((keyword, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {keyword}
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                    placeholder="Add keyword..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={addKeyword}
                    className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Public Comment Reply</label>
                <textarea
                  value={commentReply}
                  onChange={(e) => setCommentReply(e.target.value)}
                  placeholder="Check your DMs for more info! 📩"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Private DM Message</label>
                <textarea
                  value={dmMessage}
                  onChange={(e) => setDmMessage(e.target.value)}
                  placeholder="Thanks for your interest! Here's more information..."
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows="4"
                />
              </div>
            </div>
          </>
        )

      case 'dm_only':
        return (
          <>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">DM Only Configuration</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Trigger Keywords</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {dmKeywords.map((keyword, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {keyword}
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                    placeholder="Add keyword..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={addKeyword}
                    className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Auto DM Message</label>
                <textarea
                  value={dmAutoReply}
                  onChange={(e) => setDmAutoReply(e.target.value)}
                  placeholder="Thanks for your comment! Here's the information you requested..."
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows="4"
                />
              </div>
            </div>
          </>
        )

      case 'comment_only':
        return (
          <>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Comment Only Configuration</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Trigger Keywords</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {keywords.map((keyword, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {keyword}
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                    placeholder="Add keyword..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={addKeyword}
                    className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Public Reply Message</label>
                <textarea
                  value={publicReply}
                  onChange={(e) => setPublicReply(e.target.value)}
                  placeholder="Thanks for your interest! Here's the info you requested..."
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows="4"
                />
              </div>
            </div>
          </>
        )



      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-600">Please select an automation type first.</p>
          </div>
        )
    }
  }

  const renderInstagramPreview = () => {
    const selectedAccountData = mockAccounts.find(a => a.id === selectedAccount)
    const selectedPostData = mockPosts.find(p => p.id === selectedPost)
    const currentKeywords = getCurrentKeywords()
    const platformName = selectedAccountData?.platform || 'Social Media'
    
    return (
      <div className="bg-white/90 backdrop-blur-md border border-white/30 rounded-2xl p-6 sticky top-4 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-3 text-gray-800">
          <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl shadow-lg">
            <Eye className="w-5 h-5 text-white" />
          </div>
          Live {platformName} Preview
        </h3>
        
        {/* Instagram Post Interface */}
        <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
          {/* Post Header */}
          <div className="flex items-center gap-3 p-4">
            <img 
              src={selectedAccountData?.avatar || 'https://picsum.photos/40/40?random=default'} 
              alt="Profile" 
              className="w-10 h-10 rounded-full" 
            />
            <div className="flex-1">
              <div className="font-semibold text-sm">{selectedAccountData?.name || '@your_account'}</div>
              <div className="text-xs text-gray-500">2 hours ago</div>
            </div>
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </div>
          
          {/* Post Image */}
          <div className="aspect-square bg-gray-100 flex items-center justify-center">
            {selectedPostData ? (
              <img src={selectedPostData.image} alt="Post" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-12 h-12 text-gray-400" />
            )}
          </div>
          
          {/* Post Actions */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <Heart className="w-6 h-6" />
                <MessageCircle className="w-6 h-6" />
                <Send className="w-6 h-6" />
              </div>
              <Bookmark className="w-6 h-6" />
            </div>
            
            <div className="text-sm font-semibold mb-2">
              {selectedPostData ? `${selectedPostData.likes} likes` : '124 likes'}
            </div>
            
            <div className="text-sm mb-3">
              <span className="font-semibold">{selectedAccountData?.name || '@your_account'}</span>{' '}
              {selectedPostData?.caption || 'Your post caption goes here...'}
            </div>
            
            {/* Comments Section */}
            <div className="space-y-3 border-t pt-3">
              {/* User Comment */}
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm">
                    <span className="font-semibold">@user123</span>{' '}
                    {previewComment}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">2m</div>
                </div>
              </div>
              
              {/* Bot Reply - Only show for relevant automation types */}
              {(automationType === 'comment_dm' || automationType === 'comment_only') && commentReply && (
                <div className="flex items-start gap-2 ml-4">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="font-semibold">{selectedAccountData?.name || '@your_account'}</span>{' '}
                      {automationType === 'comment_dm' ? commentReply : publicReply}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                      1m • Bot
                      {automationType === 'comment_dm' && (
                        <span className="text-blue-600">• DM sent</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* DM Preview for DM-only automation */}
              {automationType === 'dm_only' && dmAutoReply && (
                <div className="bg-blue-50 rounded-lg p-3 mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Send className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Auto DM Sent</span>
                  </div>
                  <div className="text-sm text-gray-700">{dmAutoReply}</div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Automation Summary */}
        <div className="mt-6 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Automation Type:</span>
            <span className="font-medium">
              {automationTypes.find(t => t.id === automationType)?.name || 'Not selected'}
            </span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Active Keywords:</span>
            <span className="font-medium">{currentKeywords.length}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Platform:</span>
            <span className="font-medium capitalize">{selectedAccountData?.platform || 'Not selected'}</span>
          </div>
          
          {maxRepliesPerDay && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Daily Limit:</span>
              <span className="font-medium">{maxRepliesPerDay} replies</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Setup Social Media Automation
          </h1>
          <p className="text-lg text-gray-600 font-medium">Follow the steps to configure your automation workflow</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center group">
                  <div className={`flex items-center justify-center w-14 h-14 rounded-full border-3 transition-all duration-300 shadow-lg ${
                    currentStep >= step.id 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-500 text-white transform scale-110 shadow-blue-200' 
                      : currentStep === step.id
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-500 text-white transform scale-110 shadow-blue-200'
                      : 'border-gray-300 text-gray-400 bg-white hover:border-gray-400 hover:shadow-md'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-7 h-7" />
                    ) : (
                      <span className="text-sm font-bold">{step.id}</span>
                    )}
                  </div>
                  <div className="mt-3 text-center transition-all duration-300">
                    <div className={`text-sm font-semibold ${
                      currentStep >= step.id ? 'text-blue-700' : 'text-gray-700'
                    }`}>{step.title}</div>
                    <div className={`text-xs mt-1 ${
                      currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                    }`}>{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-6 mt-[-25px] rounded-full transition-all duration-500 ${
                    currentStep > step.id 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-sm' 
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
              {renderStepContent()}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-10 pt-8 border-t border-gray-200">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-200">
                  Step {currentStep} of {steps.length}
                </div>
                
                {currentStep < 6 ? (
                  <button
                    onClick={handleNext}
                    disabled={!canProceedToNext()}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinish}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Activate Automation
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            {renderInstagramPreview()}
          </div>
        </div>
      </div>
    </div>
  )
}