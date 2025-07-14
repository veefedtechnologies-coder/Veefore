import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Instagram, 
  MessageCircle, 
  MessageSquare, 
  Settings, 
  Eye,
  PlayCircle,
  Image,
  Film,
  MoreHorizontal,
  Heart,
  Share,
  Send,
  User
} from 'lucide-react'

interface AutomationRule {
  id: string
  platform: 'instagram' | 'facebook' | 'twitter'
  contentType: 'post' | 'story' | 'reel'
  trigger: 'comment' | 'dm' | 'mention'
  keywords: string[]
  response: string
  isActive: boolean
}

export default function Automation() {
  const [activeTab, setActiveTab] = useState('create')
  const [selectedPlatform, setSelectedPlatform] = useState<'instagram' | 'facebook' | 'twitter'>('instagram')
  const [selectedContentType, setSelectedContentType] = useState<'post' | 'story' | 'reel'>('post')
  const [selectedTrigger, setSelectedTrigger] = useState<'comment' | 'dm' | 'mention'>('comment')
  const [keywords, setKeywords] = useState<string[]>([''])
  const [response, setResponse] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([])

  const addKeyword = () => {
    setKeywords([...keywords, ''])
  }

  const updateKeyword = (index: number, value: string) => {
    const newKeywords = [...keywords]
    newKeywords[index] = value
    setKeywords(newKeywords)
  }

  const removeKeyword = (index: number) => {
    if (keywords.length > 1) {
      setKeywords(keywords.filter((_, i) => i !== index))
    }
  }

  const handlePreview = () => {
    setShowPreview(true)
  }

  const handleSaveRule = () => {
    const newRule: AutomationRule = {
      id: Date.now().toString(),
      platform: selectedPlatform,
      contentType: selectedContentType,
      trigger: selectedTrigger,
      keywords: keywords.filter(k => k.trim() !== ''),
      response,
      isActive: true
    }
    setAutomationRules([...automationRules, newRule])
    // Reset form
    setKeywords([''])
    setResponse('')
    setShowPreview(false)
  }

  const toggleRule = (id: string) => {
    setAutomationRules(rules => 
      rules.map(rule => 
        rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
      )
    )
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="w-4 h-4" />
      case 'facebook': return <div className="w-4 h-4 bg-blue-600 rounded" />
      case 'twitter': return <div className="w-4 h-4 bg-black rounded" />
      default: return <Instagram className="w-4 h-4" />
    }
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'post': return <Image className="w-4 h-4" />
      case 'story': return <PlayCircle className="w-4 h-4" />
      case 'reel': return <Film className="w-4 h-4" />
      default: return <Image className="w-4 h-4" />
    }
  }

  const PreviewModal = () => {
    if (!showPreview) return null

    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-sm w-full max-h-[90vh] overflow-y-auto">
          {/* Instagram Post Preview */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Instagram className="w-6 h-6 text-pink-500" />
                <h3 className="font-semibold">Instagram {selectedContentType} and keyword</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                ×
              </Button>
            </div>
            
            {/* Post Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <span className="font-medium text-sm">Your account</span>
              </div>
              <MoreHorizontal className="w-4 h-4 text-gray-600" />
            </div>

            {/* Post Image */}
            <div className="bg-gray-200 h-48 mb-3 rounded flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <Image className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">Post preview</p>
              </div>
            </div>

            {/* Post Actions */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <Heart className="w-6 h-6" />
                <MessageCircle className="w-6 h-6" />
                <Share className="w-6 h-6" />
              </div>
              <div className="w-6 h-6 border-2 border-black rounded" />
            </div>

            {/* Comment Section */}
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">username</span>
                    <Instagram className="w-3 h-3 text-pink-500" />
                  </div>
                  <p className="text-sm text-gray-600">
                    {keywords.filter(k => k.trim()).join(', ') || 'Your keyword'}
                  </p>
                  <p className="text-sm text-gray-900 mt-1">
                    {response || 'Reply'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Automation</h1>
        <p className="text-gray-600">Automate your social media interactions with smart responses</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Automation</TabsTrigger>
          <TabsTrigger value="manage">Manage Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuration Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Automation Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Platform Selection */}
                <div>
                  <Label htmlFor="platform">Social Platform</Label>
                  <Select value={selectedPlatform} onValueChange={(value: any) => setSelectedPlatform(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">
                        <div className="flex items-center gap-2">
                          <Instagram className="w-4 h-4" />
                          Instagram
                        </div>
                      </SelectItem>
                      <SelectItem value="facebook">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-blue-600 rounded" />
                          Facebook
                        </div>
                      </SelectItem>
                      <SelectItem value="twitter">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-black rounded" />
                          Twitter
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Content Type Selection */}
                <div>
                  <Label htmlFor="contentType">Content Type</Label>
                  <Select value={selectedContentType} onValueChange={(value: any) => setSelectedContentType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="post">
                        <div className="flex items-center gap-2">
                          <Image className="w-4 h-4" />
                          Post
                        </div>
                      </SelectItem>
                      <SelectItem value="story">
                        <div className="flex items-center gap-2">
                          <PlayCircle className="w-4 h-4" />
                          Story
                        </div>
                      </SelectItem>
                      <SelectItem value="reel">
                        <div className="flex items-center gap-2">
                          <Film className="w-4 h-4" />
                          Reel
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Trigger Selection */}
                <div>
                  <Label htmlFor="trigger">Automation Trigger</Label>
                  <Select value={selectedTrigger} onValueChange={(value: any) => setSelectedTrigger(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trigger" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comment">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" />
                          Comment
                        </div>
                      </SelectItem>
                      <SelectItem value="dm">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Direct Message
                        </div>
                      </SelectItem>
                      <SelectItem value="mention">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Mention
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Keywords */}
                <div>
                  <Label>Keywords/Phrases</Label>
                  <div className="space-y-2">
                    {keywords.map((keyword, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder="Enter keyword or phrase"
                          value={keyword}
                          onChange={(e) => updateKeyword(index, e.target.value)}
                        />
                        {keywords.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeKeyword(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" onClick={addKeyword} className="w-full">
                      Add Keyword
                    </Button>
                  </div>
                </div>

                {/* Response */}
                <div>
                  <Label htmlFor="response">Automated Response</Label>
                  <Textarea
                    id="response"
                    placeholder="Enter your automated response message..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button onClick={handlePreview} variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button onClick={handleSaveRule} className="flex-1">
                    Save Rule
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    {getPlatformIcon(selectedPlatform)}
                    <span className="font-medium capitalize">{selectedPlatform}</span>
                    <span className="text-gray-500">•</span>
                    {getContentTypeIcon(selectedContentType)}
                    <span className="text-gray-500 capitalize">{selectedContentType}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      <strong>Trigger:</strong> {selectedTrigger === 'comment' ? 'Comments' : selectedTrigger === 'dm' ? 'Direct Messages' : 'Mentions'}
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Keywords:</strong> {keywords.filter(k => k.trim()).join(', ') || 'No keywords set'}
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Response:</strong> {response || 'No response set'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Automation Rules</CardTitle>
            </CardHeader>
            <CardContent>
              {automationRules.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No automation rules created yet</p>
                  <p className="text-sm">Create your first rule to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {automationRules.map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getPlatformIcon(rule.platform)}
                        <div>
                          <div className="font-medium">
                            {rule.platform} {rule.contentType} {rule.trigger}
                          </div>
                          <div className="text-sm text-gray-600">
                            Keywords: {rule.keywords.join(', ')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={rule.isActive}
                          onCheckedChange={() => toggleRule(rule.id)}
                        />
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <PreviewModal />
    </div>
  )
}