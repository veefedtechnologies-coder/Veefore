import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Mail, ArrowLeft, Check, Eye, EyeOff, User, Lock, X, Sparkles, ArrowRight } from "lucide-react"
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useLocation } from "wouter"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiRequest } from "@/lib/queryClient"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion"

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

// Sophisticated background with cursor-responsive elements
const SophisticatedBackground = () => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Primary gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" />
      
      {/* Sophisticated mesh gradients */}
      <motion.div 
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(circle at ${useTransform(springX, x => x / window.innerWidth * 100)}% ${useTransform(springY, y => y / window.innerHeight * 100)}%, rgba(99, 102, 241, 0.15) 0%, transparent 60%)`
        }}
      />
      
      {/* Floating organic shapes */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${15 + (i % 4) * 20}%`,
            top: `${15 + Math.floor(i / 4) * 25}%`,
            width: 120 + Math.sin(i) * 40,
            height: 120 + Math.cos(i) * 40,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 20 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        >
          <div 
            className="w-full h-full rounded-full opacity-20 blur-3xl"
            style={{
              background: `linear-gradient(${45 + i * 30}deg, 
                hsl(${220 + i * 15}, 70%, 85%) 0%, 
                hsl(${260 + i * 10}, 60%, 90%) 100%)`
            }}
          />
        </motion.div>
      ))}
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(99, 102, 241) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  )
}

// Progressive form field component
const ProgressiveField = ({ 
  label, 
  icon: Icon, 
  type = "text", 
  value, 
  onChange, 
  onFocus, 
  onBlur, 
  placeholder, 
  error, 
  focused, 
  showToggle,
  onToggle 
}: any) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group"
    >
      {/* Floating label */}
      <motion.label
        className="absolute left-4 text-slate-600 font-medium pointer-events-none z-10 select-none"
        animate={{
          y: focused || value ? -28 : 12,
          scale: focused || value ? 0.85 : 1,
          color: focused ? '#6366f1' : error ? '#ef4444' : '#64748b'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {label}
      </motion.label>

      {/* Input container with sophisticated glass effect */}
      <motion.div
        className="relative"
        whileHover={{ scale: 1.01 }}
        whileFocus={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {/* Background layers */}
        <div className="absolute inset-0 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg" />
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
          animate={{
            background: focused 
              ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(148, 163, 184, 0.1) 0%, rgba(203, 213, 225, 0.05) 100%)'
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20">
          <motion.div
            animate={{
              color: focused ? '#6366f1' : error ? '#ef4444' : '#94a3b8',
              scale: focused ? 1.1 : 1
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Icon className="w-5 h-5" />
          </motion.div>
        </div>

        {/* Input field */}
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={focused ? placeholder : ''}
          className="relative z-30 w-full bg-transparent border-0 rounded-2xl pl-14 pr-14 py-4 text-slate-800 placeholder-slate-400 focus:outline-none text-lg font-medium"
        />

        {/* Toggle button for password */}
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {type === 'password' ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        )}

        {/* Focus ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{
            boxShadow: focused 
              ? '0 0 0 3px rgba(99, 102, 241, 0.1), 0 0 20px rgba(99, 102, 241, 0.2)'
              : error
                ? '0 0 0 3px rgba(239, 68, 68, 0.1), 0 0 20px rgba(239, 68, 68, 0.2)'
                : '0 0 0 0px transparent'
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-sm mt-2 ml-1 font-medium"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
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
  const [focusedField, setFocusedField] = useState('')
  // Progressive form state removed for cleaner code
  
  // OTP Modal States
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [sentOtpCode, setSentOtpCode] = useState<string | null>(null)
  const [verificationTimer, setVerificationTimer] = useState(0)
  const [otpError, setOtpError] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [pendingUser, setPendingUser] = useState<{ name: string; email: string } | null>(null)
  
  const { toast } = useToast()
  const { user } = useFirebaseAuth()
  const [, setLocation] = useLocation()
  const queryClient = useQueryClient()

  // Fetch user data
  const { isLoading: userDataLoading } = useQuery({
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
      
      if (data.requiresOnboarding) {
        console.log('Redirecting to dashboard for modal onboarding')
        setLocation('/')
      } else {
        setLocation('/')
      }
    },
    onError: (error: any) => {
      setOtpError(true)
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
    // Google signup temporarily disabled - will be implemented later
    toast({
      title: "Coming Soon",
      description: "Google signup will be available soon.",
    })
  }

  const passwordRequirements = validatePassword(formData.password)

  // Show loading state only when we have a user but are still loading their data
  if (user && userDataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div 
            className="w-16 h-16 border-2 border-indigo-200 border-t-indigo-500 rounded-full mx-auto mb-8"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.h1 
            className="text-2xl font-semibold text-slate-700 mb-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Preparing your VeeFore experience
          </motion.h1>
          <p className="text-slate-500">Please wait while we set up your workspace...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen relative">
        <SophisticatedBackground />
        
        {/* Ultra-minimal header */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-50 p-6"
        >
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <motion.button
              onClick={handleBackToLanding}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors bg-white/40 backdrop-blur-xl border border-white/60 rounded-full px-4 py-2 shadow-lg"
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium text-sm">Back</span>
            </motion.button>

            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.div 
                className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
              >
                V
              </motion.div>
              <span className="text-xl font-semibold text-slate-800">VeeFore</span>
            </motion.div>

            <motion.button
              onClick={() => setLocation('/signin')}
              className="bg-white/40 backdrop-blur-xl border border-white/60 hover:bg-white/60 text-slate-700 px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
          </div>
        </motion.header>

        {/* Main content - centered spatial design */}
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] px-6">
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full max-w-lg relative"
          >
            {/* Main signup card with sophisticated layering */}
            <div className="relative">
              {/* Background layers for depth */}
              <div className="absolute inset-0 bg-white/20 backdrop-blur-3xl rounded-[2.5rem] border border-white/30 shadow-2xl" />
              <div className="absolute inset-2 bg-white/40 backdrop-blur-xl rounded-[2rem] border border-white/40" />
              <div className="absolute inset-4 bg-white/60 backdrop-blur-lg rounded-[1.5rem] border border-white/50" />
              
              {/* Content container */}
              <div className="relative z-10 p-12">
                {/* Header with progressive design */}
                <motion.div 
                  className="text-center mb-12"
                  layout
                >
                  <motion.h1 
                    className="text-4xl font-light text-slate-800 mb-3 tracking-tight"
                    animate={{ 
                      background: `linear-gradient(135deg, #1e293b 0%, #6366f1 50%, #8b5cf6 100%)`,
                      backgroundSize: "200% 200%",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                    }}
                    transition={{ duration: 6, repeat: Infinity }}
                  >
                    Create Account
                  </motion.h1>
                  <motion.p 
                    className="text-slate-600 font-medium"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    Join the future of social media management
                  </motion.p>
                </motion.div>

                {/* Progressive form */}
                <form onSubmit={handleSignUp} className="space-y-8">
                  {/* Form fields with sophisticated interactions */}
                  <div className="space-y-6">
                    <ProgressiveField
                      label="Full Name"
                      icon={User}
                      value={formData.fullName}
                      onChange={(e: any) => handleInputChange('fullName', e.target.value)}
                      onFocus={() => setFocusedField('fullName')}
                      onBlur={() => setFocusedField('')}
                      placeholder="Enter your full name"
                      error={errors.fullName}
                      focused={focusedField === 'fullName'}
                    />

                    <ProgressiveField
                      label="Email Address"
                      icon={Mail}
                      type="email"
                      value={formData.email}
                      onChange={(e: any) => handleInputChange('email', e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      placeholder="Enter your email"
                      error={errors.email}
                      focused={focusedField === 'email'}
                    />

                    <ProgressiveField
                      label="Password"
                      icon={Lock}
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e: any) => handleInputChange('password', e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField('')}
                      placeholder="Create a secure password"
                      error={errors.password}
                      focused={focusedField === 'password'}
                      showToggle={true}
                      onToggle={() => setShowPassword(!showPassword)}
                    />

                    {/* Sophisticated password strength indicator */}
                    {formData.password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="ml-1"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-slate-600">Password strength:</span>
                          <motion.span 
                            className={`text-xs font-semibold ${
                              passwordRequirements.strength === 'Strong' ? 'text-emerald-600' :
                              passwordRequirements.strength === 'Medium' ? 'text-amber-600' : 'text-red-500'
                            }`}
                            animate={{ scale: passwordRequirements.strength === 'Strong' ? [1, 1.1, 1] : 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            {passwordRequirements.strength}
                          </motion.span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <motion.div
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                              passwordRequirements.strength === 'Strong' ? 'bg-emerald-500' :
                              passwordRequirements.strength === 'Medium' ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(passwordRequirements.score / 5) * 100}%` }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Sophisticated signup button */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    className="pt-4"
                  >
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="group relative w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-500 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                    >
                      {/* Sophisticated shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
                        animate={{ x: ["-200%", "200%"] }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          ease: "linear",
                          repeatDelay: 3
                        }}
                      />
                      
                      <div className="relative z-10 flex items-center justify-center space-x-3">
                        {isLoading ? (
                          <>
                            <motion.div 
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <span>Creating Account...</span>
                          </>
                        ) : (
                          <>
                            <motion.div
                              animate={{ rotate: [0, 180, 360] }}
                              transition={{ duration: 3, repeat: Infinity }}
                            >
                              <Sparkles className="w-5 h-5" />
                            </motion.div>
                            <span>Create Account</span>
                            <motion.div
                              animate={{ x: [0, 4, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <ArrowRight className="w-5 h-5" />
                            </motion.div>
                          </>
                        )}
                      </div>
                    </button>
                  </motion.div>

                  {/* Sophisticated divider */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-6 bg-white/60 text-slate-500 font-medium rounded-full">Or continue with</span>
                    </div>
                  </div>

                  {/* Social login with spatial design */}
                  <motion.button
                    type="button"
                    onClick={handleGoogleSignUp}
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white/70 backdrop-blur-xl border border-white/80 hover:bg-white/90 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-slate-700">Continue with Google</span>
                  </motion.button>

                  {/* Terms with sophisticated typography */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="text-center text-xs text-slate-500 leading-relaxed pt-4"
                  >
                    By creating an account, you agree to our{' '}
                    <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium underline decoration-1 underline-offset-2">Terms of Service</a>{' '}
                    and{' '}
                    <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium underline decoration-1 underline-offset-2">Privacy Policy</a>
                  </motion.div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Ultra-sophisticated OTP Modal */}
      <AnimatePresence>
        {showOTPModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/10 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            {/* Floating ambient elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div 
                className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              <motion.div 
                className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-gradient-to-r from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl"
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 6, repeat: Infinity, delay: 1 }}
              />
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative max-w-md w-full"
            >
              {/* Sophisticated modal with multiple glass layers */}
              <div className="relative">
                <div className="absolute inset-0 bg-white/30 backdrop-blur-3xl rounded-[2rem] border border-white/40 shadow-2xl" />
                <div className="absolute inset-2 bg-white/50 backdrop-blur-xl rounded-[1.5rem] border border-white/50" />
                
                <div className="relative z-10 p-10 text-center space-y-8">
                  {/* Header with sophisticated icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                    className="relative"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/80 to-purple-600/80 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto shadow-2xl border border-white/30">
                      <Mail className="w-10 h-10 text-white drop-shadow-lg" />
                      <motion.div 
                        className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-400/90 backdrop-blur-sm rounded-full border-2 border-white/60 flex items-center justify-center shadow-lg"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </motion.div>
                    </div>
                  </motion.div>
                  
                  <div className="space-y-4">
                    <motion.h2 
                      className="text-3xl font-light text-slate-800 tracking-tight"
                      animate={{ opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      Verify Your Email
                    </motion.h2>
                    <div className="space-y-3">
                      <p className="text-slate-600 font-medium">
                        We've sent a 6-digit code to
                      </p>
                      <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/40 shadow-lg">
                        <Mail className="w-4 h-4 text-slate-600" />
                        <span className="font-semibold text-slate-800">{pendingUser?.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sophisticated OTP inputs */}
                  <div className="space-y-6">
                    <div className="flex justify-center space-x-3">
                      {[...Array(6)].map((_, index) => (
                        <motion.div 
                          key={index} 
                          className="relative"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <input
                            type="text"
                            value={verificationCode[index] || ''}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '')
                              if (value.length <= 1) {
                                const newCode = verificationCode.split('')
                                newCode[index] = value
                                setVerificationCode(newCode.join('').slice(0, 6))
                                
                                if (otpError) setOtpError(false)
                                
                                if (value && index < 5) {
                                  const nextInput = (e.target as HTMLElement).parentElement?.parentElement?.children[index + 1]?.querySelector('input') as HTMLInputElement
                                  nextInput?.focus()
                                }
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
                                const prevInput = (e.target as HTMLElement).parentElement?.parentElement?.children[index - 1]?.querySelector('input') as HTMLInputElement
                                prevInput?.focus()
                              }
                            }}
                            className={`w-12 h-14 text-center text-2xl font-semibold border-2 rounded-xl transition-all duration-300 backdrop-blur-xl ${
                              otpError 
                                ? 'border-red-400/60 bg-red-50/60 text-red-600 shadow-lg shadow-red-200/50' 
                                : verificationCode[index] 
                                  ? 'border-emerald-400/60 bg-emerald-50/60 text-emerald-700 shadow-lg shadow-emerald-200/50' 
                                  : 'border-slate-200 bg-white/60 text-slate-700 focus:border-indigo-400/60 focus:bg-indigo-50/60 focus:shadow-lg focus:shadow-indigo-200/50'
                            }`}
                            maxLength={1}
                            autoFocus={index === 0}
                          />
                          {verificationCode[index] && !otpError && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/40"
                            >
                              <Check className="w-2.5 h-2.5 text-white" />
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    {/* Development OTP display */}
                    {process.env.NODE_ENV === 'development' && sentOtpCode && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-xl rounded-xl p-6 border border-amber-200/50 shadow-lg"
                      >
                        <div className="flex items-center space-x-2 mb-3">
                          <motion.div 
                            className="w-3 h-3 bg-amber-400 rounded-full"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                          <span className="text-amber-700 font-semibold text-sm">DEVELOPMENT MODE</span>
                        </div>
                        <div className="text-center">
                          <p className="text-amber-700 text-sm mb-2">Test Code:</p>
                          <div className="bg-amber-100/80 border border-amber-300/50 rounded-lg p-4">
                            <span className="text-amber-800 font-mono font-bold text-2xl tracking-widest">
                              {sentOtpCode}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Action buttons */}
                    <div className="space-y-4">
                      <motion.button
                        onClick={handleOTPSubmit}
                        disabled={otpLoading || verificationCode.length !== 6}
                        whileHover={{ scale: otpLoading ? 1 : 1.02 }}
                        whileTap={{ scale: otpLoading ? 1 : 0.98 }}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        {otpLoading ? (
                          <div className="flex items-center justify-center space-x-3 relative z-10">
                            <motion.div 
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <span>Verifying...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-3 relative z-10">
                            <Check className="w-5 h-5" />
                            <span>Verify & Continue</span>
                          </div>
                        )}
                      </motion.button>

                      <div className="flex items-center justify-between text-sm space-x-4">
                        <motion.button
                          onClick={handleResendOTP}
                          disabled={otpLoading}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 font-medium transition-colors duration-300 disabled:opacity-50"
                        >
                          <Mail className="w-4 h-4" />
                          <span>Resend Code</span>
                        </motion.button>
                        
                        <motion.button
                          onClick={() => {
                            setShowOTPModal(false)
                            setVerificationCode('')
                            setOtpError(false)
                            setSentOtpCode(null)
                            setPendingUser(null)
                          }}
                          disabled={otpLoading}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-2 text-slate-500 hover:text-slate-700 font-medium transition-colors duration-300 disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default SignUpIntegrated