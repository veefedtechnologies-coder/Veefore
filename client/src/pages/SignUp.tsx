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
  Globe,
  Eye,
  EyeOff
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

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
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Join VeeFore Early Access</h2>
              <p className="text-gray-600">Create your account to get started</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="John"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Smith"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="john@company.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!validateCurrentStep()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
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
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Choose Your AI Features</h2>
              <p className="text-gray-600">Select the features that matter most to you</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: 'ai_content_generation',
                  title: 'AI Content Generation',
                  description: 'Create high-quality posts and captions with AI',
                  icon: Brain
                },
                {
                  id: 'smart_scheduling',
                  title: 'Smart Scheduling',
                  description: 'AI-powered optimal posting times',
                  icon: Zap
                },
                {
                  id: 'engagement_automation',
                  title: 'Engagement Automation',
                  description: 'Automated responses and community management',
                  icon: MessageSquare
                },
                {
                  id: 'analytics_insights',
                  title: 'Advanced Analytics',
                  description: 'Deep performance insights and recommendations',
                  icon: BarChart3
                },
                {
                  id: 'multi_platform',
                  title: 'Multi-Platform Management',
                  description: 'Manage all social media from one dashboard',
                  icon: Globe
                },
                {
                  id: 'team_collaboration',
                  title: 'Team Collaboration',
                  description: 'Advanced workflow and team tools',
                  icon: Users
                },
                {
                  id: 'brand_monitoring',
                  title: 'Brand Monitoring',
                  description: 'Real-time brand mention tracking',
                  icon: Shield
                },
                {
                  id: 'growth_optimization',
                  title: 'Growth Optimization',
                  description: 'AI-driven strategies for growth',
                  icon: TrendingUp
                }
              ].map((feature) => {
                const IconComponent = feature.icon
                const isSelected = formData.features.includes(feature.id)
                return (
                  <div
                    key={feature.id}
                    onClick={() => handleFeatureToggle(feature.id)}
                    className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-500' : 'bg-gray-100'}`}>
                        <IconComponent className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute top-3 right-3">
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
                className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!validateCurrentStep()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
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
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Define Your Goals</h2>
              <p className="text-gray-600">Select your primary use cases</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: 'brand_awareness',
                  title: 'Brand Awareness',
                  description: 'Build brand recognition and reach',
                  icon: Target
                },
                {
                  id: 'lead_generation',
                  title: 'Lead Generation',
                  description: 'Convert engagement into leads',
                  icon: TrendingUp
                },
                {
                  id: 'customer_support',
                  title: 'Customer Support',
                  description: 'Provide excellent customer service',
                  icon: MessageSquare
                },
                {
                  id: 'content_marketing',
                  title: 'Content Marketing',
                  description: 'Create valuable content for customers',
                  icon: Brain
                },
                {
                  id: 'influencer_campaigns',
                  title: 'Influencer Campaigns',
                  description: 'Manage influencer partnerships',
                  icon: Users
                },
                {
                  id: 'crisis_management',
                  title: 'Crisis Management',
                  description: 'Protect your brand reputation',
                  icon: Shield
                },
                {
                  id: 'ecommerce_sales',
                  title: 'E-commerce Sales',
                  description: 'Drive product sales through social',
                  icon: BarChart3
                },
                {
                  id: 'community_building',
                  title: 'Community Building',
                  description: 'Foster engaged communities',
                  icon: Globe
                }
              ].map((useCase) => {
                const IconComponent = useCase.icon
                const isSelected = formData.useCases.includes(useCase.id)
                return (
                  <div
                    key={useCase.id}
                    onClick={() => handleUseCaseToggle(useCase.id)}
                    className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-500' : 'bg-gray-100'}`}>
                        <IconComponent className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{useCase.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{useCase.description}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute top-3 right-3">
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
                className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-white">V</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">VeeFore</h1>
          <p className="text-gray-600 mt-2">AI-Powered Social Media Management</p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-600">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit}>
            {renderStepContent()}
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('signin')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
              <p className="text-gray-600">
                We've sent a 6-digit code to {pendingUser?.email}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center space-x-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    ref={(el) => {
                      if (el) otpInputs.current[index] = el
                    }}
                    className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg text-xl font-bold focus:border-blue-500 focus:outline-none"
                    onChange={(e) => handleOTPChange(e.target.value, index)}
                    onKeyDown={(e) => handleOTPKeyDown(e, index)}
                    disabled={otpLoading}
                  />
                ))}
              </div>

              <button
                onClick={verifyOTP}
                disabled={otp.length !== 6 || otpLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 rounded-lg font-medium transition-colors"
              >
                {otpLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  'Verify Email'
                )}
              </button>

              <div className="text-center">
                <button
                  onClick={handleResendOTP}
                  disabled={otpLoading}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Resend Code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SignUp