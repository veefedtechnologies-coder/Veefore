import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { MoreHorizontal, TrendingUp, Users, Eye, Heart, MessageCircle, Share, Plus } from 'lucide-react'

export function SocialAccounts() {
  const [selectedAccount, setSelectedAccount] = useState('instagram')

  const accounts = [
    {
      id: 'instagram',
      username: 'rahulc1020',
      platform: 'Instagram',
      avatar: 'R',
      followers: '2.3K',
      engagement: '4.2%',
      posts: 89,
      platformColor: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
      status: 'active',
      lastPost: '2 hours ago',
      growth: '+12%'
    },
    {
      id: 'meta',
      username: 'MetaTraq',
      platform: 'Facebook',
      avatar: 'M',
      followers: '1.8K',
      engagement: '3.7%',
      posts: 45,
      platformColor: 'from-blue-600 to-blue-700',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      status: 'active',
      lastPost: '1 day ago',
      growth: '+8%'
    }
  ]

  const currentAccount = accounts.find(acc => acc.id === selectedAccount)

  return (
    <Card className="bg-white shadow-lg border border-gray-200/50 overflow-hidden">
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
          <div className="flex space-x-2">
            {accounts.map((account) => (
              <button
                key={account.id}
                onClick={() => setSelectedAccount(account.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  selectedAccount === account.id 
                    ? 'bg-white shadow-md border-2 border-blue-200' 
                    : 'bg-white/60 hover:bg-white/80 border border-gray-200'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white bg-gradient-to-r ${account.platformColor}`}>
                  <span className="text-sm font-medium">{account.avatar}</span>
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">{account.username}</div>
                  <div className="text-xs text-gray-500">{account.platform}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Account Details */}
        {currentAccount && (
          <div className={`p-6 ${currentAccount.bgColor}`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-r ${currentAccount.platformColor} shadow-lg`}>
                  <span className="text-lg font-bold">{currentAccount.avatar}</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">{currentAccount.username}</div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      {currentAccount.status}
                    </Badge>
                    <span className="text-sm text-gray-600">Last post: {currentAccount.lastPost}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/50">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {currentAccount.growth}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{currentAccount.followers}</div>
                <div className="text-sm text-gray-600">Followers</div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/50">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{currentAccount.engagement}</div>
                <div className="text-sm text-gray-600">Engagement</div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/50">
                <div className="flex items-center mb-2">
                  <Eye className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{currentAccount.posts}</div>
                <div className="text-sm text-gray-600">Posts</div>
              </div>
            </div>

            {/* Engagement Progress */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/50 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Monthly engagement goal</span>
                <span className="text-sm text-gray-600">67%</span>
              </div>
              <Progress value={67} className="h-2" />
              <div className="text-xs text-gray-500 mt-2">Target: 5% average engagement rate</div>
            </div>
          </div>
        )}

        {/* Connect More Section */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Connect more accounts
          </Button>
        </div>

        {/* Most Engaging Post Preview */}
        <div className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Top performing post</h4>
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Summer vibes collection launch 🌸</div>
                <div className="text-xs text-gray-500">2 days ago</div>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>248</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>23</span>
              </div>
              <div className="flex items-center space-x-1">
                <Share className="w-4 h-4" />
                <span>12</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}