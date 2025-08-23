import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Mail, ArrowLeft, Check, Eye, EyeOff, User, Lock, X, Sparkles, ArrowRight, Shield, Zap, Star, Crown, Heart, Globe, Rocket, Brain, Target, Award, TrendingUp, BarChart3, Users, Calendar, Play, Pause } from "lucide-react"
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useLocation } from "wouter"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiRequest } from "@/lib/queryClient"
import { motion, AnimatePresence } from "framer-motion"

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function SignUpIntegrated() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [currentDemo, setCurrentDemo] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [typedText, setTypedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  const { toast } = useToast()
  const { user } = useFirebaseAuth()
  const [, setLocation] = useLocation()

  // Professional demo scenarios for enterprise signup
  const demoScenarios = [
    {
      title: "Enterprise Analytics",
      description: "Real-time performance insights across all platforms",
      gradient: "from-blue-600 via-indigo-600 to-purple-600",
      icon: BarChart3,
      metrics: { growth: "+340%", accounts: "500+", roi: "+285%" }
    },
    {
      title: "AI Content Studio",
      description: "Generate professional content at enterprise scale",
      gradient: "from-emerald-600 via-teal-600 to-cyan-600",
      icon: Brain,
      metrics: { posts: "10K+", efficiency: "+450%", quality: "98%" }
    },
    {
      title: "Team Collaboration",
      description: "Seamless workflow management for large teams",
      gradient: "from-violet-600 via-purple-600 to-fuchsia-600",
      icon: Users,
      metrics: { teams: "50+", workflow: "+380%", approval: "24/7" }
    },
    {
      title: "Smart Automation",
      description: "Advanced scheduling and optimization systems",
      gradient: "from-orange-600 via-amber-600 to-yellow-600",
      icon: Calendar,
      metrics: { automated: "95%", saved: "40h/week", uptime: "99.9%" }
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
  }, [isPlaying])

  // Professional typing animation
  useEffect(() => {
    const messages = [
      "Welcome to VeeFore Enterprise",
      "AI-powered social media management",
      "Trusted by Fortune 500 companies",
      "Start your enterprise transformation"
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

  // Show loading state when we have a user
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div 
            className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-8"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.h1 
            className="text-3xl font-bold text-gray-900 mb-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Preparing your VeeFore experience
          </motion.h1>
          <p className="text-gray-600 text-lg">Setting up your premium workspace...</p>
        </motion.div>
      </div>
    )
  }

  const handleBackToLanding = () => {
    setLocation('/')
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      setIsLoading(true)
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
        console.log('✅ Firebase user created successfully:', userCredential.user.uid)
        
        toast({
          title: "Account created!",
          description: "Welcome to VeeFore Enterprise!",
        })
        
        setLocation('/')
      } catch (error: any) {
        console.error('❌ Firebase signup error:', error)
        let errorMessage = 'Failed to create account. Please try again.'
        
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'An account with this email already exists. Please try signing in instead.'
        } else if (error.code === 'auth/weak-password') {
          errorMessage = 'Password is too weak. Please choose a stronger password.'
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Professional Light Background */}
      <div className="absolute inset-0">
        {/* Subtle gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-transparent to-purple-50/30" />
        
        {/* Elegant floating elements */}
        <div 
          className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-blue-100/40 to-purple-100/30 blur-3xl animate-pulse"
          style={{
            left: `${25 + mousePosition.x * 0.01}%`,
            top: `${15 + mousePosition.y * 0.01}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
        <div 
          className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-violet-100/30 to-blue-100/40 blur-2xl animate-pulse delay-1000"
          style={{
            right: `${15 + mousePosition.x * 0.008}%`,
            bottom: `${25 + mousePosition.y * 0.008}%`,
            transform: 'translate(50%, 50%)'
          }}
        />

        {/* Advanced animated grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `
            radial-gradient(circle at 2px 2px, rgba(99, 102, 241, 0.3) 1px, transparent 0),
            linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
            linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px, 30px 30px, 30px 30px',
        }} />

        {/* Interactive floating particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30"
            style={{
              left: `${10 + (i * 6)}%`,
              top: `${20 + Math.sin(i) * 30}%`,
              animation: `particles-float ${3 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Professional Navigation */}
      <nav className="relative z-50 w-full px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={handleBackToLanding}
            className="group flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-all duration-300"
          >
            <div className="w-11 h-11 rounded-2xl bg-white/90 backdrop-blur-xl border border-gray-200/60 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg">Back to VeeFore</span>
          </button>

          <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-3 border border-gray-200/50 shadow-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
              V
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              VeeFore
            </span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>

          <motion.button
            onClick={() => setLocation('/signin')}
            className="bg-white/90 backdrop-blur-xl border border-gray-200/60 hover:bg-white text-gray-700 px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign In
          </motion.button>
        </div>
      </nav>

      <div className="flex min-h-[calc(100vh-140px)] relative z-40">
        {/* Left Side - Professional Demo Display */}
        <div className="lg:w-3/5 flex flex-col justify-center p-8 lg:p-16 relative">
          {/* Hero Content */}
          <div className="max-w-2xl mb-16">
            {/* Professional Status Badge with Typing Effect */}
            <div className="inline-flex items-center bg-white/95 backdrop-blur-xl rounded-full px-8 py-4 mb-12 border border-gray-200/50 shadow-xl group hover:scale-105 transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-center space-x-3 relative z-10">
                <div className="relative">
                  <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-4 h-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full animate-ping opacity-40" />
                  <div className="absolute -inset-1 w-6 h-6 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full animate-pulse delay-300" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-800 font-semibold text-lg min-w-[350px] text-left">
                    {typedText}
                    {isTyping && <span className="animate-pulse">|</span>}
                  </span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
                <Sparkles className="w-5 h-5 text-blue-600 group-hover:rotate-12 transition-transform duration-500" />
              </div>
            </div>

            <h1 className="text-6xl lg:text-7xl font-black mb-8 leading-[0.9]">
              <span className="block text-gray-900 mb-4">
                Start Your
              </span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 bg-clip-text text-transparent mb-4">
                Enterprise Journey
              </span>
              <span className="block text-gray-600 text-4xl lg:text-5xl font-light">
                with AI-Powered Excellence
              </span>
            </h1>

            <p className="text-2xl text-gray-600 leading-relaxed font-light mb-12 max-w-xl">
              Join Fortune 500 companies using VeeFore's advanced AI platform for strategic social media management.
            </p>

            {/* Enterprise Trust Indicators */}
            <div className="flex items-center space-x-8 mb-12">
              {[
                { label: "Enterprise Clients", value: "500+", icon: Crown },
                { label: "Posts Generated", value: "1B+", icon: TrendingUp },
                { label: "Success Rate", value: "99.9%", icon: Target }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="w-6 h-6 text-gray-600 mr-2" />
                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  </div>
                  <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Professional Demo Panel */}
          <div className="relative">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-gray-200/50 shadow-2xl overflow-hidden">
              {/* Panel Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-gray-900 font-semibold text-lg">VeeFore Enterprise Platform</span>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-all duration-300"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <div className="flex space-x-1">
                    {demoScenarios.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentDemo(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentDemo ? 'bg-blue-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Panel Content */}
              <div className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${demoScenarios[currentDemo].gradient} flex items-center justify-center shadow-lg`}>
                    {(() => {
                      const IconComponent = demoScenarios[currentDemo].icon;
                      return <IconComponent className="w-8 h-8 text-white" />;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{demoScenarios[currentDemo].title}</h3>
                    <p className="text-gray-600">{demoScenarios[currentDemo].description}</p>
                  </div>
                </div>

                {/* Professional Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {Object.entries(demoScenarios[currentDemo].metrics).map(([key, value], index) => (
                    <div key={key} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
                      <div className="text-gray-600 text-sm capitalize font-medium mb-3">{key}</div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${70 + index * 10}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Enterprise Features Section */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                        V
                      </div>
                      <div>
                        <span className="text-gray-900 font-semibold text-lg">Enterprise AI Engine</span>
                        <div className="text-sm text-blue-600 font-medium">Processing 10K+ operations/hour</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 bg-white rounded-full px-3 py-1 border border-gray-200">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span className="text-emerald-700 text-sm font-medium">Active</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {['Content Generation', 'Multi-Platform Sync', 'Analytics Processing'].map((task, index) => (
                      <div key={task}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-800 text-sm font-medium">{task}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-600 text-sm font-semibold">{95 + (index * 2)}%</span>
                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                              <span className="text-emerald-600 text-xs">✓</span>
                            </div>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-white rounded-full border border-gray-200">
                          <div 
                            className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                            style={{ width: `${95 + (index * 2)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Enterprise Stats */}
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                      <div className="text-lg font-bold text-blue-600">2.4M</div>
                      <div className="text-xs text-gray-600">Posts</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                      <div className="text-lg font-bold text-purple-600">500+</div>
                      <div className="text-xs text-gray-600">Clients</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                      <div className="text-lg font-bold text-indigo-600">99.9%</div>
                      <div className="text-xs text-gray-600">Uptime</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Professional Signup Form */}
        <div className="lg:w-2/5 flex items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-lg">
            {/* Professional Signup Card */}
            <div className="relative">
              {/* Subtle glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-200/50 via-purple-200/50 to-violet-200/50 rounded-3xl blur-xl opacity-60" />
              
              <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-10 border border-gray-200/60 shadow-2xl overflow-hidden">
                {/* Professional Header */}
                <div className="text-center mb-10 relative z-10">
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 backdrop-blur-xl rounded-full px-4 py-2 border border-blue-200/30 mb-6">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700 font-semibold text-sm">Start Your Enterprise Trial</span>
                  </div>
                  
                  <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
                    Create Account
                  </h1>
                  <p className="text-gray-600 font-semibold text-lg">
                    Join 500+ enterprise clients worldwide
                  </p>
                </div>

                {/* Professional Form */}
                <form onSubmit={handleSignUp} className="space-y-6">
                  {/* Full Name Field */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-xl rounded-2xl border-2 border-gray-200/60 shadow-lg" />
                    <div className="relative z-10 flex items-center p-4">
                      <User className="w-5 h-5 text-gray-500 mr-3" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Full Name"
                        className="flex-1 bg-transparent border-0 outline-none text-gray-800 placeholder-gray-500 font-medium"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-2 ml-4">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-xl rounded-2xl border-2 border-gray-200/60 shadow-lg" />
                    <div className="relative z-10 flex items-center p-4">
                      <Mail className="w-5 h-5 text-gray-500 mr-3" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Business Email Address"
                        className="flex-1 bg-transparent border-0 outline-none text-gray-800 placeholder-gray-500 font-medium"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-2 ml-4">{errors.email}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-xl rounded-2xl border-2 border-gray-200/60 shadow-lg" />
                    <div className="relative z-10 flex items-center p-4">
                      <Lock className="w-5 h-5 text-gray-500 mr-3" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Secure Password"
                        className="flex-1 bg-transparent border-0 outline-none text-gray-800 placeholder-gray-500 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-2 ml-4">{errors.password}</p>
                    )}
                  </div>

                  {/* Enterprise Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 relative overflow-hidden group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-3 relative z-10">
                        <motion.div 
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Creating Enterprise Account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-3 relative z-10">
                        <Crown className="w-5 h-5" />
                        <span>Start Enterprise Trial</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </motion.button>

                  {/* Professional Terms */}
                  <div className="text-center text-sm text-gray-500 pt-4">
                    <p>
                      By creating an account, you agree to our{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold underline">Terms of Service</a>{' '}
                      and{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold underline">Privacy Policy</a>
                    </p>
                    <div className="flex items-center justify-center space-x-4 pt-3">
                      <div className="flex items-center space-x-1">
                        <Shield className="w-4 h-4 text-emerald-500" />
                        <span className="text-emerald-600 font-medium">Enterprise Security</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4 text-blue-500" />
                        <span className="text-blue-600 font-medium">99.9% Uptime SLA</span>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional CSS animations */}
      <style jsx>{`
        @keyframes particles-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}

export default SignUpIntegrated