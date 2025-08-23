import React, { useState, useEffect, useRef } from 'react'
import { X, ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Sparkles, Zap, BarChart3, Calendar, Users, Target, Star, ArrowRight, TrendingUp, Clock, Globe, Heart, MessageSquare, Share2, Eye, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

// Mock data for live demos
const mockPosts = [
  {
    id: 1,
    platform: 'instagram',
    content: 'Boost your productivity with AI! 🚀 #AI #Productivity',
    likes: 234,
    comments: 45,
    shares: 12,
    reach: 1250,
    time: '2h ago'
  },
  {
    id: 2,
    platform: 'twitter',
    content: 'Just launched our new feature! What do you think?',
    likes: 189,
    comments: 23,
    shares: 67,
    reach: 2100,
    time: '4h ago'
  }
]

const mockAnalytics = {
  followers: 12540,
  engagement: 4.2,
  reach: 45600,
  impressions: 89200
}

interface WalkthroughStep {
  id: number
  title: string
  subtitle: string
  description: string
  icon: React.ElementType
  gradient: string
  bgPattern: string
  demoComponent?: React.ComponentType<any>
  features: Array<{
    title: string
    description: string
    icon: React.ElementType
  }>
  tips: string[]
  nextAction?: string
}

// Live Demo Components
const QuickActionsDemo = () => {
  const [selectedAction, setSelectedAction] = useState(0)
  const actions = ['Create from scratch', 'Post across networks', 'AI-powered content', 'Trending topics']
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedAction(prev => (prev + 1) % actions.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 border border-blue-100 shadow-xl">
      <div className="text-center mb-4">
        <h4 className="font-bold text-gray-900 mb-2">Live Quick Actions</h4>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl transition-all duration-500 cursor-pointer ${
                selectedAction === index
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white scale-105 shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="text-sm font-medium">{action}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <Badge variant="secondary" className="bg-green-100 text-green-700">
          <CheckCircle className="w-3 h-3 mr-1" />
          Interactive Demo Running
        </Badge>
      </div>
    </div>
  )
}

const AnalyticsDemo = () => {
  const [animatedValues, setAnimatedValues] = useState({
    followers: 0,
    engagement: 0,
    reach: 0,
    impressions: 0
  })

  useEffect(() => {
    const animateValue = (key: string, target: number, duration: number) => {
      const startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeOut = 1 - Math.pow(1 - progress, 3)
        
        setAnimatedValues(prev => ({
          ...prev,
          [key]: Math.floor(target * easeOut)
        }))

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      animate()
    }

    setTimeout(() => animateValue('followers', mockAnalytics.followers, 2000), 200)
    setTimeout(() => animateValue('engagement', mockAnalytics.engagement * 10, 2000), 400)
    setTimeout(() => animateValue('reach', mockAnalytics.reach, 2000), 600)
    setTimeout(() => animateValue('impressions', mockAnalytics.impressions, 2000), 800)
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 rounded-2xl p-6 border border-indigo-100 shadow-xl">
      <h4 className="font-bold text-gray-900 mb-4 text-center">Live Analytics Dashboard</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Followers</p>
              <p className="text-2xl font-bold text-blue-600">{formatNumber(animatedValues.followers)}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
          <Progress value={(animatedValues.followers / mockAnalytics.followers) * 100} className="mt-2" />
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Engagement</p>
              <p className="text-2xl font-bold text-green-600">{(animatedValues.engagement / 10).toFixed(1)}%</p>
            </div>
            <Heart className="w-8 h-8 text-green-500" />
          </div>
          <Progress value={(animatedValues.engagement / (mockAnalytics.engagement * 10)) * 100} className="mt-2" />
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reach</p>
              <p className="text-2xl font-bold text-purple-600">{formatNumber(animatedValues.reach)}</p>
            </div>
            <Globe className="w-8 h-8 text-purple-500" />
          </div>
          <Progress value={(animatedValues.reach / mockAnalytics.reach) * 100} className="mt-2" />
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Impressions</p>
              <p className="text-2xl font-bold text-orange-600">{formatNumber(animatedValues.impressions)}</p>
            </div>
            <Eye className="w-8 h-8 text-orange-500" />
          </div>
          <Progress value={(animatedValues.impressions / mockAnalytics.impressions) * 100} className="mt-2" />
        </div>
      </div>
    </div>
  )
}

const PostSchedulerDemo = () => {
  const [currentWeek, setCurrentWeek] = useState(0)
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([])

  const weeks = ['This Week', 'Next Week', 'Week 3', 'Week 4']
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWeek(prev => (prev + 1) % weeks.length)
    }, 3000)

    // Simulate adding scheduled posts
    const postInterval = setInterval(() => {
      setScheduledPosts(prev => {
        if (prev.length >= 14) return []
        const newPost = {
          id: prev.length + 1,
          day: Math.floor(Math.random() * 7),
          time: `${9 + Math.floor(Math.random() * 8)}:00`,
          platform: ['instagram', 'twitter', 'facebook'][Math.floor(Math.random() * 3)],
          type: ['photo', 'video', 'story'][Math.floor(Math.random() * 3)]
        }
        return [...prev, newPost]
      })
    }, 1500)

    return () => {
      clearInterval(interval)
      clearInterval(postInterval)
    }
  }, [])

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-6 border border-emerald-100 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-gray-900">Smart Scheduler</h4>
        <Badge className="bg-emerald-500">{weeks[currentWeek]}</Badge>
      </div>
      
      <div className="grid grid-cols-7 gap-2 mb-4">
        {days.map((day, index) => (
          <div key={index} className="text-center">
            <div className="text-xs font-medium text-gray-600 mb-2">{day}</div>
            <div className="h-20 bg-white rounded-lg border border-gray-200 relative overflow-hidden">
              {scheduledPosts
                .filter(post => post.day === index)
                .slice(0, 3)
                .map((post, postIndex) => (
                  <div
                    key={post.id}
                    className={`absolute inset-x-1 h-3 rounded-sm text-xs flex items-center justify-center text-white font-medium ${
                      post.platform === 'instagram' ? 'bg-pink-500' :
                      post.platform === 'twitter' ? 'bg-blue-500' : 'bg-indigo-500'
                    }`}
                    style={{ top: `${4 + postIndex * 16}px` }}
                  >
                    {post.time}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-pink-500 rounded"></div>
          <span className="text-xs text-gray-600">Instagram</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-xs text-gray-600">Twitter</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-indigo-500 rounded"></div>
          <span className="text-xs text-gray-600">Facebook</span>
        </div>
      </div>
    </div>
  )
}

const SocialAccountsDemo = () => {
  const [connectedAccounts, setConnectedAccounts] = useState([
    { platform: 'instagram', connected: true, followers: 12540, growth: '+2.3%' },
    { platform: 'twitter', connected: true, followers: 8920, growth: '+1.8%' },
    { platform: 'facebook', connected: false, followers: 0, growth: '0%' },
    { platform: 'linkedin', connected: false, followers: 0, growth: '0%' }
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setConnectedAccounts(prev => 
        prev.map((account, index) => {
          if (index === 2 && !account.connected) { // Connect Facebook
            return { ...account, connected: true, followers: 5630, growth: '+4.1%' }
          }
          if (index === 3 && account.connected && prev[2].connected) { // Connect LinkedIn after Facebook
            return { ...account, connected: true, followers: 3280, growth: '+3.2%' }
          }
          if (account.connected) {
            return {
              ...account,
              followers: account.followers + Math.floor(Math.random() * 10),
            }
          }
          return account
        })
      )
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return '📷'
      case 'twitter': return '🐦'
      case 'facebook': return '👥'
      case 'linkedin': return '💼'
      default: return '🌐'
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'from-pink-500 to-orange-500'
      case 'twitter': return 'from-blue-400 to-blue-600'
      case 'facebook': return 'from-blue-600 to-indigo-600'
      case 'linkedin': return 'from-blue-700 to-blue-900'
      default: return 'from-gray-500 to-gray-700'
    }
  }

  return (
    <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 rounded-2xl p-6 border border-rose-100 shadow-xl">
      <h4 className="font-bold text-gray-900 mb-4 text-center">Connected Accounts</h4>
      <div className="space-y-3">
        {connectedAccounts.map((account, index) => (
          <div
            key={account.platform}
            className={`flex items-center justify-between p-4 rounded-xl transition-all duration-500 ${
              account.connected
                ? 'bg-white shadow-lg border border-green-100'
                : 'bg-gray-50 border border-gray-200 opacity-60'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${getPlatformColor(account.platform)} flex items-center justify-center text-white text-lg`}>
                {getPlatformIcon(account.platform)}
              </div>
              <div>
                <p className="font-medium text-gray-900 capitalize">{account.platform}</p>
                <p className="text-sm text-gray-500">
                  {account.connected ? `${account.followers.toLocaleString()} followers` : 'Not connected'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {account.connected && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {account.growth}
                </Badge>
              )}
              <div className={`w-3 h-3 rounded-full ${account.connected ? 'bg-green-500' : 'bg-gray-300'}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const AIRecommendationsDemo = () => {
  const [currentTip, setCurrentTip] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  const recommendations = [
    {
      title: "Peak Engagement Time",
      description: "Post between 2-4 PM for 23% higher engagement",
      impact: "High",
      color: "text-red-600 bg-red-50"
    },
    {
      title: "Hashtag Optimization", 
      description: "Use 8-12 hashtags with mix of trending & niche tags",
      impact: "Medium",
      color: "text-orange-600 bg-orange-50"
    },
    {
      title: "Content Format",
      description: "Video posts get 2.3x more engagement than images",
      impact: "High", 
      color: "text-green-600 bg-green-50"
    },
    {
      title: "Audience Insights",
      description: "Your audience is most active on weekends",
      impact: "Medium",
      color: "text-blue-600 bg-blue-50"
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnalyzing(true)
      setTimeout(() => {
        setCurrentTip(prev => (prev + 1) % recommendations.length)
        setIsAnalyzing(false)
      }, 1000)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 rounded-2xl p-6 border border-violet-100 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-gray-900">AI Insights</h4>
        <Badge className={`${isAnalyzing ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}>
          {isAnalyzing ? 'Analyzing...' : 'Live'}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className={`p-4 rounded-xl border-2 transition-all duration-500 ${recommendations[currentTip].color} border-current border-opacity-20`}>
          <div className="flex items-start justify-between mb-2">
            <h5 className="font-semibold">{recommendations[currentTip].title}</h5>
            <Badge variant="secondary" className={`${recommendations[currentTip].color} border-current`}>
              {recommendations[currentTip].impact}
            </Badge>
          </div>
          <p className="text-sm opacity-80">{recommendations[currentTip].description}</p>
        </div>

        <div className="flex justify-center space-x-2">
          {recommendations.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentTip ? 'bg-purple-500 w-6' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const walkthroughSteps: WalkthroughStep[] = [
  {
    id: 1,
    title: "Welcome to VeeFore",
    subtitle: "Your AI-Powered Social Media Command Center", 
    description: "Experience the future of social media management with our interactive demo. Watch as VeeFore transforms your content strategy with AI-powered insights, automated workflows, and real-time performance tracking.",
    icon: Sparkles,
    gradient: "from-purple-600 via-pink-600 to-blue-600",
    bgPattern: "bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100",
    features: [
      {
        title: "AI Content Generation",
        description: "Create engaging posts with AI that learns your brand voice",
        icon: Sparkles
      },
      {
        title: "Multi-Platform Publishing",
        description: "Post to all your social accounts simultaneously", 
        icon: Globe
      },
      {
        title: "Smart Analytics",
        description: "Get actionable insights to grow your audience",
        icon: BarChart3
      }
    ],
    tips: [
      "VeeFore increases social media ROI by an average of 340%",
      "Our AI analyzes 50M+ posts daily to optimize your content",
      "Save 15+ hours per week with automated workflows"
    ]
  },
  {
    id: 2,
    title: "Quick Actions Hub",
    subtitle: "Create Content in Seconds, Not Hours",
    description: "Watch our intelligent Quick Actions system in action. See how you can create professional content, schedule posts, and engage with trending topics - all powered by AI that adapts to your unique brand voice and audience preferences.",
    icon: Zap,
    gradient: "from-emerald-500 via-teal-600 to-blue-600", 
    bgPattern: "bg-gradient-to-br from-emerald-100 via-teal-50 to-blue-100",
    demoComponent: QuickActionsDemo,
    features: [
      {
        title: "Smart Templates",
        description: "AI-powered templates that adapt to your brand",
        icon: Zap
      },
      {
        title: "Trend Detection", 
        description: "Automatically discover and capitalize on trends",
        icon: TrendingUp
      },
      {
        title: "Brand Voice AI",
        description: "Maintains consistent brand voice across all content",
        icon: MessageSquare
      }
    ],
    tips: [
      "Create 10x more content in the same time",
      "AI learns from your best-performing posts", 
      "Templates automatically optimize for each platform"
    ]
  },
  {
    id: 3,
    title: "Live Performance Dashboard", 
    subtitle: "Real-Time Social Intelligence at Your Fingertips",
    description: "Experience our real-time analytics dashboard that transforms raw data into actionable insights. Watch as metrics update live, showing follower growth, engagement patterns, and performance trends across all your connected platforms.",
    icon: BarChart3,
    gradient: "from-blue-600 via-indigo-600 to-purple-600",
    bgPattern: "bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100", 
    demoComponent: AnalyticsDemo,
    features: [
      {
        title: "Real-Time Metrics",
        description: "Live updates every 30 seconds across all platforms",
        icon: Clock
      },
      {
        title: "Predictive Analytics",
        description: "AI forecasts your growth and engagement trends",
        icon: TrendingUp
      },
      {
        title: "Competitor Benchmarking",
        description: "Compare your performance against industry leaders",
        icon: Target
      }
    ],
    tips: [
      "Monitor performance across 15+ key metrics",
      "Get alerts when posts go viral",
      "AI identifies your best-performing content patterns"
    ]
  },
  {
    id: 4,
    title: "Unified Social Accounts",
    subtitle: "All Your Platforms, One Powerful Interface",
    description: "See how seamlessly you can manage multiple social media accounts from a single dashboard. Watch accounts connect automatically, sync in real-time, and maintain consistent branding across your entire social presence.",
    icon: Users,
    gradient: "from-pink-500 via-rose-500 to-orange-500",
    bgPattern: "bg-gradient-to-br from-pink-100 via-rose-50 to-orange-100",
    demoComponent: SocialAccountsDemo,
    features: [
      {
        title: "Auto-Sync Technology",
        description: "Real-time synchronization across all platforms",
        icon: RotateCcw
      },
      {
        title: "Health Monitoring",
        description: "Track account performance and connection status", 
        icon: Heart
      },
      {
        title: "Unified Analytics",
        description: "Combined insights across all your social accounts",
        icon: BarChart3
      }
    ],
    tips: [
      "Connect unlimited social accounts",
      "Automatic backup and sync every 15 minutes",
      "Cross-platform audience insights"
    ]
  },
  {
    id: 5,
    title: "Smart Content Scheduler", 
    subtitle: "Strategic Posting Made Effortless",
    description: "Experience our intelligent scheduling system that optimizes posting times for maximum engagement. Watch as the calendar fills with strategically planned content, automatically adjusted for different time zones and audience activity patterns.",
    icon: Calendar,
    gradient: "from-cyan-500 via-blue-500 to-indigo-600",
    bgPattern: "bg-gradient-to-br from-cyan-100 via-blue-50 to-indigo-100",
    demoComponent: PostSchedulerDemo,
    features: [
      {
        title: "AI-Powered Timing",
        description: "Automatically finds optimal posting times",
        icon: Clock
      },
      {
        title: "Visual Calendar",
        description: "Drag-and-drop scheduling with visual timeline",
        icon: Calendar
      },
      {
        title: "Bulk Operations", 
        description: "Schedule weeks of content in minutes",
        icon: Zap
      }
    ],
    tips: [
      "AI increases engagement by 45% through optimal timing",
      "Schedule up to 1000 posts in advance", 
      "Automatic timezone optimization for global audiences"
    ]
  },
  {
    id: 6,
    title: "AI-Powered Recommendations",
    subtitle: "Personalized Growth Insights That Drive Results", 
    description: "Watch our AI recommendation engine in action as it analyzes your performance data, competitor strategies, and industry trends to deliver personalized insights that accelerate your social media growth.",
    icon: Target,
    gradient: "from-violet-600 via-purple-600 to-pink-600",
    bgPattern: "bg-gradient-to-br from-violet-100 via-purple-50 to-pink-100",
    demoComponent: AIRecommendationsDemo,
    features: [
      {
        title: "Smart Suggestions",
        description: "AI-generated content ideas based on trends",
        icon: Sparkles
      },
      {
        title: "Performance Optimization",
        description: "Recommendations to improve engagement rates",
        icon: TrendingUp
      },
      {
        title: "Competitor Analysis",
        description: "Learn from successful competitors in your niche",
        icon: Target
      }
    ],
    tips: [
      "AI analyzes 100M+ posts to generate recommendations",
      "Get 5-10 personalized tips daily",
      "Average 67% improvement in engagement following tips"
    ]
  },
  {
    id: 7,
    title: "You're Ready to Dominate!",
    subtitle: "Your Social Media Success Story Starts Now",
    description: "Congratulations! You've experienced VeeFore's powerful features through our interactive demos. You're now equipped with AI-powered tools, real-time insights, and proven strategies to transform your social media presence and achieve unprecedented growth.",
    icon: Star,
    gradient: "from-yellow-400 via-orange-500 to-red-500", 
    bgPattern: "bg-gradient-to-br from-yellow-100 via-orange-50 to-red-100",
    features: [
      {
        title: "Complete Setup",
        description: "Your VeeFore dashboard is ready to use",
        icon: CheckCircle
      },
      {
        title: "AI Training Complete",
        description: "Your brand voice AI is calibrated and ready",
        icon: Sparkles
      },
      {
        title: "Growth Strategy Active",
        description: "Personalized growth plan is now running",
        icon: TrendingUp
      }
    ],
    tips: [
      "Your first AI-generated post is ready to publish",
      "Recommended posting schedule has been created",
      "Growth projections show 300%+ engagement increase"
    ],
    nextAction: "Launch Your First Campaign"
  }
]

interface InteractiveWalkthroughProps {
  isOpen: boolean
  onClose: () => void
  userData?: any
}

export function InteractiveWalkthrough({ isOpen, onClose, userData }: InteractiveWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isPlaying, setIsPlaying] = useState(true)
  
  const step = walkthroughSteps[currentStep]
  const progress = ((currentStep + 1) / walkthroughSteps.length) * 100
  const displayName = userData?.displayName || userData?.fullName || 'User'

  // Auto-advance steps
  useEffect(() => {
    if (!isPlaying || !isOpen) return
    
    const timer = setTimeout(() => {
      if (currentStep < walkthroughSteps.length - 1) {
        nextStep()
      }
    }, 8000) // 8 seconds per step

    return () => clearTimeout(timer)
  }, [currentStep, isPlaying, isOpen])

  const goToStep = (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= walkthroughSteps.length) return
    
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentStep(stepIndex)
      if (stepIndex > currentStep && !completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep])
      }
      setIsAnimating(false)
    }, 300)
  }

  const nextStep = () => goToStep(currentStep + 1)
  const prevStep = () => goToStep(currentStep - 1)

  const handleClose = () => {
    setIsAnimating(true)
    setTimeout(() => {
      onClose()
      setTimeout(() => {
        setCurrentStep(0)
        setCompletedSteps([])
        setIsAnimating(false)
        setIsPlaying(true)
      }, 500)
    }, 300)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-2">
      <div className={`bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden transform transition-all duration-500 ${isAnimating ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}`}>
        
        {/* Header */}
        <div className={`relative p-6 ${step.bgPattern} border-b border-gray-100`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-3xl bg-gradient-to-r ${step.gradient} flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300`}>
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{step.title}</h1>
                <p className="text-lg text-gray-600">{step.subtitle}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
                className="rounded-full hover:bg-white/70"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Badge variant="secondary" className="bg-white/70 text-gray-700">
                {currentStep + 1} / {walkthroughSteps.length}
              </Badge>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleClose}
                className="hover:bg-red-100 hover:text-red-600 rounded-full"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="relative">
            <div className="w-full bg-white/60 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className={`h-full bg-gradient-to-r ${step.gradient} transition-all duration-1000 ease-out rounded-full relative`}
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              </div>
            </div>
            <div className="flex justify-between mt-2">
              {walkthroughSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToStep(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentStep 
                      ? `bg-gradient-to-r ${step.gradient} scale-125 shadow-lg` 
                      : completedSteps.includes(index)
                      ? 'bg-green-500 scale-110'
                      : 'bg-white/70 hover:bg-white/90 hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="p-8 max-h-[65vh] overflow-y-auto">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            
            {/* Left Column - Content */}
            <div className="space-y-8">
              {/* Description with better typography */}
              <div className="prose prose-lg">
                <p className="text-xl leading-relaxed text-gray-700 mb-8 font-medium">
                  {step.description}
                </p>
              </div>

              {/* Enhanced Features List */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Sparkles className="w-6 h-6 mr-3 text-purple-500" />
                  Key Features
                </h3>
                {step.features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="flex items-start space-x-4 p-5 rounded-2xl bg-gradient-to-r from-white via-gray-50/50 to-blue-50/30 border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${step.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-purple-700 transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pro Tips Section */}
              <div className="bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 border border-yellow-200 rounded-3xl p-6">
                <h4 className="flex items-center font-bold text-gray-900 mb-4 text-lg">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mr-3">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  Pro Tips
                </h4>
                <ul className="space-y-3">
                  {step.tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mt-3 flex-shrink-0" />
                      <span className="text-gray-700 leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column - Interactive Demo */}
            <div className="flex flex-col items-center justify-center space-y-8">
              {/* Live Demo Component */}
              {step.demoComponent && (
                <div className="w-full">
                  <step.demoComponent />
                </div>
              )}

              {/* Feature Icon Display */}
              {!step.demoComponent && (
                <div className={`w-40 h-40 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-500`}>
                  <step.icon className="w-20 h-20 text-white" />
                </div>
              )}

              {/* Personalized Welcome */}
              <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl border border-purple-100 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Welcome, {displayName}! 👋
                </h3>
                <p className="text-gray-600">
                  You're experiencing VeeFore's most advanced features through our interactive demo system.
                </p>
              </div>

              {/* Next Action Button */}
              {step.nextAction && (
                <Button
                  className={`px-12 py-4 text-lg font-bold rounded-2xl bg-gradient-to-r ${step.gradient} text-white border-0 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300`}
                  onClick={() => {/* Add action handler */}}
                >
                  <ArrowRight className="w-6 h-6 mr-3" />
                  {step.nextAction}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-100 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-3 px-8 py-3 rounded-2xl border-2 disabled:opacity-50 hover:shadow-lg transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Previous</span>
          </Button>

          <div className="flex items-center space-x-6">
            <Badge variant="secondary" className="bg-white/80 text-gray-700 px-4 py-2 text-lg">
              Step {currentStep + 1}
            </Badge>
            {isPlaying && (
              <Badge className="bg-green-500 text-white px-4 py-2 animate-pulse">
                Auto-Playing
              </Badge>
            )}
          </div>

          {currentStep < walkthroughSteps.length - 1 ? (
            <Button
              onClick={nextStep}
              className={`flex items-center space-x-3 px-8 py-3 rounded-2xl bg-gradient-to-r ${step.gradient} text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold`}
            >
              <span>Continue</span>
              <ChevronRight className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              onClick={handleClose}
              className="flex items-center space-x-3 px-12 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold text-lg"
            >
              <Star className="w-6 h-6" />
              <span>Start Creating!</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default InteractiveWalkthrough