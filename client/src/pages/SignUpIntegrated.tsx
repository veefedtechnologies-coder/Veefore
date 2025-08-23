import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Mail, ArrowLeft, Check, Eye, EyeOff, User, Lock, X, Github, Sparkles, ArrowRight, Brain, Play, Rocket, Crown, Star, Zap, Shield, Heart, Globe } from "lucide-react"
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth"
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useLocation } from "wouter"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiRequest } from "@/lib/queryClient"
import { motion, AnimatePresence } from "framer-motion"
import veeforeLogo from "@assets/output-onlinepngtools_1754852514040.png"

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

// Enhanced Floating Background Elements
const FloatingElements = () => {
  const elements = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    size: Math.random() * 80 + 20,
    delay: Math.random() * 8,
    duration: Math.random() * 15 + 20,
    x: Math.random() * 100,
    y: Math.random() * 100,
    opacity: Math.random() * 0.3 + 0.1,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
          }}
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -100, 50, 0],
            rotate: [0, 180, 360],
            scale: [0.5, 1.2, 0.8, 0.5],
            opacity: [element.opacity, element.opacity * 2, element.opacity],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div 
            className="bg-gradient-to-br from-blue-200/40 via-purple-200/40 to-pink-200/40 rounded-full blur-sm"
            style={{
              width: element.size,
              height: element.size,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

// Premium Feature Showcase Animation
const FeatureShowcase = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Content",
      desc: "Generate engaging posts with advanced AI",
      gradient: "from-purple-500 to-indigo-600",
      glow: "purple-500/20"
    },
    {
      icon: Rocket,
      title: "Smart Automation",
      desc: "Schedule and optimize across all platforms",
      gradient: "from-blue-500 to-cyan-600",
      glow: "blue-500/20"
    },
    {
      icon: Crown,
      title: "Analytics Intelligence",
      desc: "Deep insights and performance tracking",
      gradient: "from-emerald-500 to-teal-600",
      glow: "emerald-500/20"
    },
    {
      icon: Star,
      title: "Brand Management",
      desc: "Maintain consistent brand voice and style",
      gradient: "from-amber-500 to-orange-600",
      glow: "amber-500/20"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentFeature}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <motion.div
            className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${features[currentFeature].gradient} rounded-3xl flex items-center justify-center shadow-2xl`}
            animate={{
              boxShadow: [
                `0 10px 30px ${features[currentFeature].glow}`,
                `0 20px 40px ${features[currentFeature].glow}`,
                `0 10px 30px ${features[currentFeature].glow}`
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {(() => {
              const IconComponent = features[currentFeature].icon;
              return <IconComponent className="w-10 h-10 text-white" />;
            })()}
          </motion.div>
          
          <motion.h3 
            className="text-2xl font-bold text-white mb-3"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {features[currentFeature].title}
          </motion.h3>
          
          <motion.p 
            className="text-white/80 text-lg leading-relaxed max-w-sm mx-auto"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {features[currentFeature].desc}
          </motion.p>
        </motion.div>
      </AnimatePresence>
      
      {/* Feature Indicators */}
      <div className="flex justify-center space-x-3">
        {features.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentFeature(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentFeature 
                ? 'bg-white shadow-lg' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
};

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
  const [ripples, setRipples] = useState<Array<{id: number, x: number, y: number}>>([])
  
  // OTP Modal States
  const [showOTPModal, setShowOTPModal] = useState(false)
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
  const { data: userData, isLoading: userDataLoading } = useQuery({
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

  // Ripple effect function
  const createRipple = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const newRipple = { id: Date.now(), x, y }
    
    setRipples(prev => [...prev, newRipple])
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, 600)
  }

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div 
            className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-8"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.h1 
            className="text-3xl font-bold text-white mb-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Setting up your VeeFore experience
          </motion.h1>
          <p className="text-blue-200">Please wait while we prepare your workspace...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      {/* Enhanced Background with Floating Elements */}
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <FloatingElements />
        
        {/* Mesh Gradient Overlay */}
        <div className="fixed inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20 pointer-events-none" />
        
        {/* Enhanced Header */}
        <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-2xl z-50"
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              {/* Back button */}
              <motion.button
                onClick={handleBackToLanding}
                className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium text-sm">Back to Home</span>
              </motion.button>

              {/* Logo */}
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <motion.img 
                  src={veeforeLogo} 
                  alt="VeeFore" 
                  className="w-10 h-10"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                />
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  VeeFore
                </span>
              </motion.div>

              {/* Sign In Link */}
              <div className="flex items-center space-x-3">
                <span className="text-white/70 text-sm">Already have an account?</span>
                <motion.button
                  onClick={() => setLocation('/signin')}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </motion.button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="flex min-h-[calc(100vh-80px)]">
          {/* Left Side - Feature Showcase */}
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative"
          >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white/20 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 max-w-lg text-center space-y-12">
              {/* Main Headline */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <motion.h1 
                  className="text-5xl font-black text-white mb-6 leading-tight"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  style={{
                    background: "linear-gradient(135deg, #ffffff 0%, #93c5fd 25%, #a855f7 50%, #ec4899 75%, #f59e0b 100%)",
                    backgroundSize: "200% 200%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}
                  transition={{ duration: 8, repeat: Infinity }}
                >
                  Transform Your Social Media Presence
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-white/80 leading-relaxed"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  Join thousands of creators, businesses, and agencies using AI-powered social media management to grow their audience and increase engagement.
                </motion.p>
              </motion.div>

              {/* Feature Showcase */}
              <FeatureShowcase />

              {/* Social Proof */}
              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="grid grid-cols-3 gap-8 text-center"
              >
                <div>
                  <motion.div 
                    className="text-3xl font-bold text-white mb-2"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                  >
                    10K+
                  </motion.div>
                  <div className="text-white/70 text-sm">Active Users</div>
                </div>
                <div>
                  <motion.div 
                    className="text-3xl font-bold text-white mb-2"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                  >
                    500M+
                  </motion.div>
                  <div className="text-white/70 text-sm">Posts Generated</div>
                </div>
                <div>
                  <motion.div 
                    className="text-3xl font-bold text-white mb-2"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                  >
                    98%
                  </motion.div>
                  <div className="text-white/70 text-sm">Satisfaction</div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Signup Form */}
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full lg:w-1/2 flex items-center justify-center p-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full max-w-md bg-white/95 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/20 p-10 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
              }}
            >
              {/* Form background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-purple-50/30 to-pink-50/40 rounded-3xl" />
              
              {/* Ripple effects container */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                {ripples.map((ripple) => (
                  <motion.div
                    key={ripple.id}
                    className="absolute bg-blue-500/20 rounded-full"
                    style={{ left: ripple.x - 25, top: ripple.y - 25 }}
                    initial={{ width: 0, height: 0, opacity: 1 }}
                    animate={{ width: 100, height: 100, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                ))}
              </div>

              {/* Header */}
              <div className="text-center mb-10 relative z-10">
                <motion.h1 
                  className="text-4xl font-bold mb-4 relative"
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
              <form onSubmit={handleSignUp} className="space-y-6 relative z-10" onClick={createRipple}>
                {/* Full Name */}
                <motion.div 
                  whileHover={{ scale: 1.02, y: -2 }} 
                  className="relative group"
                >
                  <motion.label 
                    className="block text-gray-700 font-bold mb-3 text-sm relative"
                    animate={{ 
                      color: focusedField === 'fullName' ? '#3b82f6' : '#374151' 
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    Full Name
                    <motion.div
                      className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 origin-left"
                      animate={{ 
                        scaleX: focusedField === 'fullName' ? 1 : 0,
                        opacity: focusedField === 'fullName' ? 1 : 0 
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-20" />
                    <Input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      onFocus={() => setFocusedField('fullName')}
                      onBlur={() => setFocusedField('')}
                      className="relative z-30 w-full bg-white border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </motion.div>

                {/* Email */}
                <motion.div 
                  whileHover={{ scale: 1.02, y: -2 }} 
                  className="relative group"
                >
                  <motion.label 
                    className="block text-gray-700 font-bold mb-3 text-sm relative"
                    animate={{ 
                      color: focusedField === 'email' ? '#3b82f6' : '#374151' 
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    Email Address
                    <motion.div
                      className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 origin-left"
                      animate={{ 
                        scaleX: focusedField === 'email' ? 1 : 0,
                        opacity: focusedField === 'email' ? 1 : 0 
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-20" />
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      className="relative z-30 w-full bg-white border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </motion.div>

                {/* Password */}
                <motion.div 
                  whileHover={{ scale: 1.02, y: -2 }} 
                  className="relative group"
                >
                  <motion.label 
                    className="block text-gray-700 font-bold mb-3 text-sm relative"
                    animate={{ 
                      color: focusedField === 'password' ? '#3b82f6' : '#374151' 
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    Password
                    <motion.div
                      className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 origin-left"
                      animate={{ 
                        scaleX: focusedField === 'password' ? 1 : 0,
                        opacity: focusedField === 'password' ? 1 : 0 
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-20" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField('')}
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
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-2"
                    >
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
                        <motion.div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            passwordRequirements.strength === 'Strong' ? 'bg-green-500' :
                            passwordRequirements.strength === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(passwordRequirements.score / 5) * 100}%` }}
                        />
                      </div>
                    </motion.div>
                  )}
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </motion.div>

                {/* Sign Up Button */}
                <motion.div 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  >
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        ease: "linear",
                        repeatDelay: 2
                      }}
                    />
                    
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-3 relative z-10">
                        <motion.div 
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-3 relative z-10">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Sparkles className="w-5 h-5" />
                        </motion.div>
                        <span>Create Account</span>
                        <motion.div
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.div>
                      </div>
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
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                  >
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
                  
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                  >
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

                {/* Terms */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-center text-xs text-gray-500 mt-6"
                >
                  By creating an account, you agree to our{' '}
                  <a href="#" className="text-blue-600 hover:underline font-medium">Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 hover:underline font-medium">Privacy Policy</a>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Premium OTP Verification Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          {/* Floating gradient orbs for depth */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            />
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="relative bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-md w-full p-8 border border-white/20 before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/30 before:via-transparent before:to-transparent before:pointer-events-none"
          >
            <div className="relative z-10 text-center space-y-8">
              {/* Header */}
              <div className="space-y-6">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="relative"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500/80 via-indigo-500/80 to-purple-600/80 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto shadow-2xl border border-white/20">
                    <Mail className="w-10 h-10 text-white drop-shadow-lg" />
                    <motion.div 
                      className="absolute -top-1 -right-1 w-6 h-6 bg-green-400/90 backdrop-blur-sm rounded-full border-2 border-white/50 flex items-center justify-center shadow-lg"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </motion.div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl blur-xl animate-pulse"></div>
                </motion.div>
                
                <div className="space-y-3">
                  <motion.h2 
                    className="text-3xl font-black text-white tracking-tight drop-shadow-lg"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    Verify Your Email
                  </motion.h2>
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

              {/* OTP Input */}
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
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-green-400/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/30"
                          >
                            <Check className="w-2.5 h-2.5 text-white" />
                          </motion.div>
                        )}
                        {verificationCode[index] && otpError && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-400/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/30"
                          >
                            <X className="w-2.5 h-2.5 text-white" />
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Progress indicator */}
                  <div className="flex justify-center space-x-1">
                    {[...Array(6)].map((_, index) => (
                      <motion.div 
                        key={index} 
                        className={`h-1 w-8 rounded-full transition-all duration-300 ${
                          otpError && verificationCode[index] 
                            ? 'bg-red-400/80 shadow-lg shadow-red-400/50' 
                            : verificationCode[index] 
                              ? 'bg-green-400/80 shadow-lg shadow-green-400/50' 
                              : 'bg-white/20'
                        }`}
                        animate={verificationCode[index] ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      />
                    ))}
                  </div>
                </div>

                {/* Development OTP Display */}
                {import.meta.env.DEV && sentOtpCode && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 backdrop-blur-xl rounded-xl p-6 border border-orange-400/30 shadow-lg"
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <motion.div 
                        className="w-3 h-3 bg-orange-400 rounded-full"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
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
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="space-y-4">
                  <motion.button
                    onClick={handleOTPSubmit}
                    disabled={otpLoading || verificationCode.length !== 6}
                    whileHover={{ scale: otpLoading ? 1 : 1.02 }}
                    whileTap={{ scale: otpLoading ? 1 : 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600/80 via-indigo-600/80 to-purple-600/80 backdrop-blur-xl border border-white/20 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700/90 hover:via-indigo-700/90 hover:to-purple-700/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {otpLoading ? (
                      <div className="flex items-center justify-center space-x-3 relative z-10">
                        <motion.div 
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Verifying Your Code...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-3 relative z-10">
                        <Check className="w-5 h-5" />
                        <span>Verify & Continue</span>
                      </div>
                    )}
                  </motion.button>

                  {/* Resend and Cancel */}
                  <div className="flex items-center justify-between text-sm space-x-4">
                    <motion.button
                      onClick={handleResendOTP}
                      disabled={otpLoading}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 text-white/80 hover:text-white font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className="flex items-center space-x-2 text-white/60 hover:text-white/80 font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}

export default SignUpIntegrated