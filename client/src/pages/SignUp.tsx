import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, ArrowLeft, Check, X, Sparkles, Shield, Zap, Crown } from 'lucide-react'
import { Link, useLocation } from 'wouter'
import { signUpWithEmail, signInWithGoogle } from '@/lib/firebase'
import { useToast } from '@/hooks/use-toast'
import veeforceLogo from '@assets/output-onlinepngtools_1754815000405.png'

interface SignUpProps {
  onNavigate: (view: string) => void
}

const SignUp = ({ onNavigate }: SignUpProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: ''
  })
  const { toast } = useToast()
  const [, setLocation] = useLocation()
  const [isLoading, setIsLoading] = useState(false)

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
            email: formData.email
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Ultra Premium Background Effects */}
      <div className="absolute inset-0">
        {/* Dynamic Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] animate-pulse"></div>
        
        {/* Floating Orbs with Glow */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-float-premium ${
              i % 4 === 0 ? 'bg-gradient-to-r from-blue-400/20 to-cyan-400/20' :
              i % 4 === 1 ? 'bg-gradient-to-r from-purple-400/20 to-pink-400/20' :
              i % 4 === 2 ? 'bg-gradient-to-r from-emerald-400/20 to-teal-400/20' :
              'bg-gradient-to-r from-amber-400/20 to-orange-400/20'
            }`}
            style={{
              width: `${60 + i * 40}px`,
              height: `${60 + i * 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${12 + i * 3}s`,
              filter: 'blur(40px)',
              boxShadow: `0 0 ${100 + i * 50}px currentColor`
            }}
          />
        ))}

        {/* Premium Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40"></div>
      </div>

      {/* Navigation Header */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between p-8 max-w-7xl mx-auto">
          <button 
            onClick={handleBackToLanding}
            className="flex items-center space-x-3 text-white/80 hover:text-white transition-all duration-500 hover:scale-105 group backdrop-blur-sm bg-white/5 rounded-2xl px-6 py-3 border border-white/10 hover:border-white/20"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform duration-500" />
            <span className="font-medium">Back to Home</span>
          </button>
          
          <div className="flex items-center space-x-4 backdrop-blur-sm bg-white/5 rounded-2xl px-6 py-3 border border-white/10">
            <img 
              src={veeforceLogo} 
              alt="VeeFore" 
              className="w-10 h-10 filter drop-shadow-lg"
            />
            <span className="text-white font-bold text-2xl tracking-wide">VeeFore</span>
            <Crown className="w-6 h-6 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-20">
        <div className="w-full max-w-lg mx-auto">
          
          {/* Premium Logo Section */}
          <div className="mb-12 flex justify-center">
            <div className="relative group">
              {/* Holographic Ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 p-1 animate-spin" style={{animationDuration: '8s'}}>
                <div className="w-full h-full rounded-full bg-black"></div>
              </div>
              
              {/* Logo Container */}
              <div className="relative p-8 backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 rounded-full border border-white/20 group-hover:scale-110 transition-all duration-700 animate-[simpleEntrance_1.5s_ease-out_forwards]"
                   style={{
                     animationDelay: '0.5s',
                     opacity: 0,
                     transform: 'translateY(30px) scale(0.8)'
                   }}>
                <img 
                  src={veeforceLogo} 
                  alt="VeeFore" 
                  className="w-20 h-20 relative z-10 filter drop-shadow-2xl" 
                />
                
                {/* Premium Glow Effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              </div>
            </div>
          </div>

          {/* Premium Form Container */}
          <div className="backdrop-blur-2xl bg-gradient-to-br from-white/15 to-white/5 rounded-3xl border border-white/20 shadow-2xl p-10 animate-[simpleEntrance_1.5s_ease-out_forwards]" 
               style={{
                 animationDelay: '0.8s',
                 opacity: 0,
                 transform: 'translateY(30px) scale(0.95)',
                 boxShadow: '0 0 100px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
               }}>
            
            {/* Premium Header */}
            <div className="text-center mb-10">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  Join VeeFore Elite
                </h1>
                <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
              </div>
              <p className="text-white/70 text-lg leading-relaxed">
                Unlock the future of AI-powered social media management
              </p>
              
              {/* Premium Features Badge */}
              <div className="mt-6 flex items-center justify-center space-x-6">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm font-medium">Enterprise Security</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-400">
                  <Zap className="w-5 h-5" />
                  <span className="text-sm font-medium">AI-Powered</span>
                </div>
              </div>
            </div>

            {/* Premium Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full mb-8 flex items-center justify-center space-x-4 bg-gradient-to-r from-white to-gray-100 hover:from-gray-50 hover:to-white text-gray-900 rounded-2xl px-8 py-5 font-semibold transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group border border-white/20"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-lg">Continue with Google</span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </button>

            {/* Premium Divider */}
            <div className="flex items-center mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <div className="px-6 py-2 backdrop-blur-sm bg-white/10 rounded-full border border-white/20">
                <span className="text-white/70 font-medium">or create with email</span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>

            {/* Premium Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Full Name Field */}
              <div>
                <label htmlFor="fullName" className="block text-white font-semibold mb-3 text-lg">
                  Full Name
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`w-full px-6 py-4 bg-white/10 backdrop-blur-sm border-2 ${
                      errors.fullName 
                        ? 'border-red-400/50 bg-red-500/10' 
                        : 'border-white/20 focus:border-blue-400/50'
                    } rounded-2xl focus:outline-none transition-all duration-500 text-white placeholder-white/50 text-lg group-hover:bg-white/15`}
                    placeholder="Enter your full name"
                  />
                  {formData.fullName && !errors.fullName && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  {/* Field Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>
                </div>
                {errors.fullName && (
                  <div className="flex items-center mt-3 text-red-400 text-sm">
                    <X className="w-4 h-4 mr-2" />
                    {errors.fullName}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-white font-semibold mb-3 text-lg">
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-6 py-4 bg-white/10 backdrop-blur-sm border-2 ${
                      errors.email 
                        ? 'border-red-400/50 bg-red-500/10' 
                        : 'border-white/20 focus:border-blue-400/50'
                    } rounded-2xl focus:outline-none transition-all duration-500 text-white placeholder-white/50 text-lg group-hover:bg-white/15`}
                    placeholder="Enter your email address"
                  />
                  {formData.email && !errors.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  {/* Field Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>
                </div>
                {errors.email && (
                  <div className="flex items-center mt-3 text-red-400 text-sm">
                    <X className="w-4 h-4 mr-2" />
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-white font-semibold mb-3 text-lg">
                  Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full px-6 py-4 pr-14 bg-white/10 backdrop-blur-sm border-2 ${
                      errors.password 
                        ? 'border-red-400/50 bg-red-500/10' 
                        : 'border-white/20 focus:border-blue-400/50'
                    } rounded-2xl focus:outline-none transition-all duration-500 text-white placeholder-white/50 text-lg group-hover:bg-white/15`}
                    placeholder="Create a secure password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                  </button>
                  
                  {/* Field Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>
                </div>
                
                {/* Premium Password Requirements */}
                {formData.password && (
                  <div className="mt-4 p-6 backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-white font-medium mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-emerald-400" />
                      Security Requirements
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { key: 'length', label: '12+ characters', check: passwordRequirements.length },
                        { key: 'uppercase', label: 'Uppercase letter', check: passwordRequirements.uppercase },
                        { key: 'lowercase', label: 'Lowercase letter', check: passwordRequirements.lowercase },
                        { key: 'special', label: 'Special character', check: passwordRequirements.special }
                      ].map(({ key, label, check }) => (
                        <div key={key} className={`flex items-center text-sm transition-all duration-300 ${
                          check ? 'text-emerald-400' : 'text-white/60'
                        }`}>
                          <div className={`w-5 h-5 mr-3 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            check 
                              ? 'bg-emerald-500 border-emerald-500' 
                              : 'border-white/30'
                          }`}>
                            {check && <Check className="w-3 h-3 text-white" />}
                          </div>
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Premium Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white py-5 rounded-2xl font-bold text-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
              >
                {/* Button Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Your Elite Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <Crown className="w-6 h-6" />
                    <span>Create Elite Account</span>
                    <Sparkles className="w-6 h-6" />
                  </div>
                )}
              </button>
            </form>

            {/* Premium Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-white/70 text-lg">
                Already part of the elite?{' '}
                <button
                  onClick={() => onNavigate('signin')}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300 hover:underline"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>

          {/* Premium Footer */}
          <div className="mt-10 text-center text-white/50">
            <p className="text-sm leading-relaxed">
              By joining VeeFore Elite, you agree to our{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors duration-300">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors duration-300">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp