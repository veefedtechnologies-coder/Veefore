import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  X,
  Check,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  User,
  Plus
} from 'lucide-react'
import { apiRequest } from '@/lib/queryClient'

interface SocialAccount {
  id: string
  username: string
  platform: string
  profilePictureUrl?: string
  followers?: number
}

interface ScheduledPost {
  id: string
  content: string
  mediaUrl?: string
  platform: string
  scheduledTime: string
}

export default function Automation() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedAccount, setSelectedAccount] = useState('')
  const [selectedPost, setSelectedPost] = useState('')
  const [keyword, setKeyword] = useState('')
  const [dmResponse, setDmResponse] = useState('')
  const [showModal, setShowModal] = useState(true)

  // Fetch social accounts
  const { data: socialAccounts = [] } = useQuery<SocialAccount[]>({
    queryKey: ['/api/social-accounts'],
    queryFn: () => apiRequest('/api/social-accounts')
  })

  // Fetch scheduled posts for selected account
  const { data: scheduledPosts = [] } = useQuery<ScheduledPost[]>({
    queryKey: ['/api/scheduled-posts', selectedAccount],
    queryFn: () => apiRequest(`/api/scheduled-posts?accountId=${selectedAccount}`),
    enabled: !!selectedAccount
  })

  const instagramAccounts = socialAccounts.filter(account => account.platform === 'instagram')

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSaveAutomation = () => {
    // Save automation logic here
    console.log('Saving automation:', {
      account: selectedAccount,
      post: selectedPost,
      keyword,
      response: dmResponse
    })
    setShowModal(false)
    setCurrentStep(1)
    setSelectedAccount('')
    setSelectedPost('')
    setKeyword('')
    setDmResponse('')
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-pink-500 rounded-full flex items-center justify-center">
                  <Check className="w-2 h-2 text-white" />
                </div>
                <div className="w-12 h-px bg-gray-200"></div>
                <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                <div className="w-12 h-px bg-gray-200"></div>
                <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                <div className="w-12 h-px bg-gray-200"></div>
                <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <span className="text-pink-500 font-medium">Select a post</span>
                <span>Comment replies</span>
                <span>Direct message</span>
                <span>Review and save</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Create a DM automation</h3>
              <p className="text-gray-600 text-sm">
                Invite people to use a specific keyword in the comments of an Instagram Post or Reel,
                and automatically reply to their comment and send them a direct message.
              </p>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Social account</label>
                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {instagramAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        @{account.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Select a scheduled post or reel</label>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <p className="font-medium text-blue-800">No scheduled posts</p>
                      <p className="text-sm text-blue-600">There are no posts scheduled for the social account you've selected</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <div className="w-12 h-px bg-pink-500"></div>
                <div className="w-3 h-3 bg-pink-500 rounded-full flex items-center justify-center">
                  <Check className="w-2 h-2 text-white" />
                </div>
                <div className="w-12 h-px bg-gray-200"></div>
                <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                <div className="w-12 h-px bg-gray-200"></div>
                <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Comment replies</h3>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Keyword</label>
                <p className="text-sm text-gray-600">
                  When a user includes this keyword in a comment it will trigger a reply to their comment and a DM.
                </p>
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Your keyword"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <div className="w-12 h-px bg-pink-500"></div>
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <div className="w-12 h-px bg-pink-500"></div>
                <div className="w-3 h-3 bg-pink-500 rounded-full flex items-center justify-center">
                  <Check className="w-2 h-2 text-white" />
                </div>
                <div className="w-12 h-px bg-gray-200"></div>
                <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Direct message</h3>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Message content</label>
                <textarea
                  value={dmResponse}
                  onChange={(e) => setDmResponse(e.target.value)}
                  placeholder="Type your direct message here..."
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
            </div>
          </div>
        )
      
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <div className="w-12 h-px bg-pink-500"></div>
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <div className="w-12 h-px bg-pink-500"></div>
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <div className="w-12 h-px bg-pink-500"></div>
                <div className="w-3 h-3 bg-pink-500 rounded-full flex items-center justify-center">
                  <Check className="w-2 h-2 text-white" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Review and save</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">Account: </span>
                  <span className="text-sm text-gray-600">
                    @{instagramAccounts.find(acc => acc.id === selectedAccount)?.username || 'Not selected'}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Keyword: </span>
                  <span className="text-sm text-gray-600">{keyword || 'Not set'}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">DM Response: </span>
                  <span className="text-sm text-gray-600">{dmResponse || 'Not set'}</span>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  const InstagramPreview = () => {
    const selectedAccountData = instagramAccounts.find(acc => acc.id === selectedAccount)
    
    return (
      <div className="bg-gray-100 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-pink-500 font-medium text-sm">🔴 Instagram post and keyword</h4>
          <MoreHorizontal className="w-4 h-4 text-gray-500" />
        </div>
        
        <div className="bg-white rounded-lg p-4 max-w-sm mx-auto">
          {/* Post Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                {selectedAccountData?.profilePictureUrl ? (
                  <img 
                    src={selectedAccountData.profilePictureUrl} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-gray-600" />
                )}
              </div>
              <span className="font-medium text-sm">
                {selectedAccountData ? `@${selectedAccountData.username}` : 'Your account'}
              </span>
            </div>
            <MoreHorizontal className="w-4 h-4 text-gray-500" />
          </div>

          {/* Post Image Placeholder */}
          <div className="bg-gray-200 aspect-square rounded-lg mb-3 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center">
                📷
              </div>
              <p className="text-xs">Post content</p>
            </div>
          </div>

          {/* Post Actions */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <Heart className="w-6 h-6 text-gray-600" />
              <MessageCircle className="w-6 h-6 text-gray-600" />
              <Send className="w-6 h-6 text-gray-600" />
            </div>
            <Bookmark className="w-6 h-6 text-gray-600" />
          </div>

          {/* Comment Section */}
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium">username</span>
                <p className="text-sm text-gray-600">{keyword || 'Your keyword'}</p>
                <button className="text-xs text-gray-500 mt-1">Reply</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!showModal) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Automation</h1>
            <Button onClick={() => setShowModal(true)} className="bg-blue-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Automation
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                ⚡
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No automations yet</h3>
              <p className="text-gray-600 mb-6">Create your first automation to automatically respond to comments and send direct messages.</p>
              <Button onClick={() => setShowModal(true)} className="bg-blue-600 text-white">
                Create Your First Automation
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <div className="flex h-full">
            {/* Left Side - Form */}
            <div className="flex-1 p-6">
              <DialogHeader className="mb-6">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl font-semibold">DM automation</DialogTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </DialogHeader>

              {renderStepContent()}

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="text-gray-600"
                >
                  Back
                </Button>
                
                {currentStep < 4 ? (
                  <Button 
                    onClick={handleContinue}
                    disabled={
                      (currentStep === 1 && !selectedAccount) ||
                      (currentStep === 2 && !keyword) ||
                      (currentStep === 3 && !dmResponse)
                    }
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Continue
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSaveAutomation}
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Save Automation
                  </Button>
                )}
              </div>
            </div>

            {/* Right Side - Preview */}
            <div className="w-96 bg-gray-50 p-6 border-l">
              <InstagramPreview />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}