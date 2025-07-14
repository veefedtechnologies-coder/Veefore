import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Info, TrendingUp, Sparkles, Users, Heart, MessageCircle, Share, Eye } from 'lucide-react'

export function PerformanceScore() {
  // Mock data for connected social platforms
  const connectedPlatforms = [
    {
      name: 'Instagram',
      logo: '📷',
      color: 'from-pink-500 to-orange-500',
      followers: '2.4K',
      engagement: '8.2%',
      reach: '12.5K',
      posts: 45
    },
    {
      name: 'Twitter',
      logo: '🐦',
      color: 'from-blue-400 to-blue-600',
      followers: '1.8K',
      engagement: '5.7%',
      reach: '8.3K',
      posts: 32
    },
    {
      name: 'LinkedIn',
      logo: '💼',
      color: 'from-blue-700 to-blue-900',
      followers: '890',
      engagement: '12.1%',
      reach: '4.2K',
      posts: 18
    },
    {
      name: 'YouTube',
      logo: '🎥',
      color: 'from-red-500 to-red-700',
      followers: '567',
      engagement: '15.3%',
      reach: '2.8K',
      posts: 8
    }
  ]

  // Calculate total metrics
  const totalFollowers = connectedPlatforms.reduce((sum, platform) => {
    return sum + parseFloat(platform.followers.replace('K', '')) * 1000
  }, 0)

  const totalReach = connectedPlatforms.reduce((sum, platform) => {
    return sum + parseFloat(platform.reach.replace('K', '')) * 1000
  }, 0)

  const avgEngagement = connectedPlatforms.reduce((sum, platform) => {
    return sum + parseFloat(platform.engagement.replace('%', ''))
  }, 0) / connectedPlatforms.length

  const totalPosts = connectedPlatforms.reduce((sum, platform) => sum + platform.posts, 0)

  return (
    <Card className="border-gray-200/50 bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border-0 rounded-3xl overflow-hidden">
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
            <span>4 Active</span>
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
              <div className="text-2xl font-bold text-blue-600 mb-1">{Math.round(totalFollowers / 1000)}K</div>
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
              <div className="text-2xl font-bold text-purple-600 mb-1">{Math.round(totalReach / 1000)}K</div>
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
          
          {/* Platform Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { name: 'Instagram', followers: '2.4K', engagement: '8.2%', logo: '📷', color: 'slate-700' },
              { name: 'Twitter', followers: '1.8K', engagement: '5.7%', logo: '🐦', color: 'blue-600' },
              { name: 'LinkedIn', followers: '890', engagement: '12.1%', logo: '💼', color: 'indigo-600' },
              { name: 'YouTube', followers: '567', engagement: '15.3%', logo: '🎥', color: 'gray-600' }
            ].map((platform) => (
              <div key={platform.name} className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors duration-200">
                <div className="w-10 h-10 rounded-full bg-white mx-auto mb-3 flex items-center justify-center text-lg shadow-sm">
                  {platform.logo}
                </div>
                <div className="text-sm font-medium text-gray-700 mb-2">{platform.name}</div>
                <div className="space-y-1">
                  <div className="text-lg font-bold text-gray-900">{platform.followers}</div>
                  <div className="text-xs text-gray-500">Followers</div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-sm font-semibold text-gray-700">{platform.engagement}</div>
                  <div className="text-xs text-gray-500">Engagement</div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Best Performing Platform */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-sm font-semibold text-gray-700">Top Performer</h5>
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">🎥</span>
                <div className="text-xl font-bold text-blue-600">YouTube</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Engagement Rate</span>
                  <span className="font-medium text-gray-700">15.3%</span>
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
              <div className="text-2xl font-bold text-green-600 mb-2">8.7/10</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Quality Rating</span>
                  <span className="font-medium text-gray-700">Excellent</span>
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
                <Share className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-2">4.2</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Posts per week</span>
                  <span className="font-medium text-gray-700">Optimal</span>
                </div>
                <div className="w-full bg-white/60 rounded-full h-1.5">
                  <div className="bg-purple-500 h-1.5 rounded-full w-3/4 transition-all duration-1000"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Performance Insights */}
        <div className="bg-[#eb313bde] rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-bold text-xl mb-2">AI Performance Insights</div>
              <div className="text-blue-100">Cross-platform analytics summary</div>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/15 rounded-xl p-4 border border-white/20">
              <div className="text-sm text-blue-100 mb-1">Top Platform</div>
              <div className="font-bold flex items-center space-x-2">
                <span>🎥</span>
                <span>YouTube (15.3%)</span>
              </div>
            </div>
            <div className="bg-white/15 rounded-xl p-4 border border-white/20">
              <div className="text-sm text-blue-100 mb-1">Peak Time</div>
              <div className="font-bold">7-9 PM IST</div>
            </div>
            <div className="bg-white/15 rounded-xl p-4 border border-white/20">
              <div className="text-sm text-blue-100 mb-1">Growth Rate</div>
              <div className="font-bold">+12.3% this week</div>
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div className="text-sm text-gray-600 font-medium bg-gray-50 rounded-lg px-4 py-2 inline-block">
          Analytics for July 7-13, 2025
        </div>
      </CardContent>
    </Card>
  )
}