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
    { id: 'post1', title: 'New Product Launch', type: 'post', date: '2 hours ago', engagement: '45 likes, 12 comments' },
    { id: 'post2', title: 'Behind the Scenes', type: 'reel', date: '1 day ago', engagement: '89 likes, 23 comments' },
    { id: 'post3', title: 'Customer Testimonial', type: 'post', date: '3 days ago', engagement: '67 likes, 8 comments' }
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
  const InstagramPreview = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden max-w-sm mx-auto">
      {/* Progress indicator */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-1"></div>
      
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm font-medium text-gray-900">Instagram post and keyword</div>
          </div>
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      
      {/* Account info */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">Your account</div>
            <div className="text-xs text-gray-500">Connected</div>
          </div>
        </div>
      </div>
      
      {/* Post preview */}
      <div className="p-4">
        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
          <div className="text-center">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <div className="text-sm text-gray-500">Post preview</div>
          </div>
        </div>
        
        {/* Post actions */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <Heart className="w-5 h-5 text-gray-600" />
            <MessageCircle className="w-5 h-5 text-gray-600" />
            <Send className="w-5 h-5 text-gray-600" />
          </div>
          <Bookmark className="w-5 h-5 text-gray-600" />
        </div>
        
        {/* Comments */}
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm">
                <span className="font-medium">username</span>
                <span className="ml-1 text-gray-700">{previewComment}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Reply</div>
            </div>
          </div>
          
          {/* Automation trigger indicator */}
          {willTriggerAutomation() && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Automation triggered</span>
              </div>
              <div className="text-sm text-gray-700">
                <div className="font-medium">Reply: {commentReply}</div>
                <div className="text-xs text-gray-500 mt-1">DM will be sent automatically</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

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
      <div className="flex">
        {/* Left Form Panel */}
        <div className="w-1/2 p-6 space-y-6">
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
              Select a scheduled post or reel
            </label>
            
            {selectedPost ? (
              <div className="p-4 border border-gray-300 rounded-lg bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Image className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Selected Post</div>
                    <div className="text-sm text-gray-500">Ready for automation</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 border border-gray-300 rounded-lg bg-blue-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-blue-900">No scheduled posts</div>
                    <div className="text-xs text-blue-700">
                      There are no posts scheduled for the social account you've selected
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
        <div className="w-1/2 bg-gray-100 p-6 flex items-center justify-center">
          <InstagramPreview />
        </div>
      </div>
    </div>
  )
}