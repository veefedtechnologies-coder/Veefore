import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
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
  ExternalLink
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
  platform: string
  contentType: string
  automationType: string
  status: 'active' | 'paused' | 'draft'
  triggers: number
  created: string
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

  // Fetch social accounts
  const { data: socialAccounts = [] } = useQuery<SocialAccount[]>({
    queryKey: ['/api/social-accounts'],
    queryFn: () => apiRequest('/api/social-accounts')
  })

  // Mock automation rules for demo
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Instagram Comment to DM',
      platform: 'instagram',
      contentType: 'post',
      automationType: 'comment_to_dm',
      status: 'active',
      triggers: 47,
      created: '2024-01-15'
    },
    {
      id: '2',
      name: 'YouTube Comment Reply',
      platform: 'youtube',
      contentType: 'video',
      automationType: 'comment',
      status: 'active',
      triggers: 23,
      created: '2024-01-10'
    }
  ])

  // Mock posts data
  const mockPosts = [
    {
      id: '1',
      platform: 'instagram',
      type: 'post',
      caption: 'Check out this amazing temple architecture! 🏛️',
      imageUrl: 'https://scontent-ord5-2.cdninstagram.com/v/t51.2885-15/518197946_17851891683491583_8375805412947027539_n.jpg?stp=dst-jpg_s206x206_tt6&_nc_cat=104&ccb=1-7&_nc_sid=bf7eb4&_nc_ohc=5fmMfKhBl70Q7kNvwGDVgVI&_nc_oc=AdkXqcr0xmMDOJfJXeAwxMZzaeLpPj9hLHYKbLF-gWIbzB_SGIf4Mkkef1xBVcFFb14&_nc_zt=24&_nc_ht=scontent-ord5-2.cdninstagram.com&edm=AP4hL3IEAAAA&_nc_gid=WzKD5_OcPvQLX0gzPWxugg&oh=00_AfTJ0uFZFnfGHK13auaSCgUiNeeY5codiHK9bW7I-gseFA&oe=687B1D79',
      username: 'rahulc1020',
      timeAgo: '2h',
      likes: 45,
      comments: 12,
      shares: 3
    }
  ]

  const platforms = [
    { value: 'instagram', label: 'Instagram', icon: Instagram },
    { value: 'youtube', label: 'YouTube', icon: Youtube },
    { value: 'facebook', label: 'Facebook', icon: Facebook },
    { value: 'twitter', label: 'Twitter', icon: Twitter },
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin }
  ]

  const getContentTypes = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return [
          { value: 'post', label: 'Post', icon: FileText },
          { value: 'story', label: 'Story', icon: Image },
          { value: 'reel', label: 'Reel', icon: Video }
        ]
      case 'youtube':
        return [
          { value: 'video', label: 'Video', icon: Video },
          { value: 'short', label: 'Short', icon: Camera }
        ]
      case 'facebook':
        return [
          { value: 'post', label: 'Post', icon: FileText },
          { value: 'story', label: 'Story', icon: Image },
          { value: 'video', label: 'Video', icon: Video }
        ]
      case 'twitter':
        return [
          { value: 'tweet', label: 'Tweet', icon: FileText },
          { value: 'thread', label: 'Thread', icon: FileText }
        ]
      case 'linkedin':
        return [
          { value: 'post', label: 'Post', icon: FileText },
          { value: 'article', label: 'Article', icon: FileText },
          { value: 'video', label: 'Video', icon: Video }
        ]
      default:
        return []
    }
  }

  const automationTypes = [
    { value: 'comment', label: 'Comment Automation', description: 'Automatically reply to comments' },
    { value: 'dm', label: 'DM Automation', description: 'Send direct messages automatically' },
    { value: 'comment_to_dm', label: 'Comment to DM Automation', description: 'Reply to comments then send DM' }
  ]

  const responseTypes = [
    { value: 'keyword', label: 'Keyword Based', description: 'Reply based on specific keywords' },
    { value: 'ai_based', label: 'AI Based Reply', description: 'Let AI generate responses automatically' }
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

  const handleCreateAutomation = () => {
    const newRule: AutomationRule = {
      id: Date.now().toString(),
      name: formData.name,
      platform: formData.platform,
      contentType: formData.contentType,
      automationType: formData.automationType,
      status: 'active',
      triggers: 0,
      created: new Date().toISOString().split('T')[0]
    }
    setAutomationRules([...automationRules, newRule])
    
    // Reset form
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
  }

  const InstagramPostPreview = () => {
    const selectedPost = mockPosts.find(p => p.id === formData.selectedPost)
    if (!selectedPost) return null

    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm mx-auto">
        <div className="p-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">R</span>
              </div>
              <div>
                <p className="font-semibold text-sm">{selectedPost.username}</p>
                <p className="text-xs text-gray-500">{selectedPost.timeAgo}</p>
              </div>
            </div>
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          <img 
            src={selectedPost.imageUrl} 
            alt="Post" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-3">
          <div className="flex justify-between items-center mb-2">
            <div className="flex space-x-4">
              <Heart className="w-6 h-6" />
              <MessageCircle className="w-6 h-6" />
              <Send className="w-6 h-6" />
            </div>
            <Bookmark className="w-6 h-6" />
          </div>
          
          <p className="text-sm font-semibold">{selectedPost.likes} likes</p>
          <p className="text-sm mt-1">
            <span className="font-semibold">{selectedPost.username}</span> {selectedPost.caption}
          </p>
          
          <div className="mt-2 text-xs text-gray-500">
            View all {selectedPost.comments} comments
          </div>
          
          {formData.automationType === 'comment' && formData.commentReplies.length > 0 && (
            <div className="mt-2 border-t pt-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">R</span>
                </div>
                <div>
                  <p className="text-xs"><span className="font-semibold">username</span></p>
                  <p className="text-xs text-gray-600">SCI</p>
                  <p className="text-xs text-blue-500">Reply</p>
                </div>
              </div>
              <div className="mt-1 ml-8">
                <p className="text-xs font-semibold">{selectedPost.username}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const InstagramDMPreview = () => {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm mx-auto">
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
        
        <div className="p-4 space-y-3">
          <div className="text-right">
            <div className="inline-block bg-gray-100 rounded-lg px-3 py-2 max-w-xs">
              <p className="text-sm">hi bro kaisa hai</p>
            </div>
          </div>
          
          {formData.dmMessage && (
            <div className="text-left">
              <div className="inline-block bg-blue-500 text-white rounded-lg px-3 py-2 max-w-xs">
                <p className="text-sm">{formData.dmMessage}</p>
              </div>
            </div>
          )}
          
          {formData.buttonText && (
            <div className="text-left">
              <div className="inline-block bg-gray-100 rounded-lg px-3 py-2 max-w-xs">
                <p className="text-sm text-blue-500 font-semibold">{formData.buttonText}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 bg-gray-100 rounded-full px-3 py-2">
              <p className="text-sm text-gray-500">Message...</p>
            </div>
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Camera className="w-4 h-4 text-gray-500" />
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Image className="w-4 h-4 text-gray-500" />
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Send className="w-4 h-4 text-gray-500" />
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
          <div className="space-y-6">
            <div>
              <Label htmlFor="automation-name" className="text-sm font-medium">Automation Name</Label>
              <Input
                id="automation-name"
                value={formData.name}
                onChange={(e) => updateFormData({ name: e.target.value })}
                placeholder="e.g., Lead Generation Campaign"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Social Media Platform</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {platforms.map((platform) => {
                  const Icon = platform.icon
                  return (
                    <div
                      key={platform.value}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        formData.platform === platform.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => updateFormData({ platform: platform.value, contentType: '' })}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{platform.label}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            
            {formData.platform && (
              <div>
                <Label className="text-sm font-medium">Content Type</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {getContentTypes(formData.platform).map((type) => {
                    const Icon = type.icon
                    return (
                      <div
                        key={type.value}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          formData.contentType === type.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => updateFormData({ contentType: type.value })}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{type.label}</span>
                        </div>
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
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium">Automation Type</Label>
              <div className="space-y-3 mt-2">
                {automationTypes.map((type) => (
                  <div
                    key={type.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.automationType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateFormData({ automationType: type.value })}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        formData.automationType === type.value ? 'bg-blue-500' : 'bg-gray-100'
                      }`}>
                        <Bot className={`w-5 h-5 ${
                          formData.automationType === type.value ? 'text-white' : 'text-gray-500'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{type.label}</p>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium">Select Post</Label>
              <div className="space-y-3 mt-2">
                {mockPosts.map((post) => (
                  <div
                    key={post.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.selectedPost === post.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateFormData({ selectedPost: post.id })}
                  >
                    <div className="flex items-center space-x-3">
                      <img 
                        src={post.imageUrl} 
                        alt="Post" 
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium">{post.caption}</p>
                        <p className="text-sm text-gray-600">@{post.username} • {post.timeAgo}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      
      case 4:
        if (formData.automationType === 'comment_to_dm') {
          return (
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium">Write comment replies</Label>
                <p className="text-sm text-gray-600 mt-1">
                  Write a few different possible responses, and we'll cycle through them so your responses seem more genuine and varied.
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Comment replies</Label>
                <div className="space-y-3 mt-2">
                  {formData.commentReplies.map((reply, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={reply}
                        onChange={(e) => {
                          const newReplies = [...formData.commentReplies]
                          newReplies[index] = e.target.value
                          updateFormData({ commentReplies: newReplies })
                        }}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCommentReply(reply)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <Input
                      value={newCommentReply}
                      onChange={(e) => setNewCommentReply(e.target.value)}
                      placeholder="Add another reply"
                      className="flex-1"
                    />
                    <Button onClick={addCommentReply} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Delay before comment</Label>
                <p className="text-sm text-gray-600 mt-1">
                  Adding a short delay before responding to comments helps your replies seem more thoughtful and authentic.
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <Input
                    type="number"
                    value={formData.delay}
                    onChange={(e) => updateFormData({ delay: parseInt(e.target.value) || 15 })}
                    className="w-20"
                  />
                  <Select value="minutes" onValueChange={() => {}}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minutes">Minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )
        } else {
          return (
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium">Response Type</Label>
                <div className="space-y-3 mt-2">
                  {responseTypes.map((type) => (
                    <div
                      key={type.value}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        formData.responseType === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => updateFormData({ responseType: type.value })}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          formData.responseType === type.value ? 'bg-blue-500' : 'bg-gray-100'
                        }`}>
                          <Bot className={`w-5 h-5 ${
                            formData.responseType === type.value ? 'text-white' : 'text-gray-500'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium">{type.label}</p>
                          <p className="text-sm text-gray-600">{type.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {formData.responseType === 'keyword' && (
                <>
                  <div>
                    <Label className="text-sm font-medium">Keywords</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex flex-wrap gap-2">
                        {formData.keywords.map((keyword) => (
                          <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                            {keyword}
                            <X 
                              className="w-3 h-3 cursor-pointer" 
                              onClick={() => removeKeyword(keyword)}
                            />
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          placeholder="Add keyword"
                          className="flex-1"
                        />
                        <Button onClick={addKeyword} variant="outline">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="reply-text" className="text-sm font-medium">Reply Text</Label>
                    <Textarea
                      id="reply-text"
                      value={formData.replyText}
                      onChange={(e) => updateFormData({ replyText: e.target.value })}
                      placeholder="Enter your reply message..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </>
              )}
              
              {formData.responseType === 'ai_based' && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-blue-500" />
                    <p className="text-sm font-medium text-blue-700">AI-Based Reply Enabled</p>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    AI will automatically generate contextual responses based on the comments.
                  </p>
                </div>
              )}
            </div>
          )
        }
      
      case 5:
        if (formData.automationType === 'comment_to_dm') {
          return (
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium">Write a direct message</Label>
                <p className="text-sm text-gray-600 mt-1">
                  Write the DM you want sent when users include your keyword when they comment on your post.
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Direct message</Label>
                <p className="text-sm text-gray-600 mt-1">
                  We'll send this DM to the user who included your keyword in their comment.
                </p>
                <Textarea
                  value={formData.dmMessage}
                  onChange={(e) => updateFormData({ dmMessage: e.target.value })}
                  placeholder="hi bro kaisa hai"
                  className="mt-2"
                  rows={3}
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">Button text</Label>
                <Input
                  value={formData.buttonText}
                  onChange={(e) => updateFormData({ buttonText: e.target.value })}
                  placeholder="see products"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">Website URL</Label>
                <Input
                  value={formData.websiteUrl}
                  onChange={(e) => updateFormData({ websiteUrl: e.target.value })}
                  placeholder="www.veefore.com"
                  className="mt-1"
                />
              </div>
            </div>
          )
        } else {
          return (
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium">Review & Save</Label>
                <p className="text-sm text-gray-600 mt-1">
                  Review your automation settings and save to activate.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Automation Name:</span>
                  <span className="text-sm font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Platform:</span>
                  <span className="text-sm font-medium capitalize">{formData.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Content Type:</span>
                  <span className="text-sm font-medium capitalize">{formData.contentType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Automation Type:</span>
                  <span className="text-sm font-medium capitalize">{formData.automationType.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Response Type:</span>
                  <span className="text-sm font-medium capitalize">{formData.responseType.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          )
        }
      
      case 6:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium">Review and save</Label>
              <p className="text-sm text-gray-600 mt-1">
                Review your automation settings and save to activate.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Automation Name:</span>
                <span className="text-sm font-medium">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Platform:</span>
                <span className="text-sm font-medium capitalize">{formData.platform}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Content Type:</span>
                <span className="text-sm font-medium capitalize">{formData.contentType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Automation Type:</span>
                <span className="text-sm font-medium capitalize">{formData.automationType.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Comment Replies:</span>
                <span className="text-sm font-medium">{formData.commentReplies.length} replies</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">DM Message:</span>
                <span className="text-sm font-medium">Configured</span>
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
        <div className="space-y-4">
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
      <div className="min-h-screen bg-gray-50">
        <div className="w-full p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Create Automation</h1>
            <p className="text-gray-600 mt-2">Set up automated responses for your social media platforms</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep} of {getTotalSteps()}: {getStepTitle(currentStep)}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((currentStep / getTotalSteps()) * 100)}% complete
              </span>
            </div>
            <Progress value={(currentStep / getTotalSteps()) * 100} className="h-2" />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{getStepTitle(currentStep)}</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderCreateAutomationStep()}
                  
                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8">
                    <Button
                      variant="outline"
                      onClick={handlePrevStep}
                      disabled={currentStep === 1}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    
                    {currentStep === getTotalSteps() ? (
                      <Button
                        onClick={handleCreateAutomation}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Create Automation
                        <CheckCircle className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNextStep}
                        disabled={!canProceedToNextStep()}
                        className="bg-blue-600 hover:bg-blue-700"
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
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {formData.automationType === 'comment_to_dm' && currentStep === 5 ? 
                      'Instagram direct message' : 
                      'Instagram post and keyword'
                    }
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
    <div className="min-h-screen bg-gray-50">
      <div className="w-full p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Automation</h1>
              <p className="text-gray-600 mt-2">Manage your automated responses and workflows</p>
            </div>
            <Button 
              onClick={() => setActiveTab('create')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Automation
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-6 border-b">
            <button
              className={`pb-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('create')}
            >
              Create New
            </button>
            <button
              className={`pb-3 px-1 border-b-2 font-medium text-sm ${
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
          {automationRules.map((rule) => (
            <Card key={rule.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{rule.name}</CardTitle>
                  <Badge variant={rule.status === 'active' ? 'default' : 'secondary'}>
                    {rule.status}
                  </Badge>
                </div>
                <CardDescription>
                  {rule.platform} • {rule.contentType} • {rule.automationType.replace('_', ' ')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Triggers:</span>
                    <span className="font-medium">{rule.triggers}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">{rule.created}</span>
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Button size="sm" variant="outline">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      {rule.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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