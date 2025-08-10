import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, ArrowLeft, Check, X } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-gradient-to-r from-blue-100/30 to-purple-100/30 animate-float-slow blur-xl ${
              i % 2 === 0 ? 'from-blue-200/20 to-cyan-200/20' : 'from-purple-200/20 to-pink-200/20'
            }`}
            style={{
              width: `${120 + i * 80}px`,
              height: `${120 + i * 80}px`,
              left: `${10 + i * 15}%`,
              top: `${5 + i * 10}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${15 + i * 5}s`
            }}
          />
        ))}
      </div>

      {/* Navigation Header */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between p-6 max-w-7xl mx-auto">
          <button 
            onClick={handleBackToLanding}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Back to Home</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <img 
              src={veeforceLogo} 
              alt="VeeFore" 
              className="w-8 h-8 filter drop-shadow-sm"
            />
            <span className="text-gray-900 font-bold text-xl">VeeFore</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        {/* Simple Elegant VeeFore Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative p-6 rounded-2xl hover:scale-105 transition-all duration-500 ease-out group">
            <img 
              src={veeforceLogo} 
              alt="VeeFore" 
              className="w-24 h-24 transform hover:scale-110 transition-all duration-500 ease-out filter drop-shadow-lg hover:drop-shadow-xl animate-[simpleEntrance_1s_ease-out_forwards]" 
              style={{
                animationDelay: '0.5s',
                opacity: 0,
                transform: 'translateY(20px) scale(0.9)'
              }}
            />
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 animate-[simpleEntrance_1s_ease-out_forwards]" 
             style={{
               animationDelay: '0.8s',
               opacity: 0,
               transform: 'translateY(20px) scale(0.95)'
             }}>
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-600">
              Join VeeFore and revolutionize your social media management
            </p>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full mb-6 flex items-center justify-center space-x-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 font-medium text-gray-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <span className="px-4 text-sm text-gray-500 bg-white rounded-full">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  className={`w-full px-4 py-3 bg-gray-50 border-2 ${errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-400'} rounded-xl focus:outline-none focus:ring-0 transition-all duration-300 placeholder-gray-400`}
                  placeholder="Enter your full name"
                />
                {formData.fullName && !errors.fullName && (
                  <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              {errors.fullName && (
                <div className="flex items-center mt-2 text-red-500 text-sm">
                  <X className="w-4 h-4 mr-1" />
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
                  className={`w-full px-4 py-3 bg-gray-50 border-2 ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-400'} rounded-xl focus:outline-none focus:ring-0 transition-all duration-300 placeholder-gray-400`}
                  placeholder="Enter your email address"
                />
                {formData.email && !errors.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                  <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              {errors.email && (
                <div className="flex items-center mt-2 text-red-500 text-sm">
                  <X className="w-4 h-4 mr-1" />
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
                  className={`w-full px-4 py-3 pr-12 bg-gray-50 border-2 ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-400'} rounded-xl focus:outline-none focus:ring-0 transition-all duration-300 placeholder-gray-400`}
                  placeholder="Create a secure password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Requirements */}
              {formData.password && (
                <div className="mt-3 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`flex items-center text-sm ${passwordRequirements.length ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordRequirements.length ? (
                        <Check className="w-4 h-4 mr-2" />
                      ) : (
                        <div className="w-4 h-4 mr-2 rounded-full border-2 border-current"></div>
                      )}
                      12+ characters
                    </div>
                    <div className={`flex items-center text-sm ${passwordRequirements.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordRequirements.uppercase ? (
                        <Check className="w-4 h-4 mr-2" />
                      ) : (
                        <div className="w-4 h-4 mr-2 rounded-full border-2 border-current"></div>
                      )}
                      Uppercase letter
                    </div>
                    <div className={`flex items-center text-sm ${passwordRequirements.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordRequirements.lowercase ? (
                        <Check className="w-4 h-4 mr-2" />
                      ) : (
                        <div className="w-4 h-4 mr-2 rounded-full border-2 border-current"></div>
                      )}
                      Lowercase letter
                    </div>
                    <div className={`flex items-center text-sm ${passwordRequirements.special ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordRequirements.special ? (
                        <Check className="w-4 h-4 mr-2" />
                      ) : (
                        <div className="w-4 h-4 mr-2 rounded-full border-2 border-current"></div>
                      )}
                      Special character
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
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
  )
}

export default SignUp