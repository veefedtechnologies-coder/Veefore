import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '@/lib/queryClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Info, TrendingUp, Sparkles, Users, Heart, MessageCircle, Share, Eye } from 'lucide-react'

export function PerformanceScore() {
  // Fetch real dashboard analytics data
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['/api/dashboard/analytics'],
    queryFn: () => apiRequest('/api/dashboard/analytics'),
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  // Fetch real social accounts data  
  const { data: socialAccounts } = useQuery({
    queryKey: ['/api/social-accounts'],
    queryFn: () => apiRequest('/api/social-accounts'),
    refetchInterval: 30000,
  })

  if (isLoading) {
    return (
      <Card data-testid="performance-score" className="border-gray-200/50 bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border-0 rounded-3xl overflow-hidden">
        <CardHeader className="text-center pb-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Map real connected platforms from social accounts
  const connectedPlatforms = socialAccounts?.filter((account: any) => account.isConnected || account.followersCount > 0)?.map((account: any) => ({
    name: account.platform === 'instagram' ? 'Instagram' : 
          account.platform === 'youtube' ? 'YouTube' : 
          account.platform === 'twitter' ? 'Twitter' : 
          account.platform === 'linkedin' ? 'LinkedIn' : 'Facebook',
    logo: account.platform === 'instagram' ? '📷' : 
          account.platform === 'youtube' ? '🎥' : 
          account.platform === 'twitter' ? '🐦' : 
          account.platform === 'linkedin' ? '💼' : '📘',
    color: account.platform === 'instagram' ? 'from-pink-500 to-orange-500' : 
           account.platform === 'youtube' ? 'from-red-500 to-red-700' : 
           account.platform === 'twitter' ? 'from-blue-400 to-blue-600' : 
           account.platform === 'linkedin' ? 'from-blue-700 to-blue-900' : 'from-blue-600 to-blue-700',
    followers: account.followersCount || account.followers || 0,
    engagement: account.engagementRate ? `${account.engagementRate.toFixed(1)}%` : '0%'
    reach: account.totalReach || 0
    posts: account.mediaCount || account.posts || 0,
    username: account.username
  })) || []

  // Calculate total metrics from real data
  const totalFollowers = analytics?.totalFollowers || connectedPlatforms.reduce((sum, platform) => sum + platform.followers, 0)
  const totalReach = analytics?.totalReach || connectedPlatforms.reduce((sum, platform) => sum + platform.reach, 0)
  const avgEngagement = analytics?.engagementRate || 0
  const totalPosts = analytics?.totalPosts || connectedPlatforms.reduce((sum, platform) => sum + platform.posts, 0)

  // Format numbers for display
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <Card data-testid="performance-score" className="border-gray-200/50 bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border-0 rounded-3xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div className="flex items-center space-x-3">
          <CardTitle className="text-xl font-bold text-gray-900">Performance Overview</CardTitle>
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
        </div>
        <Button variant="outline" size="sm" className="btn-secondary rounded-xl px-6 font-semibold">
          View Details
        </Button>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Connected Platforms Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-bold text-gray-900">Connected Platforms</h3>
            <div className="flex items-center space-x-2">
              {connectedPlatforms.map((platform, idx) => (
                <div key={platform.name} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                  {platform.logo}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>{connectedPlatforms.length} Active</span>
          </div>
        </div>

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Total Followers */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-2 right-2 opacity-20">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="relative z-10">
              <div className="text-2xl font-bold text-blue-600 mb-1">{formatNumber(totalFollowers)}</div>
              <div className="text-xs text-gray-600 font-medium mb-2">Total Followers</div>
              <div className="w-full bg-white/60 rounded-full h-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full w-3/4 transition-all duration-1000"></div>
              </div>
            </div>
          </div>
          
          {/* Average Engagement */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-2 right-2 opacity-20">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <div className="relative z-10">
              <div className="text-2xl font-bold text-green-600 mb-1">{avgEngagement.toFixed(1)}%</div>
              <div className="text-xs text-gray-600 font-medium mb-2">Avg Engagement</div>
              <div className="w-full bg-white/60 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full w-4/5 transition-all duration-1000"></div>
              </div>
            </div>
          </div>
          
          {/* Total Reach */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-2 right-2 opacity-20">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <div className="relative z-10">
              <div className="text-2xl font-bold text-purple-600 mb-1">{formatNumber(totalReach)}</div>
              <div className="text-xs text-gray-600 font-medium mb-2">Total Reach</div>
              <div className="w-full bg-white/60 rounded-full h-1.5">
                <div className="bg-purple-500 h-1.5 rounded-full w-2/3 transition-all duration-1000"></div>
              </div>
            </div>
          </div>
          
          {/* Total Posts */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-2 right-2 opacity-20">
              <Share className="w-6 h-6 text-orange-600" />
            </div>
            <div className="relative z-10">
              <div className="text-2xl font-bold text-orange-600 mb-1">{totalPosts}</div>
              <div className="text-xs text-gray-600 font-medium mb-2">Total Posts</div>
              <div className="w-full bg-white/60 rounded-full h-1.5">
                <div className="bg-orange-500 h-1.5 rounded-full w-5/6 transition-all duration-1000"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Chart Section */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h4 className="text-lg font-bold text-gray-900 mb-6">Performance Breakdown</h4>
          
          {/* Real Platform Cards Grid - Dynamic Full Width */}
          <div className={`grid gap-4 mb-8 ${
            connectedPlatforms.length === 1 ? 'grid-cols-1' :
            connectedPlatforms.length === 2 ? 'grid-cols-2' :
            connectedPlatforms.length === 3 ? 'grid-cols-3' :
            connectedPlatforms.length === 4 ? 'grid-cols-2 lg:grid-cols-4' :
            connectedPlatforms.length === 5 ? 'grid-cols-2 lg:grid-cols-5' :
            'grid-cols-2 lg:grid-cols-6'
          }`}>
            {connectedPlatforms.map((platform) => (
              <div key={platform.name} className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors duration-200">
                <div className="w-10 h-10 rounded-full bg-white mx-auto mb-3 flex items-center justify-center text-lg shadow-sm">
                  {platform.logo}
                </div>
                <div className="text-sm font-medium text-gray-700 mb-2">{platform.name}</div>
                <div className="space-y-1">
                  <div className="text-lg font-bold text-gray-900">{formatNumber(platform.followers)}</div>
                  <div className="text-xs text-gray-500">Followers</div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-sm font-semibold text-gray-700">{platform.engagement}</div>
                  <div className="text-xs text-gray-500">Engagement</div>
                </div>
              </div>
            ))}
          </div>

          {/* Show message if no connected platforms */}
          {connectedPlatforms.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No connected platforms found. Connect your social accounts to see performance metrics.</p>
            </div>
          )}

          {/* Detailed Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Best Performing Platform */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-sm font-semibold text-gray-700">Top Performer</h5>
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex items-center space-x-2 mb-2">
                {connectedPlatforms[0] && (
                  <>
                    <span className="text-lg">{connectedPlatforms[0].logo}</span>
                    <div className="text-xl font-bold text-blue-600">{connectedPlatforms[0].name}</div>
                  </>
                )}
                {!connectedPlatforms[0] && (
                  <div className="text-sm text-gray-400">No platform connected</div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Engagement Rate</span>
                  <span className="font-medium text-gray-700">{avgEngagement.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-white/60 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full w-5/6 transition-all duration-1000"></div>
                </div>
              </div>
            </div>

            {/* Content Performance */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-sm font-semibold text-gray-700">Content Score</h5>
                <Sparkles className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-2">{connectedPlatforms.length > 0 ? '8.7/10' : '0/10'}</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Quality Rating</span>
                  <span className="font-medium text-gray-700">{connectedPlatforms.length > 0 ? 'Excellent' : 'No Data'}</span>
                </div>
                <div className="w-full bg-white/60 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full w-4/5 transition-all duration-1000"></div>
                </div>
              </div>
            </div>

            {/* Posting Frequency */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-sm font-semibold text-gray-700">Post Frequency</h5>
                <MessageCircle className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-2">{totalPosts}</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Total Posts</span>
                  <span className="font-medium text-gray-700">All Time</span>
                </div>
                <div className="w-full bg-white/60 rounded-full h-1.5">
                  <div className="bg-purple-500 h-1.5 rounded-full w-3/4 transition-all duration-1000"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}