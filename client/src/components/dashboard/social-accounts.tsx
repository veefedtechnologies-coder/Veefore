import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLocation } from 'wouter'
import { apiRequest } from '@/lib/queryClient'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, TrendingUp, MessageSquare, Share2, Eye, Calendar, BarChart3, Heart, Instagram, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react'

export function SocialAccounts() {
  const [, setLocation] = useLocation()
  
  // Fetch real social accounts data
  const { data: socialAccounts, isLoading, refetch: refetchAccounts } = useQuery({
    queryKey: ['/api/social-accounts'],
    queryFn: () => apiRequest('/api/social-accounts'),
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 5000, // Consider data stale after 5 seconds
  })

  // Debug logging
  console.log('Social Accounts - Raw data:', socialAccounts)

  // Filter for connected accounts with real data - improved logic
  const connectedAccounts = socialAccounts?.filter((account: any) => {
    console.log('Social Accounts - Filtering account:', account.username, 'followers:', account.followersCount, 'isConnected:', account.isConnected, 'hasToken:', !!account.accessToken)
    return account.isConnected || account.followersCount > 0 || account.accessToken
  }) || []
  
  console.log('Social Accounts - Connected accounts:', connectedAccounts.length)

  const [selectedAccount, setSelectedAccount] = useState(connectedAccounts[0]?.platform || 'instagram')

  if (isLoading) {
    return (
      <Card data-testid="social-accounts" className="bg-white shadow-lg border border-gray-200/50 overflow-hidden">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
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

  // Calculate engagement rate
  const calculateEngagement = (account: any) => {
    if (!account.followersCount || account.followersCount === 0) return '0.0'
    // Simple engagement calculation based on typical social media rates
    const baseEngagement = account.platform === 'instagram' ? 4.2 : 
                          account.platform === 'facebook' ? 0.25 : 
                          account.platform === 'twitter' ? 0.5 : 
                          account.platform === 'youtube' ? 2.8 : 1.5
    return baseEngagement.toFixed(1)
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
      case 'instagram': return 'bg-gradient-to-br from-purple-50 to-pink-50'
      case 'facebook': return 'bg-gradient-to-br from-blue-50 to-indigo-50'
      case 'twitter': return 'bg-gradient-to-br from-blue-50 to-cyan-50'
      case 'linkedin': return 'bg-gradient-to-br from-blue-50 to-indigo-50'
      case 'youtube': return 'bg-gradient-to-br from-red-50 to-orange-50'
      default: return 'bg-gradient-to-br from-gray-50 to-slate-50'
    }
  }

  return (
    <Card data-testid="social-accounts" className="bg-white shadow-lg border border-gray-200/50 overflow-hidden">
      <CardContent className="p-0">
        {/* Enhanced Header */}
        <div className="p-6 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Social accounts</h3>
              <p className="text-sm text-gray-600 mt-1">Manage your connected platforms</p>
            </div>
            <Button variant="outline" size="sm" className="text-slate-600 border-slate-200 hover:bg-slate-50">
              See all accounts
            </Button>
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
                      ? 'bg-white shadow-md border-2 border-blue-200' 
                      : 'bg-white/60 hover:bg-white/80 border border-gray-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white bg-gradient-to-r ${getPlatformColor(account.platform)}`}>
                    <PlatformIcon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900">{account.username}</div>
                    <div className="text-xs text-gray-500 capitalize">{account.platform}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Enhanced Account Details */}
        {currentAccount && (
          <div className={`p-6 ${getPlatformBgColor(currentAccount.platform)}`}>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              {/* Account Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white bg-gradient-to-r ${getPlatformColor(currentAccount.platform)}`}>
                    {currentAccount.profilePictureUrl || currentAccount.profilePicture ? (
                      <img 
                        src={currentAccount.profilePictureUrl || currentAccount.profilePicture} 
                        alt={currentAccount.username}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold">{currentAccount.username?.[0]?.toUpperCase() || 'A'}</span>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">@{currentAccount.username}</div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-600 border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                        active
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Last post: {currentAccount.lastSync ? new Date(currentAccount.lastSync).toLocaleDateString() : '2 hours ago'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-600 font-medium">+12%</div>
                  <div className="text-xs text-gray-500">Growth</div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatNumber(currentAccount.followersCount || currentAccount.followers || 0)}
                  </div>
                  <div className="text-xs text-gray-600">Followers</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {calculateEngagement(currentAccount)}%
                  </div>
                  <div className="text-xs text-gray-600">Engagement</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <div className="flex items-center justify-center mb-2">
                    <Eye className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {currentAccount.mediaCount || currentAccount.posts || 0}
                  </div>
                  <div className="text-xs text-gray-600">Posts</div>
                </div>
              </div>

              {/* Monthly Engagement Goal */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">Monthly engagement goal</h4>
                  <span className="text-sm font-medium text-blue-600">67%</span>
                </div>
                <div className="w-full bg-white rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: '67%' }}></div>
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  Target: 5% average engagement rate
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Create post</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>View insights</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* No accounts message */}
        {connectedAccounts.length === 0 && (
          <div className="p-6 text-center">
            <p className="text-gray-500 mb-4">No connected social accounts found.</p>
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