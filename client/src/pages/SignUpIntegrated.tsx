import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '@/lib/queryClient'
import { 
  Eye, 
  EyeOff, 
  ArrowLeft,
  ChevronLeft, 
  ChevronRight, 
  Mail, 
  Check, 
  Star, 
  Target, 
  Users, 
  TrendingUp, 
  Shield,
  Zap,
  Crown,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Heart,
  Briefcase,
  Sparkles
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { signUpWithEmail, signInWithGoogle } from '@/lib/firebase'
import { useLocation } from 'wouter'

interface SignUpIntegratedProps {
  onNavigate: (view: string) => void
}

const SignUpIntegrated = ({ onNavigate }: SignUpIntegratedProps) => {
  console.log('🔥 SignUpIntegrated component mounted')
  const { user } = useFirebaseAuth()
  const [, setLocation] = useLocation()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Current step state (0 = signup, 1 = email verify, 2 = plan, 3 = social, 4 = profile, 5 = complete)
  const [currentStep, setCurrentStep] = useState(0)
  
  // Signup form state
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  // Email verification state
  const [verificationCode, setVerificationCode] = useState('')
  const [isVerificationSent, setIsVerificationSent] = useState(false)
  const [verificationTimer, setVerificationTimer] = useState(0)
  const [sentOtpCode, setSentOtpCode] = useState('') // For development - show OTP on screen

  // Onboarding data
  const [onboardingData, setOnboardingData] = useState({
    planSelected: 'free',
    socialAccountsConnected: [] as string[],
    userProfile: {
      goals: [] as string[],
      niche: '',
      targetAudience: '',
      businessType: '',
      experienceLevel: '',
      primaryObjective: ''
    }
  })

  // Get user data when authenticated
  const { data: userData, isLoading: userDataLoading } = useQuery({
    queryKey: ['/api/user'],
    queryFn: () => apiRequest('/api/user'),
    enabled: !!user,
    retry: false
  })

  // Auto-advance steps based on user state
  useEffect(() => {
    // Wait for both user and userData to be fully loaded to prevent timing issues
    if (user && userData && !userDataLoading) {
      if (currentStep === 0) {
        // Check database isEmailVerified status, not Firebase emailVerified
        if (!userData.isEmailVerified) {
          setCurrentStep(1)
          if (!isVerificationSent) {
            sendVerificationMutation.mutate(user.email!)
          }
        } else if (!userData.isOnboarded) {
          // User is email verified but not onboarded, go to plan selection
          setCurrentStep(2)
        }
      }
    }
  }, [user, userData, userDataLoading, currentStep, isVerificationSent])

  // Send verification email
  const sendVerificationMutation = useMutation({
    mutationFn: (email: string) => 
      apiRequest('/api/auth/send-verification', {
        method: 'POST',
        body: JSON.stringify({ email })
      }),
    onSuccess: (response: any) => {
      setIsVerificationSent(true)
      setVerificationTimer(60)
      
      // For development - show OTP code on screen
      if (response && response.developmentOtp) {
        setSentOtpCode(response.developmentOtp)
      }
      
      toast({
        title: "Verification email sent!",
        description: "Please check your email for the verification code.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send verification email",
        variant: "destructive",
      })
    }
  })

  // Verify email code
  const verifyEmailMutation = useMutation({
    mutationFn: (code: string) => 
      apiRequest('/api/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ 
          email: user?.email,
          code: code 
        })
      }),
    onSuccess: () => {
      setCurrentStep(2)
      queryClient.invalidateQueries({ queryKey: ['/api/user'] })
      toast({
        title: "Email verified!",
        description: "Your email has been successfully verified.",
      })
    },
    onError: (error: any) => {
      console.error('Verification error:', error)
      toast({
        title: "Verification failed",
        description: error.message || "Invalid verification code. Please try again.",
        variant: "destructive",
      })
    }
  })

  // Complete onboarding
  const completeOnboardingMutation = useMutation({
    mutationFn: (data: any) => 
      apiRequest('/api/user/complete-onboarding', {
        method: 'POST',
        body: JSON.stringify({
          preferences: data || {}
        })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] })
      toast({
        title: "Welcome to VeeFore!",
        description: "Your account has been set up successfully.",
      })
      setLocation('/')
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to complete onboarding",
        variant: "destructive",
      })
    }
  })

  // Timer effect for verification email
  useEffect(() => {
    if (verificationTimer > 0) {
      const timer = setTimeout(() => setVerificationTimer(prev => prev - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [verificationTimer])

  const handleBackToLanding = () => {
    onNavigate('')
  }

  const handleStepBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    } else {
      handleBackToLanding()
    }
  }

  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    }
    return requirements
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('🔥 Form submitted with data:', formData)
    
    const newErrors = {
      fullName: '',
      email: '',
      password: ''
    }

    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your name'
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Validate password
    const passwordReqs = validatePassword(formData.password)
    if (!passwordReqs.length || !passwordReqs.uppercase || !passwordReqs.lowercase || !passwordReqs.special) {
      newErrors.password = 'Password does not meet requirements'
    }

    console.log('🔥 Validation errors:', newErrors)
    setErrors(newErrors)

    if (!newErrors.fullName && !newErrors.email && !newErrors.password) {
      setIsLoading(true)
      console.log('🔥 Starting Firebase signup with:', { email: formData.email, passwordLength: formData.password.length })
      
      try {
        // Step 1: Create Firebase account
        await signUpWithEmail(formData.email, formData.password)
        console.log('🔥 Firebase signup successful')
        
        // Step 2: Wait a moment for Firebase auth state to be established
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Step 3: Send verification email with user's name
        sendVerificationMutation.mutate(formData.email)
        
        toast({
          title: "Account created!",
          description: "Please check your email for verification code.",
        })
      } catch (error: any) {
        console.error('🔥 Signup error:', error)
        toast({
          title: "Error",
          description: error.message || "Failed to create account. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      console.log('🔥 Form validation failed, not proceeding with signup')
    }
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    try {
      await signInWithGoogle()
      // Will redirect via App.tsx logic
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign up with Google. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = () => {
    completeOnboardingMutation.mutate({
      step: 6,
      ...onboardingData
    })
  }

  const passwordRequirements = validatePassword(formData.password)

  // Get current step info
  const getStepInfo = () => {
    const steps = [
      { title: "Let's create your account", subtitle: "Sign up with social and add your first social account in one step" },
      { title: "Verify Your Email", subtitle: "We've sent a verification code to your email address" },
      { title: "Choose Your Plan", subtitle: "Select the plan that best fits your content creation needs" },
      { title: "Connect Social Accounts", subtitle: "Connect your social media accounts to start publishing content" },
      { title: "Tell Us About You", subtitle: "Help us personalize your VeeFore experience" },
      { title: "You're All Set!", subtitle: "Welcome to VeeFore! Your account has been configured based on your preferences." }
    ]
    return steps[currentStep] || steps[0]
  }

  const stepInfo = getStepInfo()

  // Debug logging
  console.log('SignUpIntegrated render state:', {
    user: !!user,
    userData: !!userData,
    userDataLoading,
    shouldShowLoading: user && userDataLoading
  })

  // Show loading state only when we have a user but are still loading their data
  if (user && userDataLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            border: '4px solid #3b82f6', 
            borderTop: '4px solid transparent', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px auto'
          }}></div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#111827' }}>
            Setting up your VeeFore experience
          </div>
          <div style={{ color: '#6b7280' }}>Please wait while we load your account...</div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen flex"
      style={{ 
        minHeight: '100vh', 
        display: 'flex',
        backgroundColor: '#ffffff',
        visibility: 'visible',
        opacity: 1,
        position: 'relative',
        zIndex: 1
      }}
    >

      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-300 to-green-400 items-center justify-center relative">
        <div className="absolute top-8 left-8">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleBackToLanding}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-gray-800 font-bold text-xl">VeeFore</span>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          {/* Owl Illustration */}
          <div className="relative w-64 h-64 mx-auto mb-8">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Owl body */}
              <ellipse cx="100" cy="130" rx="60" ry="70" fill="#EF4444" />
              
              {/* Owl head */}
              <circle cx="100" cy="80" r="45" fill="#EF4444" />
              
              {/* Wing */}
              <ellipse cx="120" cy="120" rx="25" ry="35" fill="#DC2626" transform="rotate(15 120 120)" />
              
              {/* Eyes */}
              <circle cx="88" cy="75" r="12" fill="white" />
              <circle cx="112" cy="75" r="12" fill="white" />
              <circle cx="88" cy="75" r="6" fill="black" />
              <circle cx="112" cy="75" r="6" fill="black" />
              
              {/* Beak */}
              <polygon points="100,85 95,95 105,95" fill="#FFA500" />
              
              {/* Feet */}
              <ellipse cx="85" cy="185" rx="8" ry="4" fill="#FFA500" />
              <ellipse cx="115" cy="185" rx="8" ry="4" fill="#FFA500" />
            </svg>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-8 flex items-center space-x-2 text-gray-700">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">English</span>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          {/* Back button for mobile */}
          <div className="lg:hidden mb-6">
            <button 
              onClick={handleBackToLanding}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to home</span>
            </button>
          </div>
          
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="text-sm text-gray-600 mb-2">Step {currentStep + 1} of 6</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gray-900 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${((currentStep + 1) / 6) * 100}%` }}
              ></div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {stepInfo.title}
          </h1>
          <p className="text-gray-600 mb-8">
            {stepInfo.subtitle}
          </p>

          {/* Step 0: Initial Sign Up */}
          {currentStep === 0 && (
            <>
              {/* Social login buttons */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <Button 
                  variant="outline" 
                  className="p-3 border-gray-300 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </Button>
                <Button 
                  variant="outline" 
                  className="p-3 border-gray-300 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </Button>
                <Button 
                  variant="outline" 
                  className="p-3 border-gray-300 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </Button>
                <Button 
                  variant="outline" 
                  className="p-3 border-gray-300 hover:bg-gray-50"
                  onClick={handleGoogleSignUp}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </Button>
              </div>

              <div className="text-center text-gray-500 mb-6">or</div>

              {/* Form fields */}
              <form onSubmit={handleSignUp} className="space-y-6">
                {/* Full name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                    Full name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`w-full ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.fullName && (
                    <div className="flex items-center space-x-1 text-red-600 text-sm">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{errors.fullName}</span>
                    </div>
                  )}
                </div>

                {/* Business email address */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Business email address
                  </Label>
                  <p className="text-xs text-gray-500">Note that you will be required to verify this email address.</p>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.email && (
                    <div className="flex items-center space-x-1 text-red-600 text-sm">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`w-full pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  
                  {/* Password requirements */}
                  {formData.password && (
                    <div className="text-sm">
                      <p className="text-gray-700 mb-1">Passwords must contain:</p>
                      <div className="space-y-1">
                        <div className={`flex items-center space-x-2 ${passwordRequirements.length ? 'text-green-600' : 'text-red-600'}`}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>at least 12 characters</span>
                        </div>
                        <div className={`flex items-center space-x-2 ${passwordRequirements.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>an uppercase letter</span>
                        </div>
                        <div className={`flex items-center space-x-2 ${passwordRequirements.lowercase ? 'text-green-600' : 'text-red-600'}`}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>a lowercase letter</span>
                        </div>
                        <div className={`flex items-center space-x-2 ${passwordRequirements.special ? 'text-green-600' : 'text-red-600'}`}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>a special character</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {errors.password && (
                    <div className="flex items-center space-x-1 text-red-600 text-sm">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{errors.password}</span>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                >
                  {isLoading ? "Creating Account..." : "Create My Account"}
                </Button>
              </form>

              <div className="mt-6 text-center text-xs text-gray-500">
                By creating an account, I agree to{" "}
                <a href="#" className="text-blue-600 hover:underline">VeeFore's Terms</a>
                , including the payment terms and{" "}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </div>
            </>
          )}

          {/* Step 1: Email Verification - Premium UI */}
          {currentStep === 1 && (
            <div className="space-y-8">
              {/* Back button for email verification step */}
              <div className="mb-6">
                <button 
                  onClick={handleStepBack}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
              </div>
              
              {userData?.isEmailVerified ? (
                <div className="text-center py-12">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">
                      <Check className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Email Verified!</h3>
                  <p className="text-gray-600 mb-8 max-w-sm mx-auto">Perfect! Your email is confirmed. Let's continue setting up your VeeFore experience.</p>
                  <Button onClick={handleNext} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg shadow-lg transform transition hover:scale-105">
                    Continue to Plans <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Mail className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Check Your Email</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We've sent a 6-digit verification code to<br />
                      <span className="font-semibold text-gray-900">{user?.email}</span>
                    </p>
                  </div>

                  {/* Development OTP Display - Enhanced */}
                  {sentOtpCode && (
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-6 mb-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-3">
                          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse mr-2"></div>
                          <p className="text-sm font-semibold text-amber-800">Development Mode</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-amber-200">
                          <p className="text-3xl font-bold text-gray-900 tracking-widest">{sentOtpCode}</p>
                        </div>
                        <p className="text-xs text-amber-700 mt-2">Auto-filled for testing</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Enhanced OTP Input */}
                  <div className="space-y-4">
                    <Label htmlFor="verification-code" className="text-base font-semibold text-gray-700">Enter Verification Code</Label>
                    <div className="relative">
                      <Input
                        id="verification-code"
                        placeholder="000000"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                        maxLength={6}
                        className="text-center text-2xl tracking-[0.5em] font-bold h-16 border-2 border-gray-200 focus:border-blue-500 rounded-xl shadow-sm"
                      />
                      {verificationCode.length === 6 && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <Check className="w-6 h-6 text-green-500" />
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => verifyEmailMutation.mutate(verificationCode)}
                    disabled={verificationCode.length !== 6 || verifyEmailMutation.isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-14 rounded-xl font-semibold shadow-lg transform transition hover:scale-[1.02] disabled:transform-none disabled:bg-gray-300"
                  >
                    {verifyEmailMutation.isPending ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Verifying...
                      </div>
                    ) : (
                      "Verify Email"
                    )}
                  </Button>

                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-500 mb-3">Didn't receive the code?</p>
                    <Button
                      variant="ghost"
                      onClick={() => sendVerificationMutation.mutate(user?.email!)}
                      disabled={verificationTimer > 0 || sendVerificationMutation.isPending}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      {verificationTimer > 0
                        ? `Resend in ${verificationTimer}s`
                        : "Send New Code"
                      }
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Plan Selection - Premium UI */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Choose Your Plan</h3>
                <p className="text-gray-600 max-w-md mx-auto">Select the perfect plan to power your social media success</p>
              </div>

              <div className="grid gap-6">
                {/* Free Plan */}
                <div 
                  onClick={() => setOnboardingData(prev => ({...prev, planSelected: 'free'}))}
                  className={`relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 group ${
                    onboardingData.planSelected === 'free' 
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg scale-[1.02]' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  style={{
                    position: 'relative',
                    padding: '24px',
                    border: onboardingData.planSelected === 'free' ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: onboardingData.planSelected === 'free' 
                      ? 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)' 
                      : '#ffffff',
                    boxShadow: onboardingData.planSelected === 'free' 
                      ? '0 10px 25px rgba(59, 130, 246, 0.15)' 
                      : '0 1px 3px rgba(0, 0, 0, 0.1)',
                    transform: onboardingData.planSelected === 'free' ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-bold text-gray-900">Free</h3>
                        <Target className="w-5 h-5 text-green-500 ml-2" />
                      </div>
                      <p className="text-gray-600">Perfect for getting started</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900">₹0</div>
                      <div className="text-sm text-gray-500">forever</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 mb-4 border border-gray-100">
                    <div className="text-center mb-3">
                      <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">20 Credits/month</span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />1 Social Account</div>
                      <div className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />1 Workspace</div>
                      <div className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />AI Image Generator (8/month)</div>
                      <div className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Basic Scheduler</div>
                    </div>
                  </div>
                  {onboardingData.planSelected === 'free' && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Starter Plan */}
                <div 
                  onClick={() => setOnboardingData(prev => ({...prev, planSelected: 'starter'}))}
                  className={`relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 group ${
                    onboardingData.planSelected === 'starter' 
                      ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 shadow-xl scale-[1.02]' 
                      : 'border-orange-200 hover:border-orange-300 hover:shadow-lg'
                  }`}
                  style={{
                    position: 'relative',
                    padding: '24px',
                    border: onboardingData.planSelected === 'starter' ? '2px solid #f97316' : '2px solid #fed7aa',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: onboardingData.planSelected === 'starter' 
                      ? 'linear-gradient(135deg, #fff7ed 0%, #fef2f2 100%)' 
                      : '#ffffff',
                    boxShadow: onboardingData.planSelected === 'starter' 
                      ? '0 15px 35px rgba(249, 115, 22, 0.2)' 
                      : '0 4px 10px rgba(249, 115, 22, 0.1)',
                    transform: onboardingData.planSelected === 'starter' ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 shadow-lg">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                  <div className="flex justify-between items-start mb-4 mt-2">
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-bold text-gray-900">Starter</h3>
                        <Zap className="w-5 h-5 text-orange-500 ml-2" />
                      </div>
                      <p className="text-gray-600">For growing creators</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900">₹699</div>
                      <div className="text-sm text-gray-500">/month</div>
                      <div className="text-xs text-green-600 font-semibold">Save ₹1200 yearly</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 mb-4 border border-orange-100">
                    <div className="text-center mb-3">
                      <span className="inline-block bg-orange-100 text-orange-800 text-sm font-semibold px-3 py-1 rounded-full">300 Credits/month</span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />2 Social Accounts</div>
                      <div className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />All Free features</div>
                      <div className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Full Automation (DM & Comments)</div>
                      <div className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Trend Calendar</div>
                    </div>
                  </div>
                  {onboardingData.planSelected === 'starter' && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Pro Plan */}
                <div 
                  onClick={() => setOnboardingData(prev => ({...prev, planSelected: 'pro'}))}
                  className={`relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 group ${
                    onboardingData.planSelected === 'pro' 
                      ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg scale-[1.02]' 
                      : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                  style={{
                    position: 'relative',
                    padding: '24px',
                    border: onboardingData.planSelected === 'pro' ? '2px solid #a855f7' : '2px solid #e5e7eb',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: onboardingData.planSelected === 'pro' 
                      ? 'linear-gradient(135deg, #faf5ff 0%, #fdf2f8 100%)' 
                      : '#ffffff',
                    boxShadow: onboardingData.planSelected === 'pro' 
                      ? '0 15px 35px rgba(168, 85, 247, 0.2)' 
                      : '0 4px 10px rgba(168, 85, 247, 0.1)',
                    transform: onboardingData.planSelected === 'pro' ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-bold text-gray-900">Pro</h3>
                        <TrendingUp className="w-5 h-5 text-purple-500 ml-2" />
                      </div>
                      <p className="text-gray-600">For serious marketers</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900">₹1,499</div>
                      <div className="text-sm text-gray-500">/month</div>
                      <div className="text-xs text-green-600 font-semibold">Save ₹2000 yearly</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 mb-4 border border-purple-100">
                    <div className="text-center mb-3">
                      <span className="inline-block bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full">1,100 Credits/month</span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />2 Workspaces</div>
                      <div className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />2 Team Members</div>
                      <div className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Video Generator (30s)</div>
                      <div className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />YouTube SEO Tools</div>
                    </div>
                  </div>
                  {onboardingData.planSelected === 'pro' && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Business Plan */}
                <div 
                  onClick={() => setOnboardingData(prev => ({...prev, planSelected: 'business'}))}
                  className={`relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 group ${
                    onboardingData.planSelected === 'business' 
                      ? 'border-gray-900 bg-gradient-to-br from-gray-50 to-slate-100 shadow-lg scale-[1.02]' 
                      : 'border-gray-200 hover:border-gray-400 hover:shadow-md'
                  }`}
                  style={{
                    position: 'relative',
                    padding: '24px',
                    border: onboardingData.planSelected === 'business' ? '2px solid #111827' : '2px solid #e5e7eb',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: onboardingData.planSelected === 'business' 
                      ? 'linear-gradient(135deg, #f9fafb 0%, #f1f5f9 100%)' 
                      : '#ffffff',
                    boxShadow: onboardingData.planSelected === 'business' 
                      ? '0 15px 35px rgba(17, 24, 39, 0.2)' 
                      : '0 4px 10px rgba(17, 24, 39, 0.1)',
                    transform: onboardingData.planSelected === 'business' ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-bold text-gray-900">Business</h3>
                        <Users className="w-5 h-5 text-gray-700 ml-2" />
                      </div>
                      <p className="text-gray-600">For teams & enterprises</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900">₹2,199</div>
                      <div className="text-sm text-gray-500">/month</div>
                      <div className="text-xs text-green-600 font-semibold">Save ₹7200 yearly</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 mb-4 border border-gray-100">
                    <div className="text-center mb-3">
                      <span className="inline-block bg-gray-100 text-gray-800 text-sm font-semibold px-3 py-1 rounded-full">2,000 Credits/month</span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />4 Social Accounts</div>
                      <div className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />8 Workspaces</div>
                      <div className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />3 Team Members</div>
                      <div className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Campaign Scheduling</div>
                    </div>
                  </div>
                  {onboardingData.planSelected === 'business' && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button 
                  variant="outline" 
                  onClick={handleBack} 
                  className="flex-1 h-12 border-2 rounded-xl font-semibold hover:bg-gray-50"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" /> Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg transform transition hover:scale-[1.02]"
                >
                  Continue <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Connect Social Accounts - Premium UI */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="grid grid-cols-2 gap-1">
                    <Instagram className="w-4 h-4 text-pink-500" />
                    <Facebook className="w-4 h-4 text-blue-600" />
                    <Twitter className="w-4 h-4 text-blue-400" />
                    <Linkedin className="w-4 h-4 text-blue-700" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Connect Your Platforms</h3>
                <p className="text-gray-600 max-w-md mx-auto">Link your social media accounts to unlock the full power of VeeFore's automation</p>
              </div>

              <div className="space-y-4">
                {/* Instagram */}
                <div 
                  onClick={() => {
                    const connected = onboardingData.socialAccountsConnected.includes('instagram')
                    if (connected) {
                      setOnboardingData(prev => ({
                        ...prev,
                        socialAccountsConnected: prev.socialAccountsConnected.filter(acc => acc !== 'instagram')
                      }))
                    } else {
                      setOnboardingData(prev => ({
                        ...prev,
                        socialAccountsConnected: [...prev.socialAccountsConnected, 'instagram']
                      }))
                    }
                  }}
                  className={`group relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                    onboardingData.socialAccountsConnected.includes('instagram')
                      ? 'border-pink-300 bg-gradient-to-br from-pink-50 to-rose-50 shadow-lg scale-[1.02]'
                      : 'border-gray-200 hover:border-pink-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Instagram className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Instagram</h3>
                        <p className="text-gray-600">Business account required</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">Stories</span>
                          <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full ml-1">Posts</span>
                          <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full ml-1">Reels</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {onboardingData.socialAccountsConnected.includes('instagram') ? (
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 py-2 rounded-lg shadow-lg transform transition hover:scale-105">
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Facebook */}
                <div 
                  onClick={() => {
                    const connected = onboardingData.socialAccountsConnected.includes('facebook')
                    if (connected) {
                      setOnboardingData(prev => ({
                        ...prev,
                        socialAccountsConnected: prev.socialAccountsConnected.filter(acc => acc !== 'facebook')
                      }))
                    } else {
                      setOnboardingData(prev => ({
                        ...prev,
                        socialAccountsConnected: [...prev.socialAccountsConnected, 'facebook']
                      }))
                    }
                  }}
                  className={`group relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                    onboardingData.socialAccountsConnected.includes('facebook')
                      ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg scale-[1.02]'
                      : 'border-gray-200 hover:border-blue-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Facebook className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Facebook</h3>
                        <p className="text-gray-600">Page & personal posts</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Posts</span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-1">Stories</span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-1">Pages</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {onboardingData.socialAccountsConnected.includes('facebook') ? (
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg shadow-lg transform transition hover:scale-105">
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Twitter */}
                <div 
                  onClick={() => {
                    const connected = onboardingData.socialAccountsConnected.includes('twitter')
                    if (connected) {
                      setOnboardingData(prev => ({
                        ...prev,
                        socialAccountsConnected: prev.socialAccountsConnected.filter(acc => acc !== 'twitter')
                      }))
                    } else {
                      setOnboardingData(prev => ({
                        ...prev,
                        socialAccountsConnected: [...prev.socialAccountsConnected, 'twitter']
                      }))
                    }
                  }}
                  className={`group relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                    onboardingData.socialAccountsConnected.includes('twitter')
                      ? 'border-sky-300 bg-gradient-to-br from-sky-50 to-blue-50 shadow-lg scale-[1.02]'
                      : 'border-gray-200 hover:border-sky-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Twitter className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Twitter/X</h3>
                        <p className="text-gray-600">Tweets & threads</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs bg-sky-100 text-sky-800 px-2 py-1 rounded-full">Tweets</span>
                          <span className="text-xs bg-sky-100 text-sky-800 px-2 py-1 rounded-full ml-1">Threads</span>
                          <span className="text-xs bg-sky-100 text-sky-800 px-2 py-1 rounded-full ml-1">DMs</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {onboardingData.socialAccountsConnected.includes('twitter') ? (
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <Button className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white px-6 py-2 rounded-lg shadow-lg transform transition hover:scale-105">
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* LinkedIn */}
                <div 
                  onClick={() => {
                    const connected = onboardingData.socialAccountsConnected.includes('linkedin')
                    if (connected) {
                      setOnboardingData(prev => ({
                        ...prev,
                        socialAccountsConnected: prev.socialAccountsConnected.filter(acc => acc !== 'linkedin')
                      }))
                    } else {
                      setOnboardingData(prev => ({
                        ...prev,
                        socialAccountsConnected: [...prev.socialAccountsConnected, 'linkedin']
                      }))
                    }
                  }}
                  className={`group relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                    onboardingData.socialAccountsConnected.includes('linkedin')
                      ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg scale-[1.02]'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-700 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Linkedin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">LinkedIn</h3>
                        <p className="text-gray-600">Professional networking</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Posts</span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-1">Articles</span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-1">Pages</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {onboardingData.socialAccountsConnected.includes('linkedin') ? (
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <Button className="bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-700 text-white px-6 py-2 rounded-lg shadow-lg transform transition hover:scale-105">
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Skip & Connect Later</h4>
                    <p className="text-blue-800 text-sm leading-relaxed">
                      No problem! You can connect your social accounts anytime from your dashboard. 
                      Start with at least one platform to experience VeeFore's powerful automation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button 
                  variant="outline" 
                  onClick={handleBack} 
                  className="flex-1 h-12 border-2 rounded-xl font-semibold hover:bg-gray-50"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" /> Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg transform transition hover:scale-[1.02]"
                >
                  Continue <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Tell Us About You - Premium UI */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Tell Us About You</h3>
                <p className="text-gray-600 max-w-md mx-auto">Help us customize VeeFore to your specific needs and goals</p>
              </div>

              <div className="space-y-8">
                {/* Content Goals */}
                <div className="space-y-4">
                  <Label className="text-lg font-bold text-gray-900">What are your main content goals?</Label>
                  <p className="text-gray-600 text-sm mb-4">Select all that apply to personalize your experience</p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: 'Brand Awareness', icon: Target, color: 'bg-blue-500' },
                      { name: 'Lead Generation', icon: TrendingUp, color: 'bg-green-500' }, 
                      { name: 'Sales Growth', icon: Zap, color: 'bg-yellow-500' },
                      { name: 'Community Building', icon: Users, color: 'bg-purple-500' },
                      { name: 'Thought Leadership', icon: Crown, color: 'bg-orange-500' },
                      { name: 'Customer Support', icon: Heart, color: 'bg-pink-500' }
                    ].map((goal) => {
                      const Icon = goal.icon
                      const isSelected = onboardingData.userProfile.goals.includes(goal.name)
                      return (
                        <div 
                          key={goal.name} 
                          onClick={() => {
                            if (isSelected) {
                              setOnboardingData(prev => ({
                                ...prev,
                                userProfile: {
                                  ...prev.userProfile,
                                  goals: prev.userProfile.goals.filter(g => g !== goal.name)
                                }
                              }))
                            } else {
                              setOnboardingData(prev => ({
                                ...prev,
                                userProfile: {
                                  ...prev.userProfile,
                                  goals: [...prev.userProfile.goals, goal.name]
                                }
                              }))
                            }
                          }}
                          className={`p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                            isSelected 
                              ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg scale-[1.02]' 
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 ${goal.color} rounded-xl flex items-center justify-center shadow-lg`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{goal.name}</h4>
                            </div>
                            {isSelected && (
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Business Type */}
                <div className="space-y-4">
                  <Label className="text-lg font-bold text-gray-900">What type of business/profile do you have?</Label>
                  <div className="space-y-3">
                    {[
                      { name: 'Personal Brand/Influencer', icon: Users, desc: 'Individual creator or public figure' },
                      { name: 'Small Business/Startup', icon: Target, desc: 'Growing business or new venture' },
                      { name: 'E-commerce Store', icon: TrendingUp, desc: 'Online retail and product sales' },
                      { name: 'Service Provider', icon: Briefcase, desc: 'Professional services and consulting' },
                      { name: 'Agency/Marketing Company', icon: Crown, desc: 'Marketing agency or consultancy' },
                      { name: 'Non-profit Organization', icon: Heart, desc: 'Charitable or social cause' },
                      { name: 'Enterprise/Corporation', icon: Shield, desc: 'Large company or corporation' }
                    ].map((type) => {
                      const Icon = type.icon
                      const isSelected = onboardingData.userProfile.businessType === type.name
                      return (
                        <div 
                          key={type.name}
                          onClick={() => setOnboardingData(prev => ({
                            ...prev,
                            userProfile: { ...prev.userProfile, businessType: type.name }
                          }))}
                          className={`p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                            isSelected 
                              ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg scale-[1.02]' 
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{type.name}</h4>
                              <p className="text-sm text-gray-600">{type.desc}</p>
                            </div>
                            {isSelected && (
                              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Experience Level */}
                <div className="space-y-4">
                  <Label className="text-lg font-bold text-gray-900">What's your experience with social media marketing?</Label>
                  <div className="space-y-3">
                    {[
                      { name: 'Beginner - Just getting started', level: 1, color: 'bg-red-500' },
                      { name: 'Intermediate - Some experience', level: 2, color: 'bg-yellow-500' },
                      { name: 'Advanced - Very experienced', level: 3, color: 'bg-blue-500' },
                      { name: 'Expert - Professional level', level: 4, color: 'bg-purple-500' }
                    ].map((experience) => {
                      const isSelected = onboardingData.userProfile.experienceLevel === experience.name
                      return (
                        <div 
                          key={experience.name}
                          onClick={() => setOnboardingData(prev => ({
                            ...prev,
                            userProfile: { ...prev.userProfile, experienceLevel: experience.name }
                          }))}
                          className={`p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                            isSelected 
                              ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg scale-[1.02]' 
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 ${experience.color} rounded-xl flex items-center justify-center shadow-lg`}>
                              <div className="flex space-x-1">
                                {Array.from({ length: experience.level }).map((_, i) => (
                                  <div key={i} className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                ))}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{experience.name}</h4>
                            </div>
                            {isSelected && (
                              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-6">
                <Button 
                  variant="outline" 
                  onClick={handleBack} 
                  className="flex-1 h-12 border-2 rounded-xl font-semibold hover:bg-gray-50"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" /> Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold shadow-lg transform transition hover:scale-[1.02]"
                >
                  Continue <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Welcome & Completion - Premium UI */}
          {currentStep === 5 && (
            <div className="space-y-8">
              <div className="text-center py-12">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <Sparkles className="w-12 h-12 text-emerald-500" />
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Welcome to VeeFore!</h3>
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                  🎉 Your account is ready! Here's your personalized setup summary:
                </p>
                
                <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 rounded-3xl p-8 text-left max-w-lg mx-auto shadow-xl">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                          <Crown className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-gray-700 font-medium">Plan Selected</span>
                      </div>
                      <span className="font-bold text-gray-900 capitalize bg-white px-3 py-1 rounded-lg shadow-sm">
                        {onboardingData.planSelected}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-gray-700 font-medium">Social Accounts</span>
                      </div>
                      <span className="font-bold text-gray-900 bg-white px-3 py-1 rounded-lg shadow-sm">
                        {onboardingData.socialAccountsConnected.length ? 
                          `${onboardingData.socialAccountsConnected.length} Connected` : 
                          'None yet'
                        }
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-gray-700 font-medium">Content Goals</span>
                      </div>
                      <span className="font-bold text-gray-900 bg-white px-3 py-1 rounded-lg shadow-sm">
                        {onboardingData.userProfile.goals.length ? 
                          `${onboardingData.userProfile.goals.length} Selected` : 
                          'Not set'
                        }
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-gray-700 font-medium">Business Type</span>
                      </div>
                      <span className="font-bold text-gray-900 text-sm bg-white px-3 py-1 rounded-lg shadow-sm">
                        {onboardingData.userProfile.businessType || 'Not specified'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl">
                  <h4 className="font-bold text-blue-900 mb-2">What's Next?</h4>
                  <p className="text-blue-800 text-sm leading-relaxed">
                    Connect your social accounts, create your first AI-powered content, 
                    and start automating your social media presence with VeeFore's powerful tools!
                  </p>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button 
                  variant="outline" 
                  onClick={handleBack} 
                  className="flex-1 h-12 border-2 rounded-xl font-semibold hover:bg-gray-50"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" /> Back
                </Button>
                <Button
                  onClick={handleComplete}
                  className="flex-1 h-12 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-700 hover:via-teal-700 hover:to-blue-700 text-white rounded-xl font-semibold shadow-xl transform transition hover:scale-[1.02]"
                  disabled={completeOnboardingMutation.isPending}
                >
                  {completeOnboardingMutation.isPending ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Setting up your workspace...
                    </div>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Enter VeeFore
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SignUpIntegrated