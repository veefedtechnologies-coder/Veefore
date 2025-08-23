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
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <User className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Tell us about yourself</h2>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Help us personalize your VeeFore experience with some basic information about you and your business.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="fullName" className="text-xs font-semibold text-gray-700">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="h-8 px-3 text-sm rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-0 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="role" className="text-xs font-semibold text-gray-700">Your Role *</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger className="h-8 px-3 text-sm rounded-lg border border-gray-200 focus:border-emerald-500">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border shadow-xl">
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

              <div className="space-y-1">
                <Label htmlFor="companyName" className="text-xs font-semibold text-gray-700">Company/Brand Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Enter your company or brand name"
                  className="h-8 px-3 text-sm rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-0 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="companySize" className="text-xs font-semibold text-gray-700">Company Size</Label>
                <Select value={formData.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
                  <SelectTrigger className="h-8 px-3 text-sm rounded-lg border border-gray-200 focus:border-emerald-500">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border shadow-xl">
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
          <div className="space-y-4 overflow-y-auto max-h-80">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">What are your goals?</h2>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Help us understand what you want to achieve with VeeFore.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-gray-700">Primary Goals</Label>
                <Select 
                  value={formData.primaryGoals.length > 0 ? formData.primaryGoals.join(',') : ''} 
                  onValueChange={(value) => {
                    if (value) {
                      handleInputChange('primaryGoals', value.split(','));
                    }
                  }}
                >
                  <SelectTrigger className="h-8 px-3 text-sm rounded-lg border border-gray-200 focus:border-emerald-500">
                    <SelectValue placeholder={`${formData.primaryGoals.length} goals selected`} />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border shadow-xl max-h-60 overflow-y-auto">
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
                      <div key={goal} className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 cursor-pointer" 
                           onClick={() => handleArrayToggle('primaryGoals', goal)}>
                        <Checkbox
                          checked={formData.primaryGoals.includes(goal)}
                          className="rounded-sm"
                        />
                        <span className="text-sm">{goal}</span>
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="currentChallenges" className="text-xs font-semibold text-gray-700">Biggest social media challenge?</Label>
                <Textarea
                  id="currentChallenges"
                  value={formData.currentChallenges}
                  onChange={(e) => handleInputChange('currentChallenges', e.target.value)}
                  placeholder="Tell us your main challenges..."
                  rows={3}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-0 transition-colors resize-none"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="monthlyBudget" className="text-xs font-semibold text-gray-700">Monthly Marketing Budget</Label>
                <Select value={formData.monthlyBudget} onValueChange={(value) => handleInputChange('monthlyBudget', value)}>
                  <SelectTrigger className="h-8 px-3 text-sm rounded-lg border border-gray-200 focus:border-emerald-500">
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border shadow-xl">
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
          <div className="space-y-4 overflow-y-auto max-h-80">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Settings className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Configure your content strategy</h3>
              <p className="text-sm text-gray-600 mt-1">Tell us about your social media preferences</p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-gray-700">Which platforms do you use?</Label>
                <Select 
                  value={formData.platforms.length > 0 ? formData.platforms.join(',') : ''} 
                  onValueChange={(value) => {
                    if (value) {
                      handleInputChange('platforms', value.split(','));
                    }
                  }}
                >
                  <SelectTrigger className="h-8 px-3 text-sm rounded-lg border border-gray-200 focus:border-emerald-500">
                    <SelectValue placeholder={`${formData.platforms.length} platforms selected`} />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border shadow-xl max-h-60 overflow-y-auto">
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
                      <div key={platform} className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 cursor-pointer" 
                           onClick={() => handleArrayToggle('platforms', platform)}>
                        <Checkbox
                          checked={formData.platforms.includes(platform)}
                          className="rounded-sm"
                        />
                        <span className="text-sm">{platform}</span>
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-gray-700">Content Types</Label>
                <Select 
                  value={formData.contentTypes.length > 0 ? formData.contentTypes.join(',') : ''} 
                  onValueChange={(value) => {
                    if (value) {
                      handleInputChange('contentTypes', value.split(','));
                    }
                  }}
                >
                  <SelectTrigger className="h-8 px-3 text-sm rounded-lg border border-gray-200 focus:border-emerald-500">
                    <SelectValue placeholder={`${formData.contentTypes.length} content types selected`} />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border shadow-xl max-h-60 overflow-y-auto">
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
                      <div key={type} className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 cursor-pointer" 
                           onClick={() => handleArrayToggle('contentTypes', type)}>
                        <Checkbox
                          checked={formData.contentTypes.includes(type)}
                          className="rounded-sm"
                        />
                        <span className="text-sm">{type}</span>
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="postingFrequency" className="text-xs font-semibold text-gray-700">How often do you post?</Label>
                <Select value={formData.postingFrequency} onValueChange={(value) => handleInputChange('postingFrequency', value)}>
                  <SelectTrigger className="h-8 px-3 text-sm rounded-lg border border-gray-200 focus:border-emerald-500">
                    <SelectValue placeholder="Select posting frequency" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border shadow-xl">
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
          <div className="space-y-4">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Rocket className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Setup Your Workspace</h3>
              <p className="text-sm text-gray-600 mt-1">Create your personalized workspace</p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="workspaceName" className="text-xs font-semibold text-gray-700">Workspace Name *</Label>
                <Input
                  id="workspaceName"
                  value={formData.workspaceName}
                  onChange={(e) => handleInputChange('workspaceName', e.target.value)}
                  placeholder="e.g., 'My Brand', 'Agency Clients', 'Personal'"
                  required
                  className="h-8 px-3 text-sm rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-0 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="industry" className="text-xs font-semibold text-gray-700">Industry</Label>
                <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                  <SelectTrigger className="h-8 px-3 text-sm rounded-lg border border-gray-200 focus:border-emerald-500">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border shadow-xl max-h-60 overflow-y-auto">
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

              <div className="space-y-1">
                <Label htmlFor="timezone" className="text-xs font-semibold text-gray-700">Timezone</Label>
                <Select value={formData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                  <SelectTrigger className="h-8 px-3 text-sm rounded-lg border border-gray-200 focus:border-emerald-500">
                    <SelectValue placeholder="Select your timezone" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border shadow-xl max-h-60 overflow-y-auto">
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="relative w-full max-w-4xl h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header Section - Ultra Compact */}
          <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 px-4 py-3 flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 to-teal-600/90"></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-white">Welcome to VeeFore</h1>
                    <p className="text-emerald-50/90 text-xs">Let's set up your account in {totalSteps} simple steps</p>
                  </div>
                </div>
                <button 
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center backdrop-blur-sm"
                  onClick={() => {}}
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Progress Bar - Ultra Compact */}
          <div className="px-4 py-2 bg-gray-50/50 border-b flex-shrink-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-600">Step {currentStep} of {totalSteps}</span>
              <span className="text-xs text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Steps Indicator - Ultra Compact */}
          <div className="px-4 py-3 border-b bg-white flex-shrink-0">
            <div className="flex items-center justify-center space-x-3">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <div key={step} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-300 ${
                        step === currentStep
                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-md scale-105'
                          : step < currentStep
                          ? 'bg-emerald-100 border-emerald-200 text-emerald-600'
                          : 'bg-gray-100 border-gray-200 text-gray-400'
                      }`}
                    >
                      {step < currentStep ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        getStepIcon(step)
                      )}
                    </div>
                    <span className={`text-xs mt-1 font-medium transition-colors ${
                      step === currentStep ? 'text-emerald-600' : step < currentStep ? 'text-emerald-500' : 'text-gray-400'
                    }`}>
                      {step === 1 ? 'Profile' : step === 2 ? 'Goals' : step === 3 ? 'Platforms' : 'Workspace'}
                    </span>
                  </div>
                  {step < totalSteps && (
                    <div className={`w-8 h-0.5 mx-2 rounded-full transition-all duration-300 ${
                      step < currentStep ? 'bg-emerald-300' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content Area - Flexible Height */}
          <div className="flex-1 px-4 py-3 overflow-hidden">
            <div className="max-w-2xl mx-auto h-full flex flex-col justify-center">
              {renderStep()}
            </div>
          </div>

          {/* Footer - Ultra Compact */}
          <div className="px-4 py-3 bg-gray-50/50 border-t flex items-center justify-between flex-shrink-0">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-3 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-1 inline" />
              Previous
            </button>

            <div className="flex items-center space-x-3">
              {currentStep === totalSteps ? (
                <button
                  onClick={handleComplete}
                  disabled={!isStepValid()}
                  className="px-5 py-2 text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Complete Setup
                  <Rocket className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="px-5 py-2 text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}