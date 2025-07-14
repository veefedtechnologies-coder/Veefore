import React, { useState, useEffect } from 'react'
import { useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '@/lib/queryClient'
import { 
  ChevronLeft, 
  ChevronRight, 
  Mail, 
  Check, 
  X, 
  Star, 
  Target, 
  Users, 
  TrendingUp, 
  Palette, 
  Calendar, 
  Building, 
  BarChart,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Shield,
  Zap,
  Crown
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface OnboardingData {
  emailVerified: boolean
  planSelected: string
  socialAccountsConnected: string[]
  userProfile: {
    goals: string[]
    niche: string
    targetAudience: string
    contentStyle: string
    postingFrequency: string
    businessType: string
    experienceLevel: string
    primaryObjective: string
    additionalInfo: string
  }
}

const TOTAL_STEPS = 5

export default function ProfessionalOnboarding() {
  const { user } = useFirebaseAuth()
  const [, setLocation] = useLocation()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    emailVerified: false,
    planSelected: 'free',
    socialAccountsConnected: [],
    userProfile: {
      goals: [],
      niche: '',
      targetAudience: '',
      contentStyle: '',
      postingFrequency: '',
      businessType: '',
      experienceLevel: '',
      primaryObjective: '',
      additionalInfo: ''
    }
  })

  // Email verification state
  const [verificationCode, setVerificationCode] = useState('')
  const [isVerificationSent, setIsVerificationSent] = useState(false)
  const [verificationTimer, setVerificationTimer] = useState(0)

  // Get user data
  const { data: userData, isLoading } = useQuery({
    queryKey: ['/api/user'],
    queryFn: () => apiRequest('/api/user'),
    enabled: !!user,
    retry: false
  })

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
      setOnboardingData(prev => ({ ...prev, emailVerified: true }))
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

  // Auto-send verification for email signup users
  useEffect(() => {
    if (user && !user.emailVerified && !isVerificationSent && currentStep === 1) {
      sendVerificationMutation.mutate(user.email!)
    }
  }, [user, isVerificationSent, currentStep])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = () => {
    completeOnboardingMutation.mutate({
      step: TOTAL_STEPS,
      ...onboardingData
    })
  }

  const progress = (currentStep / TOTAL_STEPS) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">VeeFore Setup</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">Step {currentStep} of {TOTAL_STEPS}</div>
            <Progress value={progress} className="w-32" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              {currentStep === 1 && <Mail className="w-8 h-8 text-white" />}
              {currentStep === 2 && <Crown className="w-8 h-8 text-white" />}
              {currentStep === 3 && <Instagram className="w-8 h-8 text-white" />}
              {currentStep === 4 && <Target className="w-8 h-8 text-white" />}
              {currentStep === 5 && <Check className="w-8 h-8 text-white" />}
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {currentStep === 1 && "Verify Your Email"}
              {currentStep === 2 && "Choose Your Plan"}
              {currentStep === 3 && "Connect Social Accounts"}
              {currentStep === 4 && "Tell Us About You"}
              {currentStep === 5 && "Complete Setup"}
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              {currentStep === 1 && "We've sent a verification code to your email address"}
              {currentStep === 2 && "Select the plan that best fits your content creation needs"}
              {currentStep === 3 && "Connect your social media accounts to start creating content"}
              {currentStep === 4 && "Help us personalize your VeeFore experience"}
              {currentStep === 5 && "You're all set! Welcome to VeeFore"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Email Verification */}
            {currentStep === 1 && (
              <div className="space-y-6">
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
              </div>
            )}

            {/* Step 2: Plan Selection */}
            {currentStep === 2 && (
              <div className="space-y-6">
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
              </div>
            )}

            {/* Step 3: Social Media Integration */}
            {currentStep === 3 && (
              <div className="space-y-6">
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
              </div>
            )}

            {/* Step 4: User Profile */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Content Goals */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">What are your main content goals? (Select all that apply)</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'brand-awareness', label: 'Brand Awareness', icon: TrendingUp },
                        { id: 'lead-generation', label: 'Lead Generation', icon: Target },
                        { id: 'engagement', label: 'Engagement', icon: Users },
                        { id: 'sales', label: 'Sales', icon: BarChart }
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
              </div>
            )}

            {/* Step 5: Complete Setup */}
            {currentStep === 5 && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-10 h-10 text-white" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">You're All Set!</h3>
                  <p className="text-gray-600">
                    Welcome to VeeFore! Your account has been configured based on your preferences.
                  </p>
                </div>

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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}