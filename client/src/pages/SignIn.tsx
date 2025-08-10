import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, ArrowLeft, Sparkles, Zap, Cpu, Network, Brain, Rocket, ChevronRight, Play, Pause } from 'lucide-react'
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
      icon: Zap,
      metrics: { efficiency: "+340%", saved: "15h/week", posts: "847" }
    },
    {
      title: "Analytics Intelligence",
      description: "Real-time insights and performance tracking",
      gradient: "from-emerald-600 via-teal-600 to-cyan-600",
      icon: Network,
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
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Advanced Background System */}
      <div className="absolute inset-0">
        {/* Dynamic Neural Network Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-blue-950/30">
          {/* Floating orbs with mouse interaction */}
          <div 
            className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-violet-500/30 to-blue-500/30 blur-3xl animate-pulse"
            style={{
              left: `${30 + mousePosition.x * 0.02}%`,
              top: `${20 + mousePosition.y * 0.02}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
          <div 
            className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 blur-2xl animate-pulse delay-1000"
            style={{
              right: `${20 + mousePosition.x * 0.015}%`,
              bottom: `${30 + mousePosition.y * 0.015}%`,
              transform: 'translate(50%, 50%)'
            }}
          />
        </div>

        {/* Matrix-style grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }} />
        </div>

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/60 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Futuristic Navigation */}
      <nav className="relative z-50 w-full px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={handleBackToLanding}
            className="group flex items-center space-x-3 text-gray-300 hover:text-white transition-all duration-500"
          >
            <div className="w-12 h-12 rounded-2xl bg-gray-900/80 backdrop-blur-2xl border border-gray-700/50 flex items-center justify-center shadow-2xl group-hover:shadow-blue-500/20 transition-all duration-500 group-hover:scale-110 group-hover:border-blue-500/50">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg">Return to VeeFore</span>
          </button>

          <div className="flex items-center space-x-4 bg-gray-900/60 backdrop-blur-2xl rounded-2xl px-6 py-3 border border-gray-700/50">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              VeeFore
            </span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
        </div>
      </nav>

      <div className="flex min-h-[calc(100vh-120px)] relative z-40">
        {/* Left Side - Advanced Interactive Demo */}
        <div className="lg:w-3/5 flex flex-col justify-center p-8 lg:p-16 relative">
          {/* Hero Content */}
          <div className="max-w-2xl mb-16">
            {/* Advanced Status Badge */}
            <div className="inline-flex items-center bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-2xl rounded-full px-8 py-4 mb-12 border border-blue-500/30 shadow-2xl group hover:scale-105 transition-all duration-500">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-4 h-4 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-4 h-4 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full animate-ping opacity-30" />
                </div>
                <span className="text-white font-bold text-lg">Neural Network Online</span>
                <Cpu className="w-5 h-5 text-blue-400 animate-pulse" />
              </div>
            </div>

            <h1 className="text-6xl lg:text-7xl font-black mb-8 leading-[0.9]">
              <span className="block text-white mb-4">
                Redefine Your
              </span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto] mb-4">
                Digital Presence
              </span>
              <span className="block text-gray-300 text-4xl lg:text-5xl font-light">
                with AI Intelligence
              </span>
            </h1>

            <p className="text-2xl text-gray-300 leading-relaxed font-light mb-12 max-w-xl">
              Enter the next generation of social media management. Where artificial intelligence meets creative brilliance.
            </p>
          </div>

          {/* Interactive Demo Theater */}
          <div className="relative">
            <div className="bg-gray-900/80 backdrop-blur-2xl rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden">
              {/* Demo Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-white font-semibold text-lg">VeeFore AI Studio</span>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 hover:bg-blue-500/30 transition-all duration-300"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <div className="flex space-x-1">
                    {demoScenarios.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentDemo(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentDemo ? 'bg-blue-500 scale-125' : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Demo Content */}
              <div className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${demoScenarios[currentDemo].gradient} flex items-center justify-center shadow-2xl`}>
                    {(() => {
                      const IconComponent = demoScenarios[currentDemo].icon;
                      return <IconComponent className="w-8 h-8 text-white" />;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{demoScenarios[currentDemo].title}</h3>
                    <p className="text-gray-400">{demoScenarios[currentDemo].description}</p>
                  </div>
                </div>

                {/* Live Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {Object.entries(demoScenarios[currentDemo].metrics).map(([key, value], index) => (
                    <div key={key} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
                      <div className="text-3xl font-bold text-white mb-1">{value}</div>
                      <div className="text-gray-400 text-sm capitalize">{key}</div>
                      <div className="w-full h-1 bg-gray-700 rounded-full mt-2 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${demoScenarios[currentDemo].gradient} rounded-full animate-pulse`}
                          style={{ width: `${60 + index * 15}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Processing Visualization */}
                <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/30">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white font-semibold">AI Processing Status</span>
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-blue-400 animate-pulse" />
                      <span className="text-blue-400 text-sm">Neural Network Active</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {['Content Analysis', 'Trend Detection', 'Engagement Optimization'].map((task, index) => (
                      <div key={task} className="flex items-center justify-between">
                        <span className="text-gray-300 text-sm">{task}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                              style={{ 
                                width: `${85 + (index * 5)}%`,
                                animation: `loading ${2 + index}s ease-in-out infinite alternate`
                              }}
                            />
                          </div>
                          <span className="text-green-400 text-xs">✓</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Futuristic Sign In */}
        <div className="lg:w-2/5 flex items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-lg">
            {/* Holographic Sign In Panel */}
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-lg opacity-30 animate-pulse" />
              
              <div className="relative bg-gray-900/95 backdrop-blur-2xl rounded-3xl p-10 border border-gray-700/50 shadow-2xl">
                {/* Header */}
                <div className="text-center mb-10">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl relative">
                    <Sparkles className="w-10 h-10 text-white" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl animate-ping opacity-20" />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-3">Neural Access</h2>
                  <p className="text-gray-400 text-lg">Connect to your AI workspace</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Email Input */}
                  <div className="space-y-3">
                    <label htmlFor="email" className="block text-white font-semibold text-lg">
                      Neural ID
                    </label>
                    <div className="relative group">
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-6 py-5 bg-gray-800/50 backdrop-blur-xl border-2 ${
                          errors.email ? 'border-red-500' : 'border-gray-600/50 group-hover:border-blue-500/50 focus:border-blue-500'
                        } rounded-2xl focus:outline-none transition-all duration-500 text-white placeholder-gray-400 text-lg`}
                        placeholder="Enter your neural ID"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-sm font-medium flex items-center space-x-2">
                        <span>⚠️</span>
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="block text-white font-semibold text-lg">
                        Access Code
                      </label>
                      <Link href="/forgot-password" className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors">
                        Recover access?
                      </Link>
                    </div>
                    <div className="relative group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`w-full px-6 py-5 bg-gray-800/50 backdrop-blur-xl border-2 ${
                          errors.password ? 'border-red-500' : 'border-gray-600/50 group-hover:border-blue-500/50 focus:border-blue-500'
                        } rounded-2xl focus:outline-none transition-all duration-500 text-white placeholder-gray-400 text-lg pr-14`}
                        placeholder="Enter your access code"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                      >
                        {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                      </button>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </div>
                    {errors.password && (
                      <p className="text-red-400 text-sm font-medium flex items-center space-x-2">
                        <span>⚠️</span>
                        <span>{errors.password}</span>
                      </p>
                    )}
                  </div>

                  {/* Futuristic Sign In Button */}
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white py-6 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 flex items-center justify-center space-x-3">
                      {isLoading ? (
                        <>
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Establishing Neural Link...</span>
                        </>
                      ) : (
                        <>
                          <span>Initialize Neural Connection</span>
                          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </div>
                  </Button>

                  {/* Divider */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-600/50" />
                    </div>
                    <div className="relative flex justify-center text-lg">
                      <span className="px-6 bg-gray-900 text-gray-400 font-semibold">Alternative Access</span>
                    </div>
                  </div>

                  {/* Google Neural Link */}
                  <Button 
                    type="button" 
                    variant="outline"
                    disabled={isLoading}
                    onClick={handleGoogleSignIn}
                    className="w-full bg-gray-800/50 backdrop-blur-xl border-2 border-gray-600/50 text-white py-6 rounded-2xl font-bold text-xl hover:bg-gray-700/50 hover:border-gray-500/50 transition-all duration-500 shadow-2xl hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 group"
                  >
                    <div className="flex items-center justify-center space-x-4">
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>{isLoading ? 'Connecting...' : 'Google Neural Link'}</span>
                      <Network className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                    </div>
                  </Button>
                </form>

                {/* Sign Up Link */}
                <div className="text-center mt-10">
                  <p className="text-gray-400 text-lg">
                    New to the neural network?{' '}
                    <button 
                      onClick={() => onNavigate('signup')}
                      className="text-blue-400 hover:text-blue-300 font-bold hover:underline transition-colors group"
                    >
                      Request Access 
                      <Rocket className="w-4 h-4 inline ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </button>
                  </p>
                </div>

                {/* Terms */}
                <p className="text-xs text-gray-500 mt-8 text-center leading-relaxed">
                  Neural connection subject to{' '}
                  <a href="#" className="text-blue-400 hover:underline">Quantum Terms</a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-400 hover:underline">Privacy Protocol</a>
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