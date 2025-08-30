import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { 
  Check,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  User,
  Plus,
  ArrowRight,
  ArrowLeft,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Linkedin,
  Zap,
  Settings,
  Play,
  Pause,
  Edit3,
  Trash2,
  Bot,
  X,
  Image,
  Video,
  FileText,
  Camera,
  CheckCircle,
  AlertCircle,
  Globe,
  ExternalLink,
  Sparkles,
  Target,
  TrendingUp,
  Clock,
  Filter,
  Search,
  Star,
  Layers,
  Palette,
  Wand2,
  Cpu,
  Rocket,
  Shield,
  Crown,
  Gem,
  Briefcase,
  Users,
  Activity,
  BarChart3,
  PieChart,
  TrendingDown,
  Calendar,
  Hash,
  AtSign,
  Link2,
  Eye,
  RefreshCw,
  Bell,
  Archive,
  Folder,
  Tag,
  Flag,
  Volume2,
  Mic,
  Headphones,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Desktop,
  Server,
  Database,
  Cloud,
  Wifi,
  Bluetooth,
  Usb,
  HardDrive,
  Cpu as ProcessorIcon,
  MemoryStick,
  Battery,
  Power,
  Plug,
  Cable,
  Router,
  Printer,
  Scanner,
  Keyboard,
  Mouse,
  Gamepad2,
  Joystick,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  Puzzle,
  Shuffle,
  Repeat,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Pentagon,
  Octagon,
  Diamond,
  Rhombus,
  Parallelogram,
  Trapezoid,
  Kite,
  Oval,
  Rectangle,
  RoundedRectangle,
  Cylinder,
  Cone,
  Cube,
  Sphere,
  Pyramid,
  Prism,
  Tetrahedron,
  Octahedron,
  Dodecahedron,
  Icosahedron,
  Torus,
  Mobius,
  Klein,
  Fractal,
  Mandelbrot,
  Julia,
  Fibonacci,
  Golden,
  Phi,
  Pi,
  E,
  Infinity,
  Null,
  Void,
  Empty,
  Full,
  Half,
  Quarter,
  Third,
  Fifth,
  Sixth,
  Seventh,
  Eighth,
  Ninth,
  Tenth,
  Eleventh,
  Twelfth,
  Thirteenth,
  Fourteenth,
  Fifteenth,
  Sixteenth,
  Seventeenth,
  Eighteenth,
  Nineteenth,
  Twentieth
} from 'lucide-react'
import { apiRequest } from '@/lib/queryClient'

interface SocialAccount {
  id: string
  username: string
  platform: string
  profilePictureUrl?: string
  followers?: number
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
}

interface AutomationRule {
  id: string
  name: string
  platform?: string
  contentType?: string
  automationType?: string
  type: 'comment_dm' | 'dm_only' | 'comment_only'
  status?: 'active' | 'paused' | 'draft'
  isActive: boolean
  triggers?: number
  created?: string
  keywords: string[]
  responses: {
    responses: string[]
    dmResponses?: string[]
  }
  createdAt?: string
  updatedAt?: string
}

export default function Automation() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<AutomationFormData>({
    name: '',
    platform: '',
    contentType: '',
    automationType: '',
    selectedPost: '',
    responseType: '',
    keywords: [],
    replyText: '',
    commentReplies: [],
    dmMessage: '',
    buttonText: '',
    websiteUrl: '',
    delay: 15
  })
  const [newKeyword, setNewKeyword] = useState('')
  const [newCommentReply, setNewCommentReply] = useState('')
  const [activeTab, setActiveTab] = useState('create')
  const [mockComment, setMockComment] = useState('cy')
  const [mockReply, setMockReply] = useState('vfrv')

  // Fetch social accounts
  const { data: socialAccounts = [] } = useQuery<SocialAccount[]>({
    queryKey: ['/api/social-accounts'],
    queryFn: () => apiRequest('/api/social-accounts')
  })

  // Debug the social accounts data
  console.log('[AUTOMATION DEBUG] Social accounts data:', socialAccounts)
  const instagramAccount = socialAccounts.find(acc => acc.platform === 'instagram')
  console.log('[AUTOMATION DEBUG] Instagram account:', instagramAccount)

  // Get user data for workspaceId
  const { data: userData } = useQuery({
    queryKey: ['/api/user'],
    queryFn: () => apiRequest('/api/user')
  })

  // Fetch automation rules from backend API
  const { data: automationRulesResponse, isLoading: rulesLoading, refetch: refetchRules } = useQuery<{ rules: AutomationRule[] }>({
    queryKey: ['/api/automation/rules', userData?.currentWorkspaceId],
    queryFn: () => apiRequest(`/api/automation/rules?workspaceId=${userData?.currentWorkspaceId}`),
    enabled: !!userData?.currentWorkspaceId
  })

  const automationRules = automationRulesResponse?.rules || []

  // Create automation rule mutation
  const createRuleMutation = useMutation({
    mutationFn: (automationData: any) => 
      apiRequest('/api/automation/rules', {
        method: 'POST',
        body: JSON.stringify({
          ...automationData,
          workspaceId: userData?.currentWorkspaceId
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/automation/rules'] })
      console.log('[AUTOMATION] Rule created successfully')
    },
    onError: (error: any) => {
      console.error('[AUTOMATION] Failed to create rule:', error)
    }
  })

  // Mock posts data
  const mockPosts = [
    {
      id: '1',
      platform: 'instagram',
      type: 'post',
      caption: 'Check out this amazing content! What do you think?',
      imageUrl: 'https://via.placeholder.com/400x400/E8E7FF/8B5DFF?text=Your+Post+Content',
      username: 'your_account',
      realUsername: 'rahulc1020',
      timeAgo: '2 hours ago',
      likes: 124,
      comments: 12,
      shares: 3
    }
  ]

  const platforms = [
    { value: 'instagram', label: 'Instagram', icon: Instagram, color: 'from-pink-500 to-purple-600' },
    { value: 'youtube', label: 'YouTube', icon: Youtube, color: 'from-red-500 to-red-600' },
    { value: 'facebook', label: 'Facebook', icon: Facebook, color: 'from-blue-500 to-blue-600' },
    { value: 'twitter', label: 'Twitter', icon: Twitter, color: 'from-blue-400 to-blue-500' },
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'from-blue-600 to-blue-700' }
  ]

  const getContentTypes = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return [
          { value: 'post', label: 'Post', icon: FileText, color: 'from-purple-500 to-pink-500' },
          { value: 'story', label: 'Story', icon: Image, color: 'from-orange-500 to-pink-500' },
          { value: 'reel', label: 'Reel', icon: Video, color: 'from-indigo-500 to-purple-500' }
        ]
      case 'youtube':
        return [
          { value: 'video', label: 'Video', icon: Video, color: 'from-red-500 to-red-600' },
          { value: 'short', label: 'Short', icon: Camera, color: 'from-red-400 to-red-500' }
        ]
      case 'facebook':
        return [
          { value: 'post', label: 'Post', icon: FileText, color: 'from-blue-500 to-blue-600' },
          { value: 'story', label: 'Story', icon: Image, color: 'from-blue-400 to-purple-500' },
          { value: 'video', label: 'Video', icon: Video, color: 'from-blue-600 to-indigo-600' }
        ]
      case 'twitter':
        return [
          { value: 'tweet', label: 'Tweet', icon: FileText, color: 'from-blue-400 to-blue-500' },
          { value: 'thread', label: 'Thread', icon: FileText, color: 'from-blue-500 to-indigo-500' }
        ]
      case 'linkedin':
        return [
          { value: 'post', label: 'Post', icon: FileText, color: 'from-blue-600 to-blue-700' },
          { value: 'article', label: 'Article', icon: FileText, color: 'from-blue-700 to-indigo-700' },
          { value: 'video', label: 'Video', icon: Video, color: 'from-blue-500 to-blue-600' }
        ]
      default:
        return []
    }
  }

  const automationTypes = [
    { 
      value: 'comment', 
      label: 'Comment Automation', 
      description: 'Automatically reply to comments with intelligent responses',
      icon: MessageCircle,
      color: 'from-blue-500 to-blue-600',
      features: ['Keyword Detection', 'AI Responses', 'Smart Filtering']
    },
    { 
      value: 'dm', 
      label: 'DM Automation', 
      description: 'Send direct messages automatically based on user interactions',
      icon: Send,
      color: 'from-purple-500 to-purple-600',
      features: ['Auto DM', 'Personalization', 'Lead Generation']
    },
    { 
      value: 'comment_to_dm', 
      label: 'Comment to DM Automation', 
      description: 'Reply to comments first, then follow up with direct messages',
      icon: ArrowRight,
      color: 'from-indigo-500 to-purple-600',
      features: ['Two-Step Process', 'Comment Reply', 'Follow-up DM']
    }
  ]

  const responseTypes = [
    { 
      value: 'keyword', 
      label: 'Keyword Based', 
      description: 'Reply based on specific keywords and phrases',
      icon: Hash,
      color: 'from-green-500 to-green-600'
    },
    { 
      value: 'ai_based', 
      label: 'AI Based Reply', 
      description: 'Let AI generate contextual responses automatically',
      icon: Bot,
      color: 'from-purple-500 to-indigo-600'
    }
  ]

  const updateFormData = (updates: Partial<AutomationFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      updateFormData({ keywords: [...formData.keywords, newKeyword.trim()] })
      setNewKeyword('')
    }
  }

  const removeKeyword = (keyword: string) => {
    updateFormData({ keywords: formData.keywords.filter(k => k !== keyword) })
  }

  const addCommentReply = () => {
    if (newCommentReply.trim() && !formData.commentReplies.includes(newCommentReply.trim())) {
      updateFormData({ commentReplies: [...formData.commentReplies, newCommentReply.trim()] })
      setNewCommentReply('')
    }
  }

  const removeCommentReply = (reply: string) => {
    updateFormData({ commentReplies: formData.commentReplies.filter(r => r !== reply) })
  }

  const handleNextStep = () => {
    if (canProceedToNextStep()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.platform && formData.contentType
      case 2:
        return formData.automationType
      case 3:
        return formData.selectedPost
      case 4:
        if (formData.automationType === 'comment_to_dm') {
          return formData.commentReplies.length > 0
        }
        return formData.responseType && (formData.responseType === 'ai_based' || formData.replyText)
      case 5:
        if (formData.automationType === 'comment_to_dm') {
          return formData.dmMessage && formData.buttonText
        }
        return true
      default:
        return false
    }
  }

  const getTotalSteps = () => {
    return formData.automationType === 'comment_to_dm' ? 6 : 5
  }

  const getStepTitle = (step: number) => {
    if (formData.automationType === 'comment_to_dm') {
      switch (step) {
        case 1: return 'Setup & Platform'
        case 2: return 'Automation Type'
        case 3: return 'Select Post'
        case 4: return 'Comment Replies'
        case 5: return 'Direct Message'
        case 6: return 'Review & Save'
        default: return `Step ${step}`
      }
    } else {
      switch (step) {
        case 1: return 'Setup & Platform'
        case 2: return 'Automation Type'
        case 3: return 'Select Post'
        case 4: return 'Response Setup'
        case 5: return 'Review & Save'
        default: return `Step ${step}`
      }
    }
  }

  const handleCreateAutomation = async () => {
    // Prepare automation rule data in expected backend format
    const automationData = {
      name: formData.name,
      type: formData.automationType === 'comment_to_dm' ? 'comment_dm' : 
            formData.automationType === 'dm' ? 'dm_only' : 'comment_only',
      isActive: true,
      keywords: formData.keywords,
      targetMediaIds: formData.selectedPost ? [formData.selectedPost] : [],
      responses: {
        responses: formData.commentReplies.length > 0 ? formData.commentReplies : [],
        dmResponses: formData.dmMessage ? [formData.dmMessage] : []
      }
    }
    
    console.log('[AUTOMATION] Creating automation rule:', automationData)
    
    try {
      await createRuleMutation.mutateAsync(automationData)
      
      // Reset form on success
      setCurrentStep(1)
      setFormData({
        name: '',
        platform: '',
        contentType: '',
        automationType: '',
        selectedPost: '',
        responseType: '',
        keywords: [],
        replyText: '',
        commentReplies: [],
        dmMessage: '',
        buttonText: '',
        websiteUrl: '',
        delay: 15
      })
      setActiveTab('manage')
      
    } catch (error) {
      alert('Failed to create automation rule. Please try again.')
    }
  }

  const InstagramPostPreview = () => {
    const selectedPost = mockPosts.find(p => p.id === formData.selectedPost)
    const connectedAccount = socialAccounts.find(acc => acc.platform === 'instagram')
    
    // More detailed debugging
    console.log('[LIVE PREVIEW DEBUG] All social accounts:', socialAccounts)
    console.log('[LIVE PREVIEW DEBUG] Connected account:', connectedAccount)
    console.log('[LIVE PREVIEW DEBUG] Profile picture URL:', connectedAccount?.profilePictureUrl || connectedAccount?.profilePicture)
    console.log('[LIVE PREVIEW DEBUG] Followers:', connectedAccount?.followers)
    console.log('[LIVE PREVIEW DEBUG] Username:', connectedAccount?.username)
    console.log('[LIVE PREVIEW DEBUG] All account fields:', connectedAccount ? Object.keys(connectedAccount) : 'No account')
    
    if (!selectedPost) return null

    return (
      <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-sm mx-auto border border-gray-100">
        {/* Live Preview Header */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 px-4 py-3 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-gray-800">Live Preview</span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Real-time automation preview</span>
          </div>
        </div>

        {/* Post Header */}
        <div className="p-4 border-b border-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {(() => {
                const profilePic = connectedAccount?.profilePictureUrl || 
                                  connectedAccount?.profilePicture || 
                                  (connectedAccount?.username ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${connectedAccount.username}` : null);
                
                console.log('[LIVE PREVIEW] Trying to load profile picture:', profilePic);
                
                return profilePic ? (
                  <img 
                    src={profilePic}
                    alt={connectedAccount?.username || 'User'}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      console.log('[LIVE PREVIEW] Profile picture failed to load:', e.currentTarget.src)
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling.style.display = 'flex'
                    }}
                  />
                ) : null;
              })()}
              <div 
                className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                style={{ 
                  display: (connectedAccount?.profilePictureUrl || connectedAccount?.profilePicture) ? 'none' : 'flex' 
                }}
              >
                <span className="text-white text-xs font-bold">
                  {connectedAccount?.username ? connectedAccount.username.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">
                  @{connectedAccount?.username || 'loading...'}
                </p>
                <p className="text-xs text-gray-500">
                  {connectedAccount?.followers !== undefined ? 
                    `${connectedAccount.followers} followers` : 
                    'Loading followers...'
                  } • {selectedPost?.timeAgo || '2h ago'}
                </p>
              </div>
              {/* Moved inside the fallback avatar div above */}
            </div>
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        
        {/* Post Content */}
        <div className="bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 aspect-square flex flex-col items-center justify-center p-8">
          <div className="w-16 h-16 bg-gray-400 rounded-lg flex items-center justify-center mb-4">
            <Camera className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-gray-600 font-medium text-center">Your Post Content</p>
          <p className="text-gray-500 text-sm">Image or Video</p>
        </div>
        
        {/* Post Actions */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex space-x-4">
              <Heart className="w-6 h-6 text-gray-700" />
              <MessageCircle className="w-6 h-6 text-gray-700" />
              <Send className="w-6 h-6 text-gray-700" />
            </div>
            <Bookmark className="w-6 h-6 text-gray-700" />
          </div>
          
          <p className="text-sm font-semibold text-gray-900 mb-2">{selectedPost.likes} likes</p>
          <p className="text-sm text-gray-900 mb-3">
            <span className="font-semibold">{selectedPost.username}</span>{' '}
            <span className="text-gray-700">{selectedPost.caption}</span>
          </p>
          
          <div className="text-xs text-gray-500 mb-3">
            View all {selectedPost.comments} comments
          </div>
          
          {/* Comments Section */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            {/* Mock Comment */}
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">U</span>
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold text-gray-900">user_123</span>{' '}
                  <span className="text-gray-700">{mockComment}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">2m ago</p>
              </div>
            </div>
            
            {/* Auto Reply */}
            {formData.commentReplies.length > 0 && (
              <div className="flex items-start space-x-2 ml-8">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">R</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold text-blue-600">
                      @{connectedAccount?.username || 'your_account'}
                    </span>{' '}
                    <span className="text-gray-700">{mockReply}</span>
                  </p>
                  <div className="flex items-center space-x-3 mt-1">
                    <p className="text-xs text-gray-500">Auto-reply</p>
                    <p className="text-xs text-gray-500">•</p>
                    <p className="text-xs text-gray-500">Just now</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const InstagramDMPreview = () => {
    return (
      <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-sm mx-auto border border-gray-100">
        {/* Live Preview Header */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 px-4 py-3 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-gray-800">Live Preview</span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Instagram</span>
          </div>
        </div>

        {/* DM Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-purple-500 font-bold">R</span>
            </div>
            <div>
              <p className="text-white font-semibold">Instagram direct message</p>
              <p className="text-purple-100 text-sm">JUL 14, 11:18 PM</p>
            </div>
          </div>
        </div>
        
        {/* DM Messages */}
        <div className="p-4 space-y-3 bg-gray-50 min-h-[200px]">
          <div className="text-right">
            <div className="inline-block bg-gray-200 rounded-2xl px-4 py-2 max-w-xs">
              <p className="text-sm text-gray-800">hi bro kaisa hai</p>
            </div>
          </div>
          
          {formData.dmMessage && (
            <div className="text-left">
              <div className="inline-block bg-blue-500 text-white rounded-2xl px-4 py-2 max-w-xs">
                <p className="text-sm">{formData.dmMessage}</p>
              </div>
            </div>
          )}
          
          {formData.buttonText && (
            <div className="text-left">
              <div className="inline-block bg-gray-200 rounded-2xl px-4 py-2 max-w-xs">
                <p className="text-sm text-blue-600 font-semibold">{formData.buttonText}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* DM Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
              <p className="text-sm text-gray-500">Message...</p>
            </div>
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Camera className="w-4 h-4 text-gray-500" />
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Image className="w-4 h-4 text-gray-500" />
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Send className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderCreateAutomationStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <div>
                <Label htmlFor="automation-name" className="text-base font-semibold text-gray-900">Automation Name</Label>
                <p className="text-sm text-gray-600 mt-1">Give your automation a memorable name</p>
                <Input
                  id="automation-name"
                  value={formData.name}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                  placeholder="e.g., Lead Generation Campaign"
                  className="mt-2 h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold text-gray-900">Social Media Platform</Label>
                <p className="text-sm text-gray-600 mt-1">Choose the platform where your automation will run</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {platforms.map((platform) => {
                  const Icon = platform.icon
                  return (
                    <div
                      key={platform.value}
                      className={`group relative overflow-hidden rounded-xl p-6 cursor-pointer transition-all duration-300 border-2 ${
                        formData.platform === platform.value
                          ? 'border-blue-500 bg-blue-50 scale-105 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 hover:scale-102 hover:shadow-md'
                      }`}
                      onClick={() => updateFormData({ platform: platform.value, contentType: '' })}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                      <div className="relative flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{platform.label}</p>
                          <p className="text-sm text-gray-600">Connect and automate</p>
                        </div>
                      </div>
                      {formData.platform === platform.value && (
                        <div className="absolute top-4 right-4">
                          <CheckCircle className="w-6 h-6 text-blue-500" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            
            {formData.platform && (
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold text-gray-900">Content Type</Label>
                  <p className="text-sm text-gray-600 mt-1">Select the type of content to automate</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getContentTypes(formData.platform).map((type) => {
                    const Icon = type.icon
                    return (
                      <div
                        key={type.value}
                        className={`group relative overflow-hidden rounded-xl p-6 cursor-pointer transition-all duration-300 border-2 ${
                          formData.contentType === type.value
                            ? 'border-blue-500 bg-blue-50 scale-105 shadow-lg'
                            : 'border-gray-200 hover:border-gray-300 hover:scale-102 hover:shadow-md'
                        }`}
                        onClick={() => updateFormData({ contentType: type.value })}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                        <div className="relative flex flex-col items-center space-y-3">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-center">
                            <p className="font-semibold text-gray-900">{type.label}</p>
                            <p className="text-sm text-gray-600">Automate {type.label.toLowerCase()}</p>
                          </div>
                        </div>
                        {formData.contentType === type.value && (
                          <div className="absolute top-4 right-4">
                            <CheckCircle className="w-5 h-5 text-blue-500" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )
      
      case 2:
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold text-gray-900">Automation Type</Label>
                <p className="text-sm text-gray-600 mt-1">Choose how you want to interact with your audience</p>
              </div>
              <div className="space-y-4">
                {automationTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <div
                      key={type.value}
                      className={`group relative overflow-hidden rounded-xl p-6 cursor-pointer transition-all duration-300 border-2 ${
                        formData.automationType === type.value
                          ? 'border-blue-500 bg-blue-50 scale-102 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 hover:scale-102 hover:shadow-md'
                      }`}
                      onClick={() => updateFormData({ automationType: type.value })}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                      <div className="relative flex items-center space-x-4">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900">{type.label}</h3>
                          <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {type.features.map((feature) => (
                              <span key={feature} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      {formData.automationType === type.value && (
                        <div className="absolute top-4 right-4">
                          <CheckCircle className="w-6 h-6 text-blue-500" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      
      case 3:
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold text-gray-900">Select Post</Label>
                <p className="text-sm text-gray-600 mt-1">Choose the post where automation will be applied</p>
              </div>
              <div className="space-y-4">
                {mockPosts.map((post) => (
                  <div
                    key={post.id}
                    className={`group relative overflow-hidden rounded-xl p-6 cursor-pointer transition-all duration-300 border-2 ${
                      formData.selectedPost === post.id
                        ? 'border-blue-500 bg-blue-50 scale-102 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:scale-102 hover:shadow-md'
                    }`}
                    onClick={() => updateFormData({ selectedPost: post.id })}
                  >
                    <div className="relative flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">{post.caption}</h3>
                        <p className="text-sm text-gray-600 mt-1">@{post.username} • {post.timeAgo}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-500 flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {post.likes}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {post.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                    {formData.selectedPost === post.id && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle className="w-6 h-6 text-blue-500" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      
      case 4:
        if (formData.automationType === 'comment_to_dm') {
          return (
            <div className="space-y-8">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold text-gray-900">Comment Replies</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Create multiple reply variations to make your responses seem more natural and authentic
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Pro Tip</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Adding variety to your replies helps maintain authentic engagement and prevents your responses from appearing robotic.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <Label className="text-base font-semibold text-gray-900">Your Reply Options</Label>
                <div className="space-y-3">
                  {formData.commentReplies.map((reply, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <Input
                        value={reply}
                        onChange={(e) => {
                          const newReplies = [...formData.commentReplies]
                          newReplies[index] = e.target.value
                          updateFormData({ commentReplies: newReplies })
                          if (index === 0) setMockReply(e.target.value)
                        }}
                        className="flex-1 border-0 bg-transparent focus:ring-0 text-base"
                        placeholder="Enter your reply..."
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCommentReply(reply)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Plus className="w-4 h-4 text-gray-500" />
                    </div>
                    <Input
                      value={newCommentReply}
                      onChange={(e) => setNewCommentReply(e.target.value)}
                      placeholder="Add another reply option..."
                      className="flex-1 border-0 bg-transparent focus:ring-0 text-base"
                    />
                    <Button 
                      onClick={addCommentReply} 
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={!newCommentReply.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Label className="text-base font-semibold text-gray-900">Response Timing</Label>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Delay Settings</span>
                  </div>
                  <p className="text-sm text-yellow-700 mb-3">
                    Adding a delay makes your automated responses appear more natural and thoughtful.
                  </p>
                  <div className="flex items-center space-x-3">
                    <Input
                      type="number"
                      value={formData.delay}
                      onChange={(e) => updateFormData({ delay: parseInt(e.target.value) || 15 })}
                      className="w-20 text-center"
                      min="1"
                      max="60"
                    />
                    <span className="text-sm text-gray-700">minutes before replying</span>
                  </div>
                </div>
              </div>
            </div>
          )
        } else {
          return (
            <div className="space-y-8">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold text-gray-900">Response Type</Label>
                  <p className="text-sm text-gray-600 mt-1">Choose how your automation will generate responses</p>
                </div>
                <div className="space-y-4">
                  {responseTypes.map((type) => {
                    const Icon = type.icon
                    return (
                      <div
                        key={type.value}
                        className={`group relative overflow-hidden rounded-xl p-6 cursor-pointer transition-all duration-300 border-2 ${
                          formData.responseType === type.value
                            ? 'border-blue-500 bg-blue-50 scale-102 shadow-lg'
                            : 'border-gray-200 hover:border-gray-300 hover:scale-102 hover:shadow-md'
                        }`}
                        onClick={() => updateFormData({ responseType: type.value })}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                        <div className="relative flex items-center space-x-4">
                          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900">{type.label}</h3>
                            <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                          </div>
                        </div>
                        {formData.responseType === type.value && (
                          <div className="absolute top-4 right-4">
                            <CheckCircle className="w-6 h-6 text-blue-500" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
              
              {formData.responseType === 'keyword' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-base font-semibold text-gray-900">Keywords</Label>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {formData.keywords.map((keyword) => (
                          <Badge key={keyword} variant="secondary" className="flex items-center gap-2 px-3 py-1 text-sm">
                            <Hash className="w-3 h-3" />
                            {keyword}
                            <X 
                              className="w-3 h-3 cursor-pointer hover:text-red-500" 
                              onClick={() => removeKeyword(keyword)}
                            />
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center space-x-3">
                        <Input
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          placeholder="Add trigger keyword..."
                          className="flex-1 h-12 text-base"
                        />
                        <Button 
                          onClick={addKeyword} 
                          className="bg-blue-600 hover:bg-blue-700 h-12"
                          disabled={!newKeyword.trim()}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label htmlFor="reply-text" className="text-base font-semibold text-gray-900">Reply Message</Label>
                    <Textarea
                      id="reply-text"
                      value={formData.replyText}
                      onChange={(e) => updateFormData({ replyText: e.target.value })}
                      placeholder="Enter your automated reply message..."
                      className="min-h-[120px] text-base border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      rows={4}
                    />
                  </div>
                </div>
              )}
              
              {formData.responseType === 'ai_based' && (
                <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-purple-900">AI-Based Reply Enabled</p>
                      <p className="text-sm text-purple-700">Advanced contextual responses powered by AI</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-700">Contextual understanding</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-700">Natural language responses</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-700">Adaptive to user sentiment</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        }
      
      case 5:
        if (formData.automationType === 'comment_to_dm') {
          return (
            <div className="space-y-8">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold text-gray-900">Direct Message Setup</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Configure the direct message that will be sent after the comment reply
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <ArrowRight className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Workflow</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    After replying to the comment, your automation will automatically send this DM to continue the conversation privately.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base font-semibold text-gray-900">Direct Message</Label>
                  <p className="text-sm text-gray-600">The message that will be sent to users who comment with your keywords</p>
                  <Textarea
                    value={formData.dmMessage}
                    onChange={(e) => updateFormData({ dmMessage: e.target.value })}
                    placeholder="Hi! Thanks for your comment. I'd love to share more details with you..."
                    className="min-h-[120px] text-base border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-4">
                  <Label className="text-base font-semibold text-gray-900">Call-to-Action Button</Label>
                  <p className="text-sm text-gray-600">Add a button text that encourages users to take action</p>
                  <Input
                    value={formData.buttonText}
                    onChange={(e) => updateFormData({ buttonText: e.target.value })}
                    placeholder="e.g., See products, Learn more, Get started"
                    className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                  />
                </div>
                
                <div className="space-y-4">
                  <Label className="text-base font-semibold text-gray-900">Website URL (Optional)</Label>
                  <p className="text-sm text-gray-600">Direct users to your website or landing page</p>
                  <Input
                    value={formData.websiteUrl}
                    onChange={(e) => updateFormData({ websiteUrl: e.target.value })}
                    placeholder="https://your-website.com"
                    className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )
        } else {
          return (
            <div className="space-y-8">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold text-gray-900">Review & Activate</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Review your automation settings and activate when ready
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-green-900">Automation Ready</p>
                      <p className="text-sm text-green-700">Your automation is configured and ready to activate</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Configuration Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Name:</span>
                        <span className="text-sm font-semibold text-gray-900">{formData.name}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Platform:</span>
                        <span className="text-sm font-semibold text-gray-900 capitalize">{formData.platform}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Content Type:</span>
                        <span className="text-sm font-semibold text-gray-900 capitalize">{formData.contentType}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Automation:</span>
                        <span className="text-sm font-semibold text-gray-900 capitalize">{formData.automationType.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Response Type:</span>
                        <span className="text-sm font-semibold text-gray-900 capitalize">{formData.responseType?.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Expected Performance</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">Engagement Rate</p>
                          <p className="text-xs text-blue-700">Expected 25-40% increase</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                        <Target className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-sm font-medium text-purple-900">Response Time</p>
                          <p className="text-xs text-purple-700">Instant to {formData.delay} minutes</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                        <Users className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-900">Lead Generation</p>
                          <p className="text-xs text-green-700">Automated follow-up</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      
      case 6:
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold text-gray-900">Final Review</Label>
                <p className="text-sm text-gray-600 mt-1">
                  Review your complete automation setup before activation
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-blue-900">Comment to DM Automation</p>
                    <p className="text-sm text-blue-700">Two-step engagement process configured</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Step 1: Comment Replies</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-2">Reply Options ({formData.commentReplies.length})</p>
                      <div className="space-y-2">
                        {formData.commentReplies.slice(0, 3).map((reply, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {index + 1}
                            </div>
                            <p className="text-sm text-gray-600 truncate">{reply}</p>
                          </div>
                        ))}
                        {formData.commentReplies.length > 3 && (
                          <p className="text-xs text-gray-500">+{formData.commentReplies.length - 3} more replies</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Step 2: Direct Message</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-2">DM Configuration</p>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <p className="text-sm text-gray-600">Message: Configured</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <p className="text-sm text-gray-600">Button: {formData.buttonText}</p>
                        </div>
                        {formData.websiteUrl && (
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <p className="text-sm text-gray-600">Website: Added</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-green-900">Ready to Launch</p>
                    <p className="text-sm text-green-700">Your automation is ready to engage with your audience</p>
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

  const renderPreview = () => {
    if (!formData.selectedPost) return null
    
    if (formData.automationType === 'comment_to_dm' && currentStep === 5) {
      return <InstagramDMPreview />
    } else if (formData.automationType === 'comment_to_dm' && currentStep === 6) {
      return (
        <div className="space-y-6">
          <InstagramPostPreview />
          <InstagramDMPreview />
        </div>
      )
    } else {
      return <InstagramPostPreview />
    }
  }

  if (activeTab === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="w-full p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Create Automation</h1>
                <p className="text-gray-600 mt-1">Build intelligent automation workflows for your social media</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">{currentStep}</span>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">{getStepTitle(currentStep)}</p>
                  <p className="text-sm text-gray-600">Step {currentStep} of {getTotalSteps()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{Math.round((currentStep / getTotalSteps()) * 100)}% complete</p>
              </div>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(currentStep / getTotalSteps()) * 100}%` }}
                ></div>
              </div>
              <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column - Form */}
            <div>
              <Card className="border-2 border-white/50 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Settings className="w-4 h-4 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{getStepTitle(currentStep)}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {renderCreateAutomationStep()}
                  
                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={handlePrevStep}
                      disabled={currentStep === 1}
                      className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 disabled:opacity-50"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    
                    {currentStep === getTotalSteps() ? (
                      <Button
                        onClick={handleCreateAutomation}
                        disabled={createRuleMutation.isPending}
                        className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg disabled:opacity-50"
                      >
                        {createRuleMutation.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Creating...
                          </>
                        ) : (
                          <>
                            <Rocket className="w-4 h-4 mr-2" />
                            Activate Automation
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNextStep}
                        disabled={!canProceedToNextStep()}
                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg disabled:opacity-50"
                      >
                        Continue
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Preview */}
            <div>
              <Card className="border-2 border-white/50 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">
                      {formData.automationType === 'comment_to_dm' && currentStep === 5 ? 
                        'Instagram Direct Message' : 
                        formData.automationType === 'comment_to_dm' && currentStep === 6 ?
                        'Complete Workflow Preview' :
                        'Instagram Post Preview'
                      }
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {renderPreview()}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="w-full p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Automation Dashboard</h1>
                <p className="text-gray-600 mt-1">Manage your automated workflows and responses</p>
              </div>
            </div>
            <Button 
              onClick={() => setActiveTab('create')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Automation
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-8 border-b border-gray-200">
            <button
              className={`pb-4 px-2 border-b-2 font-semibold text-sm transition-colors ${
                activeTab === 'create' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('create')}
            >
              Create New
            </button>
            <button
              className={`pb-4 px-2 border-b-2 font-semibold text-sm transition-colors ${
                activeTab === 'manage' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('manage')}
            >
              Manage Rules
            </button>
          </div>
        </div>

        {/* Existing Automations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rulesLoading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading automation rules...</p>
              </div>
            </div>
          ) : automationRules.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No automation rules yet</h3>
              <p className="text-gray-600 mb-6">Create your first automation to start engaging with your audience automatically.</p>
              <Button 
                onClick={() => setActiveTab('create')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Automation
              </Button>
            </div>
          ) : automationRules.map((rule) => (
            <Card key={rule.id} className="border-2 border-white/50 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-gray-900">{rule.name}</CardTitle>
                  <Badge 
                    variant={rule.isActive ? 'default' : 'secondary'}
                    className={`${rule.isActive ? 'bg-green-500' : 'bg-gray-400'} text-white`}
                  >
                    {rule.isActive ? 'active' : 'paused'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {rule.type.replace('_', ' ').toUpperCase()} • {rule.keywords.length} keywords • Instagram
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Keywords:</span>
                    <span className="font-semibold text-gray-900">{rule.keywords.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Responses:</span>
                    <span className="font-semibold text-gray-900">{rule.responses.responses.length + (rule.responses.dmResponses?.length || 0)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-semibold text-gray-900">{rule.createdAt ? new Date(rule.createdAt).toLocaleDateString() : 'Recently'}</span>
                  </div>
                  <div className="flex items-center space-x-2 pt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      {rule.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}