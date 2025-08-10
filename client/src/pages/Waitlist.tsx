import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Check, Sparkles, Shield, Zap, Users, Target, Rocket, Brain, Globe, BarChart3, MessageCircle, Star, Briefcase, TrendingUp, Code, Clock, Plus, ArrowRight } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import veeforceLogo from '@assets/output-onlinepngtools_1754815000405.png'

interface WaitlistProps {
  onNavigate: (view: string) => void
}

const Waitlist = ({ onNavigate }: WaitlistProps) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    interestedFeatures: [] as string[],
    useCases: [] as string[],
    referredBy: ''
  })
  const [errors, setErrors] = useState({
    fullName: '',
    email: ''
  })
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [waitlistUser, setWaitlistUser] = useState<any>(null)

  const totalSteps = 3

  const handleBackToLanding = () => {
    onNavigate('landing')
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleArrayFieldToggle = (field: 'interestedFeatures' | 'useCases', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (currentStep === 1) {
      // Step 1: Basic info validation
      const newErrors = {
        fullName: '',
        email: ''
      }

      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Please enter your name'
      }

      if (!formData.email.trim()) {
        newErrors.email = 'Please enter your email'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
      }

      setErrors(newErrors)

      if (!newErrors.fullName && !newErrors.email) {
        handleNextStep()
      }
    } else if (currentStep === totalSteps) {
      // Final step: Submit to waitlist
      setIsLoading(true)
      try {
        const response = await fetch('/api/early-access/join', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.fullName,
            email: formData.email,
            referredBy: formData.referredBy || undefined,
            interestedFeatures: formData.interestedFeatures,
            useCases: formData.useCases
          }),
        })

        const responseData = await response.json()

        if (!response.ok) {
          throw new Error(responseData.error || 'Failed to join waitlist')
        }

        setWaitlistUser(responseData.user)
        setIsSubmitted(true)
        
        toast({
          title: "Welcome to the VeeFore Early Access!",
          description: "You've been added to our waitlist. Check your email for next steps.",
        })
        
      } catch (error: any) {
        console.error('Waitlist signup error:', error)
        toast({
          title: "Error",
          description: error.message || "Failed to join waitlist. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      // Move to next step
      handleNextStep()
    }
  }

  if (isSubmitted && waitlistUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 flex flex-col items-center justify-center p-6">
        <div className="max-w-lg w-full text-center space-y-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <Check className="w-10 h-10 text-white" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-gray-900">
              Welcome to VeeFore!
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              You're now on the early access waitlist. We'll notify you when it's your turn!
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Your Details</h3>
            <div className="space-y-2 text-left">
              <p><span className="font-medium">Email:</span> {waitlistUser.email}</p>
              <p><span className="font-medium">Referral Code:</span> {waitlistUser.referralCode}</p>
              <p><span className="font-medium">Status:</span> <span className="capitalize text-blue-600">{waitlistUser.status}</span></p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Share your referral code with friends to move up in the waitlist!
            </p>
            <Button
              onClick={() => onNavigate('landing')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-5">
              <div className="inline-flex items-center space-x-3 bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl px-6 py-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-blue-700 font-semibold text-sm">Early Access Beta</span>
              </div>
              <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">
                Join the Waitlist
              </h1>
              <p className="text-xl text-gray-600 font-light leading-relaxed max-w-md mx-auto">
                Get early access to VeeFore's AI-powered social media platform
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="fullName" className="block text-sm font-bold text-gray-900 tracking-wide">
                  FULL NAME
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`w-full px-6 py-5 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 font-medium text-lg bg-white/80 backdrop-blur-sm ${
                      errors.fullName ? 'border-red-400 bg-red-50/80' : 
                      'border-gray-200 hover:border-blue-300 hover:shadow-lg focus:border-blue-500 focus:bg-blue-50/30 focus:shadow-xl'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-sm text-red-600 font-medium">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-3">
                <label htmlFor="email" className="block text-sm font-bold text-gray-900 tracking-wide">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-6 py-5 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 font-medium text-lg bg-white/80 backdrop-blur-sm ${
                      errors.email ? 'border-red-400 bg-red-50/80' : 
                      'border-gray-200 hover:border-blue-300 hover:shadow-lg focus:border-blue-500 focus:bg-blue-50/30 focus:shadow-xl'
                    }`}
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 font-medium">{errors.email}</p>
                )}
              </div>

              <div className="space-y-3">
                <label htmlFor="referredBy" className="block text-sm font-bold text-gray-900 tracking-wide">
                  REFERRAL CODE (OPTIONAL)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="referredBy"
                    value={formData.referredBy}
                    onChange={(e) => handleInputChange('referredBy', e.target.value)}
                    className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 font-medium text-lg bg-white/80 backdrop-blur-sm hover:border-blue-300 hover:shadow-lg focus:bg-blue-50/30 focus:shadow-xl"
                    placeholder="Enter referral code (if you have one)"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-10">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-sm border border-blue-200/50 rounded-2xl px-6 py-3 shadow-lg">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
                <span className="text-blue-700 font-semibold text-sm tracking-wide">AI FEATURES</span>
              </div>
              <div>
                <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  What interests you most?
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Select the AI features you're most excited about
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { 
                  id: 'ai-content-generation', 
                  label: 'AI Content Generation', 
                  desc: 'Create viral posts, captions, and hashtags with GPT-4o',
                  icon: Sparkles,
                  gradient: 'from-purple-500 to-pink-500'
                },
                { 
                  id: 'ai-visual-creation', 
                  label: 'AI Visual Creation', 
                  desc: 'Generate stunning images, videos, and graphics automatically',
                  icon: Brain,
                  gradient: 'from-green-500 to-emerald-500'
                },
                { 
                  id: 'ai-responses', 
                  label: 'AI Engagement Engine', 
                  desc: 'Intelligent comment management and audience engagement',
                  icon: MessageCircle,
                  gradient: 'from-blue-500 to-cyan-500'
                },
                { 
                  id: 'ai-optimization', 
                  label: 'AI Performance Optimizer', 
                  desc: 'Optimize posting times, content, and strategies with AI',
                  icon: Target,
                  gradient: 'from-orange-500 to-red-500'
                },
                { 
                  id: 'ai-analytics', 
                  label: 'AI Analytics Suite', 
                  desc: 'Deep insights and predictive analytics for your content',
                  icon: BarChart3,
                  gradient: 'from-indigo-500 to-purple-500'
                }
              ].map(({ id, label, desc, icon: Icon, gradient }, index) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleArrayFieldToggle('interestedFeatures', id)}
                  className={`w-full group relative overflow-hidden transition-all duration-500 fadeInUp ${
                    formData.interestedFeatures.includes(id)
                      ? `bg-gradient-to-r ${gradient} text-white shadow-2xl transform scale-[1.02]`
                      : 'bg-white hover:bg-gray-50 text-gray-900 shadow-md hover:shadow-xl hover:scale-[1.01]'
                  } rounded-2xl border-2 ${
                    formData.interestedFeatures.includes(id) ? 'border-transparent' : 'border-gray-200 hover:border-gray-300'
                  } p-6`}
                  style={{ 
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  <div className="relative flex items-center space-x-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      formData.interestedFeatures.includes(id)
                        ? 'bg-white/20'
                        : `bg-gradient-to-r ${gradient}`
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        formData.interestedFeatures.includes(id) ? 'text-white' : 'text-white'
                      }`} />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-lg leading-tight">{label}</h3>
                      <p className={`text-sm mt-1 ${
                        formData.interestedFeatures.includes(id) ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        {desc}
                      </p>
                    </div>
                    
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      formData.interestedFeatures.includes(id)
                        ? 'border-white bg-white'
                        : 'border-gray-300 bg-white'
                    }`}>
                      {formData.interestedFeatures.includes(id) && (
                        <Check className="w-5 h-5 text-gray-700" />
                      )}
                      {!formData.interestedFeatures.includes(id) && (
                        <Plus className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-10">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-50 to-blue-50 backdrop-blur-sm border border-green-200/50 rounded-2xl px-6 py-3 shadow-lg">
                <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 font-semibold text-sm tracking-wide">USE CASES</span>
              </div>
              <div>
                <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  How will you use VeeFore?
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Tell us about your goals so we can personalize your experience
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { 
                  id: 'content-creator', 
                  label: 'Content Creator', 
                  desc: 'Individual creator looking to grow audience and engagement',
                  icon: Star,
                  gradient: 'from-yellow-500 to-orange-500'
                },
                { 
                  id: 'small-business', 
                  label: 'Small Business', 
                  desc: 'Local business wanting to increase brand awareness',
                  icon: Briefcase,
                  gradient: 'from-blue-500 to-indigo-500'
                },
                { 
                  id: 'marketing-agency', 
                  label: 'Marketing Agency', 
                  desc: 'Agency managing multiple client social media accounts',
                  icon: Users,
                  gradient: 'from-purple-500 to-pink-500'
                },
                { 
                  id: 'enterprise', 
                  label: 'Enterprise', 
                  desc: 'Large organization with complex social media needs',
                  icon: Globe,
                  gradient: 'from-gray-600 to-gray-800'
                },
                { 
                  id: 'influencer', 
                  label: 'Influencer Marketing', 
                  desc: 'Managing influencer campaigns and collaborations',
                  icon: TrendingUp,
                  gradient: 'from-green-500 to-teal-500'
                },
                { 
                  id: 'ecommerce', 
                  label: 'E-commerce', 
                  desc: 'Online store driving sales through social media',
                  icon: Rocket,
                  gradient: 'from-red-500 to-pink-500'
                }
              ].map(({ id, label, desc, icon: Icon, gradient }, index) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleArrayFieldToggle('useCases', id)}
                  className={`w-full group relative overflow-hidden transition-all duration-500 fadeInUp ${
                    formData.useCases.includes(id)
                      ? `bg-gradient-to-r ${gradient} text-white shadow-2xl transform scale-[1.02]`
                      : 'bg-white hover:bg-gray-50 text-gray-900 shadow-md hover:shadow-xl hover:scale-[1.01]'
                  } rounded-2xl border-2 ${
                    formData.useCases.includes(id) ? 'border-transparent' : 'border-gray-200 hover:border-gray-300'
                  } p-6`}
                  style={{ 
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  <div className="relative flex items-center space-x-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      formData.useCases.includes(id)
                        ? 'bg-white/20'
                        : `bg-gradient-to-r ${gradient}`
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        formData.useCases.includes(id) ? 'text-white' : 'text-white'
                      }`} />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-lg leading-tight">{label}</h3>
                      <p className={`text-sm mt-1 ${
                        formData.useCases.includes(id) ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        {desc}
                      </p>
                    </div>
                    
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      formData.useCases.includes(id)
                        ? 'border-white bg-white'
                        : 'border-gray-300 bg-white'
                    }`}>
                      {formData.useCases.includes(id) && (
                        <Check className="w-5 h-5 text-gray-700" />
                      )}
                      {!formData.useCases.includes(id) && (
                        <Plus className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 relative">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={handleBackToLanding}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 hover:shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Back</span>
        </button>
      </div>

      {/* Logo */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
        <img src={veeforceLogo} alt="VeeFore" className="h-8" />
      </div>

      {/* Progress Bar */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-md px-6 z-10">
        <div className="flex items-center space-x-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className={`w-full h-2 rounded-full transition-all duration-500 ${
                i + 1 <= currentStep 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
                  : 'bg-gray-200'
              }`} />
              {i < totalSteps - 1 && (
                <div className={`w-3 h-3 rounded-full mx-2 transition-all duration-500 ${
                  i + 1 < currentStep 
                    ? 'bg-blue-500' 
                    : i + 1 === currentStep 
                      ? 'bg-blue-500 animate-pulse' 
                      : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>Personal Info</span>
          <span>AI Features</span>
          <span>Use Cases</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen p-6 pt-32">
        <div className="w-full max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-4 pt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 border-2 border-gray-200 rounded-xl bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-semibold text-gray-700"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Previous</span>
                </button>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`${currentStep === 1 ? 'w-full' : 'flex-1'} bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:hover:scale-100 group`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Joining Waitlist...</span>
                  </>
                ) : currentStep === totalSteps ? (
                  <>
                    <span>Join Waitlist</span>
                    <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Waitlist