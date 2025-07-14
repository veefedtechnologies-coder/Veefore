import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  Instagram,
  Zap,
  Settings,
  Play,
  Pause,
  Edit3,
  Trash2
} from 'lucide-react'
import { apiRequest } from '@/lib/queryClient'

interface SocialAccount {
  id: string
  username: string
  platform: string
  profilePictureUrl?: string
  followers?: number
}

interface AutomationRule {
  id: string
  name: string
  account: string
  keyword: string
  response: string
  status: 'active' | 'paused' | 'draft'
  triggers: number
  created: string
}

export default function Automation() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedAccount, setSelectedAccount] = useState('')
  const [automationName, setAutomationName] = useState('')
  const [keyword, setKeyword] = useState('')
  const [commentReply, setCommentReply] = useState('')
  const [dmMessage, setDmMessage] = useState('')
  const [activeTab, setActiveTab] = useState('create')

  // Fetch social accounts
  const { data: socialAccounts = [] } = useQuery<SocialAccount[]>({
    queryKey: ['/api/social-accounts'],
    queryFn: () => apiRequest('/api/social-accounts')
  })

  const instagramAccounts = socialAccounts.filter(account => account.platform === 'instagram')

  // Mock automation rules for demo
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Lead Generation DM',
      account: '@rahulc1020',
      keyword: 'interested',
      response: 'Thanks for your interest! Check your DMs for more info.',
      status: 'active',
      triggers: 47,
      created: '2024-01-15'
    },
    {
      id: '2',
      name: 'Product Demo Request',
      account: '@rahulc1020',
      keyword: 'demo',
      response: 'Hi! I\'d love to show you a demo. DMing you now!',
      status: 'active',
      triggers: 23,
      created: '2024-01-10'
    }
  ])

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCreateAutomation = () => {
    const newRule: AutomationRule = {
      id: Date.now().toString(),
      name: automationName || `${keyword} Automation`,
      account: instagramAccounts.find(acc => acc.id === selectedAccount)?.username || '',
      keyword,
      response: dmMessage,
      status: 'active',
      triggers: 0,
      created: new Date().toISOString().split('T')[0]
    }
    setAutomationRules([...automationRules, newRule])
    
    // Reset form
    setCurrentStep(1)
    setSelectedAccount('')
    setAutomationName('')
    setKeyword('')
    setCommentReply('')
    setDmMessage('')
    setActiveTab('manage')
  }

  const InstagramPreview = () => {
    const selectedAccountData = instagramAccounts.find(acc => acc.id === selectedAccount)
    
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <h4 className="font-semibold text-gray-800">Live Preview</h4>
            <Badge variant="secondary" className="text-xs">Instagram</Badge>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm max-w-sm mx-auto overflow-hidden">
            {/* Post Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                  {selectedAccountData?.profilePictureUrl ? (
                    <img 
                      src={selectedAccountData.profilePictureUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-sm">
                    {selectedAccountData ? selectedAccountData.username : 'your_account'}
                  </div>
                  <div className="text-xs text-gray-500">2 hours ago</div>
                </div>
              </div>
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </div>

            {/* Post Image */}
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 aspect-square flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center backdrop-blur-sm">
                  <Instagram className="w-8 h-8" />
                </div>
                <p className="text-sm font-medium">Your Post Content</p>
                <p className="text-xs opacity-75">Image or Video</p>
              </div>
            </div>

            {/* Post Actions */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <Heart className="w-6 h-6 text-gray-700" />
                  <MessageCircle className="w-6 h-6 text-gray-700" />
                  <Send className="w-6 h-6 text-gray-700" />
                </div>
                <Bookmark className="w-6 h-6 text-gray-700" />
              </div>

              <div className="text-sm text-gray-700 mb-2">
                <span className="font-semibold">124 likes</span>
              </div>

              {/* Comments Section */}
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="font-semibold">{selectedAccountData?.username || 'your_account'}</span>
                  <span className="ml-2 text-gray-700">Check out this amazing content! What do you think?</span>
                </div>
                
                {/* User Comment with Keyword */}
                {keyword && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm">
                          <span className="font-semibold text-gray-800">user_123</span>
                          <span className="ml-2 text-gray-700">{keyword}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">2m ago</div>
                        
                        {/* Auto Reply */}
                        {commentReply && (
                          <div className="mt-2 pl-4 border-l-2 border-gray-200">
                            <div className="text-xs">
                              <span className="font-semibold text-blue-600">{selectedAccountData?.username || 'your_account'}</span>
                              <span className="ml-2 text-gray-600">{commentReply}</span>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">Auto-reply • Just now</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* DM Preview */}
        {dmMessage && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-gray-800">Direct Message Preview</h4>
            </div>
            
            <div className="bg-white rounded-lg p-4 max-w-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                  {selectedAccountData?.profilePictureUrl ? (
                    <img 
                      src={selectedAccountData.profilePictureUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="font-semibold text-sm">
                  {selectedAccountData?.username || 'your_account'}
                </div>
              </div>
              
              <div className="bg-blue-500 text-white rounded-2xl rounded-bl-md p-3 text-sm">
                {dmMessage}
              </div>
              <div className="text-xs text-gray-400 mt-1">Auto-sent • Just now</div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const CreateAutomationForm = () => (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {step < currentStep ? <Check className="w-4 h-4" /> : step}
              </div>
              {step < 4 && (
                <div className={`w-12 h-1 rounded-full mx-2 ${
                  step < currentStep ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <Badge variant="outline" className="text-xs">
          Step {currentStep} of 4
        </Badge>
      </div>

      {/* Step Content */}
      <div className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Setup Your Automation</h3>
              <p className="text-gray-600">Choose your Instagram account and give your automation a name.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Automation Name</label>
                <Input
                  value={automationName}
                  onChange={(e) => setAutomationName(e.target.value)}
                  placeholder="e.g., Lead Generation Campaign"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Account</label>
                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your Instagram account" />
                  </SelectTrigger>
                  <SelectContent>
                    {instagramAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        <div className="flex items-center gap-2">
                          <Instagram className="w-4 h-4 text-pink-500" />
                          @{account.username}
                          <Badge variant="secondary" className="text-xs">{account.followers} followers</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Trigger Keyword</h3>
              <p className="text-gray-600">Set the keyword that will trigger your automation when users comment.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Keyword or Phrase</label>
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g., interested, info, demo"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                When someone comments this keyword, the automation will trigger
              </p>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Comment Reply</h3>
              <p className="text-gray-600">Set up an automatic reply to the user's comment.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Auto-Reply Message</label>
              <textarea
                value={commentReply}
                onChange={(e) => setCommentReply(e.target.value)}
                placeholder="Thanks for your interest! Check your DMs for more info."
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                This will be posted as a public reply to their comment
              </p>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Direct Message</h3>
              <p className="text-gray-600">Set up the private message that will be sent automatically.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">DM Message</label>
              <textarea
                value={dmMessage}
                onChange={(e) => setDmMessage(e.target.value)}
                placeholder="Hi! Thanks for your interest. Here's the link to learn more: [your-link]"
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                This private message will be sent directly to the user
              </p>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Automation Summary</h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Name:</span> {automationName || 'Untitled Automation'}</div>
                <div><span className="font-medium">Account:</span> @{instagramAccounts.find(acc => acc.id === selectedAccount)?.username || 'None'}</div>
                <div><span className="font-medium">Trigger:</span> "{keyword}"</div>
                <div><span className="font-medium">Reply:</span> {commentReply || 'None'}</div>
                <div><span className="font-medium">DM:</span> {dmMessage || 'None'}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button 
          variant="outline" 
          onClick={handlePrevStep}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        
        {currentStep < 4 ? (
          <Button 
            onClick={handleNextStep}
            disabled={
              (currentStep === 1 && (!selectedAccount || !automationName)) ||
              (currentStep === 2 && !keyword) ||
              (currentStep === 3 && !commentReply) ||
              (currentStep === 4 && !dmMessage)
            }
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            Next Step
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={handleCreateAutomation}
            disabled={!selectedAccount || !keyword || !dmMessage}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white"
          >
            Create Automation
            <Check className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )

  const ManageAutomations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Your Automations</h3>
          <p className="text-gray-600">Manage and monitor your Instagram automation rules</p>
        </div>
        <Button 
          onClick={() => setActiveTab('create')}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Automation
        </Button>
      </div>

      <div className="grid gap-4">
        {automationRules.map((rule) => (
          <Card key={rule.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    rule.status === 'active' ? 'bg-green-500' : 
                    rule.status === 'paused' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`} />
                  
                  <div>
                    <h4 className="font-semibold text-gray-900">{rule.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span>{rule.account}</span>
                      <span>•</span>
                      <span>Keyword: "{rule.keyword}"</span>
                      <span>•</span>
                      <span>{rule.triggers} triggers</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={rule.status === 'active' ? 'default' : 'secondary'}>
                    {rule.status}
                  </Badge>
                  
                  <Button variant="ghost" size="sm">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    {rule.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {automationRules.length === 0 && (
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Zap className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No automations yet</h3>
            <p className="text-gray-600 mb-6">Create your first automation to automatically respond to comments and send DMs.</p>
            <Button 
              onClick={() => setActiveTab('create')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
              Create Your First Automation
            </Button>
          </Card>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Instagram Automation</h1>
          </div>
          <p className="text-gray-600">Automate your Instagram engagement with smart comment and DM responses</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'create'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Create Automation
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'manage'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Manage Automations
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Form */}
          <div className="lg:col-span-2">
            <Card className="h-fit">
              <CardContent className="p-8">
                {activeTab === 'create' ? <CreateAutomationForm /> : <ManageAutomations />}
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Preview */}
          {activeTab === 'create' && (
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <InstagramPreview />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}