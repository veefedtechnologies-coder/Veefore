import React, { useState, useRef, useEffect } from 'react'
import { 
  ArrowLeft, 
  ArrowRight, 
  Mail, 
  Lock, 
  User, 
  Building, 
  CheckCircle, 
  Shield, 
  Star, 
  Rocket,
  Brain,
  Zap,
  Target,
  TrendingUp,
  Users,
  MessageSquare,
  BarChart3,
  Globe
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import veeforceLogo from '@assets/image_1754824225354.png'

interface SignUpProps {
  onNavigate: (page: string) => void
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  company: string
  jobTitle: string
  teamSize: string
  industry: string
  primaryGoal: string
  monthlyContent: string
  currentTools: string[]
  budget: string
  timeline: string
  features: string[]
  useCases: string[]
}

interface PendingUser {
  email: string
  userData: FormData
}

const SignUp: React.FC<SignUpProps> = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  const [pendingUser, setPendingUser] = useState<PendingUser | null>(null)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    jobTitle: '',
    teamSize: '',
    industry: '',
    primaryGoal: '',
    monthlyContent: '',
    currentTools: [],
    budget: '',
    timeline: '',
    features: [],
    useCases: []
  })

  const { toast } = useToast()
  const otpInputs = useRef<(HTMLInputElement | null)[]>([])
  const totalSteps = 4

  const handleBackToLanding = () => {
    onNavigate('landing')
  }

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const handleUseCaseToggle = (useCase: string) => {
    setFormData(prev => ({
      ...prev,
      useCases: prev.useCases.includes(useCase)
        ? prev.useCases.filter(u => u !== useCase)
        : [...prev.useCases, useCase]
    }))
  }

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.company
      case 2:
        return formData.features.length > 0
      case 3:
        return formData.useCases.length > 0
      default:
        return true
    }
  }

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1)
      }
    } else {
      toast({
        title: "Please complete all required fields",
        description: "Fill in the required information to continue.",
        variant: "destructive"
      })
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateCurrentStep()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setPendingUser({
          email: formData.email,
          userData: formData
        })
        setShowOTPModal(true)
        toast({
          title: "Verification code sent!",
          description: "Please check your email for the 6-digit verification code.",
        })
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create account. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPChange = (value: string, index: number) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = otp.split('')
      newOtp[index] = value
      setOtp(newOtp.join(''))

      if (value && index < 5) {
        otpInputs.current[index + 1]?.focus()
      }
    }
  }

  const handleOTPKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus()
    }
  }

  const verifyOTP = async () => {
    if (otp.length !== 6) return

    setOtpLoading(true)
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: pendingUser?.email,
          otp: otp
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Account created successfully!",
          description: "Welcome to VeeFore. Redirecting to dashboard...",
        })
        
        setTimeout(() => {
          onNavigate('dashboard')
        }, 2000)
      } else {
        toast({
          title: "Invalid code",
          description: data.message || "Please check your code and try again.",
          variant: "destructive"
        })
        setOtp('')
        otpInputs.current[0]?.focus()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive"
      })
    } finally {
      setOtpLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!pendingUser?.email) return

    setOtpLoading(true)
    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: pendingUser.email
        }),
      })

      if (response.ok) {
        toast({
          title: "Code resent!",
          description: "A new verification code has been sent to your email.",
        })
        setOtp('')
        otpInputs.current[0]?.focus()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend code. Please try again.",
        variant: "destructive"
      })
    } finally {
      setOtpLoading(false)
    }
  }

  useEffect(() => {
    if (otp.length === 6) {
      verifyOTP()
    }
  }, [otp])

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="John"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Smith"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="john@company.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company *</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Your Company Name"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleBackToLanding}
                className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!validateCurrentStep()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Choose Your AI Superpowers</h2>
              <p className="text-gray-600">Select the features that matter most to your content strategy</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: 'ai_content_generation',
                  title: 'AI Content Generation',
                  description: 'Create high-quality posts, captions, and scripts with advanced AI',
                  icon: Brain,
                  category: 'Core AI',
                  benefits: ['10x faster content creation', 'Brand voice consistency', 'Multi-platform optimization']
                },
                {
                  id: 'smart_scheduling',
                  title: 'Smart Scheduling',
                  description: 'AI-powered optimal posting times and content calendar management',
                  icon: Zap,
                  category: 'Automation',
                  benefits: ['Peak engagement timing', 'Automated posting', 'Calendar sync']
                },
                {
                  id: 'engagement_automation',
                  title: 'Engagement Automation',
                  description: 'Automated responses, comment management, and community building',
                  icon: MessageSquare,
                  category: 'Automation',
                  benefits: ['24/7 community management', 'Smart auto-replies', 'Sentiment analysis']
                },
                {
                  id: 'analytics_insights',
                  title: 'Advanced Analytics',
                  description: 'Deep performance insights and predictive content recommendations',
                  icon: BarChart3,
                  category: 'Business Intelligence',
                  benefits: ['ROI tracking', 'Competitor analysis', 'Growth predictions']
                },
                {
                  id: 'multi_platform',
                  title: 'Multi-Platform Management',
                  description: 'Manage all social media platforms from one unified dashboard',
                  icon: Globe,
                  category: 'Core Features',
                  benefits: ['Cross-platform posting', 'Unified inbox', 'Brand consistency']
                },
                {
                  id: 'team_collaboration',
                  title: 'Team Collaboration',
                  description: 'Advanced workflow management and team collaboration tools',
                  icon: Users,
                  category: 'Business Objectives',
                  benefits: ['Role-based permissions', 'Approval workflows', 'Team analytics']
                },
                {
                  id: 'brand_monitoring',
                  title: 'Brand Monitoring',
                  description: 'Real-time brand mention tracking and reputation management',
                  icon: Shield,
                  category: 'Specialized Workflows',
                  benefits: ['Mention alerts', 'Sentiment tracking', 'Crisis management']
                },
                {
                  id: 'growth_optimization',
                  title: 'Growth Optimization',
                  description: 'AI-driven strategies for follower growth and engagement',
                  icon: TrendingUp,
                  category: 'Business Objectives',
                  benefits: ['Growth hacking', 'Audience targeting', 'Viral content insights']
                }
              ].map((feature) => {
                const IconComponent = feature.icon
                const isSelected = formData.features.includes(feature.id)
                return (
                  <div
                    key={feature.id}
                    onClick={() => handleFeatureToggle(feature.id)}
                    className={`relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl ${isSelected ? 'bg-blue-500' : 'bg-gray-100'}`}>
                        <IconComponent className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-gray-900">{feature.title}</h3>
                          <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                            {feature.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                        <div className="space-y-1">
                          {feature.benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span className="text-xs text-gray-500">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!validateCurrentStep()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Define Your Success Strategy</h2>
              <p className="text-gray-600">Select your primary use cases to customize your VeeFore experience</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: 'brand_awareness',
                  title: 'Brand Awareness Campaigns',
                  description: 'Build brand recognition and reach new audiences effectively',
                  icon: Target,
                  category: 'Business Objectives',
                  metrics: ['Reach increase: 300%', 'Brand mentions: +250%', 'Share rate: +180%']
                },
                {
                  id: 'lead_generation',
                  title: 'Lead Generation',
                  description: 'Convert social media engagement into qualified business leads',
                  icon: TrendingUp,
                  category: 'Business Objectives',
                  metrics: ['Lead quality: 85%', 'Conversion rate: +120%', 'Cost per lead: -40%']
                },
                {
                  id: 'customer_support',
                  title: 'Customer Support',
                  description: 'Provide exceptional customer service through social channels',
                  icon: MessageSquare,
                  category: 'Automation & Engagement',
                  metrics: ['Response time: <2min', 'Satisfaction: 94%', 'Resolution rate: 89%']
                },
                {
                  id: 'content_marketing',
                  title: 'Content Marketing',
                  description: 'Create and distribute valuable content to attract customers',
                  icon: Brain,
                  category: 'Core AI',
                  metrics: ['Engagement rate: +200%', 'Content output: 5x', 'Time saved: 70%']
                },
                {
                  id: 'influencer_campaigns',
                  title: 'Influencer Campaigns',
                  description: 'Manage and optimize influencer partnerships at scale',
                  icon: Users,
                  category: 'Specialized Workflows',
                  metrics: ['Campaign ROI: 450%', 'Reach amplification: 8x', 'Partner retention: 85%']
                },
                {
                  id: 'crisis_management',
                  title: 'Crisis Management',
                  description: 'Protect and manage your brand reputation during critical moments',
                  icon: Shield,
                  category: 'Specialized Workflows',
                  metrics: ['Response time: <15min', 'Sentiment recovery: 95%', 'Issue resolution: 4x faster']
                },
                {
                  id: 'ecommerce_sales',
                  title: 'E-commerce Sales',
                  description: 'Drive product sales and revenue through social commerce',
                  icon: BarChart3,
                  category: 'Business Objectives',
                  metrics: ['Sales increase: +180%', 'Cart conversion: +65%', 'Revenue per post: $450']
                },
                {
                  id: 'community_building',
                  title: 'Community Building',
                  description: 'Foster engaged communities around your brand and products',
                  icon: Globe,
                  category: 'Automation & Engagement',
                  metrics: ['Community growth: +300%', 'Daily engagement: +250%', 'Member retention: 92%']
                }
              ].map((useCase) => {
                const IconComponent = useCase.icon
                const isSelected = formData.useCases.includes(useCase.id)
                return (
                  <div
                    key={useCase.id}
                    onClick={() => handleUseCaseToggle(useCase.id)}
                    className={`relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl ${isSelected ? 'bg-blue-500' : 'bg-gray-100'}`}>
                        <IconComponent className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-gray-900">{useCase.title}</h3>
                          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            {useCase.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{useCase.description}</p>
                        <div className="space-y-1">
                          {useCase.metrics.map((metric, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <BarChart3 className="w-3 h-3 text-blue-500" />
                              <span className="text-xs text-gray-600 font-medium">{metric}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create account</span>
                    <Rocket className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="relative">
      <div className="h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex">
        {/* Left side - Advanced Professional Showcase */}
        <div className="hidden lg:flex lg:w-1/2 bg-gray-900 relative overflow-y-auto">
          {/* Advanced Background Effects */}
          <div className="absolute inset-0">
            {/* Animated grid pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}></div>
            
            {/* Dynamic gradient orbs */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            
            {/* Subtle scan lines */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
            }}></div>
          </div>
          
          <div className="flex flex-col justify-start px-16 py-8 pb-16 relative z-10 min-h-full">
            {/* Premium Header Section */}
            <div className="mb-16">
              <div className="flex items-center space-x-5 mb-12">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl flex items-center justify-center shadow-2xl">
                    <img src={veeforceLogo} alt="VeeFore" className="w-10 h-10" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-gray-900 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-black text-white tracking-tight">VeeFore</h1>
                  <p className="text-blue-300 font-semibold text-lg">AI Social Media Command Center</p>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white leading-tight">
                  Transform Your Social Media Into a
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                    Revenue-Generating Machine
                  </span>
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Join Fortune 500 companies using our AI platform to automate content creation, 
                  engagement, and scale their social media presence with enterprise-grade precision.
                </p>
              </div>
            </div>

            {/* Enhanced Statistics Grid */}
            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl font-black text-white">500M+</div>
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-gray-300 font-semibold">Posts Generated</p>
                <p className="text-sm text-gray-400 mt-2">Across all platforms</p>
              </div>
              
              <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl font-black text-white">95%</div>
                  <Brain className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-gray-300 font-semibold">Time Saved</p>
                <p className="text-sm text-gray-400 mt-2">Content creation automation</p>
              </div>
              
              <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl font-black text-white">340%</div>
                  <BarChart3 className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-gray-300 font-semibold">ROI Increase</p>
                <p className="text-sm text-gray-400 mt-2">Average customer growth</p>
              </div>
              
              <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl font-black text-white">24/7</div>
                  <Zap className="w-8 h-8 text-yellow-400" />
                </div>
                <p className="text-gray-300 font-semibold">Automation</p>
                <p className="text-sm text-gray-400 mt-2">Never miss an opportunity</p>
              </div>
            </div>

            {/* Enhanced Features Preview */}
            <div className="space-y-6 mb-12">
              <h3 className="text-2xl font-bold text-white mb-6">Enterprise Features</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4 bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-xl p-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">AI Content Generation</h4>
                    <p className="text-gray-400 text-sm">Create engaging content 10x faster with advanced AI</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-xl p-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Smart Automation</h4>
                    <p className="text-gray-400 text-sm">Automate posting, engagement, and responses</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-xl p-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Advanced Analytics</h4>
                    <p className="text-gray-400 text-sm">Deep insights with predictive recommendations</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security & Compliance */}
            <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h6 className="text-white font-bold text-lg">Enterprise Security</h6>
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span className="text-gray-300">SOC 2 Certification</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">GDPR Ready</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">ISO 27001 Prep</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">AES-256 Encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Completely static form container */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30 flex flex-col">
          {/* Mobile header */}
          <div className="lg:hidden bg-white/95 backdrop-blur-sm p-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <button 
                onClick={handleBackToLanding}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <img src={veeforceLogo} alt="VeeFore" className="w-8 h-8" />
                <span className="text-gray-900 font-bold text-xl">VeeFore</span>
              </div>
            </div>
          </div>

          {/* Static form container with no scroll displacement */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-lg">
              <div className="max-h-[calc(100vh-8rem)] overflow-y-auto space-y-6">
                {/* Progress indicator */}
                <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                        <Rocket className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Early Access</h3>
                        <p className="text-sm text-gray-600">Join the VeeFore revolution</p>
                      </div>
                    </div>
                    
                    <div className="relative w-16 h-16">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-gray-200"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="transparent"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-blue-600"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          fill="transparent"
                          strokeDasharray={`${(currentStep / totalSteps) * 100}, 100`}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-white">{currentStep}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    {Array.from({ length: totalSteps }).map((_, index) => (
                      <div
                        key={index}
                        className={`flex-1 h-3 rounded-full transition-all duration-500 relative overflow-hidden ${
                          index < currentStep
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                            : index === currentStep - 1
                            ? 'bg-gradient-to-r from-blue-400 to-blue-500'
                            : 'bg-gray-200'
                        }`}
                      >
                        {index < currentStep && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Step labels */}
                  <div className="flex justify-between mt-4 text-xs font-medium text-gray-500">
                    <span className={currentStep >= 1 ? 'text-blue-600' : ''}>Account</span>
                    <span className={currentStep >= 2 ? 'text-blue-600' : ''}>Features</span>
                    <span className={currentStep >= 3 ? 'text-blue-600' : ''}>Use Cases</span>
                    <span className={currentStep >= 4 ? 'text-blue-600' : ''}>Complete</span>
                  </div>
                </div>

                {/* Form Steps */}
                <form onSubmit={handleSubmit}>
                  {renderStepContent()}
                </form>

                {/* Trust indicators */}
                <div className="text-center">
                  <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
                    <p className="text-gray-700 text-lg font-medium mb-4">
                      Already have an account?{' '}
                      <button
                        onClick={() => onNavigate('signin')}
                        className="text-blue-600 hover:text-blue-700 font-bold transition-all duration-200 hover:underline hover:scale-105 inline-block"
                      >
                        Sign in here →
                      </button>
                    </p>
                    
                    <div className="flex items-center justify-center space-x-6 mb-6">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Shield className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-sm font-semibold">Bank-Level Security</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Lock className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-semibold">256-bit Encryption</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Star className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="text-sm font-semibold">Enterprise Grade</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 leading-relaxed">
                      By creating an account, you agree to our{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold underline">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold underline">Privacy Policy</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revolutionary OTP Verification Experience */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          {/* Floating gradient orbs for depth */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
          
          <div className="relative bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-md w-full p-8 border border-white/20 before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/30 before:via-transparent before:to-transparent before:pointer-events-none">
            <div className="relative z-10 text-center space-y-8">
              {/* Premium Header with Glass Effect */}
              <div className="space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500/80 via-indigo-500/80 to-purple-600/80 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto shadow-2xl border border-white/20">
                    <Mail className="w-10 h-10 text-white drop-shadow-lg" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400/90 backdrop-blur-sm rounded-full border-2 border-white/50 flex items-center justify-center shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl blur-xl animate-pulse"></div>
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-lg">Verify Your Email</h2>
                  <div className="space-y-2">
                    <p className="text-white/80 font-medium drop-shadow">
                      We've sent a 6-digit verification code to
                    </p>
                    <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/30 shadow-lg">
                      <Mail className="w-4 h-4 text-white/90" />
                      <span className="font-bold text-white">{pendingUser?.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced OTP Input Grid */}
              <div className="space-y-6">
                <div className="flex justify-center space-x-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      ref={(el) => {
                        if (el) otpInputs.current[index] = el
                      }}
                      className="w-14 h-14 bg-white/20 backdrop-blur-xl border-2 border-white/30 hover:border-white/50 focus:border-white/70 rounded-2xl text-center text-2xl font-bold text-white placeholder-white/50 transition-all duration-300 shadow-lg focus:shadow-xl focus:scale-105 focus:outline-none"
                      onChange={(e) => handleOTPChange(e.target.value, index)}
                      onKeyDown={(e) => handleOTPKeyDown(e, index)}
                      disabled={otpLoading}
                      placeholder="0"
                    />
                  ))}
                </div>

                {/* Enhanced OTP Action Button */}
                <button
                  onClick={verifyOTP}
                  disabled={otp.length !== 6 || otpLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-[1.02] disabled:scale-100 border border-white/20 backdrop-blur-sm"
                >
                  {otpLoading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="drop-shadow">Verifying...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-3">
                      <span className="drop-shadow">Verify & Complete</span>
                      <CheckCircle className="w-5 h-5 drop-shadow" />
                    </div>
                  )}
                </button>

                <div className="flex items-center justify-center space-x-4 text-sm">
                  <span className="text-white/70 drop-shadow">Didn't receive the code?</span>
                  <button
                    onClick={handleResendOTP}
                    disabled={otpLoading}
                    className="text-white font-bold hover:text-blue-200 hover:underline disabled:opacity-50 transition-colors duration-200 drop-shadow"
                  >
                    Resend Code
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Security Note */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400/80 to-orange-500/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-lg">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm text-white/90 font-semibold drop-shadow">
                  Code expires in 15 minutes • Bank-level security
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SignUp