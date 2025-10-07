import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useLocation } from 'wouter'
import { apiRequest, queryClient } from '@/lib/queryClient'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useCurrentWorkspace } from '@/components/WorkspaceSwitcher'
import { Users, TrendingUp, MessageSquare, Eye, BarChart3, Instagram, Facebook, Twitter, Linkedin, Youtube, RefreshCw } from 'lucide-react'
import { useCacheInvalidation } from '@/hooks/useCacheInvalidation'

type TimePeriod = 'today' | 'week' | 'month'

export function SocialAccounts() {
  console.log('[SOCIAL ACCOUNTS] Component loaded with updated formatCountdown function')
  const [, setLocation] = useLocation()
  const { toast } = useToast()
  const { currentWorkspace } = useCurrentWorkspace()
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('today')
  const [currentTime, setCurrentTime] = useState(Date.now())

  // Enable real-time cache invalidation for instant updates
  const { isConnected: cacheConnected } = useCacheInvalidation()

  // Update current time every second for real-time countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])

  // Helper function to format countdown time
  const formatCountdown = (nextPollIn: number, dataUpdatedAt?: number) => {
    // Debug logging
    console.log(`[COUNTDOWN DEBUG] nextPollIn: ${nextPollIn}, currentTime: ${currentTime}, dataUpdatedAt: ${dataUpdatedAt}`)
    
    // CORRECTED LOGIC: nextPollIn from backend is already the remaining time
    // We just need to subtract the time elapsed since the data was fetched
    const timeElapsedSinceUpdate = dataUpdatedAt ? currentTime - dataUpdatedAt : 0
    const timeRemaining = Math.max(0, nextPollIn - timeElapsedSinceUpdate)
    
    console.log(`[COUNTDOWN DEBUG] timeElapsedSinceUpdate: ${timeElapsedSinceUpdate}, timeRemaining: ${timeRemaining}`)
    
    // Don't handle the "Polling now..." case here - let the parent component decide
    // This function should only format the time remaining
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60))
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    } else if (seconds > 0) {
      return `${seconds}s`
    } else {
      return '0s'
    }
  }

  // Helper function to get polling status color and animation
  const getPollingStatusStyle = (accountStatus: any) => {
    const isHibernated = accountStatus?.status === 'HIBERNated'
    // CORRECTED: Use formatCountdown logic for accurate timeRemaining calculation
    const timeElapsedSinceUpdate = dataUpdatedAt ? currentTime - dataUpdatedAt : 0
    const timeRemaining = Math.max(0, (accountStatus?.nextPollIn || 0) - timeElapsedSinceUpdate)
    const isPollingNow = timeRemaining <= 1000
    
    if (isHibernated) {
      return {
        color: 'text-gray-500 dark:text-gray-400',
        dotColor: 'bg-gray-400',
        animation: ''
      }
    } else if (isPollingNow) {
      return {
        color: 'text-green-600 dark:text-green-400',
        dotColor: 'bg-green-500',
        animation: 'animate-pulse'
      }
    } else {
      return {
        color: 'text-blue-600 dark:text-blue-400',
        dotColor: 'bg-blue-500',
        animation: 'animate-pulse'
      }
    }
  }
  
  // Fetch social accounts data for current workspace - PERIOD-AWARE WITH REAL-TIME UPDATES
  const { data: socialAccounts, isLoading, refetch: refetchAccounts } = useQuery({
    queryKey: ['/api/social-accounts', currentWorkspace?.id, selectedPeriod, 'real-time-data'], // Include period in cache key
    // Bypass server-side route cache by adding a timestamp param
    queryFn: () => currentWorkspace?.id ? apiRequest(`/api/social-accounts?workspaceId=${currentWorkspace.id}&period=${selectedPeriod}&_ts=${Date.now()}`) : Promise.resolve([]),
    enabled: !!currentWorkspace?.id,
    refetchInterval: cacheConnected ? 300000 : 30000, // 5 minutes if real-time connected, 30 seconds if not
    refetchIntervalInBackground: false, // Don't poll when tab is not active to save API calls
    staleTime: cacheConnected ? 5 * 60 * 1000 : 0, // 5 minutes if real-time connected, immediate if not
    refetchOnWindowFocus: true, // Refresh when user returns to tab
    refetchOnMount: true, // Always refetch on mount to get latest calculations
    refetchOnReconnect: true, // Refresh when network reconnects
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    placeholderData: (previousData) => previousData, // Show cached data immediately while refetching
  })

  // Profile picture refresh mutation
  const refreshProfilePicMutation = useMutation({
    mutationFn: () => {
      if (!currentWorkspace?.id) {
        return Promise.reject(new Error('No workspace selected'))
      }
      
      return apiRequest('/api/social-accounts/refresh-profile-picture', {
        method: 'POST',
        body: JSON.stringify({ 
          workspaceId: currentWorkspace.id,
          platform: 'instagram'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    onSuccess: (data) => {
      console.log('✅ [PROFILE PICTURE] Refresh completed:', data)
      
      // Immediately refresh the UI data
      refetchAccounts()
      
      toast({
        title: "🖼️ Profile picture refreshed!",
        description: "Your Instagram profile picture has been updated",
      })
    },
    onError: (error: any) => {
      console.error('Profile picture refresh failed:', error)
      
      toast({
        title: "❌ Refresh failed", 
        description: error.message || "Failed to refresh profile picture",
        variant: "destructive"
      })
    }
  })

  // Smart Instagram sync mutation with rate limit protection and immediate updates
  const syncMutation = useMutation({
    mutationFn: () => {
      console.log('🔄 [SOCIAL-ACCOUNTS] Sync triggered for workspace:', currentWorkspace?.id)
      
      if (!currentWorkspace?.id) {
        console.error('🔄 [SOCIAL-ACCOUNTS] ERROR: No workspace ID!')
        return Promise.reject(new Error('No workspace selected'))
      }
      
      console.log('🔄 [SOCIAL-ACCOUNTS] Calling immediate-sync endpoint...')
      return apiRequest('/api/instagram/immediate-sync', { 
        method: 'POST',
        body: JSON.stringify({ 
          workspaceId: currentWorkspace.id
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    onSuccess: () => {
      console.log('✅ [SOCIAL-ACCOUNTS] Smart Instagram sync completed')
      
      // Immediately trigger a refresh of all data for real-time updates
      refetchAccounts()
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/analytics'] })
      queryClient.invalidateQueries({ queryKey: ['/api/instagram/polling-status'] })
      // Force immediate refetch for instant updates
      queryClient.refetchQueries({ queryKey: ['/api/social-accounts', currentWorkspace.id] })
      
      toast({
        title: "🚀 Sync complete!",
        description: "Instagram data updated successfully",
      })
    },
    onError: (error: any) => {
      console.error('Smart Instagram sync failed:', error)
      
      // Enhanced rate limit error handling
      if (error.message?.includes('rate limit') || error.message?.includes('429') || error.status === 429) {
        toast({
          title: "⏳ Rate limit protection active", 
          description: "Instagram API rate limit reached. Smart sync will retry automatically in 2-3 minutes.",
          variant: "destructive"
        })
      } else if (error.message?.includes('timeout') || error.message?.includes('network')) {
        toast({
          title: "🔄 Network timeout", 
          description: "Connection timeout. Will retry automatically.",
          variant: "destructive"
        })
      } else {
        toast({
          title: "❌ Sync failed", 
          description: error.message || "Failed to sync Instagram data",
          variant: "destructive"
        })
      }
    }
  })

  // Smart refresh system with hybrid approach - Webhooks for comments/mentions + Polling for other metrics
  useEffect(() => {
    let refreshTimeout: NodeJS.Timeout | null = null
    let lastRefreshTime = 0
    let lastActivityTime = Date.now()
    const MIN_REFRESH_INTERVAL = 30 * 1000 // Minimum 30 seconds between refreshes to respect rate limits
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // User returned to page - check if we need fresh data
        const timeSinceLastActivity = Date.now() - lastActivityTime
        const timeSinceLastRefresh = Date.now() - lastRefreshTime
        const shouldRefresh = timeSinceLastActivity > 3 * 60 * 1000 && timeSinceLastRefresh > MIN_REFRESH_INTERVAL // 3 minutes
        
        if (shouldRefresh) {
          console.log('User returned after', Math.round(timeSinceLastActivity / 1000), 'seconds - refreshing data (hybrid mode)')
          // Debounce the refresh to prevent excessive API calls
          if (refreshTimeout) {
            clearTimeout(refreshTimeout)
          }
          
          refreshTimeout = setTimeout(() => {
            // User returned to page - refresh data with delay
            refetchAccounts()
            queryClient.invalidateQueries({ queryKey: ['/api/dashboard/analytics'] })
            lastActivityTime = Date.now()
            lastRefreshTime = Date.now()
          }, 1000) // 1 second delay to prevent rapid refreshes
        }
      }
    }
    
    // Track user activity for smart refreshing
    const handleUserActivity = () => {
      lastActivityTime = Date.now()
    }
    
    // Listen for user activity
    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('mousemove', handleUserActivity)
    document.addEventListener('keydown', handleUserActivity)
    document.addEventListener('click', handleUserActivity)
    
    console.log('[SOCIAL ACCOUNTS] Hybrid mode: Webhooks for comments/mentions + Smart polling for likes/followers/engagement')
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('mousemove', handleUserActivity)
      document.removeEventListener('keydown', handleUserActivity)
      document.removeEventListener('click', handleUserActivity)
      if (refreshTimeout) {
        clearTimeout(refreshTimeout)
      }
    }
  }, [refetchAccounts, queryClient])

  // Hybrid polling mutation - Webhooks for comments/mentions + Smart polling for other metrics
  const startPollingMutation = useMutation({
    mutationFn: () => currentWorkspace?.id ? apiRequest('/api/instagram/start-polling', { 
      method: 'POST',
      body: JSON.stringify({ workspaceId: currentWorkspace.id })
    }) : Promise.reject(new Error('No workspace selected')),
    onSuccess: () => {
      toast({
        title: "🔄 Hybrid System Active",
        description: "Webhooks for comments/mentions + Smart polling for likes/followers/engagement",
      })
    },
    onError: (error: any) => {
      console.error('Failed to start hybrid polling:', error)
    }
  })

  // Polling status query - Real-time countdown updates
  const { data: pollingStatus, dataUpdatedAt } = useQuery({
    queryKey: ['/api/instagram/polling-status'], // ⭐ FIX: Removed currentTime to prevent refetching every second
    queryFn: async () => {
      const data = await apiRequest('/api/instagram/polling-status');
      console.log('[POLLING STATUS API] Received data:', data);
      console.log('[POLLING STATUS API] dataUpdatedAt will be:', Date.now());
      return data;
    },
    refetchInterval: 5 * 1000, // Refresh every 5 seconds for accurate countdown
    refetchIntervalInBackground: false, // Don't poll when tab is not active to save API calls
    staleTime: 0, // No caching - always fetch fresh data
    gcTime: 0, // Don't cache at all
    refetchOnWindowFocus: true, // Refresh when user returns to tab
    refetchOnReconnect: true, // Refresh when network reconnects
    enabled: !!socialAccounts && socialAccounts.length > 0
  })

  // Filter for connected accounts with real data
  const connectedAccounts = socialAccounts?.filter((account: any) => {
    return account.isConnected || account.followersCount > 0 || account.accessToken
  }) || []

  const [selectedAccount, setSelectedAccount] = useState(connectedAccounts[0]?.platform || 'instagram')

  // PRODUCTION-SAFE: Only start polling once on initial load, not on every update
  const [hasStartedPolling, setHasStartedPolling] = useState(false)
  useEffect(() => {
    const instagramAccount = connectedAccounts.find((acc: any) => acc.platform === 'instagram')
    if (instagramAccount && !startPollingMutation.isPending && !hasStartedPolling) {
      setHasStartedPolling(true)
      // Start polling only once when Instagram account is first detected
      const timer = setTimeout(() => {
        startPollingMutation.mutate()
      }, 5000) // Longer delay to prevent rapid triggering
      return () => clearTimeout(timer)
    }
  }, [connectedAccounts, startPollingMutation.isPending, hasStartedPolling])

  // Show skeleton loading only for a limited time, then show error state
  const [showError, setShowError] = useState(false)
  
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowError(true)
      }, 10000) // Show error after 10 seconds of loading
      return () => clearTimeout(timer)
    } else {
      setShowError(false)
    }
  }, [isLoading])

  if (!socialAccounts && isLoading && !showError) {
    return (
      <Card data-testid="social-accounts" className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show error state if loading takes too long
  if (showError && !socialAccounts) {
    return (
      <Card data-testid="social-accounts" className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Social Accounts</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Unable to load social accounts. Please make sure you're logged in.
            </p>
            <button
              onClick={() => {
                setShowError(false)
                // Retry the query
                window.location.reload()
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Find current account
  const currentAccount = connectedAccounts.find((acc: any) => acc.platform === selectedAccount) || connectedAccounts[0]

  // Format numbers for display
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num?.toString() || '0'
  }

  // Graceful display for platform fields that may not be provided (e.g., Instagram shares/saves)
  const formatMetricOrNA = (value: number | undefined | null) => {
    return value === null || value === undefined ? 'N/A' : formatNumber(value)
  }

  // Calculate Smart engagement (ERR for small accounts with valid reach; else ERF)
  const calculateEngagement = (account: any) => {
    const followers = account.followersCount || 0
    const reach = account.totalReach || 0 // periodized account-level reach
    const totalEngagement = (account.totalLikes || 0) + (account.totalComments || 0)
    const isSmallAccount = followers >= 0 && followers <= 100
    const hasValidReach = reach > 0
    const rate = (isSmallAccount && hasValidReach)
      ? (totalEngagement > 0 && reach > 0 ? (totalEngagement / reach) * 100 : 0)
      : (followers > 0 ? (totalEngagement / followers) * 100 : 0)
    return rate.toFixed(1)
  }

  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return Instagram
      case 'facebook': return Facebook
      case 'twitter': return Twitter
      case 'linkedin': return Linkedin
      case 'youtube': return Youtube
      default: return Instagram
    }
  }

  // Get platform color
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'from-purple-500 to-pink-500'
      case 'facebook': return 'from-blue-600 to-blue-700'
      case 'twitter': return 'from-blue-400 to-blue-600'
      case 'linkedin': return 'from-blue-700 to-blue-900'
      case 'youtube': return 'from-red-500 to-red-700'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  // Get platform background color
  const getPlatformBgColor = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-700'
      case 'facebook': return 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700'
      case 'twitter': return 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700'
      case 'linkedin': return 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700'
      case 'youtube': return 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-slate-800 dark:to-slate-700'
      default: return 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-slate-800 dark:to-slate-700'
    }
  }

  return (
    <Card data-testid="social-accounts" className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
      <CardContent className="p-0">
        {/* Enhanced Header */}
        <div className="p-6 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-gray-800 dark:to-gray-700 border-b border-gray-100 dark:border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Social accounts</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage your connected platforms</p>
            </div>
            <div className="flex space-x-2">
              {/* SMART sync button for Instagram with rate limit protection */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  // Trigger smart sync with rate limit protection
                  syncMutation.mutate()
                  // Also immediately refresh the UI data
                  refetchAccounts()
                }}
                disabled={syncMutation.isPending}
                className="bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                title="Smart sync with rate limit protection - gets fresh data while respecting Meta's limits"
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
                {syncMutation.isPending ? 'Smart Syncing...' : '🧠 Smart Sync'}
              </Button>
              
              <Button variant="outline" size="sm" className="bg-white dark:bg-gray-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200">
                See all accounts
              </Button>
            </div>
          </div>

          {/* Period Selector */}
          <div className="flex space-x-1 mb-4">
            {(['today', 'week', 'month'] as TimePeriod[]).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  selectedPeriod === period
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white/60 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80 border border-gray-200 dark:border-gray-600'
                }`}
              >
                {period === 'today' ? 'Today' : period === 'week' ? 'This Week' : 'This Month'}
              </button>
            ))}
          </div>

          {/* Account Selector */}
          <div className="flex space-x-2 overflow-x-auto">
            {connectedAccounts.map((account: any) => {
              const PlatformIcon = getPlatformIcon(account.platform)
              const isSelected = selectedAccount === account.platform
              
              return (
                <button
                  key={account.id}
                  onClick={() => setSelectedAccount(account.platform)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 flex-shrink-0 ${
                    isSelected 
                      ? 'bg-white dark:bg-gray-700 shadow-md border-2 border-blue-200 dark:border-blue-500' 
                      : 'bg-white/60 dark:bg-gray-700/60 hover:bg-white/80 dark:hover:bg-gray-700/80 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white bg-gradient-to-r ${getPlatformColor(account.platform)}`}>
                    <PlatformIcon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{account.username}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{account.platform}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Enhanced Account Details */}
        {currentAccount && (
          <div className={`p-6 ${getPlatformBgColor(currentAccount.platform)}`}>
            {/* Reconnect Warning - Show when access token is missing */}
            {(!(currentAccount as any).hasAccessToken) ? (
              <div className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-sm border-2 border-orange-200 dark:border-orange-600">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 flex items-center justify-center">
                    <RefreshCw className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Reconnect Your {currentAccount.platform === 'instagram' ? 'Instagram' : currentAccount.platform} Account
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    Your access token is missing or expired. Reconnect your account to start syncing your real followers, posts, and engagement data.
                  </p>
                  <Button
                    onClick={() => setLocation('/settings')}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reconnect Account in Settings
                  </Button>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    After reconnecting, your real Instagram data will appear here automatically
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-600">
              {/* Account Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white bg-gradient-to-r ${getPlatformColor(currentAccount.platform)} relative overflow-hidden`}>
                      {currentAccount.profilePictureUrl || currentAccount.profilePicture ? (
                        <img 
                          src={currentAccount.profilePictureUrl || currentAccount.profilePicture} 
                          alt={currentAccount.username}
                          className="w-16 h-16 rounded-full object-cover"
                          onError={(e) => {
                            console.log('[PROFILE PICTURE] Failed to load image:', currentAccount.profilePictureUrl || currentAccount.profilePicture);
                            console.log('[PROFILE PICTURE] Account data:', {
                              username: currentAccount.username,
                              profilePictureUrl: currentAccount.profilePictureUrl,
                              profilePicture: currentAccount.profilePicture,
                              platform: currentAccount.platform
                            });
                            // Hide the broken image and show fallback
                            const target = e.currentTarget as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                          onLoad={() => {
                            console.log('[PROFILE PICTURE] Successfully loaded:', currentAccount.profilePictureUrl || currentAccount.profilePicture);
                          }}
                        />
                      ) : null}
                      {/* Fallback avatar - always present but hidden when image loads */}
                      <span 
                        className="text-2xl font-bold absolute inset-0 flex items-center justify-center"
                        style={{ display: (currentAccount.profilePictureUrl || currentAccount.profilePicture) ? 'none' : 'flex' }}
                      >
                        {currentAccount.username?.[0]?.toUpperCase() || 'A'}
                      </span>
                    </div>
                    {/* Profile picture refresh button */}
                    <button
                      onClick={() => refreshProfilePicMutation.mutate()}
                      disabled={refreshProfilePicMutation.isPending}
                      className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center text-xs transition-colors disabled:opacity-50"
                      title="Refresh profile picture"
                    >
                      {refreshProfilePicMutation.isPending ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <RefreshCw className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-gray-100 text-lg">@{currentAccount.username}</div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                        active
                      </Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Last sync: {currentAccount.lastSyncAt ? 
                          new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
                            Math.round((new Date(currentAccount.lastSyncAt).getTime() - Date.now()) / (1000 * 60)), 'minute'
                          ) :
                          currentAccount.lastSync ? new Date(currentAccount.lastSync).toLocaleDateString() : 'Never'
                        }
                      </span>
                      
                      {/* Real-time polling status for this account */}
                      {pollingStatus && 'accounts' in pollingStatus && pollingStatus.accounts?.find((acc: any) => acc.username === currentAccount.username) && (() => {
                        const accountStatus = pollingStatus.accounts.find((acc: any) => acc.username === currentAccount.username);
                        const isHibernated = accountStatus?.status === 'HIBERNATED';
                        // CORRECTED: Use formatCountdown logic for accurate timeRemaining calculation
                        const timeElapsedSinceUpdate = dataUpdatedAt ? currentTime - dataUpdatedAt : 0
                        const timeRemaining = Math.max(0, (accountStatus?.nextPollIn || 0) - timeElapsedSinceUpdate)
                        
                        // FIXED: Only show "Polling now..." during the actual sync, not when nextPollIn is 0
                        // When nextPollIn is 0, it means "ready to poll" but not necessarily "polling right now"
                        // We need to check if we're in the middle of a sync operation
                        const isPollingNow = syncMutation.isPending || startPollingMutation.isPending;
                        const style = getPollingStatusStyle(accountStatus);
                        
                        // Debug logging - FIXED: Use backend status instead of frontend calculation
                        console.log(`[POLLING STATUS DEBUG] Account: ${currentAccount.username}`, {
                          accountStatus,
                          nextPollIn: accountStatus?.nextPollIn,
                          timeRemaining,
                          isPollingNow,
                          isSyncPending: syncMutation.isPending,
                          isStartPollingPending: startPollingMutation.isPending,
                          isHibernated: accountStatus?.status === 'HIBERNATED',
                          backendStatus: accountStatus?.status,
                          currentTime
                        });
                        
                        return (
                          <div className={`text-xs mt-1 flex items-center space-x-1 ${style.color}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${style.dotColor} ${style.animation}`}></div>
                            <span>
                              {isHibernated ? (
                                '💤 Hibernated - waiting for user activity'
                              ) : isPollingNow ? (
                                '🔄 Polling now...'
                              ) : timeRemaining > 1000 ? (
                                `Smart polling: next check in ${formatCountdown(accountStatus?.nextPollIn || 0, dataUpdatedAt)}`
                              ) : (
                                '✅ Ready for next poll'
                              )}
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">{currentAccount.mediaCount || 0}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Total Posts</div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatNumber(currentAccount.followersCount || currentAccount.followers || 0)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Followers</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {calculateEngagement(currentAccount)}%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Engagement</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl">
                  <div className="flex items-center justify-center mb-2">
                    <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {currentAccount.mediaCount || currentAccount.posts || 0}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Posts</div>
                </div>
              </div>

              {/* Real Engagement Metrics */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Account Reach</h4>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{currentAccount.totalReach || 0}</span>
                </div>
                <div className="text-xs text-blue-500 dark:text-blue-400 font-semibold mb-1">
                  ✅ Account-level reach
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {(() => {
                    const parts: string[] = []
                    parts.push(`${formatNumber(currentAccount.totalLikes || 0)} likes`)
                    parts.push(`${formatNumber(currentAccount.totalComments || 0)} comments`)
                    if (currentAccount.totalShares !== undefined && currentAccount.totalShares !== null) {
                      parts.push(`${formatNumber(currentAccount.totalShares)} shares`)
                    }
                    if (currentAccount.totalSaves !== undefined && currentAccount.totalSaves !== null) {
                      parts.push(`${formatNumber(currentAccount.totalSaves)} saves`)
                    }
                    return <>Engagement (last 6 posts): {parts.join(' • ')} </>
                  })()}
                  {currentAccount.postsAnalyzed && (
                    <span className="text-blue-500 dark:text-blue-400 ml-1">
                      (from {currentAccount.postsAnalyzed} posts)
                    </span>
                  )}
                </div>
                {/* Engagement breakdown chips */}
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="px-2 py-1 text-xs rounded-md bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 text-gray-700 dark:text-gray-200">👍 Likes: {formatNumber(currentAccount.totalLikes || 0)}</span>
                  <span className="px-2 py-1 text-xs rounded-md bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 text-gray-700 dark:text-gray-200">💬 Comments: {formatNumber(currentAccount.totalComments || 0)}</span>
                  <span className="px-2 py-1 text-xs rounded-md bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 text-gray-700 dark:text-gray-200">🔁 Shares: {formatMetricOrNA(currentAccount.totalShares)}</span>
                  <span className="px-2 py-1 text-xs rounded-md bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 text-gray-700 dark:text-gray-200">📌 Saves: {formatMetricOrNA(currentAccount.totalSaves)}</span>
                </div>
                <div className="w-full bg-white dark:bg-gray-600 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min((currentAccount.totalReach || 0) / 500 * 100, 100)}%` }}></div>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Performance: {currentAccount.avgComments || 0} avg comments per post
                </div>
              </div>

                             {/* Quick Actions */}
               <div className="grid grid-cols-2 gap-3">
                 <Button 
                   onClick={() => setLocation('/create')}
                   variant="outline" 
                   size="sm" 
                   className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-green-700 dark:hover:text-green-400 flex items-center space-x-2"
                 >
                   <MessageSquare className="w-4 h-4" />
                   <span>Create post</span>
                 </Button>
                 <Button variant="outline" size="sm" className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-purple-700 dark:hover:text-purple-400 flex items-center space-x-2">
                   <BarChart3 className="w-4 h-4" />
                   <span>View insights</span>
                 </Button>
               </div>
              </div>
            )}
          </div>
        )}

        {/* No accounts message */}
        {connectedAccounts.length === 0 && (
          <div className="p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No connected social accounts found.</p>
            <Button 
              onClick={() => setLocation('/integration')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Connect Account
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}