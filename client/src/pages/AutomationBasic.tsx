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
  Youtube,
  ChevronDown,
  Image,
  Video,
  FileText,
  Layers,
  Calendar,
  Clock,
  Target,
  Users,
  Zap,
  Filter,
  PlayCircle,
  Music,
  Type,
  Palette
} from 'lucide-react'

export default function AutomationBasic() {
  console.log('AutomationBasic component loaded successfully')
  
  // Form state
  const [selectedPlatform, setSelectedPlatform] = useState('Instagram')
  const [selectedAccount, setSelectedAccount] = useState('')
  const [selectedPost, setSelectedPost] = useState('')
  const [selectedContentType, setSelectedContentType] = useState('post')
  const [keywords, setKeywords] = useState(['info', 'price', 'link'])
  const [newKeyword, setNewKeyword] = useState('')
  const [commentReply, setCommentReply] = useState('Check your DMs for more info! 📩')
  const [dmMessage, setDmMessage] = useState('Thanks for your interest! Here\'s more information about our services.')
  const [previewComment, setPreviewComment] = useState('Amazing content! info please!')
  const [userName, setUserName] = useState('your_account')
  
  // Advanced settings
  const [targetAudience, setTargetAudience] = useState('all')
  const [timeRestrictions, setTimeRestrictions] = useState(false)
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('18:00')
  const [maxRepliesPerDay, setMaxRepliesPerDay] = useState(50)
  const [cooldownPeriod, setCooldownPeriod] = useState(60)
  const [aiPersonality, setAiPersonality] = useState('professional')
  const [enableAnalytics, setEnableAnalytics] = useState(true)
  const [autoApprove, setAutoApprove] = useState(false)
  
  // Data structures
  const platforms = [
    { id: 'Instagram', name: 'Instagram', icon: <Instagram className="w-4 h-4" /> },
    { id: 'Facebook', name: 'Facebook', icon: <Facebook className="w-4 h-4" /> },
    { id: 'Twitter', name: 'Twitter', icon: <Twitter className="w-4 h-4" /> },
    { id: 'LinkedIn', name: 'LinkedIn', icon: <Linkedin className="w-4 h-4" /> },
    { id: 'Youtube', name: 'YouTube', icon: <Youtube className="w-4 h-4" /> }
  ]
  
  const contentTypes = [
    { id: 'post', name: 'Feed Post', icon: <Image className="w-4 h-4" />, description: 'Regular Instagram posts' },
    { id: 'reel', name: 'Reels', icon: <Video className="w-4 h-4" />, description: 'Short-form video content' },
    { id: 'story', name: 'Stories', icon: <PlayCircle className="w-4 h-4" />, description: '24-hour temporary content' },
    { id: 'live', name: 'Live Video', icon: <Zap className="w-4 h-4" />, description: 'Real-time streaming' }
  ]
  
  const mockAccounts = [
    { id: 'acc1', name: '@arpit9996363', followers: '9 followers', platform: 'Instagram' },
    { id: 'acc2', name: '@rahulc1020', followers: '4 followers', platform: 'Instagram' },
    { id: 'acc3', name: '@business_account', followers: '1.2K followers', platform: 'Instagram' }
  ]
  
  const mockPosts = [
    { 
      id: 'post1', 
      title: 'New Product Launch', 
      type: 'post', 
      date: '2 hours ago', 
      engagement: '45 likes, 12 comments',
      thumbnail: 'https://via.placeholder.com/150x150/3B82F6/FFFFFF?text=Post+1',
      caption: 'Exciting news! Our new product is finally here. What do you think? 🚀'
    },
    { 
      id: 'post2', 
      title: 'Behind the Scenes', 
      type: 'reel', 
      date: '1 day ago', 
      engagement: '89 likes, 23 comments',
      thumbnail: 'https://via.placeholder.com/150x150/EF4444/FFFFFF?text=Reel+1',
      caption: 'Take a look behind the scenes of our latest project! 🎬'
    },
    { 
      id: 'post3', 
      title: 'Customer Testimonial', 
      type: 'post', 
      date: '3 days ago', 
      engagement: '67 likes, 8 comments',
      thumbnail: 'https://via.placeholder.com/150x150/10B981/FFFFFF?text=Post+2',
      caption: 'Amazing feedback from our customers! Thank you for your support 💙'
    }
  ]
  
  const aiPersonalities = [
    { id: 'professional', name: 'Professional', description: 'Formal and business-focused' },
    { id: 'friendly', name: 'Friendly', description: 'Warm and approachable' },
    { id: 'casual', name: 'Casual', description: 'Relaxed and conversational' },
    { id: 'expert', name: 'Expert', description: 'Knowledgeable and authoritative' }
  ]
  
  // Helper functions
  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()])
      setNewKeyword('')
    }
  }
  
  const removeKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter(keyword => keyword !== keywordToRemove))
  }
  
  const willTriggerAutomation = () => {
    return keywords.some(keyword => 
      previewComment.toLowerCase().includes(keyword.toLowerCase())
    )
  }
  
  const canSaveAutomation = () => {
    return selectedAccount && selectedPost && keywords.length > 0 && commentReply.trim() && dmMessage.trim()
  }

  // Custom Dropdown Component
  const CustomDropdown = ({ label, value, options, onChange, placeholder = "Select an option" }) => {
    const [isOpen, setIsOpen] = useState(false)
    
    return (
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className={value ? 'text-gray-900' : 'text-gray-500'}>
              {value || placeholder}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>
        
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {option.icon && <span className="text-gray-500">{option.icon}</span>}
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    {option.description && (
                      <div className="text-sm text-gray-500">{option.description}</div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Instagram Preview Component  
  const InstagramPreview = () => {
    const selectedPostData = mockPosts.find(post => post.id === selectedPost)
    const selectedAccountData = mockAccounts.find(acc => acc.id === selectedAccount)
    
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden w-full mx-auto">
        {/* Progress indicator */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-1"></div>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="text-base font-medium text-gray-900">Instagram post and keyword</div>
            </div>
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        
        {/* Account info */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="text-base font-medium text-gray-900">
                {selectedAccountData?.name || 'Select an account'}
              </div>
              <div className="text-sm text-gray-500">
                {selectedAccountData?.followers || 'No account selected'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Post preview */}
        <div className="p-6">
          {selectedPostData ? (
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-6 relative overflow-hidden">
              <img
                src={selectedPostData.thumbnail}
                alt={selectedPostData.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                {selectedPostData.type}
              </div>
            </div>
          ) : (
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-6">
              <div className="text-center">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                <div className="text-base text-gray-500">Select a post</div>
              </div>
            </div>
          )}
          
          {/* Post actions */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-5">
              <Heart className="w-6 h-6 text-gray-600 hover:text-red-500 cursor-pointer" />
              <MessageCircle className="w-6 h-6 text-gray-600 hover:text-blue-500 cursor-pointer" />
              <Send className="w-6 h-6 text-gray-600 hover:text-green-500 cursor-pointer" />
            </div>
            <Bookmark className="w-6 h-6 text-gray-600 hover:text-yellow-500 cursor-pointer" />
          </div>
          
          {/* Post caption */}
          {selectedPostData && (
            <div className="text-sm text-gray-900 mb-4">
              <span className="font-semibold">{selectedAccountData?.name}</span>
              <span className="ml-1">{selectedPostData.caption}</span>
            </div>
          )}
          
          {/* Comments */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm">
                  <span className="font-semibold">username</span>
                  <span className="ml-1 text-gray-700">{previewComment}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Reply</div>
              </div>
            </div>
            
            {/* Automation trigger indicator */}
            {willTriggerAutomation() && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-600">Automation triggered</span>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-700">
                    <div className="font-semibold">Public Reply:</div>
                    <div className="mt-1 p-2 bg-white rounded border">{commentReply}</div>
                  </div>
                  <div className="text-sm text-gray-700">
                    <div className="font-semibold">DM Message:</div>
                    <div className="mt-1 p-2 bg-white rounded border">{dmMessage}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create a DM automation</h1>
            <p className="text-sm text-gray-600 mt-1">
              Invite people to use a specific keyword in the comments of an Instagram Post or Reel,
              and automatically reply to their comment and send them a direct message.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex min-h-screen">
        {/* Left Form Panel */}
        <div className="w-1/2 p-6 space-y-6 overflow-y-auto">
          {/* Social Account Selection */}
          <CustomDropdown
            label="Social account"
            value={selectedAccount}
            onChange={setSelectedAccount}
            placeholder="Select an option"
            options={mockAccounts.map(acc => ({
              value: acc.id,
              label: acc.name,
              description: acc.followers,
              icon: <Instagram className="w-4 h-4" />
            }))}
          />

          {/* Content Type Selection */}
          <CustomDropdown
            label="Content type"
            value={selectedContentType}
            onChange={setSelectedContentType}
            placeholder="Select content type"
            options={contentTypes.map(type => ({
              value: type.id,
              label: type.name,
              description: type.description,
              icon: type.icon
            }))}
          />

          {/* Post Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select a post or reel
            </label>
            
            {selectedAccount ? (
              <div className="space-y-3">
                {mockPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(post.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPost === post.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{post.title}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            post.type === 'reel' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {post.type}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">{post.date} • {post.engagement}</div>
                      </div>
                      {selectedPost === post.id && (
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 border border-gray-300 rounded-lg bg-blue-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-blue-900">Select a social account first</div>
                    <div className="text-xs text-blue-700">
                      Choose a social account to see available posts
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Keyword</label>
            <p className="text-sm text-gray-600 mb-3">
              When a user includes this keyword in a comment it will trigger a reply to their comment and a DM.
            </p>
            
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Enter keyword"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
              />
              <button
                onClick={addKeyword}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {keyword}
                  <button
                    onClick={() => removeKeyword(keyword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Reply Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment reply message
            </label>
            <textarea
              value={commentReply}
              onChange={(e) => setCommentReply(e.target.value)}
              placeholder="Enter your public comment reply..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* DM Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Direct message
            </label>
            <textarea
              value={dmMessage}
              onChange={(e) => setDmMessage(e.target.value)}
              placeholder="Enter your private DM message..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Advanced Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Advanced Settings</h3>
            
            <CustomDropdown
              label="AI Personality"
              value={aiPersonality}
              onChange={setAiPersonality}
              placeholder="Select personality"
              options={aiPersonalities.map(personality => ({
                value: personality.id,
                label: personality.name,
                description: personality.description,
                icon: <Brain className="w-4 h-4" />
              }))}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max replies per day
                </label>
                <input
                  type="number"
                  value={maxRepliesPerDay}
                  onChange={(e) => setMaxRepliesPerDay(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cooldown (minutes)
                </label>
                <input
                  type="number"
                  value={cooldownPeriod}
                  onChange={(e) => setCooldownPeriod(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6">
            <button
              onClick={() => setPreviewComment('Amazing content! info please!')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Test Preview
            </button>
            <button
              onClick={() => {
                if (canSaveAutomation()) {
                  // Navigate to next step - you can implement navigation logic here
                  console.log('Continuing to next step...', {
                    selectedAccount,
                    selectedPost,
                    selectedContentType,
                    keywords,
                    commentReply,
                    dmMessage,
                    aiPersonality,
                    maxRepliesPerDay,
                    cooldownPeriod
                  })
                  // Example: router.push('/automation/schedule') or setCurrentStep(2)
                }
              }}
              disabled={!canSaveAutomation()}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                canSaveAutomation()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          </div>
        </div>

        {/* Right Preview Panel */}
        <div className="w-1/2 bg-gray-100 p-6 flex items-start justify-center sticky top-0 h-screen overflow-y-auto">
          <div className="w-full max-w-lg pt-8">
            <InstagramPreview />
          </div>
        </div>
      </div>
    </div>
  )
}