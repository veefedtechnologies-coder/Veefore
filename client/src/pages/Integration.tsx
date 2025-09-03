import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '@/lib/queryClient'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ErrorModal } from '@/components/ui/error-modal'
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Video,
  Plus,
  Check,
  Zap,
  Users,
  BarChart3,
  Calendar,
  Settings,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Shield,
  Sparkles
} from 'lucide-react'
import { TokenConverter } from '../components/dashboard/token-converter'
import { useCurrentWorkspace } from '../components/WorkspaceSwitcher'

interface SocialAccount {
  id: string
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'youtube' | 'tiktok'
  username: string
  displayName?: string
  followers?: number
  isConnected: boolean
  isVerified?: boolean
  lastSync?: string
  profilePicture?: string
  accessToken?: string
}

const platformConfig = {
  instagram: {
    name: 'Instagram',
    icon: Instagram,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-gradient-to-br from-pink-50 to-rose-50',
    borderColor: 'border-pink-200',
    textColor: 'text-pink-700',
    description: 'Connect your Instagram Business account to schedule posts, stories, and reels',
    features: ['Auto-posting', 'Stories & Reels', 'Analytics', 'DM Management'],
    pricing: 'Free'
  },
  facebook: {
    name: 'Facebook',
    icon: Facebook,
    color: 'from-blue-600 to-blue-700',
    bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    description: 'Connect your Facebook Page to manage posts and engage with your audience',
    features: ['Page posting', 'Audience insights', 'Ad integration', 'Events'],
    pricing: 'Free'
  },
  twitter: {
    name: 'Twitter',
    icon: Twitter,
    color: 'from-sky-400 to-sky-600',
    bgColor: 'bg-gradient-to-br from-sky-50 to-cyan-50',
    borderColor: 'border-sky-200',
    textColor: 'text-sky-700',
    description: 'Connect your Twitter account to schedule tweets and monitor engagement',
    features: ['Tweet scheduling', 'Thread posting', 'Engagement tracking', 'Hashtag analytics'],
    pricing: 'Pro'
  },
  linkedin: {
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'from-blue-700 to-blue-800',
    bgColor: 'bg-gradient-to-br from-blue-50 to-slate-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    description: 'Connect your LinkedIn profile or company page for professional networking',
    features: ['Professional posts', 'Company updates', 'Network analytics', 'Lead generation'],
    pricing: 'Pro'
  },
  youtube: {
    name: 'YouTube',
    icon: Youtube,
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-gradient-to-br from-red-50 to-orange-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    description: 'Connect your YouTube channel to manage video content and analytics',
    features: ['Video scheduling', 'Thumbnail design', 'Analytics dashboard', 'Community posts'],
    pricing: 'Business'
  },
  tiktok: {
    name: 'TikTok',
    icon: Video,
    color: 'from-black to-gray-800',
    bgColor: 'bg-gradient-to-br from-gray-50 to-slate-50',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-700',
    description: 'Connect your TikTok account to schedule viral content and track trends',
    features: ['Video scheduling', 'Trend analysis', 'Hashtag research', 'Performance metrics'],
    pricing: 'Business'
  }
}

export default function Integration() {
  const queryClient = useQueryClient()
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null)
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false)
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    type: 'error' | 'warning' | 'constraint'
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'error'
  })

  console.log('Integration component rendering...')

  // Get current workspace (reactive to workspace switching) - MOVED UP to fix reference error
  const { currentWorkspace, workspaces } = useCurrentWorkspace();

  // Real-time WebSocket listener for instant social account updates
  useEffect(() => {
    if (!currentWorkspace?.id) return

    const handleSocialAccountUpdate = (data) => {
      console.log('🔄 Real-time social account update received:', data)
      // Instantly update React Query cache without loading state
      queryClient.setQueryData(['/api/social-accounts', currentWorkspace.id], (oldData) => {
        if (!oldData) return oldData
        if (data.type === 'connected') {
          return [...oldData, data.account]
        } else if (data.type === 'disconnected') {
          return oldData.filter(acc => acc.id !== data.accountId)
        }
        return oldData
      })
    }

    // Listen for real-time updates (assuming WebSocket is available)
    if (window.socket) {
      window.socket.on('social-account-update', handleSocialAccountUpdate)
      return () => window.socket.off('social-account-update', handleSocialAccountUpdate)
    }
  }, [currentWorkspace?.id, queryClient])

  // Check for OAuth callback success and refresh data (only once)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const success = urlParams.get('success')
    const connected = urlParams.get('connected')
    const error = urlParams.get('error')
    
    // Only process if there are OAuth parameters
    if (!success && !connected && !error) return
    
    setIsProcessingOAuth(true)
    
    if (success === 'true' || connected === 'instagram' || connected === 'youtube') {
      console.log('OAuth callback success detected, refreshing data...')
      
      // Clean up URL parameters first to prevent double execution
      const cleanUrl = window.location.pathname
      window.history.replaceState({}, '', cleanUrl)
      
      // Background refresh without loading state - data will update silently
      Promise.all([
        queryClient.refetchQueries({ queryKey: ['/api/social-accounts'] }),
        queryClient.refetchQueries({ queryKey: ['/api/workspaces'] })
      ]).then(() => {
        console.log('✅ OAuth success: Background refresh complete')
        setIsProcessingOAuth(false)
      })
    } else if (error) {
      console.log('OAuth callback error detected:', error)
      
      // Clean up URL parameters first (don't invalidate queries for errors)
      const cleanUrl = window.location.pathname
      window.history.replaceState({}, '', cleanUrl)
      
      // Handle specific error messages with modal
      let errorTitle = "Connection Failed"
      let errorDescription = "Failed to connect your social media account."
      let errorType: 'error' | 'warning' | 'constraint' = 'error'
      
      if (error.includes('already connected') || error.includes('another workspace')) {
        errorTitle = "Account Already Connected"
        errorDescription = decodeURIComponent(error)
        errorType = 'constraint'
      } else if (error === 'token_exchange_failed') {
        errorDescription = "Authentication failed. Please try again."
      } else if (error === 'profile_fetch_failed') {
        errorDescription = "Could not fetch your profile information. Please try again."
      } else if (error === 'missing_code_or_state') {
        errorDescription = "Authentication flow was interrupted. Please try again."
      } else if (error === 'invalid_state') {
        errorDescription = "Invalid authentication state. Please try again."
      } else {
        errorDescription = decodeURIComponent(error)
      }
      
      setErrorModal({
        isOpen: true,
        title: errorTitle,
        message: errorDescription,
        type: errorType
      })
      
      // Don't trigger loading state for errors
      setIsProcessingOAuth(false)
    }
  }, [])

  // Advanced: Stale-While-Revalidate strategy - show cached data instantly, update silently in background
  const { data: connectedAccounts = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/social-accounts', currentWorkspace?.id],
    queryFn: () => currentWorkspace?.id ? apiRequest(`/api/social-accounts?workspaceId=${currentWorkspace.id}`) : Promise.resolve([]),
    enabled: !!currentWorkspace?.id,
    staleTime: 0, // Always consider data stale for background updates
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnMount: 'always', // Always get fresh data, but don't show loading
    refetchOnWindowFocus: true, // Background refresh on focus
    refetchInterval: 30 * 1000, // Background refresh every 30 seconds
    notifyOnChangeProps: ['data'], // Only notify UI when data actually changes
    placeholderData: (previousData) => previousData // Keep showing old data while new data loads
  })

  console.log('Integration state:', { 
    isLoading, 
    connectedAccounts: connectedAccounts?.length || 0, 
    workspaces: workspaces?.length || 0,
    currentWorkspace: currentWorkspace?.id || 'none'
  });

  // Advanced: Optimistic updates - immediately show "connecting" state without waiting
  const handleOptimisticConnect = (platform: string) => {
    if (!currentWorkspace) return

    // Optimistically add "connecting" account to UI
    const optimisticAccount = {
      id: `temp-${Date.now()}`,
      platform,
      username: 'Connecting...',
      isConnecting: true,
      profilePictureUrl: null
    }

    queryClient.setQueryData(['/api/social-accounts', currentWorkspace.id], (oldData = []) => [
      ...oldData,
      optimisticAccount
    ])
  }

  // Handle real OAuth connection for Instagram and YouTube
  const handleOAuthConnect = async (platform: string) => {
    if (!currentWorkspace) {
      setErrorModal({
        isOpen: true,
        title: "No Workspace Found",
        message: "Please create a workspace first to connect social accounts.",
        type: "error"
      })
      return
    }

    try {
      setConnectingPlatform(platform)
      handleOptimisticConnect(platform) // Show immediate feedback
      
      if (platform === 'instagram') {
        // Get Instagram OAuth URL
        const response = await apiRequest(`/api/instagram/auth?workspaceId=${currentWorkspace.id}`)
        if (response.authUrl) {
          window.location.href = response.authUrl
        }
      } else if (platform === 'youtube') {
        // Get YouTube OAuth URL
        const response = await apiRequest(`/api/youtube/auth?workspaceId=${currentWorkspace.id}`)
        if (response.authUrl) {
          window.location.href = response.authUrl
        }
      } else {
        // For other platforms, use mock connection for now
        await new Promise(resolve => setTimeout(resolve, 2000))
        const result = await apiRequest(`/api/social-accounts/connect/${platform}`, {
          method: 'POST'
        })
        
        // Success - no modal needed for success messages
        queryClient.invalidateQueries({ queryKey: ['/api/social-accounts'] })
        setConnectingPlatform(null)
      }
    } catch (error: any) {
      setErrorModal({
        isOpen: true,
        title: "Connection Failed",
        message: `Failed to connect ${platformConfig[platform as keyof typeof platformConfig].name}: ${error.message}`,
        type: "error"
      })
      setConnectingPlatform(null)
    }
  }

  // Connect social account mutation
  const connectMutation = useMutation({
    mutationFn: handleOAuthConnect,
    onError: (error: any, platform) => {
      setErrorModal({
        isOpen: true,
        title: "Connection Failed",
        message: `Failed to connect ${platformConfig[platform as keyof typeof platformConfig].name}: ${error.message}`,
        type: "error"
      })
      setConnectingPlatform(null)
    }
  })

  // Disconnect social account mutation
  const disconnectMutation = useMutation({
    mutationFn: async (accountId: string) => {
      return apiRequest(`/api/social-accounts/${accountId}`, {
        method: 'DELETE'
      })
    },
    onSuccess: () => {
      // Success - no modal needed for success messages
      queryClient.invalidateQueries({ queryKey: ['/api/social-accounts'] })
    },
    onError: (error: any) => {
      setErrorModal({
        isOpen: true,
        title: "Disconnect Failed",
        message: `Failed to disconnect account: ${error.message}`,
        type: "error"
      })
    }
  })

  // Refresh/sync social account data mutation
  const refreshMutation = useMutation({
    mutationFn: async (platform: string) => {
      if (platform === 'instagram') {
        return apiRequest('/api/instagram/force-sync', {
          method: 'POST',
          body: JSON.stringify({ workspaceId: currentWorkspace?.id })
        })
      }
      throw new Error('Platform not supported for refresh')
    },
    onSuccess: (data: any, platform: string) => {
      // Success - no modal needed for success messages
      queryClient.invalidateQueries({ queryKey: ['/api/social-accounts'] })
    },
    onError: (error: any, platform: string) => {
      setErrorModal({
        isOpen: true,
        title: "Refresh Failed",
        message: `Failed to refresh ${platformConfig[platform as keyof typeof platformConfig].name}: ${error.message}`,
        type: "error"
      })
    }
  })

  const isAccountConnected = (platform: string) => {
    return connectedAccounts?.some((account: SocialAccount) => account.platform === platform) || false
  }

  const getConnectedAccount = (platform: string) => {
    return connectedAccounts?.find((account: SocialAccount) => account.platform === platform)
  }

  const formatFollowersCount = (count: number | undefined) => {
    if (!count || count === 0) return '0'
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  const renderPlatformCard = (platform: keyof typeof platformConfig) => {
    const config = platformConfig[platform]
    const Icon = config.icon
    const isConnected = isAccountConnected(platform)
    const connectedAccount = getConnectedAccount(platform)
    const isConnecting = connectingPlatform === platform

    return (
      <Card key={platform} className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg border-2 ${config.borderColor} ${config.bgColor}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${config.color} shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">{config.name}</CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={config.pricing === 'Free' ? 'default' : 'secondary'} className="text-xs">
                    {config.pricing}
                  </Badge>
                  {isConnected && (
                    <Badge variant="outline" className="text-xs text-green-600 dark:text-green-400 border-green-200 dark:border-green-600">
                      <Check className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {isConnected && connectedAccount?.isVerified && (
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <CardDescription className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {config.description}
          </CardDescription>

          {/* Connected Account Info */}
          {isConnected && connectedAccount && (
            <div className="mb-4 p-3 bg-white/60 dark:bg-gray-700/60 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-3">
                {connectedAccount.profilePicture && (
                  <img 
                    src={connectedAccount.profilePicture} 
                    alt={connectedAccount.displayName || connectedAccount.username}
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-600 shadow-sm"
                  />
                )}
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">@{connectedAccount.username}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{formatFollowersCount(connectedAccount.followers)} followers</p>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Last synced: {connectedAccount.lastSync ? new Date(connectedAccount.lastSync).toLocaleDateString() : 'Never'}
              </div>
            </div>
          )}

          {/* Features */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Features</h4>
            <div className="grid grid-cols-2 gap-2">
              {config.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Sparkles className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            {isConnected ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refreshMutation.mutate(platform)}
                  disabled={refreshMutation.isPending}
                  className="flex-1"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => disconnectMutation.mutate(connectedAccount!.id)}
                  disabled={disconnectMutation.isPending}
                  className="flex-1 text-red-600 dark:text-red-400 border-red-200 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Disconnect
                </Button>
              </>
            ) : (
              <Button
                onClick={() => connectMutation.mutate(platform)}
                disabled={isConnecting || connectMutation.isPending}
                className={`w-full bg-gradient-to-r ${config.color} hover:opacity-90 text-white shadow-lg`}
              >
                {isConnecting ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                {isConnecting ? 'Connecting...' : 'Connect Account'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Don't show loading if error modal is open or processing OAuth errors
  if (isLoading && !isProcessingOAuth && !errorModal.isOpen) {
    console.log('Integration - showing loading state')
    return (
      <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 dark:text-gray-400">Loading your social accounts...</p>
          </div>
        </div>
      </div>
    )
  }

  console.log('Integration - rendering main content')

  return (
    <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-xl">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 bg-clip-text text-transparent mb-4">
            Connect Your Social Accounts
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Integrate your social media accounts to streamline content creation, scheduling, and analytics across all platforms
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200 dark:border-blue-600">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{connectedAccounts?.length || 0}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Connected Accounts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-600">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {connectedAccounts?.reduce((total: number, account: SocialAccount) => total + (account.followers || 0), 0) || 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Followers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border-purple-200 dark:border-purple-600">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">24/7</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Auto Scheduling</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Platforms */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
            <Settings className="w-6 h-6 mr-3 text-blue-600" />
            Available Platforms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.keys(platformConfig).map((platform) => 
              renderPlatformCard(platform as keyof typeof platformConfig)
            )}
          </div>
        </div>

        {/* Instagram Token Converter */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
            <Settings className="w-6 h-6 mr-3 text-pink-600" />
            Instagram Token Management
          </h2>
          <TokenConverter />
        </div>

        {/* Help Section */}
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border-amber-200 dark:border-amber-600">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Need Help Connecting?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Follow our step-by-step guides to connect your social accounts securely. All connections use OAuth 2.0 for maximum security.
                </p>
                <div className="flex space-x-4">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Documentation
                  </Button>
                  <Button variant="outline" size="sm">
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal(prev => ({ ...prev, isOpen: false }))}
        title={errorModal.title}
        message={errorModal.message}
        type={errorModal.type}
      />
    </div>
  )
}