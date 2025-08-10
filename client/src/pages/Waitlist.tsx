import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { motion, useInView } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  ChevronRight, 
  Star,
  Shield,
  Globe,
  Rocket,
  CheckCircle,
  ArrowRight,
  Mail,
  User,
  Copy,
  Check,
  TrendingUp,
  Users,
  Clock,
  Award,
  Layers,
  BarChart3,
  Lightbulb,
  Target,
  Video,
  Wand2,
  Brain,
  Crown,
  Gift,
  Heart,
  Flame,
  Bolt,
  Verified
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

// Counter animation hook
const useCounter = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const isInView = useInView(countRef);

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);

  return { count, ref: countRef };
};

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
  const [currentStats, setCurrentStats] = useState({
    totalUsers: 2547,
    earlyAccessSpots: 500,
    averageWaitTime: '2-3 weeks'
  });
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Animation counters
  const usersCounter = useCounter(2547);
  const spotsCounter = useCounter(500);
  const companiesCounter = useCounter(150);
  
  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Get referral code from URL
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('ref');
    if (referralCode) {
      setFormData(prev => ({ ...prev, referredBy: referralCode }));
    }

    // Animate stats
    const interval = setInterval(() => {
      setCurrentStats(prev => ({
        ...prev,
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 3)
      }));
    }, 5000);

    // Feature rotation
    const featureInterval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 8);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearInterval(featureInterval);
    };
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
          title: "Success!",
          description: "You've been added to the waitlist. Check your email for confirmation.",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Waitlist submission error:', error);
      toast({
        title: "Error",
        description: "Network error. Please check your connection and try again.",
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
        title: "Copied!",
        description: "Referral link copied to clipboard.",
      });
      setTimeout(() => setCopiedReferral(false), 2000);
    }
  };

  if (isSubmitted && waitlistData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl w-full bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200 shadow-2xl p-12 text-center relative overflow-hidden"
        >
          {/* Success animation background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-3xl" />
          
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, Math.random() * 400 - 200],
                y: [0, Math.random() * 200 - 100]
              }}
              transition={{ 
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                repeatDelay: 3
              }}
              style={{
                left: '50%',
                top: '30%'
              }}
            />
          ))}

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
          >
            <CheckCircle className="w-12 h-12 text-white" />
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-green-300"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-4"
          >
            Welcome to VeeFore!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
          >
            You're now part of an exclusive community of creators. You're in position{' '}
            <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">#{waitlistData.position || '---'}</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-300/20 rounded-full -mr-10 -mt-10" />
              <Crown className="w-8 h-8 text-blue-600 mb-3" />
              <div className="text-3xl font-bold text-blue-600 mb-1">{waitlistData.position || '---'}</div>
              <div className="text-blue-600/70 font-medium">Your Position</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-300/20 rounded-full -mr-10 -mt-10" />
              <Clock className="w-8 h-8 text-purple-600 mb-3" />
              <div className="text-3xl font-bold text-purple-600 mb-1">{waitlistData.estimatedAccess || '2-3 weeks'}</div>
              <div className="text-purple-600/70 font-medium">Estimated Access</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-300/20 rounded-full -mr-10 -mt-10" />
              <Gift className="w-8 h-8 text-green-600 mb-3" />
              <div className="text-3xl font-bold text-green-600 mb-1">50%</div>
              <div className="text-green-600/70 font-medium">Early Bird Discount</div>
            </div>
          </motion.div>

          {waitlistData.referralCode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200 mb-8 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-100/30 to-red-100/30 rounded-2xl" />
              <div className="relative">
                <div className="flex items-center justify-center mb-4">
                  <Flame className="w-6 h-6 text-orange-500 mr-2" />
                  <h3 className="text-2xl font-bold text-gray-800">Skip the Line</h3>
                </div>
                <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                  Share your referral link and move up in the waitlist for each friend who joins. Get early access faster!
                </p>
                <div className="flex items-center gap-3 max-w-md mx-auto">
                  <input
                    type="text"
                    value={`${window.location.origin}/waitlist?ref=${waitlistData.referralCode}`}
                    readOnly
                    className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button
                    onClick={copyReferralCode}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                  >
                    {copiedReferral ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    {copiedReferral ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-4 relative"
          >
            <button
              onClick={() => setLocation('/signup')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
            >
              <Rocket className="w-5 h-5" />
              Continue to App
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-gray-500">
              Check your email for updates and early access notifications
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Advanced features data
  const advancedFeatures = [
    {
      icon: Brain,
      title: "AI Content Generation",
      description: "Generate viral content with advanced AI algorithms",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      borderColor: "border-purple-200"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep insights with predictive analytics and growth metrics",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200"
    },
    {
      icon: Wand2,
      title: "Smart Automation",
      description: "Intelligent posting schedules and engagement automation",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      borderColor: "border-green-200"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Advanced workspace management with role-based access",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      borderColor: "border-orange-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Advanced Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Floating geometric shapes */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5
            }}
            style={{
              left: `${15 + i * 10}%`,
              top: `${20 + i * 8}%`
            }}
          />
        ))}
        
        {/* Interactive mouse follower */}
        <motion.div
          className="absolute w-6 h-6 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full pointer-events-none blur-sm"
          animate={{
            x: mousePosition.x - 12,
            y: mousePosition.y - 12,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>

      {/* Premium Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-3"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">VeeFore</span>
            <div className="text-xs text-gray-500 font-medium">AI Social Media Platform</div>
          </div>
        </motion.div>
        
        <div className="flex items-center space-x-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-full border border-green-200"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-700 font-medium text-sm">2,547+ creators joined</span>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setLocation('/signin')}
            className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-2.5 rounded-xl font-medium hover:from-gray-900 hover:to-black transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Sign In
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Hero Content */}
          <div className="text-center space-y-8 mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center bg-gradient-to-r from-blue-50 to-purple-50 backdrop-blur-sm rounded-full px-6 py-3 border border-blue-200 shadow-lg"
            >
              <Crown className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-700 font-semibold">Join {usersCounter.count.toLocaleString()}+ Premium Creators</span>
              <div ref={usersCounter.ref} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl lg:text-8xl font-bold leading-tight"
            >
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                The Future of
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Social Media
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto"
            >
              Join the exclusive waitlist for VeeFore - the next-generation AI-powered platform that's revolutionizing 
              how creators and enterprises manage their social media presence with unprecedented intelligence and automation.
            </motion.p>

            {/* Floating CTA */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 px-8 py-4 rounded-2xl border border-orange-200 shadow-lg"
            >
              <Flame className="w-5 h-5 mr-2" />
              <span className="font-semibold">Limited Early Access • 50% Discount</span>
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Left Column - Features */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-12"
            >
              
              {/* Advanced Statistics */}
              <div className="grid grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-3xl font-bold text-blue-600" ref={usersCounter.ref}>
                    {usersCounter.count.toLocaleString()}+
                  </div>
                  <div className="text-gray-600 font-medium">Creators</div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-3xl font-bold text-purple-600" ref={spotsCounter.ref}>
                    {spotsCounter.count}
                  </div>
                  <div className="text-gray-600 font-medium">Early Access</div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-3xl font-bold text-green-600" ref={companiesCounter.ref}>
                    {companiesCounter.count}+
                  </div>
                  <div className="text-gray-600 font-medium">Companies</div>
                </motion.div>
              </div>

              {/* Advanced Features Grid */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Next-Generation Features</h3>
                <div className="grid grid-cols-1 gap-4">
                  {advancedFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    const isActive = activeFeature === index;
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        className={`relative p-6 rounded-2xl border transition-all duration-500 cursor-pointer group hover:scale-105 ${
                          isActive 
                            ? `bg-gradient-to-r ${feature.bgGradient} ${feature.borderColor} shadow-lg` 
                            : 'bg-white/60 border-gray-200 hover:bg-white/80'
                        }`}
                        onMouseEnter={() => setActiveFeature(index)}
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isActive 
                              ? `bg-gradient-to-r ${feature.gradient} shadow-lg` 
                              : 'bg-gray-100 group-hover:bg-gray-200'
                          }`}>
                            <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800 mb-2">{feature.title}</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                          </div>
                        </div>
                        
                        {/* Hover effect */}
                        <motion.div
                          className="absolute inset-0 rounded-2xl border-2 border-transparent"
                          animate={{
                            borderColor: isActive ? 'rgb(59 130 246 / 0.3)' : 'transparent'
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">Trusted by Industry Leaders</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { metric: "10M+", label: "Content Created" },
                    { metric: "500%", label: "Avg. Growth" },
                    { metric: "24/7", label: "AI Support" },
                    { metric: "99.9%", label: "Uptime" }
                  ].map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{item.metric}</div>
                      <div className="text-gray-600 text-sm">{item.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Premium Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="sticky top-8">
                <div className="bg-white/80 backdrop-blur-2xl rounded-3xl border border-gray-200 shadow-2xl p-8 relative overflow-hidden">
                  {/* Premium form background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-blue-50/90 rounded-3xl" />
                  
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full -mr-16 -mt-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-200/30 to-pink-200/30 rounded-full -ml-12 -mb-12" />
                  
                  <div className="relative">
                    {/* Form Header */}
                    <div className="text-center mb-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                        className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                      >
                        <Rocket className="w-8 h-8 text-white" />
                      </motion.div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-2">
                        Join the Waitlist
                      </h2>
                      <p className="text-gray-600">Be among the first to experience the future of social media</p>
                    </div>

                    {/* Premium Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-5">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <label className="block text-gray-700 font-semibold mb-3">
                            Full Name
                          </label>
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              className="w-full bg-white/80 border-2 border-gray-200 rounded-2xl pl-12 pr-4 py-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                              placeholder="Enter your full name"
                            />
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          <label className="block text-gray-700 font-semibold mb-3">
                            Email Address
                          </label>
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              className="w-full bg-white/80 border-2 border-gray-200 rounded-2xl pl-12 pr-4 py-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                              placeholder="Enter your email address"
                            />
                          </div>
                        </motion.div>

                        {formData.referredBy && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                          >
                            <label className="block text-gray-700 font-semibold mb-3">
                              Referral Code
                            </label>
                            <div className="relative group">
                              <Gift className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-400 group-focus-within:text-orange-500 transition-colors" />
                              <input
                                type="text"
                                name="referredBy"
                                value={formData.referredBy}
                                onChange={handleInputChange}
                                className="w-full bg-orange-50/80 border-2 border-orange-200 rounded-2xl pl-12 pr-4 py-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 shadow-sm hover:shadow-md"
                                placeholder="Your referral code"
                              />
                            </div>
                          </motion.div>
                        )}
                      </div>

                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:shadow-2xl"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isLoading ? (
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Bolt className="w-5 h-5" />
                            <span>Join Exclusive Waitlist</span>
                            <ChevronRight className="w-5 h-5" />
                          </>
                        )}
                      </motion.button>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.0 }}
                        className="text-center space-y-4"
                      >
                        <p className="text-gray-500 text-sm">
                          By joining, you agree to our{' '}
                          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                            Privacy Policy
                          </a>
                        </p>

                        {/* Benefits list */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                          <div className="flex items-center justify-center mb-2">
                            <Verified className="w-4 h-4 text-green-600 mr-2" />
                            <span className="text-green-700 font-semibold text-sm">What you get:</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-green-600">
                            <div className="flex items-center">
                              <Heart className="w-3 h-3 mr-1" />
                              <span>50% Early Bird Discount</span>
                            </div>
                            <div className="flex items-center">
                              <Crown className="w-3 h-3 mr-1" />
                              <span>Priority Access</span>
                            </div>
                            <div className="flex items-center">
                              <Bolt className="w-3 h-3 mr-1" />
                              <span>Exclusive Features</span>
                            </div>
                            <div className="flex items-center">
                              <Shield className="w-3 h-3 mr-1" />
                              <span>Premium Support</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </form>

                    {/* Social Proof Footer */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1 }}
                      className="mt-8 pt-6 border-t border-gray-200"
                    >
                      <div className="flex items-center justify-center space-x-4">
                        <div className="flex -space-x-3">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-3 border-white flex items-center justify-center text-white text-sm font-bold shadow-lg"
                            >
                              {String.fromCharCode(65 + i)}
                            </div>
                          ))}
                        </div>
                        <div className="text-gray-600">
                          <span className="font-bold text-gray-800">2,547+</span> creators already joined
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Waitlist;