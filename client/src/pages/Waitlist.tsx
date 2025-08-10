import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight,
  Mail,
  User,
  Copy,
  Check,
  Users,
  Crown,
  Gift,
  Heart,
  Zap,
  Shield,
  ChevronRight,
  Award,
  CheckCircle,
  Flame,
  Brain,
  BarChart3,
  Calendar,
  Clock,
  Rocket,
  Play,
  Pause,
  Bot,
  Share2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WaitlistFormData {
  name: string;
  email: string;
  referredBy: string;
}

interface WaitlistResponse {
  success: boolean;
  message: string;
  referralCode?: string;
  position?: number;
  estimatedAccess?: string;
}

const Waitlist = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState<WaitlistFormData>({
    name: '',
    email: '',
    referredBy: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [waitlistData, setWaitlistData] = useState<WaitlistResponse | null>(null);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [currentDemo, setCurrentDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [ripples, setRipples] = useState<Array<{id: number, x: number, y: number}>>([]);
  const [currentFeature, setCurrentFeature] = useState(0);

  // Advanced demo scenarios for the interactive showcase
  const demoScenarios = [
    {
      title: "AI Content Generation",
      description: "VeeGPT creates viral content that resonates with your audience",
      gradient: "from-violet-600 via-purple-600 to-blue-600",
      icon: Brain,
      metrics: { engagement: "+384%", reach: "3.2M", conversion: "+89%" },
      demo: "Generating Instagram post about tech trends..."
    },
    {
      title: "Smart Automation",
      description: "Intelligent scheduling across all your social platforms",
      gradient: "from-blue-600 via-cyan-600 to-emerald-600",
      icon: Zap,
      metrics: { efficiency: "+450%", saved: "25h/week", posts: "1,247" },
      demo: "Optimizing posting schedule for maximum reach..."
    },
    {
      title: "Advanced Analytics",
      description: "Predictive insights that show what content will go viral",
      gradient: "from-emerald-600 via-teal-600 to-cyan-600",
      icon: BarChart3,
      metrics: { accuracy: "96.8%", insights: "312", trends: "+67%" },
      demo: "Analyzing viral patterns and audience behavior..."
    },
    {
      title: "Team Collaboration",
      description: "Seamless workflow for creative teams and agencies",
      gradient: "from-orange-600 via-red-600 to-pink-600",
      icon: Users,
      metrics: { productivity: "+340%", approval: "2x faster", teams: "890+" },
      demo: "Streamlining approval workflow with clients..."
    }
  ];

  // Interactive feature showcase
  const featureShowcase = [
    {
      icon: Bot,
      title: "VeeGPT Assistant",
      description: "AI that understands your brand voice and creates authentic content",
      color: "from-purple-500 to-blue-500"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "AI-powered timing optimization for maximum engagement",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: BarChart3,
      title: "Predictive Analytics",
      description: "Know what content will perform before you post it",
      color: "from-cyan-500 to-emerald-500"
    },
    {
      icon: Users,
      title: "Team Workspace",
      description: "Collaborate seamlessly with advanced approval workflows",
      color: "from-emerald-500 to-green-500"
    }
  ];

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-advance demo scenarios
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentDemo((prev) => (prev + 1) % demoScenarios.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Feature showcase rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % featureShowcase.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Advanced typing animation
  useEffect(() => {
    const messages = [
      "Join 2,000+ creators revolutionizing social media",
      "Early access to AI-powered content creation",
      "Be part of the future of social media management",
      "Exclusive access to VeeFore's advanced features"
    ];
    
    let messageIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    const typeWriter = () => {
      const currentMessage = messages[messageIndex];
      
      if (!isDeleting && charIndex < currentMessage.length) {
        setTypedText(currentMessage.substring(0, charIndex + 1));
        setIsTyping(true);
        charIndex++;
        setTimeout(typeWriter, 80);
      } else if (isDeleting && charIndex > 0) {
        setTypedText(currentMessage.substring(0, charIndex - 1));
        charIndex--;
        setTimeout(typeWriter, 40);
      } else if (!isDeleting && charIndex === currentMessage.length) {
        setIsTyping(false);
        setTimeout(() => {
          isDeleting = true;
          typeWriter();
        }, 3000);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        messageIndex = (messageIndex + 1) % messages.length;
        setTimeout(typeWriter, 500);
      }
    };
    
    const timeout = setTimeout(typeWriter, 1000);
    return () => clearTimeout(timeout);
  }, []);

  // Interactive ripple effects
  const createRipple = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };
    
    setRipples(prev => [...prev, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  // Get referral code from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('ref');
    if (referralCode) {
      setFormData(prev => ({ ...prev, referredBy: referralCode }));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/early-access/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setWaitlistData(data);
        setIsSubmitted(true);
        toast({
          title: "Welcome to VeeFore!",
          description: "You've been added to our exclusive waitlist.",
        });
      } else {
        toast({
          title: "Something went wrong",
          description: data.message || "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Waitlist submission error:', error);
      toast({
        title: "Connection error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferralCode = async () => {
    if (waitlistData?.referralCode) {
      const referralUrl = `${window.location.origin}/waitlist?ref=${waitlistData.referralCode}`;
      await navigator.clipboard.writeText(referralUrl);
      setCopiedReferral(true);
      toast({
        title: "Link copied",
        description: "Referral link copied to clipboard.",
      });
      setTimeout(() => setCopiedReferral(false), 2000);
    }
  };

  if (isSubmitted && waitlistData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Advanced background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50" />
        
        {/* Animated particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="max-w-5xl w-full bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-12 text-center relative overflow-hidden border border-white/20"
        >
          {/* Success celebration effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-pink-50/30 rounded-3xl" />
          
          {/* Celebration particles */}
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                background: `linear-gradient(45deg, hsl(${Math.random() * 360}, 70%, 60%), hsl(${Math.random() * 360}, 70%, 60%))`
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 2, 0],
                x: [0, (Math.random() - 0.5) * 800],
                y: [0, (Math.random() - 0.5) * 600],
                rotate: [0, Math.random() * 720]
              }}
              transition={{ 
                duration: 4,
                delay: i * 0.05,
                repeat: Infinity,
                repeatDelay: 8
              }}
              style={{
                left: '50%',
                top: '40%'
              }}
            />
          ))}

          {/* Advanced success icon with multiple animations */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 1, type: "spring" }}
            className="relative w-32 h-32 mx-auto mb-8"
          >
            <div className="w-full h-full bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
            
            {/* Pulsing rings */}
            {[1, 2, 3].map((ring, i) => (
              <motion.div
                key={ring}
                className="absolute inset-0 rounded-full border-4 border-green-300"
                animate={{ 
                  scale: [1, 1.5 + i * 0.2], 
                  opacity: [0.8, 0, 0.8],
                  rotate: [0, 180, 360] 
                }}
                transition={{ 
                  duration: 2 + i * 0.5, 
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent"
          >
            🎉 You're In! 🎉
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Welcome to VeeFore's exclusive community! You're member{' '}
            <span className="font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl border border-blue-200">
              #{waitlistData.position || '---'}
            </span>{' '}
            in our revolutionary social media platform.
          </motion.p>

          {/* Enhanced achievement cards with animations */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            {[
              {
                icon: Crown,
                value: `#${waitlistData.position || '---'}`,
                label: "Priority Position",
                color: "from-blue-500 to-cyan-500",
                bg: "from-blue-50 to-cyan-50"
              },
              {
                icon: Clock,
                value: waitlistData.estimatedAccess || "2-3 weeks",
                label: "Early Access",
                color: "from-purple-500 to-pink-500",
                bg: "from-purple-50 to-pink-50"
              },
              {
                icon: Gift,
                value: "50% OFF",
                label: "Launch Discount",
                color: "from-green-500 to-emerald-500",
                bg: "from-green-50 to-emerald-50"
              }
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, rotateX: -10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
                whileHover={{ scale: 1.05, rotateX: 5 }}
                className={`relative bg-gradient-to-br ${card.bg} rounded-2xl p-8 border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                <div className={`w-16 h-16 bg-gradient-to-r ${card.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:rotate-12 transition-transform duration-300`}>
                  <card.icon className="w-8 h-8 text-white" />
                </div>
                <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                  {card.value}
                </div>
                <div className="text-gray-600 font-medium text-lg">{card.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced referral section */}
          {waitlistData.referralCode && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 rounded-2xl p-8 border border-orange-200/50 mb-8 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-100/20 to-red-100/20 rounded-2xl" />
              
              <div className="flex items-center justify-center mb-6 relative">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Flame className="w-10 h-10 text-orange-500 mr-3" />
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-800">Skip the Line!</h3>
              </div>
              
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                Share your unique referral link and move up in line for every friend who joins. 
                The more you share, the faster you get access to VeeFore's revolutionary features!
              </p>
              
              <div className="flex items-center gap-4 max-w-2xl mx-auto">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={`${window.location.origin}/waitlist?ref=${waitlistData.referralCode}`}
                    readOnly
                    className="w-full bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl px-6 py-4 text-gray-700 focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Share2 className="w-5 h-5 text-orange-400" />
                  </div>
                </div>
                <motion.button
                  onClick={copyReferralCode}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl transition-all duration-300 flex items-center gap-3 shadow-lg font-semibold relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                  {copiedReferral ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                  {copiedReferral ? 'Copied!' : 'Share Link'}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <motion.button
              onClick={() => setLocation('/signin')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-6 px-12 rounded-2xl transition-all duration-300 flex items-center gap-4 mx-auto text-xl shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
              <Sparkles className="w-7 h-7" />
              <span>Access Your VeeFore Dashboard</span>
              <ArrowRight className="w-7 h-7" />
            </motion.button>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7 }}
              className="text-gray-500 mt-6 text-lg"
            >
              We'll notify you the moment your exclusive access is ready
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Advanced background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 pointer-events-none" />
      
      {/* Interactive mouse follower */}
      <div
        className="fixed w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full pointer-events-none transition-all duration-1000 ease-out blur-3xl"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Animated particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-30"
          animate={{
            x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
            y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            scale: [0, 1, 0],
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: Math.random() * 15 + 15,
            repeat: Infinity,
            delay: Math.random() * 8
          }}
        />
      ))}

      {/* Enhanced header */}
      <header className="relative bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">VeeFore</span>
                <div className="text-sm text-gray-500 font-medium">AI Social Media Management</div>
              </div>
            </motion.div>
            
            <div className="flex items-center space-x-6">
              <motion.div 
                className="hidden sm:flex items-center space-x-3 bg-green-50 px-4 py-2 rounded-full border border-green-200 shadow-sm"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-700 font-semibold text-sm">2,847+ creators joined today</span>
              </motion.div>
              
              <motion.button
                onClick={() => setLocation('/signin')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg"
              >
                Sign In
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex min-h-[calc(100vh-88px)]">
        {/* Left side - Interactive demo */}
        <div className="flex-1 p-8 flex flex-col justify-center relative">
          <div className="max-w-2xl">
            {/* Typing animation header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
                The Future of{' '}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Social Media
                </span>
              </h1>
              <div className="text-2xl text-gray-600 h-16 flex items-center">
                <span>{typedText}</span>
                <motion.span
                  animate={{ opacity: isTyping ? [1, 0] : 1 }}
                  transition={{ duration: 0.5, repeat: isTyping ? Infinity : 0 }}
                  className="ml-1 text-blue-600"
                >
                  |
                </motion.span>
              </div>
            </motion.div>

            {/* Interactive demo showcase */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 mb-8 relative overflow-hidden"
            >
              {/* Demo header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Live Demo</h3>
                <div className="flex items-center space-x-3">
                  <motion.button
                    onClick={() => setIsPlaying(!isPlaying)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </motion.button>
                  <div className="flex space-x-1">
                    {demoScenarios.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentDemo ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Current demo */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentDemo}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${demoScenarios[currentDemo].gradient} rounded-2xl flex items-center justify-center shadow-lg mb-4`}>
                    {React.createElement(demoScenarios[currentDemo].icon, { className: "w-8 h-8 text-white" })}
                  </div>
                  
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">
                      {demoScenarios[currentDemo].title}
                    </h4>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {demoScenarios[currentDemo].description}
                    </p>
                  </div>

                  {/* Demo metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(demoScenarios[currentDemo].metrics).map(([key, value], i) => (
                      <motion.div
                        key={key}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 * i }}
                        className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100"
                      >
                        <div className="text-2xl font-bold text-gray-900">{value}</div>
                        <div className="text-gray-500 text-sm capitalize">{key}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Demo status */}
                  <div className="flex items-center space-x-3 text-blue-600">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"
                    />
                    <span className="font-medium">{demoScenarios[currentDemo].demo}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Feature showcase */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              {featureShowcase.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className={`p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg transition-all duration-300 ${
                    index === currentFeature ? 'ring-2 ring-blue-500 bg-white/80' : ''
                  }`}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Right side - Advanced waitlist form */}
        <div className="w-1/2 p-8 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-10 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
            }}
          >
            {/* Form background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 rounded-3xl" />
            
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

            {/* Form header */}
            <div className="text-center mb-10 relative">
              <motion.div
                className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
                animate={{ 
                  rotate: [0, 3, -3, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Crown className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-3">
                Join the Revolution
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Get exclusive early access to VeeFore's AI-powered social media management platform
              </p>
            </div>

            {/* Enhanced form */}
            <form onSubmit={handleSubmit} className="space-y-8 relative" onClick={createRipple}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <label className="block text-gray-700 font-semibold mb-3 text-lg">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 transition-colors duration-300" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField('')}
                    required
                    className="w-full bg-white/80 border-2 border-gray-200 rounded-2xl pl-14 pr-4 py-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter your full name"
                  />
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-blue-500 opacity-0 pointer-events-none"
                    animate={{ opacity: focusedField === 'name' ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <label className="block text-gray-700 font-semibold mb-3 text-lg">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 transition-colors duration-300" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    required
                    className="w-full bg-white/80 border-2 border-gray-200 rounded-2xl pl-14 pr-4 py-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter your email address"
                  />
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-blue-500 opacity-0 pointer-events-none"
                    animate={{ opacity: focusedField === 'email' ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </motion.div>

              {formData.referredBy && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  whileHover={{ scale: 1.02 }}
                >
                  <label className="block text-gray-700 font-semibold mb-3 text-lg">
                    Referral Code
                  </label>
                  <div className="relative">
                    <Gift className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-orange-400" />
                    <input
                      type="text"
                      name="referredBy"
                      value={formData.referredBy}
                      onChange={handleInputChange}
                      className="w-full bg-orange-50/80 border-2 border-orange-200 rounded-2xl pl-14 pr-4 py-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 backdrop-blur-sm"
                      placeholder="Referral code"
                    />
                  </div>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-5 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl text-lg relative overflow-hidden"
              >
                {/* Button shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Rocket className="w-6 h-6" />
                    <span>Join the Revolution</span>
                    <ChevronRight className="w-6 h-6" />
                  </>
                )}
              </motion.button>

              {/* Enhanced benefits section */}
              <div className="space-y-6 pt-4">
                <p className="text-gray-500 text-sm text-center">
                  By joining, you agree to our{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Terms</a> and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Privacy Policy</a>
                </p>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50 shadow-lg">
                  <div className="flex items-center justify-center mb-4">
                    <Award className="w-6 h-6 text-green-600 mr-3" />
                    <span className="text-green-700 font-bold text-lg">Exclusive Benefits:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm text-green-600">
                    {[
                      { icon: Heart, text: "50% Launch Discount" },
                      { icon: Crown, text: "Priority Access" },
                      { icon: Zap, text: "Beta Features" },
                      { icon: Shield, text: "Premium Support" }
                    ].map((benefit, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-center bg-white/60 rounded-xl p-3"
                      >
                        <benefit.icon className="w-4 h-4 mr-2" />
                        <span>{benefit.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Social proof */}
                <div className="flex items-center justify-center space-x-6 pt-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.2, zIndex: 10 }}
                        className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-3 border-white flex items-center justify-center text-white text-xs font-bold shadow-lg cursor-pointer"
                      >
                        {String.fromCharCode(65 + i)}
                      </motion.div>
                    ))}
                  </div>
                  <div className="text-gray-600">
                    <span className="font-bold text-gray-800">2,847+</span> innovators joined today
                  </div>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Waitlist;