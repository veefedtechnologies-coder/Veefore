import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, ArrowLeft, Check, X, ArrowRight, Sparkles, Shield, Zap, Crown, Users, Target, Rocket, Brain, Play, Pause, TrendingUp, Globe, BarChart3, Star, Lock, Briefcase } from 'lucide-react'
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

  const totalSteps = 4

  // Advanced demo data with real metrics
  const demoScenarios = [
    {
      title: "AI Content Engine",
      subtitle: "Powered by GPT-4 & Claude",
      description: "Generate viral content across all platforms with one click",
      gradient: "from-indigo-600 via-purple-600 to-pink-600",
      icon: Brain,
      metrics: { 
        posts: "2,847", 
        engagement: "+284%", 
        reach: "2.4M",
        time: "15 min"
      },
      features: ["Auto-posting", "Trend analysis", "A/B testing"]
    },
    {
      title: "Smart Analytics Hub",
      subtitle: "Real-time insights",
      description: "Track performance across Instagram, TikTok, LinkedIn & more",
      gradient: "from-emerald-600 via-teal-600 to-cyan-600",
      icon: BarChart3,
      metrics: { 
        platforms: "12+", 
        accuracy: "94.8%", 
        insights: "156",
        growth: "+340%"
      },
      features: ["Cross-platform sync", "Predictive analytics", "Custom reports"]
    },
    {
      title: "Automation Studio",
      subtitle: "24/7 management",
      description: "Schedule, respond, and engage automatically",
      gradient: "from-blue-600 via-indigo-600 to-purple-600",
      icon: Zap,
      metrics: { 
        automated: "847", 
        saved: "15h/week", 
        response: "2.3s",
        uptime: "99.9%"
      },
      features: ["Smart scheduling", "Auto-responses", "Engagement boost"]
    }
  ]

  // Mouse tracking for premium effects
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
    }, 5000)
    return () => clearInterval(interval)
  }, [isPlaying, demoScenarios.length])

  // Premium typing animation
  useEffect(() => {
    const messages = [
      "Join 50,000+ creators worldwide",
      "AI-powered content revolution",
      "Transform your social presence",
      "Scale with intelligent automation"
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
        setTimeout(typeWriter, 80)
      } else if (isDeleting && charIndex > 0) {
        setTypedText(currentMessage.substring(0, charIndex - 1))
        charIndex--
        setTimeout(typeWriter, 40)
      } else if (!isDeleting && charIndex === currentMessage.length) {
        setIsTyping(false)
        setTimeout(() => {
          isDeleting = true
          typeWriter()
        }, 3000)
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false
        messageIndex = (messageIndex + 1) % messages.length
        setTimeout(typeWriter, 500)
      }
    }
    
    const timeout = setTimeout(typeWriter, 2000)
    return () => clearTimeout(timeout)
  }, [])

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
  const currentScenario = demoScenarios[currentDemo]

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Create Account
              </h1>
              <p className="text-gray-600 text-lg font-medium">
                Join the future of social media management
              </p>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full group relative overflow-hidden bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 rounded-2xl px-6 py-4 font-semibold text-gray-700 transition-all duration-500 hover:scale-[1.01] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative flex items-center justify-center space-x-3">
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-lg">Continue with Google</span>
              </div>
            </button>

            {/* Elegant Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-6 bg-white text-gray-500 font-medium">or create with email</span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-800">
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
                    className={`w-full px-4 py-4 bg-gray-50/70 border-2 ${
                      errors.fullName ? 'border-red-400 bg-red-50' : 
                      focusedField === 'fullName' ? 'border-blue-400 bg-blue-50/30 shadow-lg shadow-blue-100' : 
                      'border-gray-200 hover:border-gray-300'
                    } rounded-xl focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-500 font-medium`}
                    placeholder="Enter your full name"
                  />
                  {formData.fullName && !errors.fullName && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center animate-scale-in">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
                {errors.fullName && (
                  <div className="flex items-center text-red-600 text-sm font-medium animate-slide-down">
                    <X className="w-4 h-4 mr-2" />
                    {errors.fullName}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800">
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
                    className={`w-full px-4 py-4 bg-gray-50/70 border-2 ${
                      errors.email ? 'border-red-400 bg-red-50' : 
                      focusedField === 'email' ? 'border-blue-400 bg-blue-50/30 shadow-lg shadow-blue-100' : 
                      'border-gray-200 hover:border-gray-300'
                    } rounded-xl focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-500 font-medium`}
                    placeholder="Enter your email address"
                  />
                  {formData.email && !errors.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center animate-scale-in">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
                {errors.email && (
                  <div className="flex items-center text-red-600 text-sm font-medium animate-slide-down">
                    <X className="w-4 h-4 mr-2" />
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
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
                    className={`w-full px-4 py-4 pr-12 bg-gray-50/70 border-2 ${
                      errors.password ? 'border-red-400 bg-red-50' : 
                      focusedField === 'password' ? 'border-blue-400 bg-blue-50/30 shadow-lg shadow-blue-100' : 
                      'border-gray-200 hover:border-gray-300'
                    } rounded-xl focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-500 font-medium`}
                    placeholder="Create a secure password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Enhanced Password Requirements */}
                {formData.password && (
                  <div className="mt-4 p-5 bg-gradient-to-br from-gray-50 to-blue-50/50 rounded-xl border border-gray-100 animate-slide-down">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-semibold text-gray-800">Security Requirements</span>
                      </div>
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {Object.values(passwordRequirements).filter(Boolean).length}/4
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: 'length', label: '12+ characters', check: passwordRequirements.length },
                        { key: 'uppercase', label: 'Uppercase', check: passwordRequirements.uppercase },
                        { key: 'lowercase', label: 'Lowercase', check: passwordRequirements.lowercase },
                        { key: 'special', label: 'Special char', check: passwordRequirements.special }
                      ].map(({ key, label, check }) => (
                        <div key={key} className={`flex items-center text-sm transition-all duration-300 ${
                          check ? 'text-emerald-700' : 'text-gray-500'
                        }`}>
                          <div className={`w-5 h-5 mr-3 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            check 
                              ? 'bg-emerald-500 border-emerald-500 scale-110' 
                              : 'border-gray-300'
                          }`}>
                            {check && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className="font-medium">{label}</span>
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
              className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>
              <span>Continue Setup</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Business Profile
              </h1>
              <p className="text-gray-600 text-lg font-medium">
                Help us customize your experience
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-5">
                  What type of business do you run?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'agency', label: 'Marketing Agency', icon: Target, color: 'from-blue-500 to-cyan-500', desc: 'Manage client accounts' },
                    { id: 'ecommerce', label: 'E-commerce', icon: Rocket, color: 'from-purple-500 to-pink-500', desc: 'Product promotion' },
                    { id: 'saas', label: 'SaaS Company', icon: Zap, color: 'from-emerald-500 to-teal-500', desc: 'Software solutions' },
                    { id: 'consulting', label: 'Consulting', icon: Briefcase, color: 'from-orange-500 to-red-500', desc: 'Professional services' },
                    { id: 'creator', label: 'Content Creator', icon: Sparkles, color: 'from-violet-500 to-purple-500', desc: 'Personal brand' },
                    { id: 'other', label: 'Other', icon: Crown, color: 'from-gray-500 to-gray-600', desc: 'Something else' }
                  ].map(({ id, label, icon: Icon, color, desc }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleInputChange('businessType', id)}
                      className={`p-5 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-[1.02] relative overflow-hidden group ${
                        formData.businessType === id
                          ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl shadow-blue-100'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-lg bg-white'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${color} p-2 mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <Icon className="w-full h-full text-white" />
                      </div>
                      <div className="font-bold text-gray-900 mb-1">{label}</div>
                      <div className="text-xs text-gray-500 font-medium">{desc}</div>
                      {formData.businessType === id && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-5">
                  What's your team size?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'solo', label: 'Just me', subtitle: 'Solo entrepreneur', users: '1' },
                    { id: 'small', label: '2-10 people', subtitle: 'Small team', users: '2-10' },
                    { id: 'medium', label: '11-50 people', subtitle: 'Growing company', users: '11-50' },
                    { id: 'large', label: '50+ people', subtitle: 'Enterprise', users: '50+' }
                  ].map(({ id, label, subtitle, users }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleInputChange('teamSize', id)}
                      className={`p-5 rounded-2xl border-2 transition-all duration-300 text-center hover:scale-[1.02] relative ${
                        formData.teamSize === id
                          ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl shadow-blue-100'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-lg bg-white'
                      }`}
                    >
                      <div className="text-2xl font-bold text-blue-600 mb-1">{users}</div>
                      <div className="font-bold text-gray-900 mb-1">{label}</div>
                      <div className="text-xs text-gray-500 font-medium">{subtitle}</div>
                      {formData.teamSize === id && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-4 h-4 text-white" />
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
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-[1.01] flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!formData.businessType || !formData.teamSize}
                className="flex-1 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white py-4 rounded-xl font-bold transition-all duration-300 hover:scale-[1.01] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 relative overflow-hidden group"
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
            <div className="text-center space-y-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Your Goals
              </h1>
              <p className="text-gray-600 text-lg font-medium">
                Select all that apply to personalize your dashboard
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
                  className={`w-full p-5 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-[1.01] ${
                    formData.goals.includes(goal)
                      ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg shadow-blue-100'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                      formData.goals.includes(goal)
                        ? 'bg-blue-500 border-blue-500 shadow-lg'
                        : 'border-gray-300'
                    }`}>
                      {formData.goals.includes(goal) && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="font-semibold text-gray-900">{goal}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-[1.01] flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={formData.goals.length === 0}
                className="flex-1 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white py-4 rounded-xl font-bold transition-all duration-300 hover:scale-[1.01] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 relative overflow-hidden group"
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
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 via-emerald-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-200">
                <Check className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                Almost Ready!
              </h1>
              <p className="text-gray-600 text-lg font-medium mt-3">
                Review your information and create your account
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-blue-50/50 rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-5 text-lg">Account Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-200/50">
                  <span className="text-gray-600 font-medium">Name</span>
                  <span className="font-bold text-gray-900">{formData.fullName}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200/50">
                  <span className="text-gray-600 font-medium">Email</span>
                  <span className="font-bold text-gray-900">{formData.email}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200/50">
                  <span className="text-gray-600 font-medium">Business</span>
                  <span className="font-bold text-gray-900 capitalize">{formData.businessType?.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200/50">
                  <span className="text-gray-600 font-medium">Team Size</span>
                  <span className="font-bold text-gray-900 capitalize">{formData.teamSize}</span>
                </div>
                <div className="flex items-start justify-between py-2">
                  <span className="text-gray-600 font-medium">Goals</span>
                  <span className="font-bold text-gray-900">{formData.goals.length} selected</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-[1.01] flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-emerald-600 via-emerald-700 to-cyan-700 hover:from-emerald-700 hover:via-emerald-800 hover:to-cyan-800 text-white py-4 rounded-xl font-bold transition-all duration-300 hover:scale-[1.01] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 relative overflow-hidden group"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/50 flex relative overflow-hidden">
      {/* Premium floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full opacity-20 animate-float-slow ${
              i % 3 === 0 ? 'bg-gradient-to-r from-blue-200 to-cyan-200' :
              i % 3 === 1 ? 'bg-gradient-to-r from-purple-200 to-pink-200' :
              'bg-gradient-to-r from-emerald-200 to-teal-200'
            }`}
            style={{
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 3}s`,
              animationDuration: `${25 + i * 10}s`,
              filter: 'blur(60px)'
            }}
          />
        ))}
      </div>

      {/* Left side - Premium Interactive Demo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
        {/* Premium mouse tracking gradient */}
        <div 
          className="absolute inset-0 opacity-30 transition-all duration-300"
          style={{
            background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 50%)`
          }}
        />

        {/* Elegant grid pattern */}
        <div className="absolute inset-0 opacity-5"
             style={{
               backgroundImage: `
                 linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
               `,
               backgroundSize: '60px 60px'
             }}
        />

        <div className="relative z-10 flex flex-col justify-center px-16 py-20">
          {/* Premium VeeFore Branding */}
          <div className="mb-16">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-2xl shadow-blue-500/25">
                <img src={veeforceLogo} alt="VeeFore" className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">VeeFore</h2>
                <p className="text-blue-200 font-medium">AI-Powered Platform</p>
              </div>
            </div>
            
            {/* Premium animated tagline */}
            <div className="h-20">
              <p className="text-xl text-blue-100 font-semibold leading-relaxed">
                {typedText}
                <span className={`inline-block w-0.5 h-6 bg-blue-400 ml-1 ${isTyping ? 'animate-pulse' : 'animate-blink'}`}></span>
              </p>
            </div>
          </div>

          {/* Premium Demo Section */}
          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">Platform Showcase</h3>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center space-x-3 px-5 py-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition-all duration-300 border border-white/10"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span className="font-medium">{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
            </div>

            {/* Premium demo showcase */}
            <div className={`p-8 rounded-3xl border border-white/10 backdrop-blur-md bg-gradient-to-br ${currentScenario.gradient} bg-opacity-10 transition-all duration-1000 shadow-2xl`}>
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shadow-xl">
                  <currentScenario.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="mb-2">
                    <h4 className="text-2xl font-bold text-white mb-1">{currentScenario.title}</h4>
                    <p className="text-blue-200 font-medium">{currentScenario.subtitle}</p>
                  </div>
                  <p className="text-blue-100 mb-6 text-lg leading-relaxed">{currentScenario.description}</p>
                  
                  {/* Premium metrics display */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    {Object.entries(currentScenario.metrics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-3xl font-bold text-white mb-1">{value}</div>
                        <div className="text-sm text-blue-200 capitalize font-medium">{key}</div>
                      </div>
                    ))}
                  </div>

                  {/* Feature highlights */}
                  <div className="flex flex-wrap gap-3">
                    {currentScenario.features.map((feature, index) => (
                      <div key={index} className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg text-white text-sm font-medium border border-white/10">
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Premium demo indicators */}
            <div className="flex space-x-3 justify-center">
              {demoScenarios.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentDemo(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    index === currentDemo 
                      ? 'bg-white scale-125 shadow-lg shadow-white/25' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            {/* Premium social proof */}
            <div className="pt-10 border-t border-white/10">
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex -space-x-3">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 border-3 border-white/20 flex items-center justify-center text-white font-bold shadow-xl">
                      {String.fromCharCode(65 + i - 1)}
                    </div>
                  ))}
                </div>
                <div className="text-white">
                  <div className="text-lg font-bold">50,000+ creators</div>
                  <div className="text-blue-200 font-medium">Already growing with VeeFore</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center space-y-2">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <div className="text-white font-bold">4.9/5</div>
                  <div className="text-blue-200 text-sm">Rating</div>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Zap className="w-6 h-6 text-emerald-400" />
                  <div className="text-white font-bold">99.9%</div>
                  <div className="text-blue-200 text-sm">Uptime</div>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Lock className="w-6 h-6 text-blue-400" />
                  <div className="text-white font-bold">SOC 2</div>
                  <div className="text-blue-200 text-sm">Certified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Premium Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative">
        {/* Premium navigation header */}
        <div className="absolute top-0 left-0 right-0 z-50">
          <div className="flex items-center justify-between p-8">
            <button 
              onClick={handleBackToLanding}
              className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105 group lg:hidden"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-semibold">Back to Home</span>
            </button>
            
            <div className="flex items-center space-x-4 lg:hidden">
              <img 
                src={veeforceLogo} 
                alt="VeeFore" 
                className="w-10 h-10 filter drop-shadow-lg"
              />
              <span className="text-gray-900 font-bold text-2xl">VeeFore</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-lg mx-auto px-8 py-24">
          {/* Premium Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-bold text-gray-700">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-lg font-bold text-blue-600">
                {Math.round((currentStep / totalSteps) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-700 ease-out shadow-lg"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Premium VeeFore Logo */}
          <div className="mb-12 flex justify-center">
            <div className="relative p-8 rounded-3xl hover:scale-105 transition-all duration-500 ease-out group">
              <img 
                src={veeforceLogo} 
                alt="VeeFore" 
                className="w-24 h-24 transform hover:scale-110 transition-all duration-500 ease-out filter drop-shadow-2xl hover:drop-shadow-3xl animate-[simpleEntrance_1s_ease-out_forwards]" 
                style={{
                  animationDelay: '0.5s',
                  opacity: 0,
                  transform: 'translateY(20px) scale(0.9)'
                }}
              />
            </div>
          </div>

          {/* Premium Form Container */}
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl shadow-gray-200/50 p-10 animate-[simpleEntrance_1s_ease-out_forwards]" 
               style={{
                 animationDelay: '0.8s',
                 opacity: 0,
                 transform: 'translateY(20px) scale(0.95)'
               }}>
            
            <form onSubmit={handleSubmit}>
              {renderStepContent()}
            </form>

            {/* Premium Sign In Link */}
            <div className="mt-10 text-center">
              <p className="text-gray-600 font-medium">
                Already have an account?{' '}
                <button
                  onClick={() => onNavigate('signin')}
                  className="text-blue-600 hover:text-blue-700 font-bold transition-colors duration-300 hover:underline"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>

          {/* Premium Footer */}
          <div className="mt-10 text-center text-sm text-gray-500">
            <p className="leading-relaxed">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors duration-300 font-medium">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors duration-300 font-medium">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp