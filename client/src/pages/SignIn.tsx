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

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(99, 102, 241, 0.2) 1px, transparent 0)`,
          backgroundSize: '60px 60px'
        }} />
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
            {/* Status Badge */}
            <div className="inline-flex items-center bg-white/90 backdrop-blur-xl rounded-full px-8 py-4 mb-12 border border-gray-200/50 shadow-xl group hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full animate-ping opacity-30" />
                </div>
                <span className="text-gray-800 font-semibold text-lg">Welcome Back to VeeFore</span>
                <Sparkles className="w-5 h-5 text-blue-600" />
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

                {/* Professional Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {Object.entries(demoScenarios[currentDemo].metrics).map(([key, value], index) => (
                    <div key={key} className="bg-gray-50/80 rounded-xl p-4 border border-gray-200/50">
                      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
                      <div className="text-gray-600 text-sm capitalize">{key}</div>
                      <div className="w-full h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${demoScenarios[currentDemo].gradient} rounded-full`}
                          style={{ width: `${60 + index * 15}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Status Indicator */}
                <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-200/30">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-900 font-semibold">AI Processing Status</span>
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-blue-600 animate-pulse" />
                      <span className="text-blue-600 text-sm">System Active</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {['Content Analysis', 'Trend Detection', 'Engagement Optimization'].map((task, index) => (
                      <div key={task} className="flex items-center justify-between">
                        <span className="text-gray-700 text-sm">{task}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                              style={{ width: `${85 + (index * 5)}%` }}
                            />
                          </div>
                          <span className="text-emerald-600 text-xs">✓</span>
                        </div>
                      </div>
                    ))}
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
              
              <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-10 border border-gray-200/60 shadow-2xl">
                {/* Header */}
                <div className="text-center mb-10">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-3">Welcome Back</h2>
                  <p className="text-gray-600 text-lg">Sign in to your VeeFore workspace</p>
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
                        className={`w-full px-6 py-5 bg-white/90 backdrop-blur-xl border-2 ${
                          errors.email ? 'border-red-400' : 'border-gray-200/60 group-hover:border-blue-400/60 focus:border-blue-500'
                        } rounded-2xl focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-500 text-lg focus:ring-4 focus:ring-blue-500/10`}
                        placeholder="Enter your email address"
                      />
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
                        className={`w-full px-6 py-5 bg-white/90 backdrop-blur-xl border-2 ${
                          errors.password ? 'border-red-400' : 'border-gray-200/60 group-hover:border-blue-400/60 focus:border-blue-500'
                        } rounded-2xl focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-500 text-lg pr-14 focus:ring-4 focus:ring-blue-500/10`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-300"
                      >
                        {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm font-medium flex items-center space-x-2">
                        <span>⚠️</span>
                        <span>{errors.password}</span>
                      </p>
                    )}
                  </div>

                  {/* Professional Sign In Button */}
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      {isLoading ? (
                        <>
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Signing you in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In to VeeFore</span>
                          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
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