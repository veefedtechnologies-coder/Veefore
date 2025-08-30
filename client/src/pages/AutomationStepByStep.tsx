import React, { useState, useRef, useEffect } from 'react'
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
  Settings,
  ChevronDown,
  Search,
  Check,
  Play,
  Pause,
  Trash2
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '@/lib/queryClient'
import { useToast } from '@/hooks/use-toast'

// AutomationListManager component
const AutomationListManager = ({ 
  automationRules, 
  rulesLoading, 
  updateAutomationMutation, 
  deleteAutomationMutation 
}: {
  automationRules: any[]
  rulesLoading: boolean
  updateAutomationMutation: any
  deleteAutomationMutation: any
}) => {
  const { toast } = useToast()

  const handleToggleActive = async (ruleId: string, isActive: boolean) => {
    try {
      await updateAutomationMutation.mutateAsync({
        ruleId,
        updates: { isActive: !isActive }
      })
    } catch (error) {
      console.error('Error toggling automation:', error)
    }
  }

  const handleDelete = async (ruleId: string) => {
    if (window.confirm('Are you sure you want to delete this automation rule?')) {
      try {
        await deleteAutomationMutation.mutateAsync(ruleId)
      } catch (error) {
        console.error('Error deleting automation:', error)
      }
    }
  }

  if (rulesLoading) {
    return (
      <div className="p-8">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Automation Rules</h2>
        <p className="text-gray-600">Manage your active automation rules</p>
      </div>

      {automationRules?.length === 0 ? (
        <div className="text-center py-12">
          <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No automation rules yet</h3>
          <p className="text-gray-600 mb-4">Create your first automation rule to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {automationRules?.map((rule) => (
            <div key={rule.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${rule.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Bot className={`w-5 h-5 ${rule.isActive ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{rule.type} automation</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      rule.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {rule.isActive ? 'Active' : 'Paused'}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-500">Keywords:</span>
                      <div className="mt-1">
                        {rule.keywords?.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {rule.keywords.slice(0, 3).map((keyword: string, index: number) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                {keyword}
                              </span>
                            ))}
                            {rule.keywords.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                +{rule.keywords.length - 3} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">No keywords</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-gray-500">Target Posts:</span>
                      <p className="text-sm text-gray-900">{rule.targetMediaIds?.length || 0} posts</p>
                    </div>

                    <div>
                      <span className="text-sm text-gray-500">Responses:</span>
                      <p className="text-sm text-gray-900">{rule.responses?.responses?.length || 0} comment + {rule.responses?.dmResponses?.length || 0} DM</p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    Created: {new Date(rule.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleToggleActive(rule.id, rule.isActive)}
                    disabled={updateAutomationMutation.isPending}
                    className={`p-2 rounded-lg transition-colors ${
                      rule.isActive 
                        ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                    title={rule.isActive ? 'Pause automation' : 'Resume automation'}
                  >
                    {rule.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleDelete(rule.id)}
                    disabled={deleteAutomationMutation.isPending}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    title="Delete automation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AutomationStepByStep() {
  console.log('AutomationStepByStep component loaded successfully')
  
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  // Step flow state
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [selectedAccount, setSelectedAccount] = useState('')
  const [contentType, setContentType] = useState('')
  const [automationType, setAutomationType] = useState('')
  const [selectedPost, setSelectedPost] = useState('')
  
  // Fetch real Instagram accounts
  const { data: socialAccountsData, isLoading: accountsLoading } = useQuery({
    queryKey: ['/api/social-accounts'],
    queryFn: async () => {
      const response = await apiRequest('/api/social-accounts')
      return response
    },
    enabled: true
  })

  // Transform real account data
  const realAccounts = socialAccountsData ? socialAccountsData.map((account: any) => ({
    id: account.id,
    name: `@${account.username}`,
    followers: `${account.followers} followers`,
    platform: account.platform,
    avatar: account.profilePictureUrl || `https://picsum.photos/40/40?random=${account.id}`,
    workspaceId: account.workspaceId
  })) : []
  
  // Fetch real Instagram posts when account is selected
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['/api/instagram-content', selectedAccount],
    queryFn: async () => {
      if (!selectedAccount) return []
      // Get workspace ID from social accounts data
      const selectedAccountData = realAccounts.find(acc => acc.id === selectedAccount)
      const workspaceId = selectedAccountData?.workspaceId || '6847b9cdfabaede1706f2994'
      
      const response = await apiRequest(`/api/instagram-content?workspaceId=${workspaceId}`)
      return response
    },
    enabled: !!selectedAccount && !!socialAccountsData
  })
  
  // Create automation rule mutation
  const createAutomationMutation = useMutation({
    mutationFn: async (automationData: any) => {
      return await apiRequest('/api/automation/rules', {
        method: 'POST',
        body: JSON.stringify(automationData)
      })
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Automation rule created successfully",
      })
      // Refetch the rules to show the new rule
      refetchRules()
      // Reset form or redirect
      setCurrentStep(1)
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create automation rule",
        variant: "destructive",
      })
    }
  })
  
  // Automation-specific states
  const [keywords, setKeywords] = useState([])
  const [newKeyword, setNewKeyword] = useState('')
  const [commentReply, setCommentReply] = useState('')
  const [dmMessage, setDmMessage] = useState('')
  const [showAutomationList, setShowAutomationList] = useState(false)

  // Fetch existing automation rules
  const { data: automationRules, isLoading: rulesLoading, refetch: refetchRules } = useQuery({
    queryKey: ['/api/automation/rules', realAccounts?.[0]?.workspaceId],
    queryFn: async () => {
      const workspaceId = realAccounts?.[0]?.workspaceId
      if (!workspaceId) return []
      const response = await apiRequest(`/api/automation/rules?workspaceId=${workspaceId}`)
      return response.rules || []
    },
    enabled: !!realAccounts?.[0]?.workspaceId
  })

  // Mutation for updating automation rules
  const updateAutomationMutation = useMutation({
    mutationFn: async ({ ruleId, updates }: { ruleId: string, updates: any }) => {
      return await apiRequest(`/api/automation/rules/${ruleId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      })
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Automation rule updated successfully",
      })
      refetchRules()
    }
  })

  // Mutation for deleting automation rules
  const deleteAutomationMutation = useMutation({
    mutationFn: async (ruleId: string) => {
      return await apiRequest(`/api/automation/rules/${ruleId}`, {
        method: 'DELETE'
      })
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Automation rule deleted successfully",
      })
      refetchRules()
    }
  })
  
  // Function to create automation rule
  const createAutomationRule = async () => {
    if (!selectedAccount || !selectedPost || !automationType) {
      toast({
        title: "Error",
        description: "Please complete all required fields",
        variant: "destructive",
      })
      return
    }

    // Get the workspace ID from selected account data
    const selectedAccountData = realAccounts.find(acc => acc.id === selectedAccount)
    const workspaceId = selectedAccountData?.workspaceId
    if (!workspaceId) {
      toast({
        title: "Error",
        description: "No workspace found for selected account.",
        variant: "destructive",
      })
      return
    }

    // Get current keywords and responses based on automation type
    const currentKeywords = getCurrentKeywords()
    const currentResponses = getCurrentResponses()
    
    // NEW SYSTEM FORMAT - matches what the new-automation-system.ts expects
    const ruleData = {
      name: `${automationType === 'comment_only' ? 'Comment' : automationType === 'dm_only' ? 'DM' : 'Comment to DM'} Automation`,
      workspaceId: workspaceId,
      type: automationType, // Use exact automation type (comment_dm, dm_only, comment_only)
      keywords: currentKeywords,
      targetMediaIds: selectedPost ? [selectedPost] : [],
      responses: currentResponses,
      isActive: true
    }

    try {
      console.log('Creating automation rule with data:', ruleData)
      await createAutomationMutation.mutateAsync(ruleData)
    } catch (error) {
      console.error('Error creating automation rule:', error)
      console.error('Error details:', error.response?.data || error)
    }
  }
  const [previewComment, setPreviewComment] = useState('Amazing content! info please!')
  
  // Multiple comment replies and delay settings
  const [commentReplies, setCommentReplies] = useState(['Message sent!', 'Found it? 😊', 'Sent just now! ⏰'])
  const [commentDelay, setCommentDelay] = useState(15)
  const [commentDelayUnit, setCommentDelayUnit] = useState('minutes')
  
  // DM configuration fields
  const [dmButtonText, setDmButtonText] = useState('See products')
  const [dmWebsiteUrl, setDmWebsiteUrl] = useState('')
  
  // DM-only automation
  const [dmKeywords, setDmKeywords] = useState([])
  const [dmAutoReply, setDmAutoReply] = useState('')
  
  // Comment-only automation
  const [commentKeywords, setCommentKeywords] = useState([])
  const [publicReply, setPublicReply] = useState('')
  
  // Additional state variables for automation settings
  const [aiPersonality, setAiPersonality] = useState('friendly')
  const [maxRepliesPerDay, setMaxRepliesPerDay] = useState(10)
  const [cooldownPeriod, setCooldownPeriod] = useState(30) // in minutes
  const [activeHours, setActiveHours] = useState({ start: '09:00', end: '17:00' })
  const [activeDays, setActiveDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
  
  // UI state for dropdowns
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false)
  const [contentTypeDropdownOpen, setContentTypeDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Refs for dropdown click outside handling
  const accountDropdownRef = useRef(null)
  const contentTypeDropdownRef = useRef(null)
  
  // Helper function to get current keywords based on automation type
  const getCurrentKeywords = () => {
    switch (automationType) {
      case 'comment_dm':
        return keywords
      case 'dm_only':
        return dmKeywords
      case 'comment_only':
        return commentKeywords
      default:
        return keywords
    }
  }

  // Helper function to get current responses based on automation type
  const getCurrentResponses = () => {
    switch (automationType) {
      case 'comment_dm':
        return {
          responses: commentReplies.filter(reply => reply.trim().length > 0),
          dmResponses: dmMessage ? [dmMessage] : []
        }
      case 'dm_only':
        return {
          responses: [],
          dmResponses: dmAutoReply ? [dmAutoReply] : []
        }
      case 'comment_only':
        return {
          responses: publicReply ? [publicReply] : [],
          dmResponses: []
        }
      default:
        return {
          responses: [],
          dmResponses: []
        }
    }
  }
  

  
  // Modern dropdown states
  const [automationTypeDropdownOpen, setAutomationTypeDropdownOpen] = useState(false)
  
  // Refs for dropdown management
  const automationTypeDropdownRef = useRef<HTMLDivElement>(null)
  
  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false)
      }
      if (contentTypeDropdownRef.current && !contentTypeDropdownRef.current.contains(event.target as Node)) {
        setContentTypeDropdownOpen(false)
      }
      if (automationTypeDropdownRef.current && !automationTypeDropdownRef.current.contains(event.target as Node)) {
        setAutomationTypeDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
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



  // Transform real posts data
  const realPosts = postsData ? postsData.map((post: any) => {
    console.log('Processing post data:', post); // Debug log
    return {
      id: post.id,
      title: post.caption ? post.caption.substring(0, 30) + '...' : 'Instagram Post',
      type: post.type === 'reel' ? 'reel' : 'post',
      image: post.mediaUrl || post.thumbnailUrl || 'https://picsum.photos/300/300?random=1',
      likes: post.engagement?.likes || 0,
      comments: post.engagement?.comments || 0,
      caption: post.caption || 'Instagram post content'
    };
  }) : []

  // Dynamic steps based on automation type
  const getSteps = () => {
    const baseSteps = [
      { id: 1, title: 'Select Setup', description: 'Account, content & post' },
      { id: 2, title: 'Automation Config', description: 'Choose & configure automation' }
    ]
    
    // For comment to DM, add separate comment and DM steps
    if (automationType === 'comment_dm') {
      return [
        ...baseSteps,
        { id: 3, title: 'DM Configuration', description: 'Setup private message' },
        { id: 4, title: 'Advanced Settings', description: 'Fine-tune timing' },
        { id: 5, title: 'Review & Activate', description: 'Review and activate' }
      ]
    }
    
    // For other types, keep original flow
    return [
      ...baseSteps,
      { id: 3, title: 'Advanced Settings', description: 'Fine-tune timing' },
      { id: 4, title: 'Review & Activate', description: 'Review and activate' }
    ]
  }
  
  const steps = getSteps()

  // Function to get content types based on selected platform/account
  const getContentTypesForPlatform = (accountId) => {
    const account = realAccounts.find(acc => acc.id === accountId)
    if (!account) return []
    
    switch (account.platform.toLowerCase()) {
      case 'instagram':
        return [
          { id: 'post', name: 'Post', description: 'Regular feed posts', icon: '📷' },
          { id: 'reel', name: 'Reel', description: 'Short video content', icon: '🎬' },
          { id: 'story', name: 'Story', description: '24h disappearing content', icon: '⭕' }
        ]
      case 'youtube':
        return [
          { id: 'video', name: 'Video', description: 'Long-form videos', icon: '📹' },
          { id: 'short', name: 'Short', description: 'Vertical short videos', icon: '⚡' }
        ]
      case 'linkedin':
        return [
          { id: 'post', name: 'Post', description: 'Professional updates', icon: '💼' },
          { id: 'article', name: 'Article', description: 'Long-form content', icon: '📄' }
        ]
      case 'twitter':
        return [
          { id: 'tweet', name: 'Tweet', description: 'Short messages', icon: '🐦' },
          { id: 'thread', name: 'Thread', description: 'Connected tweets', icon: '🧵' }
        ]
      default:
        return [
          { id: 'post', name: 'Post', description: 'General content', icon: '📝' }
        ]
    }
  }

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
        return selectedAccount && contentType && selectedPost
      case 2:
        // For comment_dm automation, require keywords and at least one comment reply
        if (automationType === 'comment_dm') {
          return automationType && getCurrentKeywords().length > 0 && commentReplies.some(reply => reply.trim().length > 0)
        }
        return automationType && getCurrentKeywords().length > 0 // Automation type and keywords required for configuration
      case 3:
        // For comment_dm automation, step 3 is DM configuration - require DM message and button text
        if (automationType === 'comment_dm') {
          return dmMessage.trim().length > 0 && dmButtonText.trim().length > 0
        }
        // For other automation types, step 3 is Advanced settings - optional
        return true
      case 4:
        // For comment_dm automation, step 4 is Advanced settings - optional
        // For other automation types, step 4 is Review step - always allow
        return true
      case 5:
        // Step 5 is only for comment_dm automation - Review step - always allow
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceedToNext() && currentStep < steps.length) {
      // Reset content type when account changes and auto-set platform
      if (currentStep === 1) {
        setContentType('')
        // Auto-set platform based on selected account
        const selectedAccountData = realAccounts.find(a => a.id === selectedAccount)
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

  const handleFinish = async () => {
    // Create the automation rule with real API call
    await createAutomationRule()
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            {/* Step 1: Select Account */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md">
                  <User className="w-4 h-4 text-white" />
                </div>
                Select Account
              </h3>
              <div className="relative" ref={accountDropdownRef}>
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white hover:border-blue-300 focus:border-blue-500 focus:outline-none transition-all duration-200 text-gray-800 font-medium text-left flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    {selectedAccount && !accountsLoading && (
                      <img 
                        src={realAccounts.find(acc => acc.id === selectedAccount)?.avatar} 
                        alt={realAccounts.find(acc => acc.id === selectedAccount)?.name}
                        className="w-6 h-6 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          const fallback = e.currentTarget.nextElementSibling
                          if (fallback) fallback.style.display = 'flex'
                        }}
                      />
                    )}
                    {selectedAccount && !accountsLoading && (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500" style={{display: 'none'}}>
                        <span className="text-white text-xs font-bold">
                          {realAccounts.find(acc => acc.id === selectedAccount)?.name?.charAt(1).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className={selectedAccount ? 'text-gray-900' : 'text-gray-500'}>
                      {accountsLoading ? 'Loading accounts...' : selectedAccount 
                        ? realAccounts.find(acc => acc.id === selectedAccount)?.name + ' • ' + realAccounts.find(acc => acc.id === selectedAccount)?.followers + ' • ' + realAccounts.find(acc => acc.id === selectedAccount)?.platform
                        : 'Choose your social media account...'
                      }
                    </span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${accountDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {accountDropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto dropdown-enter">
                    <div className="p-3 border-b border-gray-100">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search accounts..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="py-1">
                      {realAccounts
                        .filter(account => 
                          account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          account.platform.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map(account => (
                          <button
                            key={account.id}
                            onClick={() => {
                              setSelectedAccount(account.id)
                              setAccountDropdownOpen(false)
                              setSearchTerm('')
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150 flex items-center justify-between group"
                          >
                            <div className="flex items-center space-x-3">
                              <img 
                                src={account.avatar} 
                                alt={account.name}
                                className="w-8 h-8 rounded-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                  const fallback = e.currentTarget.nextElementSibling
                                  if (fallback) fallback.style.display = 'flex'
                                }}
                              />
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${account.platform === 'instagram' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : account.platform === 'youtube' ? 'bg-red-500' : 'bg-blue-500'}`} style={{display: 'none'}}>
                                <span className="text-white text-xs font-bold">
                                  {account.name.charAt(1).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{account.name}</div>
                                <div className="text-sm text-gray-500">{account.followers} • {account.platform}</div>
                              </div>
                            </div>
                            {selectedAccount === account.id && (
                              <Check className="w-4 h-4 text-blue-600" />
                            )}
                          </button>
                        ))
                      }
                      {realAccounts.filter(account => 
                        account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        account.platform.toLowerCase().includes(searchTerm.toLowerCase())
                      ).length === 0 && (
                        <div className="px-4 py-3 text-gray-500 text-sm">No accounts found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Select Content Type (only shown when account is selected) */}
            {selectedAccount && (
              <div className="animate-fadeIn">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg shadow-md">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  Select Content Type
                </h3>
                <div className="relative" ref={contentTypeDropdownRef}>
                  <button
                    onClick={() => setContentTypeDropdownOpen(!contentTypeDropdownOpen)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white hover:border-purple-300 focus:border-purple-500 focus:outline-none transition-all duration-200 text-gray-800 font-medium text-left flex items-center justify-between group"
                    disabled={!selectedAccount}
                  >
                    <span className={contentType ? 'text-gray-900' : 'text-gray-500'}>
                      {contentType 
                        ? getContentTypesForPlatform(selectedAccount).find(type => type.id === contentType)?.name + ' - ' + getContentTypesForPlatform(selectedAccount).find(type => type.id === contentType)?.description
                        : 'Choose content type for your automation...'
                      }
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${contentTypeDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {contentTypeDropdownOpen && selectedAccount && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto dropdown-enter">
                      <div className="py-1">
                        {getContentTypesForPlatform(selectedAccount).map(type => (
                          <button
                            key={type.id}
                            onClick={() => {
                              setContentType(type.id)
                              setContentTypeDropdownOpen(false)
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors duration-150 flex items-center justify-between group"
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-lg ${type.color} flex items-center justify-center text-white`}>
                                {type.icon}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{type.name}</div>
                                <div className="text-sm text-gray-500">{type.description}</div>
                              </div>
                            </div>
                            {contentType === type.id && (
                              <Check className="w-4 h-4 text-purple-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Select Post (only shown when content type is selected) */}
            {selectedAccount && contentType && (
              <div className="animate-fadeIn">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-md">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                  Select Post
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(postsLoading ? [] : realPosts.filter(post => post.type === contentType)).map(post => (
                    <button
                      key={post.id}
                      onClick={() => setSelectedPost(post.id)}
                      className={`relative p-3 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                        selectedPost === post.id 
                          ? 'border-emerald-500 bg-emerald-50 shadow-lg' 
                          : 'border-gray-200 hover:border-emerald-300 bg-white'
                      }`}
                    >
                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-2 overflow-hidden">
                        {post.image ? (
                          <img 
                            src={post.image} 
                            alt={post.caption || post.title} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to placeholder if image fails
                              e.currentTarget.src = 'https://picsum.photos/300/300?random=1';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Camera className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-medium text-gray-900 text-sm truncate">{post.title}</h4>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="capitalize">{post.type}</span>
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {post.likes || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {post.comments || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                      {selectedPost === post.id && (
                        <div className="absolute top-2 right-2 p-1 bg-emerald-500 rounded-full">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                  {postsLoading && (
                    <div className="col-span-full text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
                      <p className="text-gray-500 mt-2">Loading posts...</p>
                    </div>
                  )}
                  {!postsLoading && realPosts.filter(post => post.type === contentType).length === 0 && (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      No {contentType}s found for this account
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-8">
            {/* Step 1: Choose Automation Type */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                Choose Automation Type
              </h3>
              <div className="relative" ref={automationTypeDropdownRef}>
                <button
                  onClick={() => setAutomationTypeDropdownOpen(!automationTypeDropdownOpen)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white hover:border-emerald-300 focus:border-emerald-500 focus:outline-none transition-all duration-200 text-gray-800 font-medium text-left flex items-center justify-between group"
                >
                  <span className={automationType ? 'text-gray-900' : 'text-gray-500'}>
                    {automationType 
                      ? automationTypes.find(type => type.id === automationType)?.name + ' - ' + automationTypes.find(type => type.id === automationType)?.description
                      : 'Select automation type...'
                    }
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${automationTypeDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {automationTypeDropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto dropdown-enter">
                    <div className="py-1">
                      {automationTypes.map(type => (
                        <button
                          key={type.id}
                          onClick={() => {
                            setAutomationType(type.id)
                            setAutomationTypeDropdownOpen(false)
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-emerald-50 transition-colors duration-150 flex items-center justify-between group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-lg ${type.color} flex items-center justify-center text-white`}>
                              {type.icon}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{type.name}</div>
                              <div className="text-sm text-gray-500">{type.description}</div>
                            </div>
                          </div>
                          {automationType === type.id && (
                            <Check className="w-4 h-4 text-emerald-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Configuration (appears after automation type selection) */}
            {automationType && (
              <div className="animate-fadeIn">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="p-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md">
                      <Settings className="w-4 h-4 text-white" />
                    </div>
                    Configuration
                  </h4>
                  {renderAutomationSpecificConfig()}
                </div>
              </div>
            )}
          </div>
        )

      case 3:
        // For comment_dm automation, step 3 is DM configuration
        if (automationType === 'comment_dm') {
          return (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a direct message</h3>
                <p className="text-sm text-gray-600 mb-6">Write the DM you want sent when users include your keyword when they comment on your post.</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Direct message</label>
                    <p className="text-sm text-gray-600 mb-3">We'll send this DM to the user who included your keyword in their comment.</p>
                    <textarea
                      value={dmMessage}
                      onChange={(e) => setDmMessage(e.target.value)}
                      placeholder="Enter your DM text here"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      rows="4"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Button text</label>
                    <input
                      type="text"
                      value={dmButtonText}
                      onChange={(e) => setDmButtonText(e.target.value)}
                      placeholder="Choose a short and clear button text"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                    <input
                      type="text"
                      value={dmWebsiteUrl}
                      onChange={(e) => setDmWebsiteUrl(e.target.value)}
                      placeholder="Enter the destination URL for your button"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        }

        // For other automation types, step 3 is Advanced Settings
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                Advanced Settings
              </h3>
              
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

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Active Days</label>
                <div className="grid grid-cols-7 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <button
                      key={day}
                      onClick={() => {
                        const newActiveDays = [...activeDays]
                        newActiveDays[index] = !newActiveDays[index]
                        setActiveDays(newActiveDays)
                      }}
                      className={`p-2 rounded-lg text-sm font-medium transition-all ${
                        activeDays[index]
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        // For comment_dm automation, step 4 is Advanced Settings
        if (automationType === 'comment_dm') {
          return (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  Advanced Settings
                </h3>
                
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

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Active Days</label>
                  <div className="grid grid-cols-7 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                      <button
                        key={day}
                        onClick={() => {
                          const newActiveDays = [...activeDays]
                          newActiveDays[index] = !newActiveDays[index]
                          setActiveDays(newActiveDays)
                        }}
                        className={`p-2 rounded-lg text-sm font-medium transition-all ${
                          activeDays[index]
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        }
        
        // For other automation types, step 4 is Review & Activate
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                Review & Activate
              </h3>
              
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Account:</span>
                    <div className="text-lg font-semibold text-gray-900">{realAccounts.find(a => a.id === selectedAccount)?.name || 'Not selected'}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Selected Post:</span>
                    <div className="text-lg font-semibold text-gray-900">
                      {selectedPost ? (
                        <span>{realPosts.find(p => p.id === selectedPost)?.type || 'Post'} - {realPosts.find(p => p.id === selectedPost)?.caption.substring(0, 30) || 'No caption'}...</span>
                      ) : (
                        'Not selected'
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Automation Type:</span>
                    <div className="text-lg font-semibold text-gray-900">{automationTypes.find(t => t.id === automationType)?.name || 'Not selected'}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Keywords:</span>
                    <div className="text-lg font-semibold text-gray-900">{getCurrentKeywords().length} keywords</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Daily Limit:</span>
                    <div className="text-lg font-semibold text-gray-900">{maxRepliesPerDay} replies</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">AI Personality:</span>
                    <div className="text-lg font-semibold text-gray-900 capitalize">{aiPersonality}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        // Step 5 is only for comment_dm automation - Review & Activate
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                Review & Activate
              </h3>
              
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Account:</span>
                    <div className="text-lg font-semibold text-gray-900">{realAccounts.find(a => a.id === selectedAccount)?.name || 'Not selected'}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Selected Post:</span>
                    <div className="text-lg font-semibold text-gray-900">
                      {selectedPost ? (
                        <span>{realPosts.find(p => p.id === selectedPost)?.type || 'Post'} - {realPosts.find(p => p.id === selectedPost)?.caption.substring(0, 30) || 'No caption'}...</span>
                      ) : (
                        'Not selected'
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Automation Type:</span>
                    <div className="text-lg font-semibold text-gray-900">{automationTypes.find(t => t.id === automationType)?.name || 'Not selected'}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Keywords:</span>
                    <div className="text-lg font-semibold text-gray-900">{getCurrentKeywords().length} keywords</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Daily Limit:</span>
                    <div className="text-lg font-semibold text-gray-900">{maxRepliesPerDay} replies</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">AI Personality:</span>
                    <div className="text-lg font-semibold text-gray-900 capitalize">{aiPersonality}</div>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Comment Reply Configuration</h3>
              <p className="text-sm text-gray-600 mb-6">Configure the public comment that will be posted when keywords are detected. DM settings will be configured in the next step.</p>
              
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Comment replies</label>
                <p className="text-sm text-gray-600 mb-4">Write a few different possible responses, and we'll cycle through them so your responses seem more genuine and varied.</p>
                
                <div className="space-y-3 mb-4">
                  {commentReplies.map((reply, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg bg-white">
                      <input
                        type="text"
                        value={reply}
                        onChange={(e) => {
                          const newReplies = [...commentReplies]
                          newReplies[index] = e.target.value
                          setCommentReplies(newReplies)
                        }}
                        placeholder="Enter comment reply..."
                        className="flex-1 p-2 border-0 focus:outline-none bg-white"
                      />
                      <button
                        onClick={() => {
                          const newReplies = commentReplies.filter((_, i) => i !== index)
                          setCommentReplies(newReplies)
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => setCommentReplies([...commentReplies, ''])}
                  className="w-full p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add another reply
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delay before comment</label>
                <p className="text-sm text-gray-600 mb-4">Adding a short delay before responding to comments helps your replies seem more thoughtful and authentic.</p>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={commentDelay}
                      onChange={(e) => setCommentDelay(Number(e.target.value))}
                      min="1"
                      max="60"
                      className="w-20 p-2 border border-gray-300 rounded-lg text-center"
                    />
                    <X className="w-4 h-4 text-gray-400" />
                  </div>
                  
                  <select
                    value={commentDelayUnit}
                    onChange={(e) => setCommentDelayUnit(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="minutes">Minutes</option>
                    <option value="seconds">Seconds</option>
                    <option value="hours">Hours</option>
                  </select>
                  <X className="w-4 h-4 text-gray-400" />
                </div>
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
    const selectedAccountData = realAccounts.find(a => a.id === selectedAccount)
    const selectedPostData = realPosts.find(p => p.id === selectedPost)
    const currentKeywords = getCurrentKeywords()
    const platformName = selectedAccountData?.platform || 'Social Media'
    

    
    // For comment_dm automation in step 3 (DM configuration), show only DM preview
    if (automationType === 'comment_dm' && currentStep === 3) {
      return (
        <div className="sticky top-4">
          {/* Preview Header */}
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-4 rounded-t-3xl">
            <div className="flex items-center gap-3 text-white">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold">DM Preview</h3>
                <p className="text-sm opacity-90">Instagram direct message interface</p>
              </div>
              <div className="ml-auto">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* Instagram DM Preview - Exact match to reference image */}
          <div className="bg-white border border-gray-200 rounded-b-3xl shadow-sm max-w-sm mx-auto">
            <div className="p-4">
              {/* Message timestamp */}
              <div className="text-xs text-gray-500 text-center mb-4">
                JUL 15, 08:31 PM
              </div>
              
              {/* Message bubble with profile picture at bottom-left corner */}
              <div className="relative mb-4">
                <div className="bg-gray-100 rounded-2xl rounded-bl-sm p-4 max-w-[280px] ml-6">
                  <div className="text-sm text-gray-400">
                    {dmMessage || "I'm so excited you'd like to see what I've got on offer!"}
                  </div>
                  
                  {/* Button inside message bubble - white background */}
                  {dmButtonText && (
                    <div className="bg-white rounded-lg p-3 text-center mt-3">
                      <div className="text-sm font-medium text-gray-800">
                        {dmButtonText}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Profile picture positioned at bottom-left corner overlapping the message bubble */}
                <img 
                  src={selectedAccountData?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face&auto=format'} 
                  alt="Profile" 
                  className="absolute bottom-0 left-0 w-8 h-8 rounded-full border-2 border-white bg-white ml-[-11px] mr-[-11px] pl-[0px] pr-[0px] mt-[1px] mb-[1px]" 
                />
              </div>
              
              {/* Message input area */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Camera className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 text-sm text-gray-500 bg-gray-100 rounded-full px-4 py-2">
                  Message...
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 text-gray-500">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M12 14l9-5-9-5-9 5 9 5z"/>
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                    </svg>
                  </div>
                  <div className="w-6 h-6 text-gray-500">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div className="w-6 h-6 text-gray-500">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div className="w-6 h-6 text-gray-500">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    
    // Get current automation message based on type - for PUBLIC comment reply
    const getCurrentMessage = () => {
      switch (automationType) {
        case 'comment_dm':
          return commentReplies[0] || 'Thanks for your comment! Check your DMs 📩'
        case 'dm_only':
          return '' // No public comment for DM-only
        case 'comment_only':
          return commentReplies[0] || 'Thanks for your interest! Here\'s what you\'re looking for ✨'
        default:
          return 'Your automated response will appear here...'
      }
    }
    
    // Get DM message for DM preview
    const getDMMessage = () => {
      switch (automationType) {
        case 'comment_dm':
          return dmMessage || 'Here\'s the detailed info you requested! 💫'
        case 'dm_only':
          return dmAutoReply || 'Thanks for reaching out! Here\'s the info you need 💫'
        default:
          return ''
      }
    }
    
    return (
      <div className="sticky top-4">
        {/* Preview Header */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-4 rounded-t-3xl">
          <div className="flex items-center gap-3 text-white">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold">Live Preview</h3>
              <p className="text-sm opacity-90">Real-time automation preview</p>
            </div>
            <div className="ml-auto">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Instagram Post Interface - Exact replica */}
        <div className="bg-white border-l border-r border-gray-200 shadow-2xl">
          {/* Post Header - Authentic Instagram style */}
          <div className="flex items-center justify-between p-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={selectedAccountData?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face&auto=format'} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-gray-200" 
                />
                {selectedAccount && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
              <div>
                <div className="font-semibold text-sm text-gray-900">
                  {selectedAccountData?.name || 'your_account'}
                </div>
                <div className="text-xs text-gray-500">2 hours ago • 📍 Location</div>
              </div>
            </div>
            <MoreHorizontal className="w-6 h-6 text-gray-700" />
          </div>
          
          {/* Post Image with authentic aspect ratio */}
          <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
            {selectedPostData ? (
              <img 
                src={selectedPostData.image || selectedPostData.thumbnailUrl || selectedPostData.mediaUrl} 
                alt="Post" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to other image sources if primary fails
                  if (selectedPostData.mediaUrl && e.currentTarget.src !== selectedPostData.mediaUrl) {
                    e.currentTarget.src = selectedPostData.mediaUrl;
                  } else if (selectedPostData.thumbnailUrl && e.currentTarget.src !== selectedPostData.thumbnailUrl) {
                    e.currentTarget.src = selectedPostData.thumbnailUrl;
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Select a post to preview</p>
                </div>
              </div>
            )}
            
            {/* Multiple image indicator */}
            {selectedPostData && selectedPostData.type === 'carousel' && (
              <div className="absolute top-3 right-3">
                <div className="bg-black/20 backdrop-blur-sm rounded-full p-1">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                    <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Post Actions - Authentic Instagram style */}
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <Heart className="w-6 h-6 text-gray-700 hover:text-red-500 transition-colors cursor-pointer" />
                <MessageCircle className="w-6 h-6 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer" />
                <Send className="w-6 h-6 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer" />
              </div>
              <Bookmark className="w-6 h-6 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer" />
            </div>
            
            {/* Likes count */}
            <div className="text-sm font-semibold text-gray-900 mb-2">
              {selectedPostData ? `${(selectedPostData.likes || selectedPostData.engagement?.likes || 0).toLocaleString()} likes` : '1,247 likes'}
            </div>
            
            {/* Caption */}
            <div className="text-sm text-gray-900 mb-3">
              <span className="font-semibold">{selectedAccountData?.name || 'your_account'}</span>{' '}
              <span className="text-gray-900">
                {selectedPostData?.caption || 'Your amazing post caption goes here! ✨ #automation #socialmedia #growth'}
              </span>
            </div>
            
            {/* View all comments */}
            <button className="text-sm text-gray-500 mb-3 hover:text-gray-700">
              View all {selectedPostData ? (selectedPostData.comments || selectedPostData.engagement?.comments || 0) : 47} comments
            </button>
            
            {/* Comments Section with Live Automation Preview */}
            <div className="space-y-3">
              {/* Sample User Comment - Only show when user has keywords */}
              {currentKeywords.length > 0 && (
                <div className="flex items-start gap-2">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face&auto=format" 
                    alt="User" 
                    className="w-6 h-6 rounded-full" 
                  />
                  <div className="flex-1">
                    <div className="text-sm text-gray-900">
                      <span className="font-semibold">username</span>{' '}
                      <span>{currentKeywords[0]}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-500">2m</span>
                      <button className="text-xs text-gray-500 font-medium">Reply</button>
                      <Heart className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Bot Reply Preview - Only show when user has keywords AND replies */}
              {currentKeywords.length > 0 && automationType && getCurrentMessage() !== 'Your automated response will appear here...' && (
                <div className="flex items-start gap-2 ml-6 animate-fadeIn">
                  <div className="relative">
                    <img 
                      src={selectedAccountData?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face&auto=format'} 
                      alt="Bot" 
                      className="w-6 h-6 rounded-full border border-purple-200" 
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border border-white flex items-center justify-center">
                      <Bot className="w-2 h-2 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-900">
                      <span className="font-semibold">{selectedAccountData?.name || 'your_account'}</span>{' '}
                      <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {getCurrentMessage()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-500">just now</span>
                      <button className="text-xs text-gray-500 font-medium">Reply</button>
                      <Heart className="w-3 h-3 text-gray-400" />
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-purple-600 font-medium">Auto-reply</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Add comment section */}
            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face&auto=format" 
                alt="Your avatar" 
                className="w-6 h-6 rounded-full" 
              />
              <div className="flex-1 text-sm text-gray-500">Add a comment...</div>
              <div className="flex items-center gap-2">
                <span className="text-lg">❤️</span>
                <span className="text-lg">🙌</span>
                <span className="text-lg">🔥</span>
                <Plus className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        
        {/* DM Preview Section - Only show for comment to DM automation in steps 4 and 5 */}
        {automationType === 'comment_dm' && (currentStep === 4 || currentStep === 5) && (
          <div className="sticky top-4 mt-4">
            {/* Preview Header */}
            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-4 rounded-t-3xl">
              <div className="flex items-center gap-3 text-white">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold">DM Preview</h3>
                  <p className="text-sm opacity-90">Instagram direct message interface</p>
                </div>
                <div className="ml-auto">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            
            {/* Instagram DM Preview - Exact match to reference image */}
            <div className="bg-white border border-gray-200 rounded-b-3xl shadow-sm max-w-sm mx-auto">
              <div className="p-4">
                {/* Message timestamp */}
                <div className="text-xs text-gray-500 text-center mb-4">
                  JUL 15, 08:31 PM
                </div>
                
                {/* Message bubble with profile picture at bottom-left corner */}
                <div className="relative mb-4">
                  <div className="bg-gray-100 rounded-2xl rounded-bl-sm p-4 max-w-[280px] ml-6">
                    <div className="text-sm text-gray-400">
                      {dmMessage || "I'm so excited you'd like to see what I've got on offer!"}
                    </div>
                    
                    {/* Button inside message bubble - white background */}
                    {dmButtonText && (
                      <div className="bg-white rounded-lg p-3 text-center mt-3">
                        <div className="text-sm font-medium text-gray-800">
                          {dmButtonText}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Profile picture positioned at bottom-left corner overlapping the message bubble */}
                  <img 
                    src={selectedAccountData?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face&auto=format'} 
                    alt="Profile" 
                    className="absolute bottom-0 left-0 w-8 h-8 rounded-full border-2 border-white bg-white ml-[-11px] mr-[-11px] pl-[0px] pr-[0px] mt-[1px] mb-[1px]" 
                  />
                </div>
                
                {/* Message input area */}
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 text-sm text-gray-500 bg-gray-100 rounded-full px-4 py-2">
                    Message...
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 text-gray-500">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M12 14l9-5-9-5-9 5 9 5z"/>
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                      </svg>
                    </div>
                    <div className="w-6 h-6 text-gray-500">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <div className="w-6 h-6 text-gray-500">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <div className="w-6 h-6 text-gray-500">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Automation Status Indicator */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 rounded-b-3xl">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">
                {automationType ? `${automationTypes.find(t => t.id === automationType)?.name} Active` : 'Select Automation Type'}
              </span>
            </div>
            {currentKeywords.length > 0 && (
              <div className="flex items-center gap-1">
                <Hash className="w-3 h-3" />
                <span className="text-xs">{currentKeywords.length} triggers</span>
              </div>
            )}
          </div>
          {automationType && (
            <div className="mt-2 text-xs text-emerald-100">
              Monitoring: {currentKeywords.join(', ') || 'All comments'}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-full">
      {/* Sleek Management Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 w-full shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Automation Studio
                </h1>
                <p className="text-sm text-gray-600">Smart social media automation</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAutomationList(!showAutomationList)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Manage Automations
            </button>
            <button
              onClick={() => {
                setCurrentStep(1)
                setShowAutomationList(false)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              New Automation
            </button>
          </div>
        </div>
      </div>

      {/* Show automation list or step-by-step flow */}
      {showAutomationList ? (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <AutomationListManager 
            automationRules={automationRules}
            rulesLoading={rulesLoading}
            updateAutomationMutation={updateAutomationMutation}
            deleteAutomationMutation={deleteAutomationMutation}
          />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto p-6 pb-20">

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
                
                {currentStep < steps.length ? (
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
                    disabled={createAutomationMutation.isPending}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {createAutomationMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Activate Automation
                      </>
                    )}
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
      )}
    </div>
  )
}