import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Sparkles, 
  Calendar, 
  BarChart3, 
  Users, 
  Target,
  Check,
  Play,
  Instagram,
  Twitter,
  Linkedin,
  MessageSquare,
  Bot
} from 'lucide-react'

interface WalkthroughModalProps {
  open: boolean
  onClose: () => void
  userName?: string
}

const walkthroughSteps = [
  {
    id: 1,
    title: "Welcome to VeeFore!",
    subtitle: "Your AI-Powered Social Media Command Center",
    description: "Get ready to revolutionize your social media presence with cutting-edge AI automation and intelligent content management.",
    icon: Sparkles,
    gradient: "from-purple-500 to-pink-500",
    features: [
      "AI-powered content creation",
      "Multi-platform management", 
      "Advanced analytics & insights",
      "Automated scheduling"
    ],
    visual: "welcome"
  },
  {
    id: 2,
    title: "AI Content Creation",
    subtitle: "Create engaging content in seconds",
    description: "Our advanced AI analyzes your brand voice and creates compelling posts, stories, and captions tailored to your audience across all platforms.",
    icon: Bot,
    gradient: "from-blue-500 to-cyan-500",
    features: [
      "GPT-4o powered content generation",
      "Brand voice consistency",
      "Multi-format content (posts, stories, videos)",
      "SEO-optimized captions"
    ],
    visual: "ai-content",
    demo: "Generate a post about productivity tips"
  },
  {
    id: 3,
    title: "Smart Scheduling",
    subtitle: "Post at the perfect time, automatically",
    description: "Let AI determine the optimal posting times for maximum engagement. Schedule weeks of content in advance and watch your audience grow.",
    icon: Calendar,
    gradient: "from-green-500 to-emerald-500",
    features: [
      "AI-optimized posting times",
      "Bulk scheduling & queues",
      "Cross-platform publishing",
      "Automatic timezone handling"
    ],
    visual: "scheduling",
    demo: "Schedule 10 posts across Instagram, Twitter & LinkedIn"
  },
  {
    id: 4,
    title: "Advanced Analytics",
    subtitle: "Data-driven growth insights",
    description: "Track performance across all platforms with real-time analytics. Get AI-powered recommendations to boost your engagement and reach.",
    icon: BarChart3,
    gradient: "from-orange-500 to-red-500",
    features: [
      "Real-time performance tracking",
      "Cross-platform analytics",
      "AI growth recommendations",
      "Competitor analysis"
    ],
    visual: "analytics",
    demo: "Your posts gained 2.3K impressions this week"
  },
  {
    id: 5,
    title: "Multi-Platform Management",
    subtitle: "One dashboard, all your social accounts",
    description: "Connect and manage Instagram, Twitter, LinkedIn, TikTok and more from a single powerful dashboard. Post everywhere with one click.",
    icon: Users,
    gradient: "from-indigo-500 to-purple-500",
    features: [
      "Connect multiple accounts",
      "Cross-platform posting",
      "Unified inbox management",
      "Brand consistency tools"
    ],
    visual: "platforms"
  },
  {
    id: 6,
    title: "You're All Set!",
    subtitle: "Ready to dominate social media",
    description: "Start creating amazing content with AI, schedule your posts, and watch your audience grow. VeeFore is your secret weapon for social media success.",
    icon: Target,
    gradient: "from-pink-500 to-rose-500",
    features: [
      "Start creating content with AI",
      "Schedule your first posts",
      "Connect your social accounts",
      "Track your growth"
    ],
    visual: "success",
    cta: "Create Your First Post"
  }
]

export default function WalkthroughModal({ open, onClose, userName }: WalkthroughModalProps) {
  console.log('🎯 WALKTHROUGH MODAL: Component rendering with open:', open, 'userName:', userName)
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const currentStepData = walkthroughSteps.find(step => step.id === currentStep)
  const totalSteps = walkthroughSteps.length

  // Auto-advance demo for certain steps
  useEffect(() => {
    if (isPlaying && currentStepData?.demo) {
      const timer = setTimeout(() => {
        setIsPlaying(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isPlaying, currentStepData])

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCompletedSteps(prev => [...prev, currentStep])
      setCurrentStep(prev => prev + 1)
    } else {
      onClose()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const skipWalkthrough = () => {
    onClose()
  }

  const playDemo = () => {
    setIsPlaying(true)
  }

  if (!open) {
    console.log('🎯 WALKTHROUGH MODAL: Open is false, not rendering')
    return null
  }

  if (!currentStepData) {
    console.log('🎯 WALKTHROUGH MODAL: No currentStepData found, returning null')
    return null
  }

  console.log('🎯 WALKTHROUGH MODAL: About to render dialog with step:', currentStep)

  const IconComponent = currentStepData.icon

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[600px] p-0 overflow-hidden border-0 bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="relative h-full flex flex-col">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
            data-testid="button-close-walkthrough"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>

          {/* Main Content */}
          <div className="flex-1 flex">
            {/* Left Side - Content */}
            <div className="flex-1 p-8 flex flex-col justify-center">
              <div className="space-y-6">
                {/* Step Indicator */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-purple-600">Step {currentStep} of {totalSteps}</span>
                </div>

                {/* Icon & Title */}
                <div className="space-y-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${currentStepData.gradient} flex items-center justify-center`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {currentStepData.title.replace('VeeFore', userName ? `VeeFore, ${userName}` : 'VeeFore')}
                    </h1>
                    <p className="text-lg text-gray-600">{currentStepData.subtitle}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 leading-relaxed">{currentStepData.description}</p>

                {/* Features List */}
                <div className="space-y-3">
                  {currentStepData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${currentStepData.gradient} flex items-center justify-center`}>
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Demo Button */}
                {currentStepData.demo && (
                  <button
                    onClick={playDemo}
                    className={`inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${currentStepData.gradient} hover:opacity-90 text-white rounded-lg font-medium transition-opacity`}
                    data-testid="button-play-demo"
                  >
                    <Play className="h-4 w-4" />
                    <span>Try Demo</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Side - Visual */}
            <div className="flex-1 p-8 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
              {currentStepData.visual === 'welcome' && (
                <div className="text-center space-y-8">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto animate-pulse">
                    <Sparkles className="h-24 w-24 text-white" />
                  </div>
                  <div className="space-y-4">
                    <div className="text-6xl">🎉</div>
                    <div className="text-xl font-semibold text-gray-900">Welcome to the future!</div>
                  </div>
                </div>
              )}

              {currentStepData.visual === 'ai-content' && (
                <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-sm font-medium text-gray-900">AI Content Generator</div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  </div>
                  <div className="text-sm text-gray-500">Generating content...</div>
                  {isPlaying && (
                    <div className="mt-2 text-xs text-green-600 animate-pulse">
                      {currentStepData.demo}
                    </div>
                  )}
                </div>
              )}

              {currentStepData.visual === 'scheduling' && (
                <div className="grid grid-cols-7 gap-2 bg-white rounded-xl shadow-lg p-6">
                  <div className="text-xs font-medium text-gray-500 text-center py-2">Su</div>
                  <div className="text-xs font-medium text-gray-500 text-center py-2">Mo</div>
                  <div className="text-xs font-medium text-gray-500 text-center py-2">Tu</div>
                  <div className="text-xs font-medium text-gray-500 text-center py-2">We</div>
                  <div className="text-xs font-medium text-gray-500 text-center py-2">Th</div>
                  <div className="text-xs font-medium text-gray-500 text-center py-2">Fr</div>
                  <div className="text-xs font-medium text-gray-500 text-center py-2">Sa</div>
                  {Array.from({ length: 35 }, (_, i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded text-xs flex items-center justify-center">
                      {Math.floor(Math.random() * 30) + 1}
                    </div>
                  ))}
                </div>
              )}

              {currentStepData.visual === 'analytics' && (
                <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6 space-y-4">
                  <div className="text-sm font-medium text-gray-900">Performance Overview</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">12.5K</div>
                      <div className="text-xs text-gray-500">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">8.2%</div>
                      <div className="text-xs text-gray-500">Engagement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">45</div>
                      <div className="text-xs text-gray-500">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">128K</div>
                      <div className="text-xs text-gray-500">Total Impressions</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">Total Impressions</div>
                  {isPlaying && (
                    <div className="mt-2 text-xs text-green-600 animate-pulse">
                      {currentStepData.demo}
                    </div>
                  )}
                </div>
              )}

              {currentStepData.visual === 'platforms' && (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'Instagram', icon: Instagram, color: 'bg-pink-500' },
                    { name: 'Twitter', icon: Twitter, color: 'bg-blue-500' },
                    { name: 'LinkedIn', icon: Linkedin, color: 'bg-indigo-500' },
                    { name: 'TikTok', icon: MessageSquare, color: 'bg-black' }
                  ].map((platform, index) => {
                    const IconComp = platform.icon
                    return (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                        <div className={`w-12 h-12 rounded-lg ${platform.color} flex items-center justify-center mb-3`}>
                          <IconComp className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{platform.name}</div>
                        <div className="text-xs text-green-600">✓ Connected</div>
                      </div>
                    )
                  })}
                </div>
              )}

              {currentStepData.visual === 'success' && (
                <div className="text-center space-y-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center mx-auto animate-bounce">
                    <Target className="h-16 w-16 text-white" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl">🎉</div>
                    <div className="text-lg font-semibold text-gray-900">Ready to grow!</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer - Navigation */}
          <div className="border-t border-gray-200 p-6 bg-white">
            <div className="flex items-center justify-between">
              {/* Left - Skip */}
              <button
                onClick={skipWalkthrough}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                data-testid="button-skip-walkthrough"
              >
                Skip tour
              </button>

              {/* Center - Dots */}
              <div className="flex items-center space-x-2">
                {walkthroughSteps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      step.id === currentStep
                        ? 'bg-purple-500 w-8'
                        : completedSteps.includes(step.id)
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                    data-testid={`dot-step-${step.id}`}
                  />
                ))}
              </div>

              {/* Right - Navigation */}
              <div className="flex items-center space-x-3">
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="px-4 py-2"
                    data-testid="button-previous"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                )}
                
                <Button
                  onClick={nextStep}
                  className={`px-6 py-2 bg-gradient-to-r ${currentStepData.gradient} hover:opacity-90 text-white border-0`}
                  data-testid="button-next"
                >
                  {currentStep === totalSteps ? (
                    currentStepData.cta || 'Get Started'
                  ) : (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { WalkthroughModal }