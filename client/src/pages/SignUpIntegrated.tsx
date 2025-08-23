import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Mail, ArrowLeft, Check, Eye, EyeOff } from "lucide-react"
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth"
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useLocation } from "wouter"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiRequest } from "@/lib/queryClient"

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const validatePassword = (password: string) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }
  
  const score = Object.values(checks).filter(Boolean).length
  let strength = ''
  if (score < 2) strength = 'Weak'
  else if (score < 4) strength = 'Medium'
  else strength = 'Strong'
  
  return { ...checks, score, strength }
}

function SignUpIntegrated() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [sentOtpCode, setSentOtpCode] = useState<string | null>(null)
  const [verificationTimer, setVerificationTimer] = useState(0)
  
  const { toast } = useToast()
  const { user, signInWithGoogle } = useFirebaseAuth()
  const [, setLocation] = useLocation()
  const queryClient = useQueryClient()

  // Fetch user data
  const { data: userData, isLoading: userDataLoading, refetch: refetchUserData } = useQuery({
    queryKey: ['/api/user'],
    enabled: !!user,
  })

  // Send verification email mutation
  const sendVerificationMutation = useMutation({
    mutationFn: (email: string) => 
      apiRequest('/api/auth/send-verification', {
        method: 'POST',
        body: JSON.stringify({ email })
      }),
    onSuccess: (data: any) => {
      console.log('🔑 DEVELOPMENT OTP:', data.otp)
      setSentOtpCode(data.otp)
      setVerificationTimer(60)
      toast({
        title: "Verification email sent!",
        description: "Please check your email for the verification code.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send verification email. Please try again.",
        variant: "destructive",
      })
    }
  })

  // Verify email mutation
  const verifyEmailMutation = useMutation({
    mutationFn: (code: string) => 
      apiRequest('/api/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ 
          email: user?.email,
          code: code 
        })
      }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] })
      toast({
        title: "Email verified!",
        description: "Your email has been successfully verified.",
      })
      
      // If user needs onboarding, redirect to dashboard where modal will show
      if (data.requiresOnboarding) {
        console.log('Redirecting to dashboard for modal onboarding')
        setLocation('/')
      } else {
        setLocation('/')
      }
    },
    onError: (error: any) => {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid verification code. Please try again.",
        variant: "destructive",
      })
    }
  })

  // Timer effect for resend verification
  useEffect(() => {
    if (verificationTimer > 0) {
      const timer = setTimeout(() => setVerificationTimer(prev => prev - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [verificationTimer])

  // Auto-fill OTP in development
  useEffect(() => {
    if (sentOtpCode && verificationCode !== sentOtpCode) {
      setVerificationCode(sentOtpCode)
    }
  }, [sentOtpCode])

  const handleBackToLanding = () => {
    setLocation('/')
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else {
      const passwordCheck = validatePassword(formData.password)
      if (passwordCheck.score < 3) {
        newErrors.password = 'Password must be stronger (at least 8 characters with uppercase, lowercase, number)'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      setIsLoading(true)
      try {
        console.log('🚀 Creating Firebase user with email:', formData.email)
        
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
        console.log('✅ Firebase user created successfully:', userCredential.user.uid)
        
        // Send verification email
        sendVerificationMutation.mutate(formData.email)
        
        // Move to email verification step
        setCurrentStep(1)
        
        toast({
          title: "Account created!",
          description: "Please verify your email to continue.",
        })
      } catch (error: any) {
        console.error('❌ Firebase signup error:', error)
        let errorMessage = 'Failed to create account. Please try again.'
        
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'An account with this email already exists. Please try signing in instead.'
        } else if (error.code === 'auth/weak-password') {
          errorMessage = 'Password is too weak. Please choose a stronger password.'
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'Please enter a valid email address.'
        }
        
        toast({
          title: "Error",
          description: errorMessage,
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

  const passwordRequirements = validatePassword(formData.password)

  // Get current step info
  const getStepInfo = () => {
    const steps = [
      { title: "Let's create your account", subtitle: "Sign up with social and add your first social account in one step" },
      { title: "Verify Your Email", subtitle: "We've sent a verification code to your email address" }
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
            <div className="text-sm text-gray-600 mb-2">Step {currentStep + 1} of 2</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gray-900 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${((currentStep + 1) / 2) * 100}%` }}
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
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`w-full pr-12 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {/* Password strength indicator */}
                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded ${
                              level <= passwordRequirements.score
                                ? passwordRequirements.score <= 2
                                  ? 'bg-red-500'
                                  : passwordRequirements.score <= 3
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600">
                        Password strength: {passwordRequirements.strength}
                      </p>
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
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white h-12"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Creating account...
                    </div>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>

              <div className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{' '}
                <button 
                  onClick={() => setLocation('/signin')}
                  className="text-gray-900 hover:underline font-medium"
                >
                  Sign in
                </button>
              </div>
            </>
          )}

          {/* Step 1: Email Verification */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <button 
                  onClick={() => setCurrentStep(0)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-6"
                >
                  <ArrowLeft className="w-4 h-4" />
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
                  <p className="text-gray-600 mb-8 max-w-sm mx-auto">Redirecting you to complete your setup...</p>
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
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

          {/* All old onboarding steps removed - now handled by modal after redirect */}
        </div>
      </div>
    </div>
  )
}

export default SignUpIntegrated