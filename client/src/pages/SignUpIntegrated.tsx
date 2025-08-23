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
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else {
      const passwordValidation = validatePassword(formData.password)
      if (passwordValidation.score < 3) {
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
                  <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.89 2.75.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleGoogleSignUp}
                  disabled={isLoading}
                  className="p-3 border-gray-300 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </Button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <form onSubmit={handleSignUp} className="space-y-4">
                {/* Name field */}
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`mt-1 ${errors.fullName ? 'border-red-500' : ''}`}
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                {/* Email field */}
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Password field */}
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                  
                  {/* Password strength indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Password strength:</span>
                        <span className={`text-xs font-bold ${
                          passwordRequirements.strength === 'Strong' ? 'text-green-600' :
                          passwordRequirements.strength === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {passwordRequirements.strength}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            passwordRequirements.strength === 'Strong' ? 'bg-green-500' :
                            passwordRequirements.strength === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${(passwordRequirements.score / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white h-12 rounded-lg font-medium"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating account...
                    </div>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{' '}
                <button 
                  onClick={() => setLocation('/signin')}
                  className="text-gray-900 font-medium hover:underline"
                >
                  Sign in
                </button>
              </p>
            </>
          )}

          {/* Step 1: Email Verification */}
          {currentStep === 1 && user && (
            <div className="space-y-6">
              {/* Verification content */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
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

          {/* All old onboarding steps removed - now handled by modal after redirect */}
        </div>
      </div>
    </div>
  )
}

export default SignUpIntegrated