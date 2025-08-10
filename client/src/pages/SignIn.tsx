import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, ArrowLeft, Sparkles, Bot, Zap, Shield, Globe } from 'lucide-react'
import { Link, useLocation } from 'wouter'
import { signInWithEmail, signInWithGoogle } from '@/lib/firebase'
import { useToast } from '@/hooks/use-toast'
import VeeForeLogo from '@assets/output-onlinepngtools_1754773215023.png'

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
      {/* Apple-style Background Elements */}
      <div className="absolute inset-0">
        {/* Dynamic mesh gradient background */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-violet-400/20 via-blue-400/15 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-emerald-400/20 via-blue-400/15 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-pink-400/10 via-purple-400/10 to-blue-400/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 animate-pulse delay-500" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Premium Navigation Bar */}
      <nav className="relative z-20 w-full px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={handleBackToLanding}
            className="group flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-xl border border-gray-200/50 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-medium">Back to VeeFore</span>
          </button>

          <div className="flex items-center space-x-3">
            <img 
              src={VeeForeLogo}
              alt="VeeFore Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              VeeFore
            </span>
          </div>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-120px)] relative z-10">
        {/* Left Side - Premium Visual Content */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
          <div className="max-w-xl">
            {/* Hero Section */}
            <div className="text-center lg:text-left mb-12">
              {/* Status Badge */}
              <div className="inline-flex items-center bg-white/70 backdrop-blur-xl rounded-full px-6 py-3 mb-8 border border-white/40 shadow-xl">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full mr-3 animate-pulse" />
                <span className="text-gray-700 font-semibold text-sm">Welcome Back to VeeFore</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-black mb-8 leading-tight">
                <span className="block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4">
                  Continue Your
                </span>
                <span className="block bg-gradient-to-r from-violet-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  AI Journey
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed font-light mb-8">
                Sign in to access your personalized AI workspace where intelligent content creation meets strategic social media management.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  icon: Bot,
                  title: "VeeGPT Assistant",
                  description: "Your intelligent AI companion",
                  gradient: "from-blue-500 to-indigo-600"
                },
                {
                  icon: Zap,
                  title: "Smart Automation",
                  description: "Streamlined workflows",
                  gradient: "from-emerald-500 to-teal-600"
                },
                {
                  icon: Shield,
                  title: "Secure & Private",
                  description: "Enterprise-grade security",
                  gradient: "from-purple-500 to-pink-600"
                },
                {
                  icon: Globe,
                  title: "Global Reach",
                  description: "Multi-platform management",
                  gradient: "from-orange-500 to-red-600"
                }
              ].map((feature, index) => (
                <div key={index} className="group">
                  <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Premium Sign In Form */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-md">
            {/* Glassmorphism Card */}
            <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-8 border border-white/50 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-600">Sign in to continue your AI experience</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-4 bg-white/70 backdrop-blur-xl border-2 ${
                        errors.email ? 'border-red-400' : 'border-gray-200/50'
                      } rounded-xl focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-400/20 transition-all duration-300 text-gray-900 placeholder-gray-500`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-500 text-xs">!</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm font-medium">{errors.email}</p>
                  )}
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-sm text-violet-600 hover:text-violet-700 font-medium hover:underline transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`w-full px-4 py-4 bg-white/70 backdrop-blur-xl border-2 ${
                        errors.password ? 'border-red-400' : 'border-gray-200/50'
                      } rounded-xl focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-400/20 transition-all duration-300 text-gray-900 placeholder-gray-500 pr-12`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm font-medium">{errors.password}</p>
                  )}
                </div>

                {/* Sign In Button */}
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-violet-500/25 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing you in...</span>
                    </div>
                  ) : (
                    'Sign In to VeeFore'
                  )}
                </Button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200/50" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/80 text-gray-500 font-medium">Or continue with</span>
                  </div>
                </div>

                {/* Google Sign In */}
                <Button 
                  type="button" 
                  variant="outline"
                  disabled={isLoading}
                  onClick={handleGoogleSignIn}
                  className="w-full bg-white/70 backdrop-blur-xl border-2 border-gray-200/50 text-gray-700 py-4 rounded-xl font-semibold text-lg hover:bg-white/90 hover:border-gray-300/50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              <div className="text-center mt-8">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <button 
                    onClick={() => onNavigate('signup')}
                    className="text-violet-600 hover:text-violet-700 font-semibold hover:underline transition-colors"
                  >
                    Get early access
                  </button>
                </p>
              </div>

              {/* Terms */}
              <p className="text-xs text-gray-500 mt-6 text-center leading-relaxed">
                By signing in, you agree to our{' '}
                <a href="#" className="text-violet-600 hover:underline">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="text-violet-600 hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn