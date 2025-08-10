import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, ArrowLeft, Check, X, ArrowRight, Sparkles, Shield, Zap, Users, Target, Rocket, Brain, Globe, BarChart3, Star, Lock, Briefcase, ChevronRight, TrendingUp } from 'lucide-react'
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
    goals: []
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
        await signUpWithEmail(formData.email, formData.password)
        
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
          description: "Account created successfully. Check your email for verification.",
        })
        
        setLocation('/')
      } catch (error: any) {
        console.error('Signup error:', error)
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
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">
                Create your account
              </h1>
              <p className="text-lg text-gray-600">
                Join thousands of creators using AI to grow their audience
              </p>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 border-2 border-gray-200 rounded-xl bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
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
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  onFocus={() => setFocusedField('fullName')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.fullName ? 'border-red-400' : 'border-gray-200'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.email ? 'border-red-400' : 'border-gray-200'
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.password ? 'border-red-400' : 'border-gray-200'
                    }`}
                    placeholder="Create a secure password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {formData.password && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-3">Password requirements:</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {[
                        { key: 'length', label: '8+ characters', check: passwordRequirements.length },
                        { key: 'uppercase', label: 'Uppercase letter', check: passwordRequirements.uppercase },
                        { key: 'lowercase', label: 'Lowercase letter', check: passwordRequirements.lowercase },
                        { key: 'number', label: 'Number', check: passwordRequirements.number }
                      ].map(({ key, label, check }) => (
                        <div key={key} className={`flex items-center ${check ? 'text-green-600' : 'text-gray-500'}`}>
                          {check ? <Check className="w-4 h-4 mr-2" /> : <X className="w-4 h-4 mr-2" />}
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
              type="button"
              onClick={handleNextStep}
              disabled={!formData.fullName || !formData.email || !passwordRequirements.length || !passwordRequirements.uppercase || !passwordRequirements.lowercase || !passwordRequirements.number}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Feature showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-white relative overflow-hidden">
        <div className="flex flex-col justify-center px-12 py-16 relative z-10">
          <div className="mb-12">
            <div className="flex items-center space-x-4 mb-8">
              <img src={veeforceLogo} alt="VeeFore" className="w-12 h-12" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">VeeFore</h2>
                <p className="text-gray-600">AI-Powered Social Media Platform</p>
              </div>
            </div>
            
            <h3 className="text-4xl font-bold text-gray-900 mb-6">
              Grow your audience with AI-powered content
            </h3>
            <p className="text-xl text-gray-600 leading-relaxed">
              Join thousands of creators who use VeeFore to automate their social media,
              create engaging content, and grow their audience 10x faster.
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                icon: Brain,
                title: "AI Content Generation",
                description: "Create viral posts, captions, and stories in seconds with our advanced AI."
              },
              {
                icon: BarChart3,
                title: "Smart Analytics",
                description: "Get insights that matter with predictive analytics and growth recommendations."
              },
              {
                icon: Zap,
                title: "Automation Tools",
                description: "Schedule posts, respond to comments, and engage with your audience automatically."
              }
            ].map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
                  <p className="text-gray-600">{description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-600">Active users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">2M+</div>
                <div className="text-sm text-gray-600">Posts created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">95%</div>
                <div className="text-sm text-gray-600">Satisfaction rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Sign up form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative">
        <div className="absolute top-0 left-0 right-0 z-50 lg:hidden">
          <div className="flex items-center justify-between p-6">
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

        <div className="w-full max-w-md mx-auto px-6 py-20">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm font-medium text-blue-600">
                {Math.round((currentStep / totalSteps) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {renderStepContent()}
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => onNavigate('signin')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>
              By creating an account, you agree to our{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp