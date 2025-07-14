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
import { ChevronLeft, ChevronRight, Mail, Check, X, Star, Target, Users, TrendingUp, Palette, Calendar, Building, BarChart } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface OnboardingData {
  step: number
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

export default function Onboarding() {
  const { user } = useFirebaseAuth()
  const [, setLocation] = useLocation()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    step: 1,
    emailVerified: false,
    planSelected: '',
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

  // Email verification
  const [verificationCode, setVerificationCode] = useState('')
  const [isVerificationSent, setIsVerificationSent] = useState(false)
  const [verificationTimer, setVerificationTimer] = useState(0)

  // Get user onboarding status
  const { data: userData } = useQuery({
    queryKey: ['/api/user/onboarding-status'],
    queryFn: () => apiRequest('/api/user/onboarding-status'),
    enabled: !!user,
    retry: false
  })

  // Send verification email
  const sendVerificationMutation = useMutation({
    mutationFn: () => apiRequest('/api/auth/send-verification', {
      method: 'POST'
    }),
    onSuccess: () => {
      setIsVerificationSent(true)
      setVerificationTimer(60)
      toast({
        title: "Verification Email Sent",
        description: "Please check your email for the verification code."
      })
    }
  })

  // Verify email
  const verifyEmailMutation = useMutation({
    mutationFn: (code: string) => apiRequest('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ code })
    }),
    onSuccess: () => {
      setOnboardingData(prev => ({ ...prev, emailVerified: true }))
      setCurrentStep(2)
      toast({
        title: "Email Verified",
        description: "Your email has been successfully verified!"
      })
    },
    onError: () => {
      toast({
        title: "Verification Failed",
        description: "Invalid verification code. Please try again.",
        variant: "destructive"
      })
    }
  })

  // Update onboarding data
  const updateOnboardingMutation = useMutation({
    mutationFn: (data: Partial<OnboardingData>) => apiRequest('/api/user/onboarding', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/onboarding-status'] })
    }
  })

  // Complete onboarding
  const completeOnboardingMutation = useMutation({
    mutationFn: () => apiRequest('/api/user/complete-onboarding', {
      method: 'POST',
      body: JSON.stringify(onboardingData)
    }),
    onSuccess: () => {
      toast({
        title: "Welcome to VeeFore!",
        description: "Your account has been set up successfully."
      })
      setLocation('/')
    }
  })

  // Timer effect for verification code
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (verificationTimer > 0) {
      timer = setTimeout(() => setVerificationTimer(prev => prev - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [verificationTimer])

  // Initialize onboarding data from user data
  useEffect(() => {
    if (userData) {
      setCurrentStep(userData.onboardingStep || 1)
      if (userData.isEmailVerified) {
        setOnboardingData(prev => ({ ...prev, emailVerified: true }))
      }
    }
  }, [userData])

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      updateOnboardingMutation.mutate({ ...onboardingData, step: nextStep })
    } else {
      completeOnboardingMutation.mutate()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateProfileData = (field: string, value: any) => {
    setOnboardingData(prev => ({
      ...prev,
      userProfile: {
        ...prev.userProfile,
        [field]: value
      }
    }))
  }

  const toggleGoal = (goal: string) => {
    setOnboardingData(prev => ({
      ...prev,
      userProfile: {
        ...prev.userProfile,
        goals: prev.userProfile.goals.includes(goal)
          ? prev.userProfile.goals.filter(g => g !== goal)
          : [...prev.userProfile.goals, goal]
      }
    }))
  }

  // Skip email verification if signed up with Google
  const isGoogleUser = user?.providerData?.some(provider => provider.providerId === 'google.com')
  
  useEffect(() => {
    if (isGoogleUser && currentStep === 1) {
      setOnboardingData(prev => ({ ...prev, emailVerified: true }))
      setCurrentStep(2)
    }
  }, [isGoogleUser, currentStep])

  const renderStep = () => {
    switch (currentStep) {
      case 1: // Email Verification
        if (isGoogleUser) return null
        
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle>Verify Your Email</CardTitle>
              <CardDescription>
                We've sent a verification code to {user?.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isVerificationSent ? (
                <Button 
                  onClick={() => sendVerificationMutation.mutate()}
                  disabled={sendVerificationMutation.isPending}
                  className="w-full"
                >
                  {sendVerificationMutation.isPending ? 'Sending...' : 'Send Verification Code'}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="code">Verification Code</Label>
                    <Input
                      id="code"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                    />
                  </div>
                  <Button 
                    onClick={() => verifyEmailMutation.mutate(verificationCode)}
                    disabled={verificationCode.length !== 6 || verifyEmailMutation.isPending}
                    className="w-full"
                  >
                    {verifyEmailMutation.isPending ? 'Verifying...' : 'Verify Email'}
                  </Button>
                  {verificationTimer > 0 ? (
                    <p className="text-sm text-gray-500 text-center">
                      Resend code in {verificationTimer}s
                    </p>
                  ) : (
                    <Button 
                      variant="ghost" 
                      onClick={() => sendVerificationMutation.mutate()}
                      className="w-full"
                    >
                      Resend Code
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )

      case 2: // Plan Selection
        return (
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Choose Your Plan</CardTitle>
              <CardDescription>
                Select the plan that best fits your needs. You can change this anytime.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    name: 'Starter',
                    price: '$19',
                    description: 'Perfect for individuals and small businesses',
                    features: ['300 AI generations/month', '3 social accounts', 'Basic analytics', 'Email support']
                  },
                  {
                    name: 'Pro',
                    price: '$49',
                    description: 'Best for growing businesses',
                    features: ['1000 AI generations/month', '10 social accounts', 'Advanced analytics', 'Priority support', 'Team collaboration'],
                    popular: true
                  },
                  {
                    name: 'Business',
                    price: '$99',
                    description: 'For agencies and large teams',
                    features: ['3000 AI generations/month', 'Unlimited accounts', 'White-label options', 'Custom integrations', 'Dedicated manager']
                  }
                ].map((plan) => (
                  <div 
                    key={plan.name}
                    className={`relative border rounded-lg p-6 cursor-pointer transition-all ${
                      onboardingData.planSelected === plan.name 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setOnboardingData(prev => ({ ...prev, planSelected: plan.name }))}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600">
                        Most Popular
                      </Badge>
                    )}
                    <div className="text-center">
                      <h3 className="text-xl font-semibold">{plan.name}</h3>
                      <div className="text-3xl font-bold text-blue-600 my-2">{plan.price}</div>
                      <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                      <ul className="space-y-2 text-sm">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center">
                            <Check className="w-4 h-4 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )

      case 3: // Social Media Integration
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Connect Your Social Accounts</CardTitle>
              <CardDescription>
                Connect your social media accounts to start managing them with VeeFore
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Instagram', icon: '📸', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
                  { name: 'Facebook', icon: '📘', color: 'bg-blue-600' },
                  { name: 'Twitter', icon: '🐦', color: 'bg-sky-500' },
                  { name: 'LinkedIn', icon: '💼', color: 'bg-blue-700' },
                  { name: 'TikTok', icon: '🎵', color: 'bg-black' },
                  { name: 'YouTube', icon: '📺', color: 'bg-red-600' }
                ].map((platform) => (
                  <div key={platform.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg ${platform.color} flex items-center justify-center text-white`}>
                        {platform.icon}
                      </div>
                      <span className="font-medium">{platform.name}</span>
                    </div>
                    <Button 
                      variant={onboardingData.socialAccountsConnected.includes(platform.name) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const connected = onboardingData.socialAccountsConnected.includes(platform.name)
                        setOnboardingData(prev => ({
                          ...prev,
                          socialAccountsConnected: connected
                            ? prev.socialAccountsConnected.filter(p => p !== platform.name)
                            : [...prev.socialAccountsConnected, platform.name]
                        }))
                      }}
                    >
                      {onboardingData.socialAccountsConnected.includes(platform.name) ? 'Connected' : 'Connect'}
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  You can connect more accounts later. We recommend starting with your primary platform.
                </p>
              </div>
            </CardContent>
          </Card>
        )

      case 4: // User Goals & Objectives
        return (
          <Card className="w-full max-w-3xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Tell Us About Your Goals</CardTitle>
              <CardDescription>
                Help us personalize your experience by sharing your objectives
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Objectives */}
              <div>
                <Label className="text-base font-medium mb-3 block">What's your primary objective?</Label>
                <RadioGroup 
                  value={onboardingData.userProfile.primaryObjective} 
                  onValueChange={(value) => updateProfileData('primaryObjective', value)}
                >
                  {[
                    { value: 'followers', label: 'Grow followers and reach', icon: Users },
                    { value: 'engagement', label: 'Increase engagement and community', icon: TrendingUp },
                    { value: 'sales', label: 'Generate leads and sales', icon: Target },
                    { value: 'brand', label: 'Build brand awareness', icon: Star },
                    { value: 'content', label: 'Create better content consistently', icon: Palette }
                  ].map(({ value, label, icon: Icon }) => (
                    <div key={value} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value={value} id={value} />
                      <Icon className="w-5 h-5 text-gray-500" />
                      <Label htmlFor={value} className="flex-1 cursor-pointer">{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Goals Selection */}
              <div>
                <Label className="text-base font-medium mb-3 block">Select your goals (choose all that apply):</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Increase followers',
                    'Boost engagement',
                    'Generate leads',
                    'Drive website traffic',
                    'Build brand awareness',
                    'Create viral content',
                    'Improve content quality',
                    'Save time on posting',
                    'Grow sales',
                    'Build community'
                  ].map((goal) => (
                    <div key={goal} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <Checkbox 
                        id={goal}
                        checked={onboardingData.userProfile.goals.includes(goal)}
                        onCheckedChange={() => toggleGoal(goal)}
                      />
                      <Label htmlFor={goal} className="cursor-pointer">{goal}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <Label className="text-base font-medium mb-3 block">What's your social media experience level?</Label>
                <RadioGroup 
                  value={onboardingData.userProfile.experienceLevel} 
                  onValueChange={(value) => updateProfileData('experienceLevel', value)}
                >
                  {[
                    { value: 'beginner', label: 'Beginner - Just getting started' },
                    { value: 'intermediate', label: 'Intermediate - Some experience' },
                    { value: 'advanced', label: 'Advanced - Very experienced' },
                    { value: 'expert', label: 'Expert - Professional marketer' }
                  ].map(({ value, label }) => (
                    <div key={value} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value={value} id={value} />
                      <Label htmlFor={value} className="cursor-pointer">{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        )

      case 5: // Detailed Profile
        return (
          <Card className="w-full max-w-3xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Complete Your Profile</CardTitle>
              <CardDescription>
                Final step! Tell us more about your business and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Business Type */}
              <div>
                <Label className="text-base font-medium mb-3 block">What type of business do you have?</Label>
                <RadioGroup 
                  value={onboardingData.userProfile.businessType} 
                  onValueChange={(value) => updateProfileData('businessType', value)}
                >
                  {[
                    { value: 'ecommerce', label: 'E-commerce/Retail', icon: Building },
                    { value: 'service', label: 'Service Business', icon: Target },
                    { value: 'content', label: 'Content Creator/Influencer', icon: Star },
                    { value: 'agency', label: 'Marketing Agency', icon: BarChart },
                    { value: 'nonprofit', label: 'Non-profit', icon: Users },
                    { value: 'personal', label: 'Personal Brand', icon: Palette },
                    { value: 'other', label: 'Other', icon: Building }
                  ].map(({ value, label, icon: Icon }) => (
                    <div key={value} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value={value} id={value} />
                      <Icon className="w-5 h-5 text-gray-500" />
                      <Label htmlFor={value} className="cursor-pointer">{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Niche */}
              <div>
                <Label htmlFor="niche" className="text-base font-medium">What's your niche or industry?</Label>
                <Input
                  id="niche"
                  placeholder="e.g., Fitness, Technology, Fashion, Food, etc."
                  value={onboardingData.userProfile.niche}
                  onChange={(e) => updateProfileData('niche', e.target.value)}
                />
              </div>

              {/* Target Audience */}
              <div>
                <Label htmlFor="audience" className="text-base font-medium">Describe your target audience</Label>
                <Textarea
                  id="audience"
                  placeholder="e.g., Young professionals interested in fitness, age 25-35, primarily female..."
                  value={onboardingData.userProfile.targetAudience}
                  onChange={(e) => updateProfileData('targetAudience', e.target.value)}
                  rows={3}
                />
              </div>

              {/* Content Style */}
              <div>
                <Label className="text-base font-medium mb-3 block">What's your preferred content style?</Label>
                <RadioGroup 
                  value={onboardingData.userProfile.contentStyle} 
                  onValueChange={(value) => updateProfileData('contentStyle', value)}
                >
                  {[
                    'Professional and informative',
                    'Casual and friendly',
                    'Funny and entertaining',
                    'Inspirational and motivational',
                    'Educational and tutorial-based',
                    'Trendy and modern'
                  ].map((style) => (
                    <div key={style} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value={style} id={style} />
                      <Label htmlFor={style} className="cursor-pointer">{style}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Posting Frequency */}
              <div>
                <Label className="text-base font-medium mb-3 block">How often do you want to post?</Label>
                <RadioGroup 
                  value={onboardingData.userProfile.postingFrequency} 
                  onValueChange={(value) => updateProfileData('postingFrequency', value)}
                >
                  {[
                    { value: 'daily', label: 'Daily (7 posts/week)' },
                    { value: 'frequent', label: 'Frequently (4-5 posts/week)' },
                    { value: 'regular', label: 'Regularly (2-3 posts/week)' },
                    { value: 'weekly', label: 'Weekly (1 post/week)' },
                    { value: 'occasional', label: 'Occasionally (2-3 posts/month)' }
                  ].map(({ value, label }) => (
                    <div key={value} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value={value} id={value} />
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <Label htmlFor={value} className="cursor-pointer">{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Additional Information */}
              <div>
                <Label htmlFor="additional" className="text-base font-medium">
                  Anything else you'd like us to know? (Optional)
                </Label>
                <Textarea
                  id="additional"
                  placeholder="Tell us about specific challenges, preferences, or goals you have..."
                  value={onboardingData.userProfile.additionalInfo}
                  onChange={(e) => updateProfileData('additionalInfo', e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  // Don't show step 1 for Google users
  const effectiveStep = isGoogleUser && currentStep === 1 ? 2 : currentStep
  const effectiveTotal = isGoogleUser ? TOTAL_STEPS - 1 : TOTAL_STEPS

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="ml-3 text-2xl font-bold text-gray-900">VeeFore</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to VeeFore!</h1>
          <p className="text-gray-600 mb-6">Let's set up your account in just a few steps</p>
          
          {/* Progress */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Step {effectiveStep} of {effectiveTotal}</span>
              <span className="text-sm text-gray-500">{Math.round((effectiveStep / effectiveTotal) * 100)}%</span>
            </div>
            <Progress value={(effectiveStep / effectiveTotal) * 100} className="h-2" />
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between max-w-3xl mx-auto">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentStep === 1 || (isGoogleUser && currentStep === 2)}
            className="flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={
              (currentStep === 1 && !onboardingData.emailVerified && !isGoogleUser) ||
              (currentStep === 2 && !onboardingData.planSelected) ||
              (currentStep === 4 && !onboardingData.userProfile.primaryObjective) ||
              (currentStep === 5 && (!onboardingData.userProfile.businessType || !onboardingData.userProfile.niche))
            }
            className="flex items-center"
          >
            {currentStep === TOTAL_STEPS ? 'Complete Setup' : 'Next'}
            {currentStep !== TOTAL_STEPS && <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  )
}