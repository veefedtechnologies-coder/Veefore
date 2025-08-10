import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, ArrowLeft, Check, X, ArrowRight, Sparkles, Shield, Zap, Crown, Users, Target, Rocket, Brain, Play, Pause, TrendingUp, Globe, BarChart3, Star, Lock, Briefcase, ChevronDown, Camera, Mic, Video, MessageSquare, Bot } from 'lucide-react'
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
  const [focusedField, setFocusedField] = useState('')
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, vx: number, vy: number, life: number}>>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [aiChat, setAiChat] = useState({ isOpen: false, messages: [] })
  const [liveMetrics, setLiveMetrics] = useState({
    users: 50247,
    posts: 2847329,
    engagement: 94.8,
    satisfaction: 4.9
  })

  const totalSteps = 4

  // Revolutionary demo scenarios with live AI interaction
  const demoScenarios = [
    {
      title: "AI Content Studio",
      subtitle: "GPT-4 Turbo + Claude 3.5",
      description: "Generate viral content in seconds with multi-platform optimization",
      gradient: "from-violet-500 via-purple-600 to-indigo-600",
      icon: Brain,
      stats: {
        generated: "2.8M+ posts",
        engagement: "+340% avg",
        platforms: "15+ networks",
        speed: "3.2s avg"
      },
      features: ["Real-time trend analysis", "Multi-language support", "Brand voice learning", "Viral prediction AI"],
      demo: "Creating Instagram post for tech startup...",
      progress: 0
    },
    {
      title: "Neural Analytics",
      subtitle: "Real-time insights",
      description: "AI-powered analytics that predict viral content before you post",
      gradient: "from-emerald-500 via-teal-600 to-cyan-600",
      icon: BarChart3,
      stats: {
        accuracy: "97.3% prediction",
        insights: "250K+ daily",
        growth: "+430% faster",
        coverage: "50+ metrics"
      },
      features: ["Predictive viral scoring", "Competitor intelligence", "Audience behavior AI", "ROI optimization"],
      demo: "Analyzing audience sentiment...",
      progress: 0
    },
    {
      title: "Automation Engine",
      subtitle: "24/7 AI management",
      description: "Smart automation that learns your brand and engages authentically",
      gradient: "from-blue-500 via-indigo-600 to-purple-600",
      icon: Zap,
      stats: {
        automated: "15M+ actions",
        saved: "25hrs/week",
        response: "0.8s avg",
        learning: "99.7% uptime"
      },
      features: ["Context-aware responses", "Mood detection", "Smart scheduling", "Crisis management"],
      demo: "Auto-responding to comments...",
      progress: 0
    }
  ]

  // Advanced particle system
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const updateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      setParticles(prev => {
        return prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - 1
        })).filter(particle => particle.life > 0)
      })

      particles.forEach(particle => {
        const alpha = particle.life / 100
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(59, 130, 246, ${alpha * 0.6})`
        ctx.fill()
      })

      requestAnimationFrame(updateParticles)
    }

    updateParticles()
  }, [particles])

  // Mouse tracking with particle generation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      
      // Generate particles on mouse move
      if (Math.random() < 0.3) {
        const newParticle = {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 100
        }
        setParticles(prev => [...prev.slice(-50), newParticle])
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Live metrics animation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        users: prev.users + Math.floor(Math.random() * 3),
        posts: prev.posts + Math.floor(Math.random() * 50),
        engagement: Math.max(90, Math.min(99, prev.engagement + (Math.random() - 0.5) * 0.2)),
        satisfaction: Math.max(4.5, Math.min(5.0, prev.satisfaction + (Math.random() - 0.5) * 0.02))
      }))
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])

  // Demo progress simulation
  useEffect(() => {
    if (!isPlaying) return
    
    const interval = setInterval(() => {
      setCurrentDemo(prev => {
        const next = (prev + 1) % demoScenarios.length
        return next
      })
    }, 6000)
    
    return () => clearInterval(interval)
  }, [isPlaying])

  // Demo progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDemoScenarios(prev => 
        prev.map((scenario, index) => 
          index === currentDemo 
            ? { ...scenario, progress: Math.min(100, scenario.progress + 2) }
            : { ...scenario, progress: 0 }
        )
      )
    }, 100)
    
    return () => clearInterval(interval)
  }, [currentDemo])

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
          title: "🚀 Welcome to VeeFore!",
          description: "Your AI-powered workspace is ready. Check your email for activation.",
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
        title: "🎉 Welcome aboard!",
        description: "Google authentication successful!",
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
          <div className="space-y-10">
            <div className="text-center space-y-4">
              <div className="relative">
                <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                  Join the Revolution
                </h1>
                <div className="absolute -top-2 -right-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full animate-ping"></div>
                </div>
              </div>
              <p className="text-xl text-gray-600 font-medium">
                AI-powered social media that works while you sleep
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>{liveMetrics.users.toLocaleString()} users online</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>{liveMetrics.posts.toLocaleString()} posts today</span>
                </div>
              </div>
            </div>

            {/* Revolutionary Google Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-white border-2 border-gray-200 hover:border-blue-300 rounded-3xl px-8 py-6 font-bold text-gray-700 transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:rotate-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="relative flex items-center justify-center space-x-4">
                <svg className="w-7 h-7 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-xl">Continue with Google</span>
                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-bounce"></div>
              </div>
            </button>

            {/* Revolutionary Divider */}
            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-8 py-2 bg-gradient-to-r from-white to-gray-50 text-gray-500 font-bold text-sm rounded-full border border-gray-200">
                  or start your AI journey
                </span>
              </div>
            </div>

            {/* Revolutionary Form Fields */}
            <div className="space-y-8">
              {/* Name Field */}
              <div className="space-y-3">
                <label htmlFor="fullName" className="block text-sm font-black text-gray-800 uppercase tracking-wide">
                  Full Name
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    onFocus={() => setFocusedField('fullName')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-3 ${
                      errors.fullName ? 'border-red-400 bg-red-50' : 
                      focusedField === 'fullName' ? 'border-blue-500 shadow-2xl shadow-blue-200 bg-blue-50/30' : 
                      'border-gray-200 hover:border-gray-400'
                    } rounded-2xl focus:outline-none transition-all duration-500 text-gray-900 placeholder-gray-500 font-semibold text-lg group-hover:scale-[1.01]`}
                    placeholder="Enter your full name"
                  />
                  {formData.fullName && !errors.fullName && (
                    <div className="absolute right-5 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                  {focusedField === 'fullName' && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-xl -z-10 animate-pulse"></div>
                  )}
                </div>
                {errors.fullName && (
                  <div className="flex items-center text-red-600 text-sm font-bold animate-shake">
                    <X className="w-5 h-5 mr-2" />
                    {errors.fullName}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-3">
                <label htmlFor="email" className="block text-sm font-black text-gray-800 uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-3 ${
                      errors.email ? 'border-red-400 bg-red-50' : 
                      focusedField === 'email' ? 'border-blue-500 shadow-2xl shadow-blue-200 bg-blue-50/30' : 
                      'border-gray-200 hover:border-gray-400'
                    } rounded-2xl focus:outline-none transition-all duration-500 text-gray-900 placeholder-gray-500 font-semibold text-lg group-hover:scale-[1.01]`}
                    placeholder="Enter your email address"
                  />
                  {formData.email && !errors.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                    <div className="absolute right-5 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                  {focusedField === 'email' && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-xl -z-10 animate-pulse"></div>
                  )}
                </div>
                {errors.email && (
                  <div className="flex items-center text-red-600 text-sm font-bold animate-shake">
                    <X className="w-5 h-5 mr-2" />
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <label htmlFor="password" className="block text-sm font-black text-gray-800 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-6 py-5 pr-16 bg-gradient-to-r from-gray-50 to-white border-3 ${
                      errors.password ? 'border-red-400 bg-red-50' : 
                      focusedField === 'password' ? 'border-blue-500 shadow-2xl shadow-blue-200 bg-blue-50/30' : 
                      'border-gray-200 hover:border-gray-400'
                    } rounded-2xl focus:outline-none transition-all duration-500 text-gray-900 placeholder-gray-500 font-semibold text-lg group-hover:scale-[1.01]`}
                    placeholder="Create an ultra-secure password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-all duration-300 hover:scale-110"
                  >
                    {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                  </button>
                  {focusedField === 'password' && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-xl -z-10 animate-pulse"></div>
                  )}
                </div>
                
                {/* Revolutionary Password Requirements */}
                {formData.password && (
                  <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 via-blue-50/50 to-purple-50/50 rounded-2xl border-2 border-gray-100 animate-slide-down shadow-xl">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-black text-gray-800">Security Check</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border font-bold">
                          {Object.values(passwordRequirements).filter(Boolean).length}/4
                        </div>
                        <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                            style={{ width: `${(Object.values(passwordRequirements).filter(Boolean).length / 4) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { key: 'length', label: '12+ characters', check: passwordRequirements.length, icon: '🔢' },
                        { key: 'uppercase', label: 'Uppercase letter', check: passwordRequirements.uppercase, icon: '🔠' },
                        { key: 'lowercase', label: 'Lowercase letter', check: passwordRequirements.lowercase, icon: '🔡' },
                        { key: 'special', label: 'Special character', check: passwordRequirements.special, icon: '🔣' }
                      ].map(({ key, label, check, icon }) => (
                        <div key={key} className={`flex items-center text-sm transition-all duration-500 p-3 rounded-xl ${
                          check ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-gray-500 bg-white border border-gray-200'
                        }`}>
                          <div className={`w-8 h-8 mr-4 rounded-xl border-2 flex items-center justify-center transition-all duration-500 ${
                            check 
                              ? 'bg-emerald-500 border-emerald-500 scale-110 shadow-lg' 
                              : 'border-gray-300'
                          }`}>
                            {check ? <Check className="w-4 h-4 text-white" /> : <span className="text-sm">{icon}</span>}
                          </div>
                          <span className="font-bold">{label}</span>
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
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white py-6 rounded-3xl font-black text-xl transition-all duration-700 hover:scale-[1.03] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-4 relative overflow-hidden group transform hover:rotate-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <Rocket className="w-6 h-6 group-hover:animate-bounce" />
              <span>Launch Your AI Journey</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </div>
        )

      case 2:
        return (
          <div className="space-y-10">
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Business DNA
              </h1>
              <p className="text-xl text-gray-600 font-medium">
                Let our AI understand your unique business
              </p>
            </div>

            <div className="space-y-10">
              <div>
                <label className="block text-lg font-black text-gray-800 mb-6 uppercase tracking-wide">
                  What drives your business?
                </label>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { id: 'agency', label: 'Marketing Agency', icon: Target, color: 'from-blue-500 via-blue-600 to-cyan-600', desc: 'Multi-client management', gradient: 'bg-gradient-to-br from-blue-50 to-cyan-50' },
                    { id: 'ecommerce', label: 'E-commerce', icon: Rocket, color: 'from-purple-500 via-pink-500 to-rose-600', desc: 'Product sales focus', gradient: 'bg-gradient-to-br from-purple-50 to-pink-50' },
                    { id: 'saas', label: 'SaaS Company', icon: Zap, color: 'from-emerald-500 via-green-500 to-teal-600', desc: 'Software solutions', gradient: 'bg-gradient-to-br from-emerald-50 to-teal-50' },
                    { id: 'consulting', label: 'Consulting', icon: Briefcase, color: 'from-orange-500 via-amber-500 to-yellow-600', desc: 'Expert services', gradient: 'bg-gradient-to-br from-orange-50 to-yellow-50' },
                    { id: 'creator', label: 'Content Creator', icon: Sparkles, color: 'from-violet-500 via-purple-500 to-indigo-600', desc: 'Personal brand', gradient: 'bg-gradient-to-br from-violet-50 to-indigo-50' },
                    { id: 'other', label: 'Other', icon: Crown, color: 'from-gray-500 via-slate-500 to-gray-600', desc: 'Unique business', gradient: 'bg-gradient-to-br from-gray-50 to-slate-50' }
                  ].map(({ id, label, icon: Icon, color, desc, gradient }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleInputChange('businessType', id)}
                      className={`p-8 rounded-3xl border-3 transition-all duration-500 text-left hover:scale-[1.05] relative overflow-hidden group transform hover:rotate-2 ${
                        formData.businessType === id
                          ? `border-blue-400 ${gradient} shadow-2xl shadow-blue-200 scale-105`
                          : 'border-gray-200 hover:border-gray-400 hover:shadow-xl bg-white'
                      }`}
                    >
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${color} p-3 mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl`}>
                        <Icon className="w-full h-full text-white" />
                      </div>
                      <div className="font-black text-gray-900 mb-2 text-lg">{label}</div>
                      <div className="text-sm text-gray-500 font-semibold">{desc}</div>
                      {formData.businessType === id && (
                        <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000 opacity-0 group-hover:opacity-100"></div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-black text-gray-800 mb-6 uppercase tracking-wide">
                  Team size matters
                </label>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { id: 'solo', label: 'Just me', subtitle: 'Solo entrepreneur', users: '1', color: 'from-indigo-500 to-purple-600' },
                    { id: 'small', label: '2-10 people', subtitle: 'Small & agile', users: '2-10', color: 'from-blue-500 to-cyan-600' },
                    { id: 'medium', label: '11-50 people', subtitle: 'Growing fast', users: '11-50', color: 'from-emerald-500 to-teal-600' },
                    { id: 'large', label: '50+ people', subtitle: 'Enterprise scale', users: '50+', color: 'from-orange-500 to-red-600' }
                  ].map(({ id, label, subtitle, users, color }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleInputChange('teamSize', id)}
                      className={`p-8 rounded-3xl border-3 transition-all duration-500 text-center hover:scale-[1.05] relative overflow-hidden group transform hover:rotate-1 ${
                        formData.teamSize === id
                          ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 shadow-2xl shadow-blue-200 scale-105'
                          : 'border-gray-200 hover:border-gray-400 hover:shadow-xl bg-white'
                      }`}
                    >
                      <div className={`w-16 h-16 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl`}>
                        <span className="text-2xl font-black text-white">{users}</span>
                      </div>
                      <div className="font-black text-gray-900 mb-2 text-lg">{label}</div>
                      <div className="text-sm text-gray-500 font-semibold">{subtitle}</div>
                      {formData.teamSize === id && (
                        <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000 opacity-0 group-hover:opacity-100"></div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-6">
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 py-5 rounded-2xl font-black text-lg transition-all duration-500 hover:scale-[1.02] flex items-center justify-center space-x-3 transform hover:-rotate-1"
              >
                <ArrowLeft className="w-6 h-6" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!formData.businessType || !formData.teamSize}
                className="flex-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white py-5 rounded-2xl font-black text-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 relative overflow-hidden group transform hover:rotate-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>
                <span>Continue</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-10">
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Dream Goals
              </h1>
              <p className="text-xl text-gray-600 font-medium">
                What success looks like for you
              </p>
            </div>

            <div className="space-y-4">
              {[
                { goal: 'Increase social media engagement', icon: '📈', color: 'from-pink-500 to-rose-600' },
                { goal: 'Save time on content creation', icon: '⏰', color: 'from-blue-500 to-cyan-600' },
                { goal: 'Grow my audience faster', icon: '🚀', color: 'from-purple-500 to-indigo-600' },
                { goal: 'Improve brand consistency', icon: '🎯', color: 'from-emerald-500 to-teal-600' },
                { goal: 'Get better analytics insights', icon: '📊', color: 'from-orange-500 to-yellow-600' },
                { goal: 'Automate routine tasks', icon: '🤖', color: 'from-violet-500 to-purple-600' },
                { goal: 'Manage multiple accounts', icon: '🔀', color: 'from-indigo-500 to-blue-600' },
                { goal: 'Create viral content', icon: '💥', color: 'from-red-500 to-pink-600' }
              ].map(({ goal, icon, color }) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => handleGoalToggle(goal)}
                  className={`w-full p-6 rounded-2xl border-3 transition-all duration-500 text-left hover:scale-[1.02] relative overflow-hidden group ${
                    formData.goals.includes(goal)
                      ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl shadow-blue-200'
                      : 'border-gray-200 hover:border-gray-400 hover:shadow-lg bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center text-2xl shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                      {icon}
                    </div>
                    <div className="flex-1">
                      <span className="font-black text-gray-900 text-lg">{goal}</span>
                    </div>
                    <div className={`w-8 h-8 rounded-xl border-3 flex items-center justify-center transition-all duration-500 ${
                      formData.goals.includes(goal)
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-blue-500 shadow-lg scale-110'
                        : 'border-gray-300'
                    }`}>
                      {formData.goals.includes(goal) && (
                        <Check className="w-5 h-5 text-white" />
                      )}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000 opacity-0 group-hover:opacity-100"></div>
                </button>
              ))}
            </div>

            <div className="flex space-x-6">
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 py-5 rounded-2xl font-black text-lg transition-all duration-500 hover:scale-[1.02] flex items-center justify-center space-x-3 transform hover:-rotate-1"
              >
                <ArrowLeft className="w-6 h-6" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={formData.goals.length === 0}
                className="flex-1 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 text-white py-5 rounded-2xl font-black text-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 relative overflow-hidden group transform hover:rotate-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>
                <span>Continue</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-10">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-200 animate-bounce">
                <Check className="w-16 h-16 text-white" />
              </div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                Launch Ready!
              </h1>
              <p className="text-xl text-gray-600 font-medium mt-4">
                Your AI workspace is configured and ready to revolutionize your social media
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 via-blue-50/50 to-purple-50/50 rounded-3xl p-8 border-3 border-gray-100 shadow-xl">
              <h3 className="font-black text-gray-900 mb-8 text-2xl flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <Star className="w-5 h-5 text-white" />
                </div>
                Your Profile
              </h3>
              <div className="space-y-6">
                {[
                  { label: 'Name', value: formData.fullName, icon: '👤' },
                  { label: 'Email', value: formData.email, icon: '📧' },
                  { label: 'Business', value: formData.businessType?.replace('_', ' '), icon: '🏢' },
                  { label: 'Team Size', value: formData.teamSize, icon: '👥' },
                  { label: 'Goals', value: `${formData.goals.length} selected`, icon: '🎯' }
                ].map(({ label, value, icon }) => (
                  <div key={label} className="flex items-center justify-between py-4 px-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{icon}</span>
                      <span className="text-gray-600 font-bold">{label}</span>
                    </div>
                    <span className="font-black text-gray-900 capitalize">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-6">
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 py-5 rounded-2xl font-black text-lg transition-all duration-500 hover:scale-[1.02] flex items-center justify-center space-x-3 transform hover:-rotate-1"
              >
                <ArrowLeft className="w-6 h-6" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white py-5 rounded-2xl font-black text-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 relative overflow-hidden group transform hover:rotate-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Launching...</span>
                  </>
                ) : (
                  <>
                    <Rocket className="w-6 h-6 group-hover:animate-bounce" />
                    <span>Launch VeeFore</span>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex relative overflow-hidden">
      {/* Revolutionary particle canvas */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{ mixBlendMode: 'multiply' }}
      />

      {/* Revolutionary floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-float-slow ${
              i % 4 === 0 ? 'bg-gradient-to-r from-blue-200/30 to-cyan-200/30' :
              i % 4 === 1 ? 'bg-gradient-to-r from-purple-200/30 to-pink-200/30' :
              i % 4 === 2 ? 'bg-gradient-to-r from-emerald-200/30 to-teal-200/30' :
              'bg-gradient-to-r from-yellow-200/30 to-orange-200/30'
            }`}
            style={{
              width: `${150 + i * 80}px`,
              height: `${150 + i * 80}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${20 + i * 8}s`,
              filter: 'blur(50px)',
              transform: `rotate(${i * 30}deg)`
            }}
          />
        ))}
      </div>

      {/* Left side - Revolutionary Interactive Demo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
        {/* Revolutionary mouse tracking */}
        <div 
          className="absolute inset-0 opacity-40 transition-all duration-500"
          style={{
            background: `radial-gradient(1000px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15), transparent 60%)`
          }}
        />

        {/* Revolutionary grid pattern */}
        <div className="absolute inset-0 opacity-5"
             style={{
               backgroundImage: `
                 linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
               `,
               backgroundSize: '80px 80px'
             }}
        />

        <div className="relative z-10 flex flex-col justify-center px-20 py-24">
          {/* Revolutionary VeeFore Branding */}
          <div className="mb-20">
            <div className="flex items-center space-x-6 mb-10">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 flex items-center justify-center shadow-2xl shadow-purple-500/30 animate-pulse">
                <img src={veeforceLogo} alt="VeeFore" className="w-12 h-12" />
              </div>
              <div>
                <h2 className="text-4xl font-black text-white">VeeFore</h2>
                <p className="text-purple-200 font-bold text-lg">Next-Gen AI Platform</p>
              </div>
            </div>
            
            {/* Revolutionary live metrics */}
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-black text-white">{liveMetrics.users.toLocaleString()}</div>
                <div className="text-purple-200 text-sm font-bold">Active Users</div>
                <div className="w-full h-1 bg-white/20 rounded-full mt-2">
                  <div className="w-3/4 h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-black text-white">{liveMetrics.engagement.toFixed(1)}%</div>
                <div className="text-purple-200 text-sm font-bold">Success Rate</div>
                <div className="w-full h-1 bg-white/20 rounded-full mt-2">
                  <div className="w-full h-1 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Revolutionary Demo Section */}
          <div className="space-y-12">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-black text-white">Live AI Demo</h3>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center space-x-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 transition-all duration-500 border border-white/20 group"
              >
                {isPlaying ? <Pause className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" /> : <Play className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />}
                <span className="font-bold">{isPlaying ? 'Pause Demo' : 'Play Demo'}</span>
              </button>
            </div>

            {/* Revolutionary demo showcase */}
            <div className={`p-10 rounded-3xl border border-white/10 backdrop-blur-md bg-gradient-to-br ${currentScenario.gradient} bg-opacity-15 transition-all duration-1000 shadow-2xl`}>
              <div className="flex items-start space-x-8">
                <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center shadow-2xl">
                  <currentScenario.icon className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <div className="mb-4">
                    <h4 className="text-3xl font-black text-white mb-2">{currentScenario.title}</h4>
                    <p className="text-purple-200 font-bold text-lg">{currentScenario.subtitle}</p>
                  </div>
                  <p className="text-blue-100 mb-8 text-xl leading-relaxed">{currentScenario.description}</p>
                  
                  {/* Revolutionary demo progress */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-bold">{currentScenario.demo}</span>
                      <span className="text-purple-200 text-sm">{Math.round(currentScenario.progress)}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full transition-all duration-300"
                        style={{ width: `${currentScenario.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Revolutionary metrics display */}
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    {Object.entries(currentScenario.stats).map(([key, value]) => (
                      <div key={key} className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                        <div className="text-2xl font-black text-white mb-1">{value}</div>
                        <div className="text-sm text-purple-200 capitalize font-bold">{key}</div>
                      </div>
                    ))}
                  </div>

                  {/* Revolutionary feature highlights */}
                  <div className="grid grid-cols-2 gap-3">
                    {currentScenario.features.map((feature, index) => (
                      <div key={index} className="px-4 py-3 bg-white/10 backdrop-blur-md rounded-xl text-white text-sm font-bold border border-white/20 text-center">
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Revolutionary demo indicators */}
            <div className="flex space-x-4 justify-center">
              {demoScenarios.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentDemo(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-500 ${
                    index === currentDemo 
                      ? 'bg-white scale-125 shadow-lg shadow-white/30' 
                      : 'bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

            {/* Revolutionary social proof */}
            <div className="pt-12 border-t border-white/10">
              <div className="grid grid-cols-4 gap-8 text-center">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-white font-black text-xl">{liveMetrics.satisfaction}/5</div>
                  <div className="text-purple-200 text-sm font-bold">Rating</div>
                </div>
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-white font-black text-xl">99.9%</div>
                  <div className="text-purple-200 text-sm font-bold">Uptime</div>
                </div>
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-white font-black text-xl">SOC 2</div>
                  <div className="text-purple-200 text-sm font-bold">Certified</div>
                </div>
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-white font-black text-xl">190+</div>
                  <div className="text-purple-200 text-sm font-bold">Countries</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Revolutionary Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative z-10">
        {/* Revolutionary navigation header */}
        <div className="absolute top-0 left-0 right-0 z-50">
          <div className="flex items-center justify-between p-10">
            <button 
              onClick={handleBackToLanding}
              className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-all duration-500 hover:scale-110 group lg:hidden transform hover:-rotate-2"
            >
              <ArrowLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform duration-300" />
              <span className="font-black">Back to Home</span>
            </button>
            
            <div className="flex items-center space-x-4 lg:hidden">
              <img 
                src={veeforceLogo} 
                alt="VeeFore" 
                className="w-12 h-12 filter drop-shadow-xl hover:scale-110 transition-transform duration-500"
              />
              <span className="text-gray-900 font-black text-3xl">VeeFore</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-2xl mx-auto px-10 py-28">
          {/* Revolutionary Progress Steps */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-black text-gray-700">
                  Step {currentStep}
                </span>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-bold">
                  of {totalSteps}
                </span>
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {Math.round((currentStep / totalSteps) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 h-4 rounded-full transition-all duration-1000 ease-out shadow-lg relative overflow-hidden"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer"></div>
              </div>
            </div>
          </div>

          {/* Revolutionary VeeFore Logo */}
          <div className="mb-16 flex justify-center">
            <div className="relative p-10 rounded-3xl hover:scale-110 transition-all duration-700 ease-out group transform hover:rotate-3">
              <img 
                src={veeforceLogo} 
                alt="VeeFore" 
                className="w-28 h-28 transform hover:scale-125 transition-all duration-700 ease-out filter drop-shadow-2xl hover:drop-shadow-3xl animate-float" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-700 -z-10"></div>
            </div>
          </div>

          {/* Revolutionary Form Container */}
          <div className="bg-white/95 backdrop-blur-3xl rounded-3xl border-2 border-white/50 shadow-2xl shadow-gray-300/50 p-12 transform hover:scale-[1.01] transition-all duration-700 relative overflow-hidden"> 
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 rounded-3xl"></div>
            <div className="relative z-10">
              <form onSubmit={handleSubmit}>
                {renderStepContent()}
              </form>

              {/* Revolutionary Sign In Link */}
              <div className="mt-12 text-center">
                <p className="text-gray-600 font-semibold text-lg">
                  Already building the future?{' '}
                  <button
                    onClick={() => onNavigate('signin')}
                    className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-black transition-all duration-300 hover:scale-110 transform inline-block hover:rotate-2"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Revolutionary Footer */}
          <div className="mt-12 text-center text-sm text-gray-500">
            <p className="leading-relaxed font-medium">
              By joining VeeFore, you agree to our{' '}
              <a href="#" className="text-blue-600 hover:text-purple-600 transition-colors duration-300 font-bold">Terms</a>
              {' '}and{' '}
              <a href="#" className="text-blue-600 hover:text-purple-600 transition-colors duration-300 font-bold">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp