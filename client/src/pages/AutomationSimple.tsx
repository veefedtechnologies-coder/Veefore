import { useState } from 'react'
import { SEO, seoConfig, generateStructuredData } from '@/lib/seo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
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
  Plus,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  User
} from 'lucide-react'

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
  platform: string
  contentType: string
  automationType: string
  status: 'active' | 'paused' | 'draft'
  triggers: number
  created: string
}

export default function AutomationSimple() {
  return (
    <>
      <SEO 
        {...seoConfig.automation}
        structuredData={generateStructuredData.softwareApplication()}
      />
      <AutomationSimpleContent />
    </>
  )
}

function AutomationSimpleContent() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [selectedContentType, setSelectedContentType] = useState('')
  const [selectedAutomationType, setSelectedAutomationType] = useState('')
  const [automationName, setAutomationName] = useState('')
  const [activeRules, setActiveRules] = useState<AutomationRule[]>([])

  const steps = [
    { number: 1, title: 'Choose Platform', description: 'Select social media platform' },
    { number: 2, title: 'Content Type', description: 'Choose content type to automate' },
    { number: 3, title: 'Automation Type', description: 'Select automation behavior' },
    { number: 4, title: 'Configure Rules', description: 'Set up automation rules' },
    { number: 5, title: 'Test & Deploy', description: 'Test and activate automation' }
  ]

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-pink-500' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'bg-red-500' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-blue-400' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' }
  ]

  const contentTypes = {
    instagram: ['Posts', 'Stories', 'Reels', 'Comments'],
    youtube: ['Videos', 'Comments', 'Community Posts'],
    facebook: ['Posts', 'Comments', 'Stories'],
    twitter: ['Tweets', 'Replies', 'Mentions'],
    linkedin: ['Posts', 'Comments', 'Articles']
  }

  const automationTypes = [
    { id: 'comment-to-dm', name: 'Comment to DM', description: 'Send DM when someone comments' },
    { id: 'keyword-response', name: 'Keyword Response', description: 'Reply to specific keywords' },
    { id: 'engagement-boost', name: 'Engagement Boost', description: 'Auto-engage with content' },
    { id: 'lead-capture', name: 'Lead Capture', description: 'Capture leads from interactions' }
  ]

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Platform</h2>
              <p className="text-gray-600">Select the social media platform you want to automate</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {platforms.map((platform) => {
                const Icon = platform.icon
                return (
                  <Card 
                    key={platform.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedPlatform === platform.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedPlatform(platform.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 rounded-full ${platform.color} flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">Automate {platform.name} interactions</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Content Type</h2>
              <p className="text-gray-600">Choose what type of content to automate</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {contentTypes[selectedPlatform as keyof typeof contentTypes]?.map((type) => (
                <Card 
                  key={type}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedContentType === type ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedContentType(type)}
                >
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold text-gray-900">{type}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Automation Type</h2>
              <p className="text-gray-600">Select how you want to automate interactions</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {automationTypes.map((type) => (
                <Card 
                  key={type.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedAutomationType === type.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedAutomationType(type.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Bot className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">{type.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure Rules</h2>
              <p className="text-gray-600">Set up your automation rules and triggers</p>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Automation Name
                    </label>
                    <input
                      type="text"
                      value={automationName}
                      onChange={(e) => setAutomationName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter automation name"
                    />
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Configuration Summary</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>Platform: {selectedPlatform}</li>
                      <li>Content Type: {selectedContentType}</li>
                      <li>Automation: {selectedAutomationType}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Test & Deploy</h2>
              <p className="text-gray-600">Review and activate your automation</p>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Deploy</h3>
                  <p className="text-gray-600 mb-6">Your automation is configured and ready to go live</p>
                  
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Play className="w-4 h-4 mr-2" />
                    Activate Automation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Automation Studio</h1>
          <p className="text-xl text-gray-600">Create powerful social media automations</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step.number 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">{step.title}</div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-gray-400 mx-4" />
                )}
              </div>
            ))}
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Button 
            onClick={nextStep}
            disabled={currentStep === steps.length}
          >
            {currentStep === steps.length ? 'Complete' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}