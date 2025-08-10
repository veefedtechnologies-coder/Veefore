import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, ArrowLeft, Check, X, ArrowRight, Sparkles, Shield, Zap, Crown, Users, Target, Rocket, Brain, Play, Pause, TrendingUp, Globe, BarChart3 } from 'lucide-react'
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
  const [currentDemo, setCurrentDemo] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isTyping, setIsTyping] = useState(false)
  const [typedText, setTypedText] = useState('')
  const [focusedField, setFocusedField] = useState('')
  const [ripples, setRipples] = useState<Array<{id: number, x: number, y: number}>>([])
  const particleCount = 0

  const totalSteps = 4

  // Advanced interactive demo data
  const demoScenarios = [
    {
      title: "AI Content Creation",
      description: "Watch VeeGPT generate viral content automatically",
      gradient: "from-violet-600 via-purple-600 to-blue-600",
      icon: Brain,
      metrics: { created: "2,847", engagement: "+284%", reach: "2.4M" }
    },
    {
      title: "Smart Analytics",
      description: "Real-time performance insights and optimization",
      gradient: "from-blue-600 via-cyan-600 to-emerald-600",
      icon: BarChart3,
      metrics: { tracked: "156", growth: "+340%", saved: "15h/week" }
    },
    {
      title: "Global Reach",
      description: "Multi-platform management and automation",
      gradient: "from-emerald-600 via-teal-600 to-cyan-600",
      icon: Globe,
      metrics: { platforms: "12", audiences: "94.8K", trends: "+45%" }
    }
  ]

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Auto-advance demo scenarios
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setCurrentDemo((prev) => (prev + 1) % demoScenarios.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [isPlaying, demoScenarios.length])

  // Advanced typing animation
  useEffect(() => {
    const messages = [
      "Join 50,000+ creators on VeeFore",
      "AI-powered social media revolution",
      "Transform your content strategy today",
      "Scale your social presence intelligently"
    ]
    
    let messageIndex = 0
    let charIndex = 0
    let isDeleting = false
    
    const typeWriter = () => {
      const currentMessage = messages[messageIndex]
      
      if (!isDeleting && charIndex < currentMessage.length) {
        setTypedText(currentMessage.substring(0, charIndex + 1))
        setIsTyping(true)
        charIndex++
        setTimeout(typeWriter, 100)
      } else if (isDeleting && charIndex > 0) {
        setTypedText(currentMessage.substring(0, charIndex - 1))
        charIndex--
        setTimeout(typeWriter, 50)
      } else if (!isDeleting && charIndex === currentMessage.length) {
        setIsTyping(false)
        setTimeout(() => {
          isDeleting = true
          typeWriter()
        }, 2000)
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false
        messageIndex = (messageIndex + 1) % messages.length
        setTimeout(typeWriter, 500)
      }
    }
    
    const timeout = setTimeout(typeWriter, 1000)
    return () => clearTimeout(timeout)
  }, [])

  // Interactive ripple effects
  const createRipple = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const newRipple = { id: Date.now(), x, y }
    
    setRipples(prev => [...prev, newRipple])
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, 600)
  }

  const handleBackToLanding = () => {
    onNavigate('landing')
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
    if (!passwordReqs.length || !passwordReqs.uppercase || !passwordReqs.lowercase || !passwordReqs.special) {
      newErrors.password = 'Password does not meet requirements'
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
          title: "Success",
          description: "Account created successfully! Please check your email for verification.",
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
        title: "Success",
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
  const currentScenario = demoScenarios[currentDemo]

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Create Your Account
              </h1>
              <p className="text-gray-600 text-lg">
                Join VeeFore and transform your social media management
              </p>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 rounded-2xl px-6 py-4 font-semibold text-gray-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
              onClick={createRipple}
            >
              {ripples.map(ripple => (
                <div
                  key={ripple.id}
                  className="absolute bg-blue-400/30 rounded-full animate-ping"
                  style={{
                    left: ripple.x - 10,
                    top: ripple.y - 10,
                    width: 20,
                    height: 20
                  }}
                />
              ))}
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-lg">Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="flex items-center">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <span className="px-4 text-sm text-gray-500 bg-white">or</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    onFocus={() => setFocusedField('fullName')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-4 py-3 bg-gray-50/50 backdrop-blur-sm border-2 ${
                      errors.fullName ? 'border-red-300 bg-red-50' : 
                      focusedField === 'fullName' ? 'border-blue-400 bg-blue-50/50' : 
                      'border-gray-200 hover:border-gray-300'
                    } rounded-xl focus:outline-none focus:ring-0 transition-all duration-300 placeholder-gray-400`}
                    placeholder="Enter your full name"
                  />
                  {formData.fullName && !errors.fullName && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center animate-scale-in">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  {/* Focus glow effect */}
                  {focusedField === 'fullName' && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-lg -z-10 animate-pulse"></div>
                  )}
                </div>
                {errors.fullName && (
                  <div className="flex items-center mt-2 text-red-500 text-sm animate-slide-down">
                    <X className="w-4 h-4 mr-2" />
                    {errors.fullName}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-4 py-3 bg-gray-50/50 backdrop-blur-sm border-2 ${
                      errors.email ? 'border-red-300 bg-red-50' : 
                      focusedField === 'email' ? 'border-blue-400 bg-blue-50/50' : 
                      'border-gray-200 hover:border-gray-300'
                    } rounded-xl focus:outline-none focus:ring-0 transition-all duration-300 placeholder-gray-400`}
                    placeholder="Enter your email address"
                  />
                  {formData.email && !errors.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center animate-scale-in">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  {/* Focus glow effect */}
                  {focusedField === 'email' && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-lg -z-10 animate-pulse"></div>
                  )}
                </div>
                {errors.email && (
                  <div className="flex items-center mt-2 text-red-500 text-sm animate-slide-down">
                    <X className="w-4 h-4 mr-2" />
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className={`w-full px-4 py-3 pr-12 bg-gray-50/50 backdrop-blur-sm border-2 ${
                      errors.password ? 'border-red-300 bg-red-50' : 
                      focusedField === 'password' ? 'border-blue-400 bg-blue-50/50' : 
                      'border-gray-200 hover:border-gray-300'
                    } rounded-xl focus:outline-none focus:ring-0 transition-all duration-300 placeholder-gray-400`}
                    placeholder="Create a secure password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  
                  {/* Focus glow effect */}
                  {focusedField === 'password' && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-lg -z-10 animate-pulse"></div>
                  )}
                </div>
                
                {/* Enhanced Password Requirements */}
                {formData.password && (
                  <div className="mt-4 p-4 bg-gradient-to-br from-gray-50 to-blue-50/50 backdrop-blur-sm rounded-xl border border-gray-200/50 animate-slide-down">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-gray-700 flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-emerald-500" />
                        Security Requirements
                      </p>
                      <div className="text-xs text-gray-500">
                        {Object.values(passwordRequirements).filter(Boolean).length}/4
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: 'length', label: '12+ characters', check: passwordRequirements.length },
                        { key: 'uppercase', label: 'Uppercase letter', check: passwordRequirements.uppercase },
                        { key: 'lowercase', label: 'Lowercase letter', check: passwordRequirements.lowercase },
                        { key: 'special', label: 'Special character', check: passwordRequirements.special }
                      ].map(({ key, label, check }) => (
                        <div key={key} className={`flex items-center text-sm transition-all duration-300 ${
                          check ? 'text-emerald-600' : 'text-gray-400'
                        }`}>
                          <div className={`w-4 h-4 mr-2 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            check 
                              ? 'bg-emerald-500 border-emerald-500 scale-110' 
                              : 'border-gray-300'
                          }`}>
                            {check && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <span className="text-xs">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleNextStep}
              disabled={!formData.fullName || !formData.email || !passwordRequirements.length || !passwordRequirements.uppercase || !passwordRequirements.lowercase || !passwordRequirements.special}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>
              <span>Continue</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Tell us about your business
              </h1>
              <p className="text-gray-600 text-lg">
                Help us personalize your VeeFore experience
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  What type of business do you run?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'agency', label: 'Marketing Agency', icon: Target, color: 'from-blue-500 to-cyan-500' },
                    { id: 'ecommerce', label: 'E-commerce', icon: Rocket, color: 'from-purple-500 to-pink-500' },
                    { id: 'saas', label: 'SaaS Company', icon: Zap, color: 'from-emerald-500 to-teal-500' },
                    { id: 'consulting', label: 'Consulting', icon: Users, color: 'from-orange-500 to-red-500' },
                    { id: 'creator', label: 'Content Creator', icon: Sparkles, color: 'from-violet-500 to-purple-500' },
                    { id: 'other', label: 'Other', icon: Crown, color: 'from-gray-500 to-gray-600' }
                  ].map(({ id, label, icon: Icon, color }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleInputChange('businessType', id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-[1.02] relative overflow-hidden group ${
                        formData.businessType === id
                          ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 text-blue-700 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:shadow-md'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${color} p-1.5 mb-2 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-full h-full text-white" />
                      </div>
                      <div className="font-medium text-sm">{label}</div>
                      {formData.businessType === id && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  What's your team size?
                </label>
                <div className="grid grid-cols-2 gap-3">
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
                      className={`p-4 rounded-xl border-2 transition-all duration-300 text-center hover:scale-[1.02] ${
                        formData.teamSize === id
                          ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 text-blue-700 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:shadow-md'
                      }`}
                    >
                      <div className="font-medium text-sm">{label}</div>
                      <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
                      {formData.teamSize === id && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!formData.businessType || !formData.teamSize}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>
                <span>Continue</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                What are your main goals?
              </h1>
              <p className="text-gray-600 text-lg">
                Select all that apply to personalize your dashboard
              </p>
            </div>

            <div className="space-y-3">
              {[
                'Increase social media engagement',
                'Save time on content creation',
                'Grow my audience',
                'Improve brand consistency',
                'Better analytics and insights',
                'Automate social media tasks',
                'Manage multiple accounts',
                'Create better content'
              ].map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => handleGoalToggle(goal)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-[1.02] ${
                    formData.goals.includes(goal)
                      ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 text-blue-700 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                      formData.goals.includes(goal)
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {formData.goals.includes(goal) && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="font-medium">{goal}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={formData.goals.length === 0}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>
                <span>Continue</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                You're all set!
              </h1>
              <p className="text-gray-600 text-lg">
                Ready to transform your social media management?
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-4">Your VeeFore Setup:</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium text-gray-900">{formData.fullName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-900">{formData.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Business Type:</span>
                  <span className="font-medium text-gray-900 capitalize">{formData.businessType?.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Team Size:</span>
                  <span className="font-medium text-gray-900 capitalize">{formData.teamSize}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-gray-600">Goals:</span>
                  <span className="font-medium text-gray-900 text-right">{formData.goals.length} selected</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <Rocket className="w-5 h-5" />
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

  console.log('Interactive effects ready', { particleCount })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex relative overflow-hidden">
      {/* Floating background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full opacity-30 animate-float-slow ${
              i % 3 === 0 ? 'bg-gradient-to-r from-blue-300 to-cyan-300' :
              i % 3 === 1 ? 'bg-gradient-to-r from-purple-300 to-pink-300' :
              'bg-gradient-to-r from-emerald-300 to-teal-300'
            }`}
            style={{
              width: `${100 + i * 60}px`,
              height: `${100 + i * 60}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${20 + i * 5}s`,
              filter: 'blur(40px)'
            }}
          />
        ))}
      </div>

      {/* Left side - Interactive Demo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
        {/* Mouse tracking gradient */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1), transparent)`
          }}
        />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10"
             style={{
               backgroundImage: `
                 linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
               `,
               backgroundSize: '50px 50px'
             }}
        />

        <div className="relative z-10 flex flex-col justify-center px-12 py-20">
          {/* VeeFore Branding */}
          <div className="mb-12">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <img src={veeforceLogo} alt="VeeFore" className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">VeeFore</h2>
                <p className="text-blue-200 text-sm">AI-Powered Platform</p>
              </div>
            </div>
            
            {/* Animated tagline */}
            <div className="h-16">
              <p className="text-lg text-blue-100 font-medium">
                {typedText}
                <span className={`inline-block w-0.5 h-5 bg-blue-400 ml-1 ${isTyping ? 'animate-pulse' : 'animate-blink'}`}></span>
              </p>
            </div>
          </div>

          {/* Interactive Demo Section */}
          <div className="space-y-8">
            {/* Demo controls */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">See VeeFore in Action</h3>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-all duration-300"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span className="text-sm">{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
            </div>

            {/* Current demo showcase */}
            <div className={`p-6 rounded-2xl border border-white/20 backdrop-blur-sm bg-gradient-to-br ${currentScenario.gradient} bg-opacity-20 transition-all duration-1000`}>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <currentScenario.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white mb-2">{currentScenario.title}</h4>
                  <p className="text-blue-100 text-sm mb-4">{currentScenario.description}</p>
                  
                  {/* Metrics display */}
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(currentScenario.metrics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-xl font-bold text-white">{value}</div>
                        <div className="text-xs text-blue-200 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Demo indicators */}
            <div className="flex space-x-2 justify-center">
              {demoScenarios.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentDemo(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentDemo ? 'bg-white scale-125' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>

            {/* Social proof */}
            <div className="pt-8 border-t border-white/10">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white/20 flex items-center justify-center text-white text-xs font-semibold">
                      {i}
                    </div>
                  ))}
                </div>
                <div className="text-white">
                  <div className="text-sm font-semibold">Join 50,000+ creators</div>
                  <div className="text-xs text-blue-200">Already using VeeFore</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-blue-200">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>4.9/5 rating</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4" />
                  <span>99.9% uptime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative">
        {/* Navigation Header */}
        <div className="absolute top-0 left-0 right-0 z-50">
          <div className="flex items-center justify-between p-6">
            <button 
              onClick={handleBackToLanding}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105 group lg:hidden"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Back to Home</span>
            </button>
            
            <div className="flex items-center space-x-3 lg:hidden">
              <img 
                src={veeforceLogo} 
                alt="VeeFore" 
                className="w-8 h-8 filter drop-shadow-sm"
              />
              <span className="text-gray-900 font-bold text-xl">VeeFore</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto px-6 py-20">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm font-medium text-gray-500">
                {Math.round((currentStep / totalSteps) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Simple Elegant VeeFore Logo */}
          <div className="mb-8 flex justify-center">
            <div className="relative p-6 rounded-2xl hover:scale-105 transition-all duration-500 ease-out group">
              <img 
                src={veeforceLogo} 
                alt="VeeFore" 
                className="w-20 h-20 transform hover:scale-110 transition-all duration-500 ease-out filter drop-shadow-lg hover:drop-shadow-xl animate-[simpleEntrance_1s_ease-out_forwards]" 
                style={{
                  animationDelay: '0.5s',
                  opacity: 0,
                  transform: 'translateY(20px) scale(0.9)'
                }}
              />
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 animate-[simpleEntrance_1s_ease-out_forwards]" 
               style={{
                 animationDelay: '0.8s',
                 opacity: 0,
                 transform: 'translateY(20px) scale(0.95)'
               }}>
            
            <form onSubmit={handleSubmit}>
              {renderStepContent()}
            </form>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => onNavigate('signin')}
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300 hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              By creating an account, you agree to our{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors duration-300">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors duration-300">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp