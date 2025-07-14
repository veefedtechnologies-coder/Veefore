import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
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
  Linkedin
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { signUpWithEmail, signInWithGoogle } from '@/lib/firebase'
import { useLocation } from 'wouter'

interface SignUpWithOnboardingProps {
  onNavigate: (view: string) => void
}

// Onboarding steps: 0 = signup, 1 = email verify, 2 = plan, 3 = social, 4 = profile, 5 = complete
const TOTAL_STEPS = 6

const SignUpWithOnboarding = ({ onNavigate }: SignUpWithOnboardingProps) => {
  const { user } = useFirebaseAuth()
  const [, setLocation] = useLocation()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Current step state
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

  // Auto-advance to verification step after successful signup
  useEffect(() => {
    if (user && !user.emailVerified && currentStep === 0) {
      setCurrentStep(1)
      // Auto-send verification email
      if (!isVerificationSent) {
        sendVerificationMutation.mutate(user.email!)
      }
    }
  }, [user, currentStep])

  // Send verification email
  const sendVerificationMutation = useMutation({
    mutationFn: (email: string) => 
      apiRequest('/api/auth/send-verification', {
        method: 'POST',
        body: JSON.stringify({ email })
      }),
    onSuccess: () => {
      setIsVerificationSent(true)
      setVerificationTimer(60)
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
        body: JSON.stringify({ code })
      }),
    onSuccess: () => {
      setCurrentStep(2)
      toast({
        title: "Email verified!",
        description: "Your email has been successfully verified.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid verification code",
        variant: "destructive",
      })
    }
  })

  // Complete onboarding
  const completeOnboardingMutation = useMutation({
    mutationFn: (data: any) => 
      apiRequest('/api/user/onboarding', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          isOnboarded: true
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
      newErrors.password = 'Password must be at least 12 characters with uppercase, lowercase, and special characters'
    }

    if (Object.values(newErrors).some(error => error)) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    try {
      await signUpWithEmail(formData.email, formData.password, formData.fullName)
      // User creation successful, will auto-advance to verification step via useEffect
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    try {
      await signInWithGoogle()
      // If successful, will redirect via useEffect in App.tsx
    } catch (error: any) {
      toast({
        title: "Google sign up failed",
        description: error.message || "Failed to sign up with Google",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
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
      step: TOTAL_STEPS,
      ...onboardingData
    })
  }

  const progress = currentStep === 0 ? 0 : ((currentStep - 1) / (TOTAL_STEPS - 2)) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header - only show after signup */}
      {currentStep > 0 && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">VeeFore Setup</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">Step {currentStep} of {TOTAL_STEPS - 1}</div>
              <Progress value={progress} className="w-32" />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Card className="shadow-xl border-0">
          {/* Step 0: Initial Sign Up */}
          {currentStep === 0 && (
            <>
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">V</span>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Join VeeFore</CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  Create your account and start managing your social media like a pro
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={errors.fullName ? 'border-red-500' : ''}
                    />
                    {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                    
                    {/* Password requirements */}
                    {formData.password && (
                      <div className="text-xs space-y-1">
                        {Object.entries(validatePassword(formData.password)).map(([req, met]) => (
                          <div key={req} className={`flex items-center ${met ? 'text-green-600' : 'text-gray-400'}`}>
                            <Check size={12} className="mr-1" />
                            {req === 'length' && '12+ characters'}
                            {req === 'uppercase' && 'Uppercase letter'}
                            {req === 'lowercase' && 'Lowercase letter'}
                            {req === 'special' && 'Special character'}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <Button
                  onClick={handleGoogleSignUp}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>

                <div className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    onClick={() => onNavigate('signin')}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </div>

                <button
                  onClick={() => onNavigate('landing')}
                  className="flex items-center text-sm text-gray-500 hover:text-gray-700 mx-auto"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back to home
                </button>
              </CardContent>
            </>
          )}

          {/* Step 1: Email Verification */}
          {currentStep === 1 && (
            <>
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Verify Your Email</CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  We've sent a verification code to your email address
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {user?.emailVerified ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Already Verified!</h3>
                    <p className="text-gray-600">Your email is verified. Let's continue with setup.</p>
                    <Button onClick={handleNext} className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600">
                      Continue <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">
                        We sent a 6-digit verification code to <strong>{user?.email}</strong>
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="verification-code">Verification Code</Label>
                      <Input
                        id="verification-code"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength={6}
                        className="text-center text-lg tracking-wider"
                      />
                    </div>

                    <Button
                      onClick={() => verifyEmailMutation.mutate(verificationCode)}
                      disabled={verificationCode.length !== 6 || verifyEmailMutation.isPending}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      {verifyEmailMutation.isPending ? "Verifying..." : "Verify Email"}
                    </Button>

                    <div className="text-center">
                      <Button
                        variant="ghost"
                        onClick={() => sendVerificationMutation.mutate(user?.email!)}
                        disabled={verificationTimer > 0 || sendVerificationMutation.isPending}
                        className="text-sm"
                      >
                        {verificationTimer > 0
                          ? `Resend in ${verificationTimer}s`
                          : "Resend Code"
                        }
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </>
          )}

          {/* Step 2: Plan Selection */}
          {currentStep === 2 && (
            <>
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Choose Your Plan</CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  Select the plan that best fits your content creation needs
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <RadioGroup
                  value={onboardingData.planSelected}
                  onValueChange={(value) => setOnboardingData(prev => ({ ...prev, planSelected: value }))}
                  className="space-y-4"
                >
                  {/* Free Plan */}
                  <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-blue-300 transition-colors">
                    <RadioGroupItem value="free" id="free" />
                    <Label htmlFor="free" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-gray-500" />
                            <span className="font-semibold">Free Plan</span>
                          </div>
                          <p className="text-sm text-gray-600">Perfect for getting started</p>
                          <p className="text-xs text-gray-500">5 posts/month • Basic analytics • Email support</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">$0</div>
                          <div className="text-xs text-gray-500">forever</div>
                        </div>
                      </div>
                    </Label>
                  </div>

                  {/* Starter Plan */}
                  <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-blue-300 transition-colors">
                    <RadioGroupItem value="starter" id="starter" />
                    <Label htmlFor="starter" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <Zap className="w-4 h-4 text-blue-500" />
                            <span className="font-semibold">Starter Plan</span>
                            <Badge variant="secondary" className="text-xs">Popular</Badge>
                          </div>
                          <p className="text-sm text-gray-600">For growing creators</p>
                          <p className="text-xs text-gray-500">50 posts/month • Advanced analytics • Priority support</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">$19</div>
                          <div className="text-xs text-gray-500">/month</div>
                        </div>
                      </div>
                    </Label>
                  </div>

                  {/* Pro Plan */}
                  <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-blue-300 transition-colors">
                    <RadioGroupItem value="pro" id="pro" />
                    <Label htmlFor="pro" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <Crown className="w-4 h-4 text-purple-500" />
                            <span className="font-semibold">Pro Plan</span>
                          </div>
                          <p className="text-sm text-gray-600">For professional creators</p>
                          <p className="text-xs text-gray-500">Unlimited posts • Team collaboration • Premium features</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">$49</div>
                          <div className="text-xs text-gray-500">/month</div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                <div className="flex space-x-3">
                  <Button variant="outline" onClick={handleBack} className="flex-1">
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!onboardingData.planSelected}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    Continue <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3: Social Media Integration */}
          {currentStep === 3 && (
            <>
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Instagram className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Connect Social Accounts</CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  Connect your social media accounts to start publishing content
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="text-center mb-6">
                  <p className="text-gray-600">Connect your social media accounts to start publishing content</p>
                  <p className="text-sm text-gray-500 mt-2">You can skip this step and connect accounts later</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 border-2 hover:border-pink-300 hover:bg-pink-50"
                  >
                    <Instagram className="w-6 h-6 text-pink-600" />
                    <span className="text-sm font-medium">Instagram</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 border-2 hover:border-blue-300 hover:bg-blue-50"
                  >
                    <Facebook className="w-6 h-6 text-blue-600" />
                    <span className="text-sm font-medium">Facebook</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 border-2 hover:border-blue-300 hover:bg-blue-50"
                  >
                    <Twitter className="w-6 h-6 text-blue-500" />
                    <span className="text-sm font-medium">Twitter</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 border-2 hover:border-blue-300 hover:bg-blue-50"
                  >
                    <Linkedin className="w-6 h-6 text-blue-700" />
                    <span className="text-sm font-medium">LinkedIn</span>
                  </Button>
                </div>

                <div className="flex space-x-3">
                  <Button variant="outline" onClick={handleBack} className="flex-1">
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button onClick={handleNext} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600">
                    Continue <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 4: User Profile */}
          {currentStep === 4 && (
            <>
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Tell Us About You</CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  Help us personalize your VeeFore experience
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Content Goals */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">What are your main content goals? (Select all that apply)</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'brand-awareness', label: 'Brand Awareness', icon: TrendingUp },
                        { id: 'lead-generation', label: 'Lead Generation', icon: Target },
                        { id: 'engagement', label: 'Engagement', icon: Users },
                        { id: 'sales', label: 'Sales', icon: Star }
                      ].map(goal => (
                        <div key={goal.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={goal.id}
                            checked={onboardingData.userProfile.goals.includes(goal.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setOnboardingData(prev => ({
                                  ...prev,
                                  userProfile: {
                                    ...prev.userProfile,
                                    goals: [...prev.userProfile.goals, goal.id]
                                  }
                                }))
                              } else {
                                setOnboardingData(prev => ({
                                  ...prev,
                                  userProfile: {
                                    ...prev.userProfile,
                                    goals: prev.userProfile.goals.filter(g => g !== goal.id)
                                  }
                                }))
                              }
                            }}
                          />
                          <Label htmlFor={goal.id} className="text-sm cursor-pointer">
                            {goal.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Niche */}
                  <div className="space-y-2">
                    <Label htmlFor="niche">What's your niche or industry?</Label>
                    <Input
                      id="niche"
                      placeholder="e.g., Fashion, Technology, Food, Travel"
                      value={onboardingData.userProfile.niche}
                      onChange={(e) => setOnboardingData(prev => ({
                        ...prev,
                        userProfile: { ...prev.userProfile, niche: e.target.value }
                      }))}
                    />
                  </div>

                  {/* Target Audience */}
                  <div className="space-y-2">
                    <Label htmlFor="target-audience">Who is your target audience?</Label>
                    <Input
                      id="target-audience"
                      placeholder="e.g., Young professionals, Small business owners"
                      value={onboardingData.userProfile.targetAudience}
                      onChange={(e) => setOnboardingData(prev => ({
                        ...prev,
                        userProfile: { ...prev.userProfile, targetAudience: e.target.value }
                      }))}
                    />
                  </div>

                  {/* Business Type */}
                  <div className="space-y-3">
                    <Label>What type of business or creator are you?</Label>
                    <RadioGroup
                      value={onboardingData.userProfile.businessType}
                      onValueChange={(value) => setOnboardingData(prev => ({
                        ...prev,
                        userProfile: { ...prev.userProfile, businessType: value }
                      }))}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="individual" id="individual" />
                        <Label htmlFor="individual">Individual Creator</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="small-business" id="small-business" />
                        <Label htmlFor="small-business">Small Business</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="agency" id="agency" />
                        <Label htmlFor="agency">Agency</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="enterprise" id="enterprise" />
                        <Label htmlFor="enterprise">Enterprise</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button variant="outline" onClick={handleBack} className="flex-1">
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button onClick={handleNext} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600">
                    Continue <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 5: Complete Setup */}
          {currentStep === 5 && (
            <>
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">You're All Set!</CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  Welcome to VeeFore! Your account has been configured based on your preferences.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2">
                  <h4 className="font-medium text-gray-900">Setup Summary:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Email verified</li>
                    <li>✓ {onboardingData.planSelected} plan selected</li>
                    <li>✓ Profile configured for {onboardingData.userProfile.businessType || 'your business'}</li>
                    <li>✓ Ready to create amazing content!</li>
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <Button variant="outline" onClick={handleBack} className="flex-1">
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button
                    onClick={handleComplete}
                    disabled={completeOnboardingMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-600"
                  >
                    {completeOnboardingMutation.isPending ? "Setting up..." : "Enter VeeFore"}
                  </Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}

export default SignUpWithOnboarding