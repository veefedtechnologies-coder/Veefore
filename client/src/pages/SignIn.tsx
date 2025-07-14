import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { Link, useLocation } from 'wouter'
import { signInWithEmail, signInWithGoogle } from '@/lib/firebase'
import { useToast } from '@/hooks/use-toast'

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
    <div className="min-h-screen flex">
      {/* Left side - Marketing content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-800 to-blue-900 text-white p-12 relative">
        <div className="absolute top-8 left-8">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleBackToLanding}
              className="flex items-center space-x-2 text-white hover:text-teal-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-white font-bold text-xl">VeeFore</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col justify-center max-w-md">
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Gets social.<br />
            Knows your brand.<br />
            Ready to jam.
          </h1>
          
          <p className="text-lg text-teal-100 mb-8">
            Meet VeeGPT — your social media AI assistant. Built on real-time social media conversations and set to your brand voice, it's ready to help you spot post-worthy trends, write posts tailored to your brand, and build campaign strategies based on what's happening online right now.
          </p>
          
          <p className="text-teal-200 font-medium">
            Free for a limited time.
          </p>
        </div>
        
        {/* Phone mockup */}
        <div className="absolute bottom-8 right-8">
          <div className="w-64 h-80 bg-gradient-to-b from-pink-500 to-purple-600 rounded-3xl p-6 shadow-2xl">
            <div className="bg-white rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">V</span>
                </div>
                <span className="text-xs text-gray-500">VeeGPT</span>
              </div>
              
              <div className="space-y-2">
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-purple-700">What's trending in my industry?</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-purple-700">How can I boost engagement?</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-purple-700">Draft a posting schedule for next month</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-purple-700">I need a campaign idea</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-purple-700">Draft a TikTok script</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="bg-white bg-opacity-20 rounded-full px-4 py-2">
                <span className="text-white font-bold text-sm">VeeGPT</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Sign in form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          {/* Back button for mobile */}
          <div className="lg:hidden mb-6">
            <button 
              onClick={handleBackToLanding}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to home</span>
            </button>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Sign in
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-3 border-b-2 ${errors.email ? 'border-red-500' : 'border-blue-500'} focus:outline-none focus:border-blue-600 bg-transparent`}
                placeholder=""
              />
              {errors.email && (
                <div className="flex items-center mt-1 text-red-500 text-sm">
                  <span className="w-4 h-4 mr-1">⚠️</span>
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-3 py-3 border-b-2 ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-blue-600 bg-transparent pr-10`}
                  placeholder=""
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center mt-1 text-red-500 text-sm">
                  <span className="w-4 h-4 mr-1">⚠️</span>
                  {errors.password}
                </div>
              )}
            </div>

            {/* Sign In Button */}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-md font-medium disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>

            {/* Google Sign In */}
            <Button 
              type="button" 
              variant="outline"
              disabled={isLoading}
              onClick={handleGoogleSignIn}
              className="w-full border-gray-300 text-gray-700 py-3 rounded-md font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </Button>

            {/* Sign up link */}
            <div className="text-center">
              <button 
                onClick={() => onNavigate('signup')}
                className="text-blue-600 hover:underline font-medium bg-transparent border-none cursor-pointer"
              >
                Sign up
              </button>
            </div>
          </form>

          {/* Terms */}
          <p className="text-xs text-gray-500 mt-8 text-center">
            By selecting Sign in, I agree to{' '}
            <a href="#" className="text-blue-600 hover:underline">VeeFore's Terms</a>, including the payment terms, and{' '}
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
          </p>

          {/* Social Sign In */}
          <div className="mt-8 text-center">
            <Button 
              variant="outline" 
              className="text-blue-600 hover:bg-blue-50 font-medium"
            >
              Use Social Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn