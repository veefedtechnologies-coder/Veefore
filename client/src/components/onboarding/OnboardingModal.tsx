import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '@/lib/queryClient'
import { useToast } from '@/hooks/use-toast'
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Star, 
  Target, 
  Users, 
  TrendingUp, 
  Crown,
  Zap,
  Palette,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Heart
} from 'lucide-react'

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
}

interface OnboardingData {
  step: number
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

const TOTAL_STEPS = 4

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  console.log('OnboardingModal rendered - isOpen:', isOpen)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [currentStep, setCurrentStep] = useState(1)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    step: 1,
    planSelected: 'Free',
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

  const updateProfileData = (field: string, value: string | string[]) => {
    setOnboardingData(prev => ({
      ...prev,
      userProfile: {
        ...prev.userProfile,
        [field]: value
      }
    }))
  }

  // Complete onboarding mutation
  const completeOnboardingMutation = useMutation({
    mutationFn: () => apiRequest('/api/user/complete-onboarding', {
      method: 'POST',
      body: JSON.stringify({
        onboardingData: {
          ...onboardingData,
          step: TOTAL_STEPS
        }
      })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] })
      toast({
        title: "Welcome to VeeFore!",
        description: "Your account has been set up successfully. Let's get started!"
      })
      onClose()
    },
    onError: (error: any) => {
      toast({
        title: "Setup Error",
        description: error.message || "There was an error completing your setup. Please try again.",
        variant: "destructive"
      })
    }
  })

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1)
    } else {
      // Complete onboarding
      completeOnboardingMutation.mutate()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1: // Plan Selection
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Plan</h3>
              <p className="text-gray-600">Select the plan that best fits your needs</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  name: 'Free',
                  price: '₹0',
                  description: 'Perfect for getting started',
                  features: ['10 AI generations/month', '1 social account', 'Basic templates', 'Community support'],
                  icon: Heart
                },
                {
                  name: 'Starter',
                  price: '₹699',
                  description: 'Best for individuals',
                  features: ['300 AI generations/month', '3 social accounts', 'Premium templates', 'Email support'],
                  popular: true,
                  icon: Zap
                },
                {
                  name: 'Pro',
                  price: '₹1,499',
                  description: 'For growing businesses',
                  features: ['1000 AI generations/month', '10 social accounts', 'Advanced analytics', 'Priority support'],
                  icon: Crown
                }
              ].map((plan) => {
                const IconComponent = plan.icon
                return (
                  <div 
                    key={plan.name}
                    className={`relative border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      onboardingData.planSelected === plan.name 
                        ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200' 
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
                      <IconComponent className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                      <h4 className="text-lg font-semibold">{plan.name}</h4>
                      <div className="text-2xl font-bold text-blue-600 my-2">{plan.price}</div>
                      <p className="text-gray-600 text-sm mb-3">{plan.description}</p>
                      <ul className="space-y-1 text-xs">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center justify-center">
                            <Check className="w-3 h-3 text-green-500 mr-1" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )

      case 2: // Social Media Integration
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Accounts</h3>
              <p className="text-gray-600">Connect your social media accounts to get started</p>
            </div>
            
            <div className="space-y-3">
              {[
                { name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
                { name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
                { name: 'Twitter', icon: Twitter, color: 'bg-sky-500' },
                { name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
                { name: 'YouTube', icon: Youtube, color: 'bg-red-600' }
              ].map((platform) => {
                const IconComponent = platform.icon
                return (
                  <div key={platform.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg ${platform.color} flex items-center justify-center text-white`}>
                        <IconComponent className="w-5 h-5" />
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
                )
              })}
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                You can connect more accounts later. We recommend starting with your primary platform.
              </p>
            </div>
          </div>
        )

      case 3: // User Goals & Objectives
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Tell Us About Your Goals</h3>
              <p className="text-gray-600">Help us personalize your experience</p>
            </div>
            
            {/* Primary Objectives */}
            <div>
              <Label className="text-base font-medium mb-3 block">What's your primary objective?</Label>
              <RadioGroup 
                value={onboardingData.userProfile.primaryObjective} 
                onValueChange={(value) => updateProfileData('primaryObjective', value)}
              >
                {[
                  { value: 'followers', label: 'Grow followers and reach', icon: Users },
                  { value: 'engagement', label: 'Increase engagement', icon: TrendingUp },
                  { value: 'sales', label: 'Generate leads and sales', icon: Target },
                  { value: 'brand', label: 'Build brand awareness', icon: Star },
                  { value: 'content', label: 'Create better content', icon: Palette }
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
                  'Save time on posting'
                ].map((goal) => (
                  <div key={goal} className="flex items-center space-x-2 p-3 border rounded-lg">
                    <Checkbox
                      id={goal}
                      checked={onboardingData.userProfile.goals.includes(goal)}
                      onCheckedChange={(checked) => {
                        const currentGoals = onboardingData.userProfile.goals
                        const newGoals = checked 
                          ? [...currentGoals, goal]
                          : currentGoals.filter(g => g !== goal)
                        updateProfileData('goals', newGoals)
                      }}
                    />
                    <Label htmlFor={goal} className="text-sm cursor-pointer">{goal}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 4: // Profile Details
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h3>
              <p className="text-gray-600">Just a few more details to get started</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessType">Business Type</Label>
                <Select value={onboardingData.userProfile.businessType} onValueChange={(value) => updateProfileData('businessType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Personal Brand', 'Small Business', 'Agency', 'Enterprise', 'Creator', 'Non-profit'].map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="experienceLevel">Experience Level</Label>
                <Select value={onboardingData.userProfile.experienceLevel} onValueChange={(value) => updateProfileData('experienceLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="niche">Your Niche</Label>
                <Input
                  id="niche"
                  value={onboardingData.userProfile.niche}
                  onChange={(e) => updateProfileData('niche', e.target.value)}
                  placeholder="e.g., Fashion, Tech, Food"
                />
              </div>

              <div>
                <Label htmlFor="postingFrequency">Posting Frequency</Label>
                <Select value={onboardingData.userProfile.postingFrequency} onValueChange={(value) => updateProfileData('postingFrequency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="How often?" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Daily', 'Few times a week', 'Weekly', 'Monthly', 'Occasionally'].map((freq) => (
                      <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input
                id="targetAudience"
                value={onboardingData.userProfile.targetAudience}
                onChange={(e) => updateProfileData('targetAudience', e.target.value)}
                placeholder="Describe your ideal audience"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}} data-testid="onboarding-modal">
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="onboarding-modal-content">
        <DialogHeader>
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">VeeFore</span>
            </div>
            <DialogTitle className="text-3xl font-bold text-gray-900">Welcome to VeeFore!</DialogTitle>
            <p className="text-gray-600 mt-2">Let's set up your account in just a few steps</p>
            
            {/* Progress */}
            <div className="max-w-md mx-auto mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Step {currentStep} of {TOTAL_STEPS}</span>
                <span className="text-sm text-gray-500">{Math.round((currentStep / TOTAL_STEPS) * 100)}%</span>
              </div>
              <Progress value={(currentStep / TOTAL_STEPS) * 100} className="h-2" />
            </div>
          </div>
        </DialogHeader>

        {/* Step Content */}
        <div className="py-6">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center"
            data-testid="onboarding-back-button"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={
              (currentStep === 1 && !onboardingData.planSelected) ||
              (currentStep === 3 && !onboardingData.userProfile.primaryObjective) ||
              (currentStep === 4 && (!onboardingData.userProfile.businessType || !onboardingData.userProfile.niche)) ||
              completeOnboardingMutation.isPending
            }
            className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            data-testid="onboarding-next-button"
          >
            {currentStep === TOTAL_STEPS 
              ? (completeOnboardingMutation.isPending ? 'Setting up...' : 'Complete Setup')
              : 'Continue'
            }
            {currentStep !== TOTAL_STEPS && <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}