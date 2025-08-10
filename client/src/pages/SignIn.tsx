import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, ArrowLeft, Sparkles, Brain, ChevronRight, Play, Pause } from 'lucide-react'
import { Link, useLocation } from 'wouter'
import { signInWithEmail, signInWithGoogle } from '@/lib/firebase'
import { useToast } from '@/hooks/use-toast'
// Note: VeeFore logo will be displayed as text-based logo

interface SignInProps {
  onNavigate: (view: string) => void
}

const SignIn = ({ onNavigate }: SignInProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({
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
  const [particleCount, setParticleCount] = useState(0)

  // Advanced interactive demo data
  const demoScenarios = [
    {
      title: "AI Content Generation",
      description: "Watch VeeGPT create engaging social media content",
      gradient: "from-violet-600 via-purple-600 to-blue-600",
      icon: Brain,
      metrics: { engagement: "+284%", reach: "2.4M", conversion: "+67%" }
    },
    {
      title: "Smart Automation",
      description: "Automated scheduling and optimization in action",
      gradient: "from-blue-600 via-cyan-600 to-emerald-600",
      icon: Play,
      metrics: { efficiency: "+340%", saved: "15h/week", posts: "847" }
    },
    {
      title: "Analytics Intelligence",
      description: "Real-time insights and performance tracking",
      gradient: "from-emerald-600 via-teal-600 to-cyan-600",
      icon: Brain,
      metrics: { accuracy: "94.8%", insights: "156", trends: "+45%" }
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
      "Welcome back to VeeFore AI",
      "Your intelligent workspace awaits",
      "AI-powered content creation ready",
      "Advanced analytics at your fingertips"
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
    }, 1000)
  }

  // Particle counter animation
  useEffect(() => {
    const interval = setInterval(() => {
      setParticleCount(prev => (prev + 1) % 1000)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const handleBackToLanding = () => {
    // Use the prop function for smooth SPA navigation
    onNavigate('')
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors = {
      email: '',
      password: ''
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Validate password
    if (!formData.password.trim()) {
      newErrors.password = 'Please enter your password'
    }

    setErrors(newErrors)

    if (!newErrors.email && !newErrors.password) {
      setIsLoading(true)
      try {
        // Sign in with Firebase
        await signInWithEmail(formData.email, formData.password)
        
        // Send user data to backend
        await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email
          })
        })
        
        toast({
          title: "Success",
          description: "Signed in successfully!",
        })
        
        // Redirect to home page
        setLocation('/')
      } catch (error: any) {
        console.error('Sign in error:', error)
        toast({
          title: "Error",
          description: error.message || "Failed to sign in. Please try again.",
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
      
      // Send user data to backend
      await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      toast({
        title: "Success",
        description: "Signed in with Google successfully!",
      })
      
      // Redirect to home page
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
          animation: 'gridMove 30s linear infinite'
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

        {/* Dynamic mesh overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            background: `
              radial-gradient(circle at ${25 + mousePosition.x * 0.02}% ${25 + mousePosition.y * 0.02}%, rgba(99, 102, 241, 0.4) 0%, transparent 50%),
              radial-gradient(circle at ${75 + mousePosition.x * 0.015}% ${75 + mousePosition.y * 0.015}%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)
            `
          }}
        />
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
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              VeeFore
            </span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
        </div>
      </nav>

      <div className="flex min-h-[calc(100vh-140px)] relative z-40">
        {/* Left Side - Professional Content Preview */}
        <div className="lg:w-3/5 flex flex-col justify-center p-8 lg:p-16 relative">
          {/* Hero Content */}
          <div className="max-w-2xl mb-16">
            {/* Advanced Status Badge with Typing Effect */}
            <div className="inline-flex items-center bg-white/95 backdrop-blur-xl rounded-full px-8 py-4 mb-12 border border-gray-200/50 shadow-xl group hover:scale-105 transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-center space-x-3 relative z-10">
                <div className="relative">
                  <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-4 h-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full animate-ping opacity-40" />
                  <div className="absolute -inset-1 w-6 h-6 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full animate-pulse delay-300" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-800 font-semibold text-lg min-w-[300px] text-left">
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
                Continue Your
              </span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 bg-clip-text text-transparent mb-4">
                AI Journey
              </span>
              <span className="block text-gray-600 text-4xl lg:text-5xl font-light">
                with Professional Excellence
              </span>
            </h1>

            <p className="text-2xl text-gray-600 leading-relaxed font-light mb-12 max-w-xl">
              Access your personalized AI workspace where intelligent content creation meets strategic social media management.
            </p>
          </div>

          {/* Professional Preview Panel */}
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
                  <span className="text-gray-900 font-semibold text-lg">VeeFore AI Workspace</span>
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

                {/* Advanced Metrics with Animations */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {Object.entries(demoScenarios[currentDemo].metrics).map(([key, value], index) => (
                    <div key={key} className="bg-gradient-to-br from-white to-gray-50/80 rounded-xl p-4 border border-gray-200/50 hover:shadow-lg transition-all duration-300 group cursor-pointer relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative z-10">
                        <div className="text-3xl font-bold text-gray-900 mb-1 group-hover:scale-110 transition-transform duration-300">{value}</div>
                        <div className="text-gray-600 text-sm capitalize font-medium">{key}</div>
                        <div className="w-full h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${demoScenarios[currentDemo].gradient} rounded-full transition-all duration-1000 relative`}
                            style={{ 
                              width: `${60 + index * 15}%`,
                              animation: `loading ${2 + index}s ease-in-out infinite alternate`
                            }}
                          >
                            <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse" />
                          </div>
                        </div>
                        {/* Floating indicator */}
                        <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Advanced AI Status with Real-time Metrics */}
                <div className="bg-gradient-to-br from-blue-50/70 to-purple-50/50 rounded-2xl p-6 border border-blue-200/40 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Brain className="w-6 h-6 text-blue-600 animate-pulse" />
                          <div className="absolute -inset-1 w-8 h-8 border-2 border-blue-400/30 rounded-full animate-spin" />
                        </div>
                        <div>
                          <span className="text-gray-900 font-bold text-lg">Neural Network</span>
                          <div className="text-xs text-blue-600 font-medium">Processing {particleCount} operations/sec</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 bg-white/60 rounded-full px-3 py-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-emerald-700 text-sm font-semibold">Active</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {['Content Analysis', 'Trend Detection', 'Engagement Optimization'].map((task, index) => (
                        <div key={task} className="relative">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-800 text-sm font-medium">{task}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-blue-600 text-xs font-bold">{85 + (index * 5)}%</span>
                              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                                <span className="text-emerald-600 text-xs font-bold">✓</span>
                              </div>
                            </div>
                          </div>
                          <div className="w-full h-3 bg-white/60 rounded-full overflow-hidden relative">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full transition-all duration-2000 relative"
                              style={{ 
                                width: `${85 + (index * 5)}%`,
                                animation: `loading ${2 + index}s ease-in-out infinite alternate`
                              }}
                            >
                              <div className="absolute inset-0 bg-white/40 rounded-full animate-pulse" />
                              <div className="absolute right-0 top-0 w-2 h-full bg-white/80 rounded-full animate-pulse" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Real-time activity indicators */}
                    <div className="mt-6 grid grid-cols-3 gap-3">
                      <div className="text-center p-2 bg-white/50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{Math.floor(particleCount / 10)}</div>
                        <div className="text-xs text-gray-600">Models</div>
                      </div>
                      <div className="text-center p-2 bg-white/50 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">{Math.floor(particleCount / 7)}ms</div>
                        <div className="text-xs text-gray-600">Response</div>
                      </div>
                      <div className="text-center p-2 bg-white/50 rounded-lg">
                        <div className="text-lg font-bold text-indigo-600">99.{Math.floor(particleCount % 10)}%</div>
                        <div className="text-xs text-gray-600">Accuracy</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Professional Sign In */}
        <div className="lg:w-2/5 flex items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-lg">
            {/* Professional Sign In Card */}
            <div className="relative">
              {/* Subtle glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-200/50 via-purple-200/50 to-violet-200/50 rounded-3xl blur-xl opacity-60" />
              
              <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-10 border border-gray-200/60 shadow-2xl overflow-hidden">
                {/* Ripple effects */}
                {ripples.map(ripple => (
                  <div
                    key={ripple.id}
                    className="absolute pointer-events-none"
                    style={{
                      left: ripple.x - 50,
                      top: ripple.y - 50,
                      width: 100,
                      height: 100,
                    }}
                  >
                    <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-ping" />
                  </div>
                ))}
                
                {/* Ultra-Advanced Header Section */}
                <div className="text-center mb-12 relative z-10">
                  {/* Revolutionary Logo with Multiple Effects */}
                  <div className="relative flex flex-col items-center mb-10">
                    {/* Floating orb background */}
                    <div className="absolute -inset-8 bg-gradient-to-r from-blue-400/5 via-purple-400/10 to-indigo-400/5 rounded-full blur-3xl animate-pulse" />
                    
                    {/* Main logo container with advanced effects */}
                    <div className="relative group cursor-pointer transform transition-all duration-700 hover:scale-110" onClick={createRipple}>
                      {/* Rotating outer ring */}
                      <div className="absolute -inset-4 w-28 h-28 border-2 border-gradient-to-r from-blue-400/30 via-purple-400/30 to-indigo-400/30 rounded-full animate-spin opacity-60" style={{ animationDuration: '8s' }} />
                      <div className="absolute -inset-3 w-26 h-26 border border-gradient-to-r from-indigo-300/40 via-blue-300/40 to-purple-300/40 rounded-full animate-spin opacity-40" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
                      
                      {/* Core logo */}
                      <div className="relative w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-700">
                        {/* Inner glow effect */}
                        <div className="absolute inset-1 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl animate-pulse" />
                        
                        {/* Logo icon with advanced animations */}
                        <Sparkles className="w-10 h-10 text-white relative z-10 group-hover:rotate-180 transition-transform duration-700 drop-shadow-lg" />
                        
                        {/* Floating particles around logo */}
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700"
                            style={{
                              left: `${50 + 35 * Math.cos((i * Math.PI * 2) / 8)}%`,
                              top: `${50 + 35 * Math.sin((i * Math.PI * 2) / 8)}%`,
                              animation: `particles-orbit ${3 + i * 0.2}s linear infinite`,
                              animationDelay: `${i * 0.3}s`
                            }}
                          />
                        ))}
                      </div>
                      
                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>

                  {/* Sophisticated Welcome Text */}
                  <div className="space-y-4 mb-8">
                    <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-700 cursor-default leading-tight">
                      Welcome Back
                    </h2>
                    <div className="relative">
                      <p className="text-xl text-gray-600 font-medium relative z-10">
                        Sign in to your{' '}
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                          intelligent
                        </span>{' '}
                        VeeFore workspace
                      </p>
                      {/* Subtle text underline effect */}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
                    </div>
                  </div>
                  
                  {/* Revolutionary Security Status Bar */}
                  <div className="relative bg-gradient-to-r from-gray-50/80 via-white/90 to-gray-50/80 backdrop-blur-xl rounded-2xl p-4 border border-gray-200/50 shadow-lg">
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-purple-50/20 to-indigo-50/30 rounded-2xl opacity-50" />
                    
                    <div className="relative z-10 flex items-center justify-center space-x-8">
                      {/* Advanced Security Indicators */}
                      <div className="flex items-center space-x-3 group cursor-pointer">
                        <div className="relative">
                          <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full animate-pulse shadow-lg" />
                          <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-30" />
                          <div className="absolute -inset-1 w-5 h-5 border border-emerald-300/30 rounded-full animate-pulse" />
                        </div>
                        <div className="text-center">
                          <span className="text-emerald-700 text-sm font-bold block">Secure</span>
                          <span className="text-emerald-600 text-xs">256-bit SSL</span>
                        </div>
                      </div>
                      
                      <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
                      
                      <div className="flex items-center space-x-3 group cursor-pointer">
                        <div className="relative">
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full animate-pulse shadow-lg delay-300" />
                          <div className="absolute inset-0 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-30 delay-300" />
                          <div className="absolute -inset-1 w-5 h-5 border border-blue-300/30 rounded-full animate-pulse delay-300" />
                        </div>
                        <div className="text-center">
                          <span className="text-blue-700 text-sm font-bold block">Encrypted</span>
                          <span className="text-blue-600 text-xs">End-to-End</span>
                        </div>
                      </div>
                      
                      <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
                      
                      <div className="flex items-center space-x-3 group cursor-pointer">
                        <div className="relative">
                          <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full animate-pulse shadow-lg delay-500" />
                          <div className="absolute inset-0 w-3 h-3 bg-purple-400 rounded-full animate-ping opacity-30 delay-500" />
                          <div className="absolute -inset-1 w-5 h-5 border border-purple-300/30 rounded-full animate-pulse delay-500" />
                        </div>
                        <div className="text-center">
                          <span className="text-purple-700 text-sm font-bold block">AI-Protected</span>
                          <span className="text-purple-600 text-xs">Neural Guard</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Security level indicator */}
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 h-1 rounded-full transition-all duration-500 ${
                            i < 5 ? 'bg-emerald-500 scale-125' : 'bg-gray-300'
                          }`}
                          style={{ animationDelay: `${i * 100}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Dynamic trust score */}
                  <div className="mt-4 text-center">
                    <span className="text-xs text-gray-500 bg-gray-50/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-200/50">
                      Trust Score: <span className="text-emerald-600 font-bold">99.{Math.floor(particleCount % 10)}%</span>
                    </span>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Email Input */}
                  <div className="space-y-3">
                    <label htmlFor="email" className="block text-gray-800 font-semibold text-lg">
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
                        className={`w-full px-6 py-5 bg-white/90 backdrop-blur-xl border-2 ${
                          errors.email ? 'border-red-400' : 'border-gray-200/60 group-hover:border-blue-400/60 focus:border-blue-500'
                        } rounded-2xl focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-500 text-lg focus:ring-4 focus:ring-blue-500/10 relative z-10`}
                        placeholder="Enter your email address"
                      />
                      {/* Advanced focus indicator */}
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 transition-opacity duration-500 ${focusedField === 'email' ? 'opacity-100' : 'opacity-0'}`} />
                      {/* Typing animation dots */}
                      {focusedField === 'email' && formData.email && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-1">
                          <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" />
                          <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce delay-100" />
                          <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce delay-200" />
                        </div>
                      )}
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm font-medium flex items-center space-x-2">
                        <span>⚠️</span>
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="block text-gray-800 font-semibold text-lg">
                        Password
                      </label>
                      <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField('')}
                        className={`w-full px-6 py-5 bg-white/90 backdrop-blur-xl border-2 ${
                          errors.password ? 'border-red-400' : 'border-gray-200/60 group-hover:border-blue-400/60 focus:border-blue-500'
                        } rounded-2xl focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-500 text-lg pr-20 focus:ring-4 focus:ring-blue-500/10 relative z-10`}
                        placeholder="Enter your password"
                      />
                      {/* Advanced focus indicator */}
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 transition-opacity duration-500 ${focusedField === 'password' ? 'opacity-100' : 'opacity-0'}`} />
                      
                      {/* Enhanced password visibility toggle */}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-all duration-300 hover:scale-110 relative z-20"
                      >
                        {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                      </button>
                      
                      {/* Password strength indicator */}
                      {focusedField === 'password' && formData.password && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20">
                          <div className={`w-3 h-3 rounded-full ${formData.password.length >= 8 ? 'bg-emerald-500' : formData.password.length >= 4 ? 'bg-yellow-500' : 'bg-red-500'} animate-pulse`} />
                        </div>
                      )}
                      
                      {/* Security level indicator */}
                      {formData.password && (
                        <div className="absolute bottom-2 left-2 flex space-x-1 z-20">
                          {[...Array(4)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-1 h-1 rounded-full transition-all duration-300 ${
                                formData.password.length > i * 2 ? 'bg-blue-500 scale-125' : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm font-medium flex items-center space-x-2">
                        <span>⚠️</span>
                        <span>{errors.password}</span>
                      </p>
                    )}
                  </div>

                  {/* Advanced Sign In Button with Multiple Effects */}
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    onClick={createRipple}
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white py-6 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                  >
                    {/* Animated background overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    
                    {/* Glowing effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl" />
                    
                    <div className="flex items-center justify-center space-x-3 relative z-10">
                      {isLoading ? (
                        <>
                          <div className="relative">
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <div className="absolute inset-0 w-6 h-6 border-2 border-transparent border-t-blue-300 rounded-full animate-spin animate-reverse" />
                          </div>
                          <span className="animate-pulse">Establishing connection...</span>
                          <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-white rounded-full animate-bounce" />
                            <div className="w-1 h-1 bg-white rounded-full animate-bounce delay-100" />
                            <div className="w-1 h-1 bg-white rounded-full animate-bounce delay-200" />
                          </div>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                          <span className="group-hover:tracking-wider transition-all duration-300">Sign In to VeeFore AI</span>
                          <ChevronRight className="w-6 h-6 group-hover:translate-x-2 group-hover:scale-125 transition-all duration-300" />
                        </>
                      )}
                    </div>
                    
                    {/* Particle effects */}
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{
                            left: `${20 + i * 12}%`,
                            top: `${30 + Math.sin(i) * 20}%`,
                            animation: `particles-float ${2 + i * 0.5}s ease-in-out infinite`,
                            animationDelay: `${i * 0.2}s`
                          }}
                        />
                      ))}
                    </div>
                  </Button>

                  {/* Divider */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200/60" />
                    </div>
                    <div className="relative flex justify-center text-lg">
                      <span className="px-6 bg-white text-gray-500 font-medium">Or continue with</span>
                    </div>
                  </div>

                  {/* Google Sign In */}
                  <Button 
                    type="button" 
                    variant="outline"
                    disabled={isLoading}
                    onClick={handleGoogleSignIn}
                    className="w-full bg-white/90 backdrop-blur-xl border-2 border-gray-200/60 text-gray-700 py-6 rounded-2xl font-bold text-xl hover:bg-gray-50/90 hover:border-gray-300/60 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50"
                  >
                    <div className="flex items-center justify-center space-x-4">
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
                    </div>
                  </Button>
                </form>

                {/* Sign Up Link */}
                <div className="text-center mt-10">
                  <p className="text-gray-600 text-lg">
                    Don't have an account?{' '}
                    <button 
                      onClick={() => onNavigate('signup')}
                      className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition-colors"
                    >
                      Get early access
                    </button>
                  </p>
                </div>

                {/* Terms */}
                <p className="text-xs text-gray-500 mt-8 text-center leading-relaxed">
                  By signing in, you agree to our{' '}
                  <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations are handled by Tailwind */}
    </div>
  )
}

export default SignIn