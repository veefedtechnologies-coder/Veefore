import { useState, useEffect, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import { Mail, ArrowLeft, Check, Eye, EyeOff, User, Lock, X, Sparkles, ArrowRight, Shield, Zap, Star, Crown, Heart, Globe, Rocket, Brain, Target, Award, TrendingUp } from "lucide-react"
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useLocation } from "wouter"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiRequest } from "@/lib/queryClient"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useAnimation } from "framer-motion"

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

// Advanced Interactive Particle System
const AdvancedParticleSystem = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    y: number
    size: number
    color: string
    speed: number
    direction: number
    pulse: number
    trail: Array<{x: number, y: number}>
  }>>([])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const createParticle = (index: number) => ({
      id: index,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 6 + 2,
      color: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][Math.floor(Math.random() * 5)],
      speed: Math.random() * 2 + 0.5,
      direction: Math.random() * Math.PI * 2,
      pulse: Math.random() * 2 + 1,
      trail: []
    })

    setParticles(Array.from({ length: 50 }, (_, i) => createParticle(i)))

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}40`,
          }}
          animate={{
            x: [
              particle.x,
              particle.x + Math.cos(particle.direction) * 100,
              particle.x + Math.cos(particle.direction + 1) * 200,
              particle.x
            ],
            y: [
              particle.y,
              particle.y + Math.sin(particle.direction) * 100,
              particle.y + Math.sin(particle.direction + 1) * 200,
              particle.y
            ],
            scale: [1, particle.pulse, 1],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 10 + particle.speed * 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Interactive cursor effect */}
      <motion.div
        className="absolute w-32 h-32 rounded-full pointer-events-none"
        style={{
          x: useTransform(mouseX, (x) => x - 64),
          y: useTransform(mouseY, (y) => y - 64),
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          filter: 'blur(20px)'
        }}
      />
    </div>
  )
}

// Sophisticated Background with Multiple Layers
const SophisticatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Base gradient */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          ]
        }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      
      {/* Animated mesh gradients */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: 300 + i * 50,
              height: 300 + i * 50,
              background: `conic-gradient(from ${i * 45}deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #54a0ff)`,
              filter: 'blur(40px)'
            }}
            animate={{
              x: [
                Math.sin(i * 0.5) * 200,
                Math.sin(i * 0.5 + Math.PI) * 200,
                Math.sin(i * 0.5) * 200
              ],
              y: [
                Math.cos(i * 0.7) * 150,
                Math.cos(i * 0.7 + Math.PI) * 150,
                Math.cos(i * 0.7) * 150
              ],
              rotate: [0, 360]
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Floating geometric shapes */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`shape-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              delay: i * 0.5
            }}
          >
            {i % 3 === 0 ? (
              <div className="w-8 h-8 bg-white/10 backdrop-blur-sm border border-white/20" />
            ) : i % 3 === 1 ? (
              <div className="w-6 h-6 bg-white/10 backdrop-blur-sm rounded-full border border-white/20" />
            ) : (
              <div className="w-6 h-6 bg-white/10 backdrop-blur-sm transform rotate-45 border border-white/20" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Advanced Premium Form Field
const PremiumFormField = ({ 
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
  onToggle,
  requirements
}: any) => {
  const fieldControls = useAnimation()

  useEffect(() => {
    if (focused) {
      fieldControls.start({
        scale: 1.02,
        boxShadow: "0 20px 60px rgba(59, 130, 246, 0.3)",
        borderColor: "#3b82f6"
      })
    } else {
      fieldControls.start({
        scale: 1,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        borderColor: error ? "#ef4444" : "#e2e8f0"
      })
    }
  }, [focused, error, fieldControls])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group"
    >
      {/* Advanced floating label */}
      <motion.label
        className="absolute left-6 text-slate-600 font-semibold pointer-events-none z-20 select-none flex items-center space-x-2"
        animate={{
          y: focused || value ? -35 : 18,
          scale: focused || value ? 0.9 : 1,
          color: focused ? '#3b82f6' : error ? '#ef4444' : '#64748b'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </motion.label>

      {/* Premium input container */}
      <motion.div
        className="relative"
        animate={fieldControls}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Multiple background layers for depth */}
        <div className="absolute inset-0 rounded-2xl bg-white/90 backdrop-blur-2xl border-2 shadow-xl" />
        <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-xl" />
        
        {/* Animated focus ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{
            background: focused 
              ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)'
              : 'transparent'
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Premium input field */}
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={focused ? placeholder : ''}
          className="relative z-30 w-full bg-transparent border-0 rounded-2xl px-6 py-6 text-slate-800 placeholder-slate-400 focus:outline-none text-lg font-medium"
        />

        {/* Toggle button for password */}
        {showToggle && (
          <motion.button
            type="button"
            onClick={onToggle}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 z-30 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {type === 'password' ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </motion.button>
        )}

        {/* Interactive glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
            filter: 'blur(20px)'
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Advanced requirements indicator */}
      {requirements && value && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 space-y-2"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-600">Security Level:</span>
            <motion.span 
              className={`text-sm font-bold px-3 py-1 rounded-full ${
                requirements.strength === 'Strong' ? 'bg-emerald-100 text-emerald-700' :
                requirements.strength === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
              }`}
              animate={{ scale: requirements.strength === 'Strong' ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 0.3, repeat: requirements.strength === 'Strong' ? 3 : 0 }}
            >
              {requirements.strength}
            </motion.span>
          </div>
          
          {/* Animated progress bar */}
          <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className={`absolute inset-y-0 left-0 rounded-full ${
                requirements.strength === 'Strong' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
                requirements.strength === 'Medium' ? 'bg-gradient-to-r from-amber-400 to-amber-600' : 
                'bg-gradient-to-r from-red-400 to-red-600'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${(requirements.score / 5) * 100}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
            
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
          
          {/* Requirement checks */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(requirements).map(([key, met]) => {
              if (key === 'score' || key === 'strength') return null
              return (
                <motion.div
                  key={key}
                  className={`flex items-center space-x-2 ${met ? 'text-emerald-600' : 'text-slate-400'}`}
                  animate={{ color: met ? '#059669' : '#94a3b8' }}
                >
                  <motion.div
                    animate={{ scale: met ? 1.2 : 1, rotate: met ? 360 : 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  </motion.div>
                  <span className="capitalize font-medium">{key}</span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Error message with animation */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <X className="w-4 h-4 text-red-500" />
              </motion.div>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Ultra-Premium Feature Showcase
const FeatureShowcase = () => {
  const [currentFeature, setCurrentFeature] = useState(0)
  
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Advanced machine learning algorithms analyze your content performance and suggest optimal posting strategies",
      stats: "500M+ posts analyzed",
      gradient: "from-purple-600 via-indigo-600 to-blue-600",
      particles: Array.from({length: 6}, (_, i) => ({
        id: i,
        delay: i * 0.2,
        color: '#8b5cf6'
      }))
    },
    {
      icon: Rocket,
      title: "Lightning-Fast Automation",
      description: "Deploy content across 15+ platforms simultaneously with zero-latency publishing and real-time sync",
      stats: "99.9% uptime guaranteed",
      gradient: "from-emerald-600 via-teal-600 to-cyan-600",
      particles: Array.from({length: 8}, (_, i) => ({
        id: i,
        delay: i * 0.15,
        color: '#10b981'
      }))
    },
    {
      icon: Crown,
      title: "Enterprise Analytics",
      description: "Comprehensive insights with predictive analytics, ROI tracking, and competitor analysis",
      stats: "1B+ data points processed",
      gradient: "from-amber-600 via-orange-600 to-red-600",
      particles: Array.from({length: 10}, (_, i) => ({
        id: i,
        delay: i * 0.1,
        color: '#f59e0b'
      }))
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption, SOC2 compliance, and enterprise SSO with advanced threat protection",
      stats: "Zero security incidents",
      gradient: "from-slate-600 via-gray-600 to-zinc-600",
      particles: Array.from({length: 5}, (_, i) => ({
        id: i,
        delay: i * 0.25,
        color: '#6b7280'
      }))
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const currentFeatureData = features[currentFeature]

  return (
    <motion.div 
      className="space-y-8"
      layout
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentFeature}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="text-center relative"
        >
          {/* Floating particles around icon */}
          <div className="relative">
            {currentFeatureData.particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute w-2 h-2 rounded-full"
                style={{ backgroundColor: particle.color }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: [0, Math.cos(particle.id * 60 * Math.PI / 180) * 80],
                  y: [0, Math.sin(particle.id * 60 * Math.PI / 180) * 80],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: "easeInOut"
                }}
              />
            ))}
            
            <motion.div
              className={`w-24 h-24 mx-auto mb-6 bg-gradient-to-r ${currentFeatureData.gradient} rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden`}
              animate={{
                boxShadow: [
                  "0 10px 30px rgba(59, 130, 246, 0.3)",
                  "0 20px 60px rgba(139, 92, 246, 0.4)",
                  "0 10px 30px rgba(59, 130, 246, 0.3)"
                ],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <currentFeatureData.icon className="w-12 h-12 text-white drop-shadow-lg" />
              </motion.div>
              
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
          
          <motion.h3 
            className="text-3xl font-bold text-white mb-4"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {currentFeatureData.title}
          </motion.h3>
          
          <motion.p 
            className="text-white/90 text-lg leading-relaxed max-w-md mx-auto mb-4"
            animate={{ opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {currentFeatureData.description}
          </motion.p>
          
          <motion.div
            className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-xl rounded-full px-4 py-2 border border-white/30"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            <Star className="w-4 h-4 text-yellow-300" />
            <span className="text-white/90 font-semibold text-sm">{currentFeatureData.stats}</span>
          </motion.div>
        </motion.div>
      </AnimatePresence>
      
      {/* Feature indicators */}
      <div className="flex justify-center space-x-3">
        {features.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentFeature(index)}
            className={`relative overflow-hidden ${
              index === currentFeature 
                ? 'w-12 h-3 bg-white shadow-lg' 
                : 'w-3 h-3 bg-white/40 hover:bg-white/60'
            } rounded-full transition-all duration-300`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            {index === currentFeature && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                layoutId="activeIndicator"
              />
            )}
          </motion.button>
        ))}
      </div>
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
    toast({
      title: "Coming Soon",
      description: "Google signup will be available soon.",
    })
  }

  const passwordRequirements = validatePassword(formData.password)

  // Show loading state only when we have a user but are still loading their data
  if (user && userDataLoading) {
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

  return (
    <>
      <div className="min-h-screen relative overflow-hidden">
        <SophisticatedBackground />
        <AdvancedParticleSystem />
        
        {/* Ultra-Premium Header */}
        <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
          className="relative z-50 p-8"
        >
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <motion.button
              onClick={handleBackToLanding}
              className="group flex items-center space-x-3 text-white/90 hover:text-white transition-colors bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl px-6 py-3 shadow-2xl"
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ x: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.div>
              <span className="font-semibold">Back to Home</span>
            </motion.button>

            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-2xl border border-white/30"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  boxShadow: [
                    "0 10px 30px rgba(255, 255, 255, 0.1)",
                    "0 20px 60px rgba(255, 255, 255, 0.2)",
                    "0 10px 30px rgba(255, 255, 255, 0.1)"
                  ]
                }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                V
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-white">VeeFore</h1>
                <p className="text-white/70 text-sm">Enterprise Edition</p>
              </div>
            </motion.div>

            <motion.button
              onClick={() => setLocation('/signin')}
              className="bg-white/10 backdrop-blur-2xl border border-white/20 hover:bg-white/20 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-2xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
          </div>
        </motion.header>

        {/* Main Content - Split Layout */}
        <div className="flex min-h-[calc(100vh-120px)]">
          {/* Left Side - Feature Showcase */}
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2, type: "spring", stiffness: 80 }}
            className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-16 relative"
          >
            <div className="relative z-10 max-w-2xl text-center space-y-12">
              {/* Hero Content */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
              >
                <motion.h1 
                  className="text-6xl font-black text-white mb-8 leading-tight"
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
                  The Future of Social Media Management
                </motion.h1>
                
                <motion.p 
                  className="text-2xl text-white/90 leading-relaxed mb-8"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  Join the world's most advanced AI-powered platform trusted by Fortune 500 companies and leading agencies globally.
                </motion.p>

                {/* Trust Indicators */}
                <motion.div 
                  className="flex items-center justify-center space-x-8 mb-12"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
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
                </motion.div>
              </motion.div>

              {/* Feature Showcase */}
              <FeatureShowcase />

              {/* Premium Badge */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-xl rounded-2xl px-6 py-4 border border-yellow-400/30 shadow-2xl"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Award className="w-6 h-6 text-yellow-300" />
                </motion.div>
                <div className="text-left">
                  <div className="text-white font-bold">Enterprise Grade</div>
                  <div className="text-white/80 text-sm">SOC2 Compliant • 99.9% SLA</div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Ultra-Premium Signup Form */}
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2, type: "spring", stiffness: 80 }}
            className="w-full lg:w-1/2 flex items-center justify-center p-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="w-full max-w-lg relative"
            >
              {/* Ultra-Premium Form Card */}
              <div className="relative">
                {/* Multiple background layers for extreme depth */}
                <div className="absolute inset-0 bg-white/20 backdrop-blur-3xl rounded-[3rem] border border-white/30 shadow-2xl" />
                <div className="absolute inset-3 bg-white/30 backdrop-blur-2xl rounded-[2.5rem] border border-white/40" />
                <div className="absolute inset-6 bg-white/40 backdrop-blur-xl rounded-[2rem] border border-white/50" />
                <div className="absolute inset-9 bg-white/60 backdrop-blur-lg rounded-[1.5rem] border border-white/60" />
                
                {/* Animated glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-[3rem] opacity-50"
                  animate={{
                    boxShadow: [
                      "0 0 50px rgba(59, 130, 246, 0.3)",
                      "0 0 100px rgba(139, 92, 246, 0.4)",
                      "0 0 50px rgba(59, 130, 246, 0.3)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                {/* Content container */}
                <div className="relative z-10 p-16">
                  {/* Ultra-Premium Header */}
                  <motion.div 
                    className="text-center mb-16"
                    layout
                  >
                    <motion.div
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-full px-4 py-2 border border-blue-300/30 mb-6"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-4 h-4 text-blue-300" />
                      <span className="text-blue-100 font-semibold text-sm">Start Your Free Enterprise Trial</span>
                    </motion.div>
                    
                    <motion.h1 
                      className="text-5xl font-black text-slate-800 mb-6 tracking-tight"
                      animate={{ 
                        background: `linear-gradient(135deg, #1e293b 0%, #3b82f6 30%, #8b5cf6 60%, #ec4899 100%)`,
                        backgroundSize: "300% 300%",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                      }}
                      transition={{ duration: 8, repeat: Infinity }}
                    >
                      Create Account
                    </motion.h1>
                    <motion.p 
                      className="text-slate-600 font-semibold text-lg"
                      animate={{ opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      Join 500+ enterprise clients worldwide
                    </motion.p>
                  </motion.div>

                  {/* Ultra-Premium Form */}
                  <form onSubmit={handleSignUp} className="space-y-10">
                    {/* Premium Form Fields */}
                    <div className="space-y-8">
                      <PremiumFormField
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

                      <PremiumFormField
                        label="Email Address"
                        icon={Mail}
                        type="email"
                        value={formData.email}
                        onChange={(e: any) => handleInputChange('email', e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField('')}
                        placeholder="Enter your business email"
                        error={errors.email}
                        focused={focusedField === 'email'}
                      />

                      <PremiumFormField
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
                        requirements={formData.password ? passwordRequirements : null}
                      />
                    </div>

                    {/* Ultra-Premium Create Account Button */}
                    <motion.div 
                      className="pt-8"
                    >
                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        className="group relative w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-6 rounded-2xl font-bold text-xl transition-all duration-500 shadow-2xl hover:shadow-4xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Ultra-sophisticated shine effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                          animate={{ x: ["-200%", "200%"] }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            ease: "linear",
                            repeatDelay: 2
                          }}
                        />
                        
                        {/* Multiple glow layers */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-2xl"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        
                        <div className="relative z-10 flex items-center justify-center space-x-4">
                          {isLoading ? (
                            <>
                              <motion.div 
                                className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              />
                              <span>Creating Your Enterprise Account...</span>
                            </>
                          ) : (
                            <>
                              <motion.div
                                animate={{ 
                                  rotate: [0, 180, 360],
                                  scale: [1, 1.2, 1]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                              >
                                <Crown className="w-6 h-6" />
                              </motion.div>
                              <span>Start Free Enterprise Trial</span>
                              <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <ArrowRight className="w-6 h-6" />
                              </motion.div>
                            </>
                          )}
                        </div>
                      </motion.button>
                    </motion.div>

                    {/* Premium Divider */}
                    <div className="relative my-10">
                      <div className="absolute inset-0 flex items-center">
                        <motion.div 
                          className="w-full border-t border-gradient-to-r from-transparent via-slate-300 to-transparent"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-8 bg-white/80 text-slate-600 font-semibold rounded-full border border-slate-200">
                          Or continue with SSO
                        </span>
                      </div>
                    </div>

                    {/* Premium Social Login Options */}
                    <div className="grid grid-cols-2 gap-4">
                      <motion.button
                        type="button"
                        onClick={handleGoogleSignUp}
                        disabled={isLoading}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white/80 backdrop-blur-xl border-2 border-white/60 hover:bg-white/90 hover:border-white/80 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-3"
                      >
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span className="text-slate-700">Google</span>
                      </motion.button>
                      
                      <motion.button
                        type="button"
                        disabled={true}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white/60 backdrop-blur-xl border-2 border-white/40 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl flex items-center justify-center space-x-3 opacity-60 cursor-not-allowed"
                      >
                        <Shield className="w-6 h-6 text-slate-600" />
                        <span className="text-slate-600">SSO</span>
                      </motion.button>
                    </div>

                    {/* Premium Terms */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                      className="text-center text-sm text-slate-500 leading-relaxed pt-6 space-y-2"
                    >
                      <p>
                        By creating an account, you agree to our{' '}
                        <a href="#" className="text-indigo-600 hover:text-indigo-700 font-semibold underline decoration-2 underline-offset-2">Terms of Service</a>{' '}
                        and{' '}
                        <a href="#" className="text-indigo-600 hover:text-indigo-700 font-semibold underline decoration-2 underline-offset-2">Privacy Policy</a>
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
                    </motion.div>
                  </form>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Ultra-Sophisticated OTP Modal */}
      <AnimatePresence>
        {showOTPModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-lg flex items-center justify-center z-50 p-4"
          >
            {/* Advanced floating ambient elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div 
                  key={i}
                  className={`absolute w-96 h-96 rounded-full blur-3xl opacity-30`}
                  style={{
                    background: `conic-gradient(from ${i * 60}deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #10b981, #3b82f6)`,
                    left: `${20 + (i % 3) * 30}%`,
                    top: `${20 + Math.floor(i / 3) * 30}%`,
                  }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{ 
                    duration: 8 + i * 2, 
                    repeat: Infinity, 
                    delay: i * 0.5 
                  }}
                />
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 100 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-lg w-full"
            >
              {/* Ultra-sophisticated modal with extreme layering */}
              <div className="relative">
                <div className="absolute inset-0 bg-white/30 backdrop-blur-3xl rounded-[2.5rem] border border-white/40 shadow-2xl" />
                <div className="absolute inset-3 bg-white/40 backdrop-blur-2xl rounded-[2rem] border border-white/50" />
                <div className="absolute inset-6 bg-white/60 backdrop-blur-xl rounded-[1.5rem] border border-white/60" />
                
                <div className="relative z-10 p-12 text-center space-y-10">
                  {/* Ultra-premium header */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                    className="relative"
                  >
                    <motion.div 
                      className="w-24 h-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto shadow-2xl border-2 border-white/40"
                      animate={{
                        boxShadow: [
                          "0 10px 40px rgba(59, 130, 246, 0.4)",
                          "0 20px 80px rgba(139, 92, 246, 0.6)",
                          "0 10px 40px rgba(59, 130, 246, 0.4)"
                        ],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Mail className="w-12 h-12 text-white drop-shadow-2xl" />
                      
                      {/* Floating particles around icon */}
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-white rounded-full"
                          style={{
                            left: `${50 + Math.cos(i * 45 * Math.PI / 180) * 60}%`,
                            top: `${50 + Math.sin(i * 45 * Math.PI / 180) * 60}%`,
                          }}
                          animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                  
                  <div className="space-y-6">
                    <motion.h2 
                      className="text-4xl font-black text-slate-800 tracking-tight"
                      animate={{ opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      Verify Your Email
                    </motion.h2>
                    <div className="space-y-4">
                      <p className="text-slate-600 font-semibold text-lg">
                        We've sent a 6-digit verification code to
                      </p>
                      <motion.div 
                        className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 backdrop-blur-xl px-6 py-3 rounded-2xl border border-blue-200/50 shadow-lg"
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Mail className="w-5 h-5 text-slate-600" />
                        <span className="font-bold text-slate-800 text-lg">{pendingUser?.email}</span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Ultra-sophisticated OTP inputs */}
                  <div className="space-y-8">
                    <div className="flex justify-center space-x-4">
                      {[...Array(6)].map((_, index) => (
                        <motion.div 
                          key={index} 
                          className="relative"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
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
                            className={`w-16 h-20 text-center text-3xl font-black border-3 rounded-2xl transition-all duration-300 backdrop-blur-xl shadow-lg ${
                              otpError 
                                ? 'border-red-400 bg-red-50/80 text-red-600 shadow-red-200/50' 
                                : verificationCode[index] 
                                  ? 'border-emerald-400 bg-emerald-50/80 text-emerald-700 shadow-emerald-200/50' 
                                  : 'border-slate-300 bg-white/80 text-slate-700 focus:border-indigo-400 focus:bg-indigo-50/80 focus:shadow-indigo-200/50'
                            }`}
                            maxLength={1}
                            autoFocus={index === 0}
                          />
                          
                          {/* Success/Error indicators */}
                          {verificationCode[index] && !otpError && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                            >
                              <Check className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                          {verificationCode[index] && otpError && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-400 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                            >
                              <X className="w-3 h-3 text-white" />
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
                        className="bg-gradient-to-r from-amber-100/90 to-orange-100/90 backdrop-blur-xl rounded-2xl p-6 border-2 border-amber-300/50 shadow-lg"
                      >
                        <div className="flex items-center space-x-3 mb-4">
                          <motion.div 
                            className="w-4 h-4 bg-amber-400 rounded-full"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                          <span className="text-amber-800 font-bold">DEVELOPMENT MODE</span>
                        </div>
                        <div className="text-center">
                          <p className="text-amber-700 font-semibold mb-3">Test Verification Code:</p>
                          <div className="bg-amber-200/80 border-2 border-amber-400/50 rounded-xl p-4">
                            <span className="text-amber-900 font-mono font-black text-3xl tracking-widest">
                              {sentOtpCode}
                            </span>
                          </div>
                          <p className="text-amber-700/80 text-sm mt-3">
                            Use this code for testing or check your email
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Ultra-premium action buttons */}
                    <div className="space-y-6">
                      <motion.button
                        onClick={handleOTPSubmit}
                        disabled={otpLoading || verificationCode.length !== 6}
                        whileHover={{ scale: otpLoading ? 1 : 1.02 }}
                        whileTap={{ scale: otpLoading ? 1 : 0.98 }}
                        className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-6 px-8 rounded-2xl font-bold text-xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-2xl hover:shadow-3xl relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        {otpLoading ? (
                          <div className="flex items-center justify-center space-x-4 relative z-10">
                            <motion.div 
                              className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <span>Verifying Your Code...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-4 relative z-10">
                            <Crown className="w-6 h-6" />
                            <span>Verify & Access Enterprise Platform</span>
                          </div>
                        )}
                      </motion.button>

                      <div className="flex items-center justify-between text-sm space-x-6">
                        <motion.button
                          onClick={handleResendOTP}
                          disabled={otpLoading}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 font-semibold transition-colors duration-300 disabled:opacity-50 bg-slate-100/80 backdrop-blur-xl px-4 py-2 rounded-xl"
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
                          className="flex items-center space-x-2 text-slate-500 hover:text-slate-700 font-semibold transition-colors duration-300 disabled:opacity-50 bg-slate-100/80 backdrop-blur-xl px-4 py-2 rounded-xl"
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