import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Mail, ArrowLeft, Check, Eye, EyeOff, User, Lock, X, Github } from "lucide-react"
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth"
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useLocation } from "wouter"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiRequest } from "@/lib/queryClient"
import { motion } from "framer-motion"
import veeforeLogo from "@assets/VeeFore.png"

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const validatePassword = (password: string) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }
  
  const score = Object.values(checks).filter(Boolean).length
  let strength = ''
  if (score < 2) strength = 'Weak'
  else if (score < 4) strength = 'Medium'
  else strength = 'Strong'
  
  return { ...checks, score, strength }
}

function SignUpIntegrated() {
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [sentOtpCode, setSentOtpCode] = useState<string | null>(null)
  const [verificationTimer, setVerificationTimer] = useState(0)
  const [otpError, setOtpError] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [pendingUser, setPendingUser] = useState<{ name: string; email: string } | null>(null)
  
  const { toast } = useToast()
  const { user, signInWithGoogle } = useFirebaseAuth()
  const [, setLocation] = useLocation()
  const queryClient = useQueryClient()

  // Fetch user data
  const { data: userData, isLoading: userDataLoading, refetch: refetchUserData } = useQuery({
    queryKey: ['/api/user'],
    enabled: !!user,
  })

  // Send verification email mutation
  const sendVerificationMutation = useMutation({
    mutationFn: (email: string) => 
      apiRequest('/api/auth/send-verification', {
        method: 'POST',
        body: JSON.stringify({ email })
      }),
    onSuccess: (data: any) => {
      console.log('🔑 DEVELOPMENT OTP:', data.otp)
      setSentOtpCode(data.otp)
      setVerificationTimer(60)
      setShowOTPModal(true)
      setPendingUser({ name: formData.fullName, email: formData.email })
      toast({
        title: "Verification email sent!",
        description: "Please check your email for the verification code.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send verification email. Please try again.",
        variant: "destructive",
      })
    }
  })

  // Verify email mutation
  const verifyEmailMutation = useMutation({
    mutationFn: (code: string) => 
      apiRequest('/api/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ 
          email: user?.email,
          code: code 
        })
      }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] })
      setShowOTPModal(false)
      toast({
        title: "Email verified!",
        description: "Your email has been successfully verified.",
      })
      
      // If user needs onboarding, redirect to dashboard where modal will show
      if (data.requiresOnboarding) {
        console.log('Redirecting to dashboard for modal onboarding')
        setLocation('/')
      } else {
        setLocation('/')
      }
    },
    onError: (error: any) => {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid verification code. Please try again.",
        variant: "destructive",
      })
    }
  })

  // Timer effect for resend verification
  useEffect(() => {
    if (verificationTimer > 0) {
      const timer = setTimeout(() => setVerificationTimer(prev => prev - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [verificationTimer])

  // Auto-fill OTP in development
  useEffect(() => {
    if (sentOtpCode && verificationCode !== sentOtpCode) {
      setVerificationCode(sentOtpCode)
    }
  }, [sentOtpCode])

  const handleBackToLanding = () => {
    setLocation('/')
  }

  // OTP Verification Functions
  const handleOTPSubmit = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setOtpError(true)
      toast({
        title: "Invalid Code",
        description: "Please enter the 6-digit verification code.",
        variant: "destructive",
      })
      return
    }

    setOtpLoading(true)
    setOtpError(false)
    
    try {
      await verifyEmailMutation.mutateAsync(verificationCode)
    } catch (error: any) {
      setOtpError(true)
    } finally {
      setOtpLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!pendingUser?.email) return
    
    try {
      await sendVerificationMutation.mutateAsync(pendingUser.email)
    } catch (error) {
      console.error('Failed to resend OTP:', error)
    }
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
    } else {
      const passwordValidation = validatePassword(formData.password)
      if (passwordValidation.score < 3) {
        newErrors.password = 'Password must be stronger (at least 8 characters with uppercase, lowercase, number)'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      setIsLoading(true)
      try {
        console.log('🚀 Creating Firebase user with email:', formData.email)
        
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
        console.log('✅ Firebase user created successfully:', userCredential.user.uid)
        
        // Send verification email
        sendVerificationMutation.mutate(formData.email)
        
        toast({
          title: "Account created!",
          description: "Please verify your email to continue.",
        })
      } catch (error: any) {
        console.error('❌ Firebase signup error:', error)
        let errorMessage = 'Failed to create account. Please try again.'
        
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'An account with this email already exists. Please try signing in instead.'
        } else if (error.code === 'auth/weak-password') {
          errorMessage = 'Password is too weak. Please choose a stronger password.'
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'Please enter a valid email address.'
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

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    try {
      await signInWithGoogle()
      // Will redirect via App.tsx logic
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign up with Google. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const passwordRequirements = validatePassword(formData.password)

  // Show loading state only when we have a user but are still loading their data
  if (user && userDataLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            border: '4px solid #3b82f6', 
            borderTop: '4px solid transparent', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px auto'
          }}></div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#111827' }}>
            Setting up your VeeFore experience
          </div>
          <div style={{ color: '#6b7280' }}>Please wait while we load your account...</div>
        </div>
      </div>
    )
  }

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50/40 to-purple-50/40 pointer-events-none" />
      
      {/* Animated mesh gradient background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-3xl transform-gpu" />
        <div className="absolute inset-0 bg-gradient-to-l from-cyan-400/20 via-blue-400/20 to-indigo-400/20 blur-3xl transform-gpu" />
      </div>

      {/* Enhanced floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed rounded-full opacity-40 mix-blend-multiply"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            background: `linear-gradient(${Math.random() * 360}deg, hsl(${210 + Math.random() * 60}, 70%, 60%), hsl(${270 + Math.random() * 60}, 70%, 60%))`,
          }}
          animate={{
            x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
            y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            scale: [0, Math.random() * 1.5 + 0.5, 0],
            opacity: [0, 0.8, 0],
            rotate: [0, Math.random() * 360]
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Ultra-enhanced header */}
      <header className="relative bg-white/90 backdrop-blur-2xl border-b border-white/30 shadow-2xl z-50">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-purple-50/50" />
        <div className="max-w-7xl mx-auto px-6 py-5 relative">
          <div className="flex justify-between items-center">
            {/* Back button */}
            <motion.button
              onClick={handleBackToLanding}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-2 shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium text-sm">Back to Home</span>
            </motion.button>

            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <img src={veeforeLogo} alt="VeeFore" className="w-10 h-10" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                VeeFore
              </span>
            </motion.div>

            <div className="flex items-center space-x-3">
              <span className="text-gray-600 text-sm">Already have an account?</span>
              <Button
                onClick={() => setLocation('/signin')}
                variant="outline"
                className="bg-white/70 backdrop-blur-sm border-gray-200 hover:bg-white/90"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-10 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
          }}
        >
          {/* Form background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 rounded-3xl" />
          
          {/* Header */}
          <div className="text-center mb-10 relative z-10">
            <motion.h1 
              className="text-4xl font-bold mb-3 relative"
              style={{
                background: "linear-gradient(135deg, #1f2937 0%, #3b82f6 25%, #8b5cf6 50%, #ec4899 75%, #f59e0b 100%)",
                backgroundSize: "300% 300%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 10, repeat: Infinity }}
            >
              Create Your Account
            </motion.h1>
            <p className="text-gray-600 leading-relaxed">Join VeeFore and transform your social media presence with AI</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-6 relative z-10">
            {/* Full Name */}
            <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative group">
              <Label className="block text-gray-700 font-bold mb-3 text-sm">Full Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-20" />
                <Input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="relative z-30 w-full bg-white border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </motion.div>

            {/* Email */}
            <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative group">
              <Label className="block text-gray-700 font-bold mb-3 text-sm">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-20" />
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="relative z-30 w-full bg-white border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium"
                  placeholder="Enter your email"
                  required
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </motion.div>

            {/* Password */}
            <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative group">
              <Label className="block text-gray-700 font-bold mb-3 text-sm">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-20" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="relative z-30 w-full bg-white border-2 border-gray-200 rounded-xl pl-12 pr-12 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium"
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20"
                >
                  {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
              
              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Password strength:</span>
                    <span className={`text-xs font-bold ${
                      passwordRequirements.strength === 'Strong' ? 'text-green-600' :
                      passwordRequirements.strength === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {passwordRequirements.strength}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordRequirements.strength === 'Strong' ? 'bg-green-500' :
                        passwordRequirements.strength === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(passwordRequirements.score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </motion.div>

            {/* Sign Up Button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </motion.div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full bg-white border-2 border-gray-200 hover:bg-gray-50 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="button"
                  disabled={true}
                  variant="outline"
                  className="w-full bg-white border-2 border-gray-200 hover:bg-gray-50 py-3 rounded-xl font-semibold transition-all duration-300 opacity-50 cursor-not-allowed"
                >
                  <Github className="w-5 h-5 mr-2" />
                  GitHub
                </Button>
              </motion.div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>

    {/* OTP Verification Modal */}
    {showOTPModal && (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        {/* Floating gradient orbs for depth */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-md w-full p-8 border border-white/20 before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/30 before:via-transparent before:to-transparent before:pointer-events-none">
          <div className="relative z-10 text-center space-y-8">
            {/* Premium Header with Glass Effect */}
            <div className="space-y-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500/80 via-indigo-500/80 to-purple-600/80 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto shadow-2xl border border-white/20">
                  <Mail className="w-10 h-10 text-white drop-shadow-lg" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400/90 backdrop-blur-sm rounded-full border-2 border-white/50 flex items-center justify-center shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl blur-xl animate-pulse"></div>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-lg">Verify Your Email</h2>
                <div className="space-y-2">
                  <p className="text-white/80 font-medium drop-shadow">
                    We've sent a 6-digit verification code to
                  </p>
                  <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/30 shadow-lg">
                    <Mail className="w-4 h-4 text-white/90" />
                    <span className="font-bold text-white">{pendingUser?.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Revolutionary OTP Input Grid */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className={`text-sm font-bold tracking-wide drop-shadow transition-colors duration-300 ${
                  otpError ? 'text-red-300' : 'text-white/90'
                }`}>
                  {otpError ? 'INVALID CODE' : 'VERIFICATION CODE'}
                </div>
                <div className="flex justify-center space-x-3">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="relative">
                      <input
                        type="text"
                        value={verificationCode[index] || ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '')
                          if (value.length <= 1) {
                            const newCode = verificationCode.split('')
                            newCode[index] = value
                            setVerificationCode(newCode.join('').slice(0, 6))
                            
                            // Clear error state when user starts typing
                            if (otpError) {
                              setOtpError(false)
                            }
                            
                            // Auto-focus next input
                            if (value && index < 5) {
                              const nextInput = e.target.parentElement?.parentElement?.children[index + 1]?.querySelector('input')
                              nextInput?.focus()
                            }
                          }
                        }}
                        onKeyDown={(e) => {
                          // Handle backspace to focus previous input
                          if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
                            const prevInput = e.target.parentElement?.parentElement?.children[index - 1]?.querySelector('input')
                            prevInput?.focus()
                          }
                        }}
                        className={`w-12 h-14 text-center text-2xl font-black border-2 rounded-xl transition-all duration-300 backdrop-blur-xl ${
                          otpError 
                            ? 'border-red-400/60 bg-red-500/20 text-white shadow-lg shadow-red-400/30 animate-pulse' 
                            : verificationCode[index] 
                              ? 'border-green-400/60 bg-green-500/20 text-white shadow-lg shadow-green-400/30' 
                              : 'border-white/30 bg-white/10 text-white placeholder-white/50 focus:border-blue-400/60 focus:bg-blue-500/20 focus:shadow-lg focus:shadow-blue-400/30'
                        }`}
                        maxLength={1}
                        autoFocus={index === 0}
                      />
                      {verificationCode[index] && !otpError && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/30">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                      {verificationCode[index] && otpError && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/30">
                          <X className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Progress indicator */}
                <div className="flex justify-center space-x-1">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className={`h-1 w-8 rounded-full transition-all duration-300 ${
                      otpError && verificationCode[index] 
                        ? 'bg-red-400/80 shadow-lg shadow-red-400/50' 
                        : verificationCode[index] 
                          ? 'bg-green-400/80 shadow-lg shadow-green-400/50' 
                          : 'bg-white/20'
                    }`}></div>
                  ))}
                </div>
              </div>

              {/* Development OTP Display - Only in Development */}
              {import.meta.env.DEV && sentOtpCode && (
                <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 backdrop-blur-xl rounded-xl p-6 border border-orange-400/30 shadow-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                    <span className="text-orange-200 font-bold text-sm">DEVELOPMENT MODE</span>
                  </div>
                  <div className="text-center">
                    <p className="text-orange-100 text-sm mb-2">Development OTP Code:</p>
                    <div className="bg-orange-900/50 border border-orange-400/50 rounded-lg p-4">
                      <span className="text-orange-200 font-mono font-bold text-2xl tracking-widest">
                        {sentOtpCode}
                      </span>
                    </div>
                    <p className="text-orange-200/80 text-xs mt-2">
                      Use this code for testing or check your email
                    </p>
                  </div>
                </div>
              )}

              {/* Premium Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleOTPSubmit}
                  disabled={otpLoading || verificationCode.length !== 6}
                  className="w-full bg-gradient-to-r from-blue-600/80 via-indigo-600/80 to-purple-600/80 backdrop-blur-xl border border-white/20 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700/90 hover:via-indigo-700/90 hover:to-purple-700/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] disabled:hover:scale-100 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {otpLoading ? (
                    <div className="flex items-center justify-center space-x-3 relative z-10">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Verifying Your Code...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-3 relative z-10">
                      <Check className="w-5 h-5" />
                      <span>Verify & Continue</span>
                    </div>
                  )}
                </button>

                {/* Resend and Cancel Options */}
                <div className="flex items-center justify-between text-sm space-x-4">
                  <button
                    onClick={handleResendOTP}
                    disabled={otpLoading}
                    className="flex items-center space-x-2 text-white/80 hover:text-white font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Resend Code</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowOTPModal(false);
                      setVerificationCode('');
                      setOtpError(false);
                      setSentOtpCode(null);
                      setPendingUser(null);
                    }}
                    disabled={otpLoading}
                    className="flex items-center space-x-2 text-white/60 hover:text-white/80 font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}

export default SignUpIntegrated