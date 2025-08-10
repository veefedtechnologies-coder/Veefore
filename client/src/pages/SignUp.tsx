import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, ArrowLeft, Check, X, ArrowRight, Sparkles, Shield, Zap, Users, Target, Rocket, Brain, Globe, BarChart3, Star, Lock, Briefcase, ChevronRight, TrendingUp, Code, Mail } from 'lucide-react'
import { Link, useLocation } from 'wouter'
import { signUpWithEmail, signInWithGoogle } from '@/lib/firebase'
import { useToast } from '@/hooks/use-toast'
import veeforceLogo from '@assets/output-onlinepngtools_1754815000405.png'

interface SignUpProps {
  onNavigate: (view: string) => void
}

const SignUp = ({ onNavigate }: SignUpProps) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    businessType: '',
    teamSize: '',
    goals: [] as string[]
  })
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: ''
  })
  const { toast } = useToast()
  const [, setLocation] = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState('')
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState(false)
  const [pendingUser, setPendingUser] = useState<{email: string, firstName: string} | null>(null)
  const [developmentOtp, setDevelopmentOtp] = useState<string | null>(null)

  const totalSteps = 4

  const handleBackToLanding = () => {
    onNavigate('landing')
  }

  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password)
    }
    return requirements
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal) 
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
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
      // Step 1: Basic info validation and OTP trigger
      const newErrors = {
        fullName: '',
        email: '',
        password: ''
      }

      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Please enter your name'
      }

      if (!formData.email.trim()) {
        newErrors.email = 'Please enter your email'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
      }

      const passwordReqs = validatePassword(formData.password)
      if (!passwordReqs.length || !passwordReqs.uppercase || !passwordReqs.lowercase || !passwordReqs.number) {
        newErrors.password = 'Password must be 8+ characters with uppercase, lowercase, and number'
      }

      setErrors(newErrors)

      if (!newErrors.fullName && !newErrors.email && !newErrors.password) {
        setIsLoading(true)
        try {
          // Store user info for OTP verification
          setPendingUser({
            email: formData.email,
            firstName: formData.fullName.split(' ')[0] || 'User'
          })

          // Send OTP verification email
          const response = await fetch('/api/auth/send-verification-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.email,
              firstName: formData.fullName.split(' ')[0] || 'User'
            }),
          })

          const responseData = await response.json()

          if (!response.ok) {
            throw new Error(responseData.message || 'Failed to send verification email')
          }

          // Store development OTP and show OTP modal
          if (responseData.developmentOtp && import.meta.env.DEV) {
            console.log('🔑 DEVELOPMENT OTP:', responseData.developmentOtp)
            setDevelopmentOtp(responseData.developmentOtp)
          }
          
          // Show OTP modal - user must verify before proceeding to step 2
          setShowOTPModal(true)
          
          // Simple toast notification
          toast({
            title: "Verification code sent!",
            description: "Check your email for the 6-digit verification code.",
            duration: 5000,
          })
          
        } catch (error: any) {
          console.error('Email verification error:', error)
          toast({
            title: "Error",
            description: error.message || "Failed to send verification email. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }
    } else {
      // Final step: Complete account creation
      setIsLoading(true)
      try {
        // Create Firebase account
        await signUpWithEmail(formData.email, formData.password)
        
        // Create user in database
        await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            businessType: formData.businessType,
            teamSize: formData.teamSize,
            goals: formData.goals
          })
        })

        toast({
          title: "Welcome to VeeFore!",
          description: "Your account has been created successfully.",
        })
        
        setLocation('/')
        
      } catch (error: any) {
        console.error('Account creation error:', error)
        toast({
          title: "Error",
          description: error.message || "Failed to create account. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  // OTP Verification Functions
  const handleOTPSubmit = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setOtpError(true)
      toast({
        title: "Invalid Code",
        description: "Please enter the 6-digit verification code.",
        variant: "destructive",
      })
      return
    }

    setOtpLoading(true)
    setOtpError(false) // Reset error state
    try {
      console.log('[OTP DEBUG] Attempting to verify OTP:', { email: pendingUser?.email, code: otpCode })
      
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: pendingUser?.email,
          code: otpCode
        }),
      })

      console.log('[OTP DEBUG] Response status:', response.status)
      
      const responseData = await response.json()
      console.log('[OTP DEBUG] Response data:', responseData)

      if (!response.ok) {
        setOtpError(true) // Set error state for visual feedback
        throw new Error(responseData.message || 'Verification failed')
      }

      // Success - email verified, now proceed to step 2
      setOtpError(false)
      setShowOTPModal(false)
      setOtpCode('') // Clear the OTP code
      setDevelopmentOtp(null) // Clear development OTP
      toast({
        title: "Email verified!",
        description: "You can now continue with your account setup.",
      })
      
      setCurrentStep(2) // Move to next step after verification
    } catch (error: any) {
      console.error('[OTP DEBUG] Verification error:', error)
      setOtpError(true) // Ensure error state is set
      toast({
        title: "Verification failed",
        description: error.message || "Invalid or expired code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setOtpLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!pendingUser) return

    setOtpLoading(true)
    try {
      const response = await fetch('/api/auth/send-verification-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: pendingUser.email,
          firstName: pendingUser.firstName
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to resend verification email')
      }

      // Store new development OTP
      if (responseData.developmentOtp && import.meta.env.DEV) {
        console.log('🔑 RESENT DEVELOPMENT OTP:', responseData.developmentOtp)
        setDevelopmentOtp(responseData.developmentOtp)
      }

      toast({
        title: "Code resent!",
        description: "A new verification code has been sent to your email.",
      })
      setOtpCode('') // Clear current code
    } catch (error: any) {
      toast({
        title: "Failed to resend",
        description: error.message || "Please try again.",
        variant: "destructive",
      })
    } finally {
      setOtpLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signInWithGoogle()
      
      await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      toast({
        title: "Welcome!",
        description: "Signed in with Google successfully!",
      })
      
      setLocation('/')
    } catch (error: any) {
      console.error('Google sign in error:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const passwordRequirements = validatePassword(formData.password)

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-5">
              <div className="inline-flex items-center space-x-3 bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl px-6 py-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-blue-700 font-semibold text-sm">Enterprise Account Setup</span>
              </div>
              <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">
                Create your account
              </h1>
              <p className="text-xl text-gray-600 font-light leading-relaxed max-w-md mx-auto">
                Join thousands of creators using AI to grow their audience
              </p>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 border-2 border-gray-200 rounded-xl bg-white hover:bg-gray-50 hover:border-blue-300 hover:shadow-lg transition-all duration-300 font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
              <div className="w-2 h-2 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or continue with email</span>
              </div>
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
                    onFocus={() => setFocusedField('fullName')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-6 py-5 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 font-medium text-lg bg-white/80 backdrop-blur-sm ${
                      errors.fullName ? 'border-red-400 bg-red-50/80' : 
                      focusedField === 'fullName' ? 'border-blue-500 bg-blue-50/30 shadow-xl' :
                      'border-gray-200 hover:border-blue-300 hover:shadow-lg'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {focusedField === 'fullName' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
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
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-6 py-5 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 font-medium text-lg bg-white/80 backdrop-blur-sm ${
                      errors.email ? 'border-red-400 bg-red-50/80' : 
                      focusedField === 'email' ? 'border-blue-500 bg-blue-50/30 shadow-xl' :
                      'border-gray-200 hover:border-blue-300 hover:shadow-lg'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {focusedField === 'email' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 font-medium">{errors.email}</p>
                )}
              </div>

              <div className="space-y-3">
                <label htmlFor="password" className="block text-sm font-bold text-gray-900 tracking-wide">
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-6 py-5 pr-16 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 font-medium text-lg bg-white/80 backdrop-blur-sm ${
                      errors.password ? 'border-red-400 bg-red-50/80' : 
                      focusedField === 'password' ? 'border-blue-500 bg-blue-50/30 shadow-xl' :
                      'border-gray-200 hover:border-blue-300 hover:shadow-lg'
                    }`}
                    placeholder="Create a secure password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                  </button>
                  {focusedField === 'password' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                
                {formData.password && (
                  <div className="mt-6 p-6 bg-gradient-to-br from-gray-50/80 to-blue-50/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl">
                    <div className="text-sm font-bold text-gray-900 mb-4 tracking-wide">PASSWORD STRENGTH:</div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {[
                        { key: 'length', label: '8+ characters', check: passwordRequirements.length },
                        { key: 'uppercase', label: 'Uppercase letter', check: passwordRequirements.uppercase },
                        { key: 'lowercase', label: 'Lowercase letter', check: passwordRequirements.lowercase },
                        { key: 'number', label: 'Number', check: passwordRequirements.number }
                      ].map(({ key, label, check }) => (
                        <div key={key} className={`flex items-center font-medium transition-all duration-300 ${
                          check ? 'text-green-700' : 'text-gray-500'
                        }`}>
                          <div className={`w-5 h-5 mr-3 rounded-full flex items-center justify-center ${
                            check ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100 border-2 border-gray-300'
                          }`}>
                            {check ? <Check className="w-3 h-3 text-green-600" /> : <X className="w-3 h-3 text-gray-400" />}
                          </div>
                          <span>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={!formData.fullName || !formData.email || !passwordRequirements.length || !passwordRequirements.uppercase || !passwordRequirements.lowercase || !passwordRequirements.number || isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:hover:scale-100 group"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Sending verification...</span>
                </>
              ) : (
                <>
                  <span>Send Verification Code</span>
                  <Mail className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </button>
          </div>
        )

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">
                Tell us about your business
              </h1>
              <p className="text-lg text-gray-600">
                Help us personalize your experience
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  What type of business do you run?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'agency', label: 'Marketing Agency', icon: Target },
                    { id: 'ecommerce', label: 'E-commerce', icon: Rocket },
                    { id: 'saas', label: 'SaaS Company', icon: Zap },
                    { id: 'consulting', label: 'Consulting', icon: Briefcase },
                    { id: 'creator', label: 'Content Creator', icon: Sparkles },
                    { id: 'other', label: 'Other', icon: Globe }
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleInputChange('businessType', id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        formData.businessType === id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-6 h-6 text-blue-600 mb-2" />
                      <div className="font-medium text-gray-900">{label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  What's your team size?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'solo', label: 'Just me', subtitle: 'Solo entrepreneur' },
                    { id: 'small', label: '2-10 people', subtitle: 'Small team' },
                    { id: 'medium', label: '11-50 people', subtitle: 'Growing company' },
                    { id: 'large', label: '50+ people', subtitle: 'Enterprise' }
                  ].map(({ id, label, subtitle }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleInputChange('teamSize', id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                        formData.teamSize === id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{label}</div>
                      <div className="text-sm text-gray-500">{subtitle}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!formData.businessType || !formData.teamSize}
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
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">
                What are your goals?
              </h1>
              <p className="text-lg text-gray-600">
                Select all that apply (you can change these later)
              </p>
            </div>

            <div className="space-y-3">
              {[
                'Increase social media engagement',
                'Save time on content creation',
                'Grow my audience faster',
                'Improve brand consistency',
                'Get better analytics insights',
                'Automate routine tasks',
                'Manage multiple accounts',
                'Create viral content'
              ].map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => handleGoalToggle(goal)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left flex items-center justify-between ${
                    formData.goals.includes(goal)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium text-gray-900">{goal}</span>
                  {formData.goals.includes(goal) && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={formData.goals.length === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                You're all set!
              </h1>
              <p className="text-lg text-gray-600">
                Review your information and create your account
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Account summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name</span>
                  <span className="font-medium">{formData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Business type</span>
                  <span className="font-medium capitalize">{formData.businessType?.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Team size</span>
                  <span className="font-medium capitalize">{formData.teamSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Goals selected</span>
                  <span className="font-medium">{formData.goals.length}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
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
    <>
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
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900"></div>
              </div>
              <div>
                <h2 className="text-4xl font-black text-white tracking-tight">VeeFore</h2>
                <p className="text-gray-300 font-medium tracking-wide">Enterprise AI Platform</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-6xl font-black text-white leading-[1.1] tracking-tight">
                Transform your
                <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  social presence
                </span>
              </h3>
              <p className="text-xl text-gray-300 leading-relaxed max-w-lg font-light">
                Next-generation AI platform in development. Join our early access program 
                to shape the future of social media automation.
              </p>
            </div>
            
            {/* Development progress dashboard */}
            <div className="mt-12 grid grid-cols-2 gap-6">
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-400 text-sm font-medium">Beta Testers</span>
                  </div>
                  <Users className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-bold text-white">1,247</div>
                <div className="text-amber-400 text-sm font-medium">Early access</div>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-400 text-sm font-medium">Platform Progress</span>
                  </div>
                  <Code className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white">87%</div>
                <div className="text-blue-400 text-sm font-medium">Development complete</div>
              </div>
            </div>
          </div>

          {/* Advanced Feature Showcase */}
          <div className="space-y-6">
            {[
              {
                icon: Brain,
                title: "Neural Content Engine",
                description: "Advanced GPT-4 integration with custom training models for your brand voice and style.",
                metric: "Ready for beta testing",
                color: "from-blue-500 to-cyan-400",
                bgColor: "bg-blue-500/10",
                stats: "In development"
              },
              {
                icon: BarChart3,
                title: "Predictive Analytics Suite",
                description: "Machine learning algorithms predict viral potential and optimal posting times.",
                metric: "Algorithm training phase",
                color: "from-purple-500 to-pink-400",
                bgColor: "bg-purple-500/10",
                stats: "95% complete"
              },
              {
                icon: Zap,
                title: "Autonomous Engagement",
                description: "AI-powered automation handles responses, DMs, and community management 24/7.",
                metric: "Currently in testing",
                color: "from-orange-500 to-yellow-400",
                bgColor: "bg-orange-500/10",
                stats: "Beta ready"
              }
            ].map(({ icon: Icon, title, description, metric, color, bgColor, stats }, index) => (
              <div key={title} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl" 
                     style={{ background: `linear-gradient(to right, ${color.split(' ')[1]}, ${color.split(' ')[3]})` }}></div>
                <div className="relative bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 hover:border-gray-600/50 transition-all duration-500">
                  <div className="flex items-start space-x-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-white text-xl">{title}</h4>
                        <div className={`text-xs font-bold ${bgColor} text-white px-3 py-1 rounded-full`}>
                          {stats}
                        </div>
                      </div>
                      <p className="text-gray-300 mb-4 leading-relaxed font-light">{description}</p>
                      <div className="flex items-center justify-between">
                        <div className={`text-sm font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                          {metric}
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enterprise Trust Section */}
          <div className="mt-16 pt-8 border-t border-gray-700/50">
            {/* Early Access Program */}
            <div className="mb-8">
              <h5 className="text-gray-400 text-sm font-semibold mb-4 tracking-wide uppercase">Early Access Program</h5>
              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl p-6 border border-amber-500/30">
                <div className="flex items-center space-x-3 mb-3">
                  <Star className="w-5 h-5 text-amber-400" />
                  <span className="text-amber-400 font-bold text-sm">FOUNDING MEMBER</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Join our exclusive pre-launch community and get lifetime benefits, priority support, and input on product direction.
                </p>
              </div>
            </div>
            
            {/* Development Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                <div className="text-4xl font-black text-white mb-2">Q1</div>
                <div className="text-gray-400 text-sm font-medium">Launch Target</div>
                <div className="text-green-400 text-xs font-semibold mt-1">2025</div>
              </div>
              <div className="text-center bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                <div className="text-4xl font-black text-white mb-2">15+</div>
                <div className="text-gray-400 text-sm font-medium">AI Features</div>
                <div className="text-blue-400 text-xs font-semibold mt-1">In Development</div>
              </div>
              <div className="text-center bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                <div className="text-4xl font-black text-white mb-2">24/7</div>
                <div className="text-gray-400 text-sm font-medium">Beta Support</div>
                <div className="text-purple-400 text-xs font-semibold mt-1">Coming Soon</div>
              </div>
            </div>
            
            {/* Development Roadmap */}
            <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h6 className="text-white font-bold text-lg">Development Roadmap</h6>
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="text-gray-300 text-sm">Core AI Engine</div>
                    <div className="text-green-400 text-xs">Completed ✓</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full flex-shrink-0 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="text-gray-300 text-sm">Social Platform Integrations</div>
                    <div className="text-blue-400 text-xs">In Progress - 85%</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-amber-400 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="text-gray-300 text-sm">Beta Testing Platform</div>
                    <div className="text-amber-400 text-xs">Next - Q1 2025</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gray-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="text-gray-300 text-sm">Public Launch</div>
                    <div className="text-gray-500 text-xs">Planned - Q2 2025</div>
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
                    <span className="text-white font-bold text-sm">{currentStep}</span>
                  </div>
                  <div>
                    <span className="text-xl font-black text-gray-900">
                      Step {currentStep}
                    </span>
                    <span className="text-sm text-gray-500 bg-gray-100/80 px-3 py-1 rounded-full font-semibold ml-3">
                      of {totalSteps}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold text-blue-600">
                    {Math.round((currentStep / totalSteps) * 100)}%
                  </span>
                  <div className="w-16 h-16 relative">
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
                        strokeWidth="4"
                        strokeDasharray={`${(currentStep / totalSteps) * 100}, 100`}
                        strokeLinecap="round"
                        fill="transparent"
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
                <span className={currentStep >= 2 ? 'text-blue-600' : ''}>Business</span>
                <span className={currentStep >= 3 ? 'text-blue-600' : ''}>Goals</span>
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

            {/* Revolutionary OTP Input Grid */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className={`text-sm font-bold tracking-wide drop-shadow transition-colors duration-300 ${
                  otpError ? 'text-red-300' : 'text-white/90'
                }`}>
                  {otpError ? 'INVALID CODE' : 'VERIFICATION CODE'}
                </div>
                <div className="flex justify-center space-x-3">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="relative">
                      <input
                        type="text"
                        value={otpCode[index] || ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '')
                          if (value.length <= 1) {
                            const newCode = otpCode.split('')
                            newCode[index] = value
                            setOtpCode(newCode.join('').slice(0, 6))
                            
                            // Clear error state when user starts typing
                            if (otpError) {
                              setOtpError(false)
                            }
                            
                            // Auto-focus next input
                            if (value && index < 5) {
                              const nextInput = e.target.parentElement?.parentElement?.children[index + 1]?.querySelector('input')
                              nextInput?.focus()
                            }
                          }
                        }}
                        onKeyDown={(e) => {
                          // Handle backspace to focus previous input
                          if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
                            const prevInput = e.target.parentElement?.parentElement?.children[index - 1]?.querySelector('input')
                            prevInput?.focus()
                          }
                        }}
                        className={`w-12 h-14 text-center text-2xl font-black border-2 rounded-xl transition-all duration-300 backdrop-blur-xl ${
                          otpError 
                            ? 'border-red-400/60 bg-red-500/20 text-white shadow-lg shadow-red-400/30 animate-pulse' 
                            : otpCode[index] 
                              ? 'border-green-400/60 bg-green-500/20 text-white shadow-lg shadow-green-400/30' 
                              : 'border-white/30 bg-white/10 text-white placeholder-white/50 focus:border-blue-400/60 focus:bg-blue-500/20 focus:shadow-lg focus:shadow-blue-400/30'
                        }`}
                        maxLength={1}
                        autoFocus={index === 0}
                      />
                      {otpCode[index] && !otpError && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/30">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                      {otpCode[index] && otpError && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/30">
                          <X className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Progress indicator */}
                <div className="flex justify-center space-x-1">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className={`h-1 w-8 rounded-full transition-all duration-300 ${
                      otpError && otpCode[index] 
                        ? 'bg-red-400/80 shadow-lg shadow-red-400/50' 
                        : otpCode[index] 
                          ? 'bg-green-400/80 shadow-lg shadow-green-400/50' 
                          : 'bg-white/20'
                    }`}></div>
                  ))}
                </div>
              </div>

              {/* Development OTP Display - Only in Development */}
              {import.meta.env.DEV && developmentOtp && (
                <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 backdrop-blur-xl rounded-xl p-6 border border-orange-400/30 shadow-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                    <span className="text-orange-200 font-bold text-sm">DEVELOPMENT MODE</span>
                  </div>
                  <div className="text-center">
                    <p className="text-orange-100 text-sm mb-2">Development OTP Code:</p>
                    <div className="bg-orange-900/50 border border-orange-400/50 rounded-lg p-4">
                      <span className="text-orange-200 font-mono font-bold text-2xl tracking-widest">
                        {developmentOtp}
                      </span>
                    </div>
                    <p className="text-orange-200/80 text-xs mt-2">
                      Use this code for testing or check your email
                    </p>
                  </div>
                </div>
              )}

              {/* Premium Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleOTPSubmit}
                  disabled={otpLoading || otpCode.length !== 6}
                  className="w-full bg-gradient-to-r from-blue-600/80 via-indigo-600/80 to-purple-600/80 backdrop-blur-xl border border-white/20 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700/90 hover:via-indigo-700/90 hover:to-purple-700/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] disabled:hover:scale-100 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {otpLoading ? (
                    <div className="flex items-center justify-center space-x-3 relative z-10">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Verifying Your Code...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-3 relative z-10">
                      <span>Verify & Continue</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
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
      </div>
    )}
    </>
  )
}

export default SignUp