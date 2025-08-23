import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ChevronRight, ChevronLeft, CheckCircle, User, Target, Settings, Rocket } from 'lucide-react'

interface OnboardingFlowProps {
  open: boolean
  onComplete: (data: any) => void
}

export default function OnboardingFlow({ open, onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    fullName: '',
    role: '',
    companyName: '',
    companySize: '',
    
    // Step 2: Goals & Objectives
    primaryGoals: [] as string[],
    currentChallenges: '',
    monthlyBudget: '',
    
    // Step 3: Social Media Preferences
    platforms: [] as string[],
    contentTypes: [] as string[],
    postingFrequency: '',
    
    // Step 4: Workspace Setup
    workspaceName: '',
    timezone: '',
    teamSize: '',
    industry: ''
  })

  const totalSteps = 4

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayToggle = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(value)
        ? (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
        : [...(prev[field as keyof typeof prev] as string[]), value]
    }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = () => {
    onComplete(formData)
  }

  const getStepIcon = (step: number) => {
    const icons = [User, Target, Settings, Rocket]
    const Icon = icons[step - 1]
    return <Icon className="w-5 h-5" />
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 backdrop-blur-sm border border-emerald-200/30 shadow-lg mb-6">
                <User className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">Tell us about yourself</h3>
              <p className="text-gray-600 text-lg">Help us personalize your VeeFore experience</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700 mb-2 block">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/30 shadow-sm focus:bg-white/80 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                />
              </div>

              <div>
                <Label htmlFor="role" className="text-sm font-semibold text-gray-700 mb-2 block">Your Role *</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger className="w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/30 shadow-sm focus:bg-white/80 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl bg-white/95 backdrop-blur-xl border border-white/30 shadow-xl">
                    <SelectItem value="founder">Founder/CEO</SelectItem>
                    <SelectItem value="marketing-manager">Marketing Manager</SelectItem>
                    <SelectItem value="social-media-manager">Social Media Manager</SelectItem>
                    <SelectItem value="content-creator">Content Creator</SelectItem>
                    <SelectItem value="freelancer">Freelancer</SelectItem>
                    <SelectItem value="agency-owner">Agency Owner</SelectItem>
                    <SelectItem value="influencer">Influencer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="companyName" className="text-sm font-semibold text-gray-700 mb-2 block">Company/Brand Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Enter your company or brand name"
                  className="w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/30 shadow-sm focus:bg-white/80 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                />
              </div>

              <div>
                <Label htmlFor="companySize" className="text-sm font-semibold text-gray-700 mb-2 block">Company Size</Label>
                <Select value={formData.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
                  <SelectTrigger className="w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/30 shadow-sm focus:bg-white/80 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl bg-white/95 backdrop-blur-xl border border-white/30 shadow-xl">
                    <SelectItem value="solo">Just me</SelectItem>
                    <SelectItem value="2-10">2-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="200+">200+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">What are your goals?</h3>
              <p className="text-gray-600 mt-2">Help us understand what you want to achieve</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Primary Goals (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {[
                    'Increase followers',
                    'Drive website traffic',
                    'Generate leads',
                    'Boost engagement',
                    'Build brand awareness',
                    'Increase sales',
                    'Save time on content',
                    'Improve content quality'
                  ].map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal}
                        checked={formData.primaryGoals.includes(goal)}
                        onCheckedChange={() => handleArrayToggle('primaryGoals', goal)}
                      />
                      <Label htmlFor={goal} className="text-sm font-normal">{goal}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="currentChallenges">What's your biggest social media challenge?</Label>
                <Textarea
                  id="currentChallenges"
                  value={formData.currentChallenges}
                  onChange={(e) => handleInputChange('currentChallenges', e.target.value)}
                  placeholder="Tell us about your main challenges with social media management..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="monthlyBudget">Monthly Marketing Budget</Label>
                <Select value={formData.monthlyBudget} onValueChange={(value) => handleInputChange('monthlyBudget', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-500">$0 - $500</SelectItem>
                    <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                    <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                    <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                    <SelectItem value="10000+">$10,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Social Media Preferences</h3>
              <p className="text-gray-600 mt-2">Configure your content strategy</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Which platforms do you use? (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {[
                    'Instagram',
                    'Facebook',
                    'Twitter/X',
                    'LinkedIn',
                    'TikTok',
                    'YouTube',
                    'Pinterest',
                    'Snapchat'
                  ].map((platform) => (
                    <div key={platform} className="flex items-center space-x-2">
                      <Checkbox
                        id={platform}
                        checked={formData.platforms.includes(platform)}
                        onCheckedChange={() => handleArrayToggle('platforms', platform)}
                      />
                      <Label htmlFor={platform} className="text-sm font-normal">{platform}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Content Types (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {[
                    'Photos',
                    'Videos',
                    'Stories',
                    'Reels/Shorts',
                    'Carousels',
                    'Text posts',
                    'Live streams',
                    'User-generated content'
                  ].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={formData.contentTypes.includes(type)}
                        onCheckedChange={() => handleArrayToggle('contentTypes', type)}
                      />
                      <Label htmlFor={type} className="text-sm font-normal">{type}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="postingFrequency">How often do you post?</Label>
                <Select value={formData.postingFrequency} onValueChange={(value) => handleInputChange('postingFrequency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select posting frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple-daily">Multiple times per day</SelectItem>
                    <SelectItem value="daily">Once per day</SelectItem>
                    <SelectItem value="few-weekly">Few times per week</SelectItem>
                    <SelectItem value="weekly">Once per week</SelectItem>
                    <SelectItem value="monthly">Once per month</SelectItem>
                    <SelectItem value="irregular">Irregular/as needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Setup Your Workspace</h3>
              <p className="text-gray-600 mt-2">Create your personalized workspace</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="workspaceName">Workspace Name *</Label>
                <Input
                  id="workspaceName"
                  value={formData.workspaceName}
                  onChange={(e) => handleInputChange('workspaceName', e.target.value)}
                  placeholder="e.g., 'My Brand', 'Agency Clients', 'Personal'"
                  required
                />
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ecommerce">E-commerce/Retail</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="real-estate">Real Estate</SelectItem>
                    <SelectItem value="fitness">Fitness/Wellness</SelectItem>
                    <SelectItem value="food">Food & Beverage</SelectItem>
                    <SelectItem value="travel">Travel & Tourism</SelectItem>
                    <SelectItem value="fashion">Fashion & Beauty</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="non-profit">Non-profit</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={formData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                    <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Japan Standard Time (JST)</SelectItem>
                    <SelectItem value="Australia/Sydney">Australian Eastern Time (AET)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="teamSize">Team Size</Label>
                <Select value={formData.teamSize} onValueChange={(value) => handleInputChange('teamSize', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="How many people will use this workspace?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Just me</SelectItem>
                    <SelectItem value="2-5">2-5 people</SelectItem>
                    <SelectItem value="6-10">6-10 people</SelectItem>
                    <SelectItem value="11-25">11-25 people</SelectItem>
                    <SelectItem value="25+">25+ people</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName && formData.role
      case 2:
        return formData.primaryGoals.length > 0
      case 3:
        return formData.platforms.length > 0
      case 4:
        return formData.workspaceName
      default:
        return true
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Solid Backdrop - Completely Hide Dashboard */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-gray-900/95 to-slate-800/95" />
        
        {/* Floating Liquid Glass Modal */}
        <div className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden">
          {/* Liquid Glass Container */}
          <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl shadow-black/40 overflow-hidden">
            {/* Animated Liquid Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/8 via-blue-400/5 to-purple-400/8 animate-pulse" />
            
            {/* Glass Reflection Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent rounded-3xl" />
            
            {/* Content Container with Frosted Glass */}
            <div className="relative bg-white/95 backdrop-blur-xl m-1.5 rounded-[20px] p-8 overflow-y-auto max-h-[80vh] shadow-inner">
              {/* Liquid Glass Close Button */}
              <button 
                className="absolute right-6 top-6 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 hover:bg-white/30 hover:border-white/30 transition-all duration-300 flex items-center justify-center group shadow-lg"
                onClick={() => {}}
              >
                <svg className="w-5 h-5 text-gray-700 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Premium Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 shadow-2xl shadow-emerald-500/30 mb-6 relative overflow-hidden">
                  {/* Glass highlight */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-white/10 to-transparent rounded-3xl" />
                  <svg className="w-10 h-10 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
                  Welcome to VeeFore
                </h1>
                <p className="text-xl text-gray-600 font-medium">
                  Let's create something amazing together
                </p>
              </div>
        
              {/* Liquid Glass Progress Indicator */}
              <div className="flex items-center justify-center space-x-3 mb-8">
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                  <div key={step} className="flex items-center">
                    <div className="relative">
                      {/* Glass Background */}
                      <div className={`w-12 h-12 rounded-2xl backdrop-blur-xl border transition-all duration-500 ${
                        step === currentStep
                          ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-400/50 shadow-lg shadow-emerald-500/25 scale-110'
                          : step < currentStep
                          ? 'bg-gradient-to-br from-emerald-100 to-emerald-200 border-emerald-300/30 shadow-md'
                          : 'bg-white/50 border-gray-200/30 shadow-sm'
                      }`} />
                      
                      {/* Icon */}
                      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                        step === currentStep ? 'text-white' : step < currentStep ? 'text-emerald-600' : 'text-gray-400'
                      }`}>
                        {step < currentStep ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          getStepIcon(step)
                        )}
                      </div>
                    </div>
                    
                    {/* Connection Line */}
                    {step < totalSteps && (
                      <div className={`w-12 h-0.5 mx-2 rounded-full transition-all duration-500 ${
                        step < currentStep 
                          ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' 
                          : 'bg-gray-200/50'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step Content with Enhanced Glass Effect */}
              <div className="min-h-[420px] relative">
                <div className="relative p-8 rounded-3xl bg-white/30 backdrop-blur-xl border border-white/30 shadow-xl overflow-hidden">
                  {/* Inner glass reflection */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-3xl" />
                  <div className="relative z-10">
                    {renderStep()}
                  </div>
                </div>
              </div>

              {/* Liquid Glass Navigation */}
              <div className="flex justify-between items-center pt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                    currentStep === 1
                      ? 'opacity-30 cursor-not-allowed bg-gray-100/50'
                      : 'bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg hover:bg-white/80 hover:shadow-xl hover:scale-105 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </div>
                </button>

                {currentStep === totalSteps ? (
                  <button
                    onClick={handleComplete}
                    disabled={!isStepValid()}
                    className="group px-8 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <div className="flex items-center space-x-2">
                      <span>Complete Setup</span>
                      <Rocket className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className="group px-8 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <div className="flex items-center space-x-2">
                      <span>Next Step</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}