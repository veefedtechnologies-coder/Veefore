import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Mail, ArrowLeft, Check, Eye, EyeOff, User, Lock, X, Sparkles, ArrowRight, Shield, Zap, Star, Crown, Heart, Globe, Rocket, Brain, Target, Award, TrendingUp } from "lucide-react"
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
  
  const { toast } = useToast()
  const { user } = useFirebaseAuth()
  const [, setLocation] = useLocation()

  // Show loading state when we have a user
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div 
            className="w-20 h-20 border-4 border-white/20 border-t-white rounded-full mx-auto mb-8"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.h1 
            className="text-3xl font-bold text-white mb-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Preparing your VeeFore experience
          </motion.h1>
          <p className="text-white/70 text-lg">Setting up your premium workspace...</p>
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
          description: "Welcome to VeeFore!",
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900" />
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-50 p-8"
      >
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <motion.button
            onClick={handleBackToLanding}
            className="flex items-center space-x-3 text-white/90 hover:text-white transition-colors bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Home</span>
          </motion.button>

          <motion.div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white font-bold text-lg border border-white/30">
              V
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">VeeFore</h1>
              <p className="text-white/70 text-sm">Enterprise Edition</p>
            </div>
          </motion.div>

          <motion.button
            onClick={() => setLocation('/signin')}
            className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white px-6 py-3 rounded-2xl font-semibold transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign In
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-120px)]">
        {/* Left Side - Feature Showcase */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-16 relative"
        >
          <div className="relative z-10 max-w-2xl text-center space-y-12">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              <h1 className="text-6xl font-black text-white mb-8 leading-tight">
                The Future of Social Media Management
              </h1>
              
              <p className="text-2xl text-white/90 leading-relaxed mb-8">
                Join the world's most advanced AI-powered platform trusted by Fortune 500 companies globally.
              </p>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center space-x-8 mb-12">
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
                      <stat.icon className="w-6 h-6 text-white/90 mr-2" />
                      <div className="text-3xl font-bold text-white">{stat.value}</div>
                    </div>
                    <div className="text-white/70 text-sm font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Signup Form */}
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="w-full lg:w-1/2 flex items-center justify-center p-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full max-w-lg relative"
          >
            {/* Premium Form Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 backdrop-blur-3xl rounded-3xl border border-white/30 shadow-2xl" />
              <div className="absolute inset-3 bg-white/30 backdrop-blur-2xl rounded-2xl border border-white/40" />
              
              {/* Content */}
              <div className="relative z-10 p-12">
                {/* Header */}
                <motion.div className="text-center mb-12">
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-full px-4 py-2 border border-blue-300/30 mb-6">
                    <Sparkles className="w-4 h-4 text-blue-300" />
                    <span className="text-blue-100 font-semibold text-sm">Start Your Free Enterprise Trial</span>
                  </div>
                  
                  <h1 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">
                    Create Account
                  </h1>
                  <p className="text-slate-600 font-semibold text-lg">
                    Join 500+ enterprise clients worldwide
                  </p>
                </motion.div>

                {/* Form */}
                <form onSubmit={handleSignUp} className="space-y-6">
                  {/* Full Name Field */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-xl rounded-2xl border-2 border-white/60 shadow-xl" />
                    <div className="relative z-10 flex items-center p-4">
                      <User className="w-5 h-5 text-slate-500 mr-3" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Full Name"
                        className="flex-1 bg-transparent border-0 outline-none text-slate-800 placeholder-slate-500 font-medium"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-2 ml-4">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-xl rounded-2xl border-2 border-white/60 shadow-xl" />
                    <div className="relative z-10 flex items-center p-4">
                      <Mail className="w-5 h-5 text-slate-500 mr-3" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Email Address"
                        className="flex-1 bg-transparent border-0 outline-none text-slate-800 placeholder-slate-500 font-medium"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-2 ml-4">{errors.email}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-xl rounded-2xl border-2 border-white/60 shadow-xl" />
                    <div className="relative z-10 flex items-center p-4">
                      <Lock className="w-5 h-5 text-slate-500 mr-3" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Password"
                        className="flex-1 bg-transparent border-0 outline-none text-slate-800 placeholder-slate-500 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-2 ml-4">{errors.password}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-2xl hover:shadow-3xl disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-3">
                        <motion.div 
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-3">
                        <Crown className="w-5 h-5" />
                        <span>Start Free Enterprise Trial</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </motion.button>

                  {/* Terms */}
                  <div className="text-center text-sm text-slate-500 pt-4">
                    <p>
                      By creating an account, you agree to our{' '}
                      <a href="#" className="text-indigo-600 hover:text-indigo-700 font-semibold underline">Terms of Service</a>{' '}
                      and{' '}
                      <a href="#" className="text-indigo-600 hover:text-indigo-700 font-semibold underline">Privacy Policy</a>
                    </p>
                    <div className="flex items-center justify-center space-x-4 pt-2">
                      <div className="flex items-center space-x-1">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span className="text-green-600 font-medium">Enterprise Security</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="text-red-600 font-medium">99.9% Uptime SLA</span>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default SignUpIntegrated