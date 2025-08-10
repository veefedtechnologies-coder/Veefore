import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { motion, useInView, AnimatePresence } from 'framer-motion';
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
  Star,
  Shield,
  ChevronRight,
  Award,
  TrendingUp,
  BarChart3,
  Layers,
  Globe,
  Target,
  CheckCircle,
  Flame,
  Play,
  Calendar,
  Clock,
  Building,
  Briefcase,
  Smartphone
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
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Animation counters
  const usersCounter = useCounter(2547);
  const companiesCounter = useCounter(156);
  const countriesCounter = useCounter(28);
  
  useEffect(() => {
    // Get referral code from URL
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('ref');
    if (referralCode) {
      setFormData(prev => ({ ...prev, referredBy: referralCode }));
    }

    // Testimonial rotation
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for subtle parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ 
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
          description: "You've been added to the waitlist. Check your email for confirmation.",
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

  const testimonials = [
    {
      quote: "VeeFore completely transformed our social media strategy. The AI tools are incredibly intuitive.",
      author: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechFlow Inc"
    },
    {
      quote: "The analytics dashboard gives us insights we never had before. Our engagement increased by 300%.",
      author: "Michael Chen",
      role: "Content Creator",
      company: "Digital Studios"
    },
    {
      quote: "Finally, a platform that understands what modern creators need. The automation features are game-changing.",
      author: "Emily Rodriguez",
      role: "Social Media Manager",
      company: "Brand Collective"
    }
  ];

  const features = [
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Real-time insights and performance tracking across all platforms",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "AI Content Generation",
      description: "Create engaging content with advanced AI algorithms",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Optimal posting times based on audience behavior analysis",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamless workflow management for teams of any size",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  if (isSubmitted && waitlistData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-12 text-center relative overflow-hidden"
        >
          {/* Celebration elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-3xl" />
          
          {/* Confetti animation */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, Math.random() * 400 - 200],
                y: [0, Math.random() * 300 - 150],
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 2,
                delay: i * 0.1,
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
            className="relative w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
          >
            <CheckCircle className="w-12 h-12 text-white" />
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-green-300"
              animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
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
            You're now part of our exclusive community. Your position is{' '}
            <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">#{waitlistData.position || '---'}</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <Crown className="w-8 h-8 text-blue-600 mb-3 mx-auto" />
              <div className="text-3xl font-bold text-blue-600 mb-1">{waitlistData.position || '---'}</div>
              <div className="text-blue-600/70 font-medium">Your Position</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
              <Clock className="w-8 h-8 text-purple-600 mb-3 mx-auto" />
              <div className="text-3xl font-bold text-purple-600 mb-1">{waitlistData.estimatedAccess || '2-3 weeks'}</div>
              <div className="text-purple-600/70 font-medium">Estimated Access</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
              <Gift className="w-8 h-8 text-green-600 mb-3 mx-auto" />
              <div className="text-3xl font-bold text-green-600 mb-1">50%</div>
              <div className="text-green-600/70 font-medium">Early Access Discount</div>
            </div>
          </motion.div>

          {waitlistData.referralCode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200 mb-8"
            >
              <div className="flex items-center justify-center mb-4">
                <Flame className="w-6 h-6 text-orange-500 mr-2" />
                <h3 className="text-2xl font-bold text-gray-800">Skip the Line</h3>
              </div>
              <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                Share your referral link to move up in the waitlist for each friend who joins.
              </p>
              <div className="flex items-center gap-3 max-w-md mx-auto">
                <input
                  type="text"
                  value={`${window.location.origin}/waitlist?ref=${waitlistData.referralCode}`}
                  readOnly
                  className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  onClick={copyReferralCode}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  {copiedReferral ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copiedReferral ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-4"
          >
            <button
              onClick={() => setLocation('/signup')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
            >
              <Sparkles className="w-5 h-5" />
              Continue to Dashboard
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Subtle background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-cyan-100/20 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6 bg-white/80 backdrop-blur-md border-b border-gray-100">
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
            <div className="text-xs text-gray-500 font-medium">Social Media Management</div>
          </div>
        </motion.div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-700 font-medium text-sm">{usersCounter.count.toLocaleString()}+ users joined</span>
          </div>
          
          <button
            onClick={() => setLocation('/signin')}
            className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Hero Section */}
          <div className="text-center space-y-8 mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center bg-blue-50 rounded-full px-6 py-3 border border-blue-200 shadow-sm"
            >
              <Star className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-700 font-semibold">Join {usersCounter.count.toLocaleString()}+ creators worldwide</span>
              <div ref={usersCounter.ref} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
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
              transition={{ delay: 0.3 }}
              className="text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto"
            >
              Join the exclusive waitlist for VeeFore - the next-generation AI-powered platform that's revolutionizing 
              how creators and businesses manage their social media presence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <div className="inline-flex items-center bg-orange-50 text-orange-700 px-6 py-3 rounded-2xl border border-orange-200">
                <Flame className="w-5 h-5 mr-2" />
                <span className="font-semibold">Limited Early Access</span>
              </div>
              <div className="inline-flex items-center bg-green-50 text-green-700 px-6 py-3 rounded-2xl border border-green-200">
                <Gift className="w-5 h-5 mr-2" />
                <span className="font-semibold">50% Launch Discount</span>
              </div>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          >
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2" ref={usersCounter.ref}>
                {usersCounter.count.toLocaleString()}+
              </div>
              <div className="text-gray-600 font-medium text-lg">Active Creators</div>
            </div>
            
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
              <div className="text-4xl font-bold text-purple-600 mb-2" ref={companiesCounter.ref}>
                {companiesCounter.count}+
              </div>
              <div className="text-gray-600 font-medium text-lg">Enterprise Clients</div>
            </div>
            
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-2" ref={countriesCounter.ref}>
                {countriesCounter.count}+
              </div>
              <div className="text-gray-600 font-medium text-lg">Countries</div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Left: Features & Testimonials */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-12"
            >
              
              {/* Features */}
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-8">Powerful Features</h3>
                <div className="space-y-6">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-start space-x-4 p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-2 text-lg">{feature.title}</h4>
                          <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Testimonials */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">What Our Users Say</h3>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTestimonial}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <p className="text-gray-700 text-lg mb-6 italic leading-relaxed">
                      "{testimonials[activeTestimonial].quote}"
                    </p>
                    <div>
                      <div className="font-bold text-gray-900">{testimonials[activeTestimonial].author}</div>
                      <div className="text-gray-600">{testimonials[activeTestimonial].role}</div>
                      <div className="text-blue-600 font-medium">{testimonials[activeTestimonial].company}</div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                {/* Testimonial indicators */}
                <div className="flex justify-center space-x-2 mt-6">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === activeTestimonial ? 'bg-blue-600 w-8' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: Waitlist Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
              style={{
                transform: `translateX(${mousePosition.x}px) translateY(${mousePosition.y}px)`
              }}
            >
              <div className="sticky top-8">
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-gray-200 shadow-2xl p-8 relative overflow-hidden">
                  
                  {/* Form Header */}
                  <div className="text-center mb-8">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                      animate={{
                        rotate: [0, 2, -2, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Crown className="w-8 h-8 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-3">
                      Join the Waitlist
                    </h2>
                    <p className="text-gray-600 text-lg">Be among the first to experience the future of social media management</p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-5">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-3 text-lg">
                          Full Name
                        </label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-white border-2 border-gray-200 rounded-2xl pl-14 pr-4 py-4 text-gray-800 text-lg placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-3 text-lg">
                          Email Address
                        </label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-white border-2 border-gray-200 rounded-2xl pl-14 pr-4 py-4 text-gray-800 text-lg placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                            placeholder="Enter your email address"
                          />
                        </div>
                      </div>

                      {formData.referredBy && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                        >
                          <label className="block text-gray-700 font-semibold mb-3 text-lg">
                            Referral Code
                          </label>
                          <div className="relative group">
                            <Gift className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-orange-400 group-focus-within:text-orange-500 transition-colors" />
                            <input
                              type="text"
                              name="referredBy"
                              value={formData.referredBy}
                              onChange={handleInputChange}
                              className="w-full bg-orange-50 border-2 border-orange-200 rounded-2xl pl-14 pr-4 py-4 text-gray-800 text-lg placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 shadow-sm hover:shadow-md"
                              placeholder="Your referral code"
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:shadow-2xl text-lg"
                    >
                      {isLoading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Zap className="w-6 h-6" />
                          <span>Join Exclusive Waitlist</span>
                          <ChevronRight className="w-6 h-6" />
                        </>
                      )}
                    </button>

                    <div className="text-center space-y-4">
                      <p className="text-gray-500">
                        By joining, you agree to our{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                          Privacy Policy
                        </a>
                      </p>

                      {/* Benefits */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                        <div className="flex items-center justify-center mb-4">
                          <Award className="w-5 h-5 text-green-600 mr-2" />
                          <span className="text-green-700 font-semibold">What you get:</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm text-green-600">
                          <div className="flex items-center">
                            <Heart className="w-4 h-4 mr-2" />
                            <span>50% Early Bird Discount</span>
                          </div>
                          <div className="flex items-center">
                            <Crown className="w-4 h-4 mr-2" />
                            <span>Priority Access</span>
                          </div>
                          <div className="flex items-center">
                            <Zap className="w-4 h-4 mr-2" />
                            <span>Exclusive Features</span>
                          </div>
                          <div className="flex items-center">
                            <Shield className="w-4 h-4 mr-2" />
                            <span>Premium Support</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>

                  {/* Social Proof Footer */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
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
                        <span className="font-bold text-gray-800">{usersCounter.count.toLocaleString()}+</span> professionals already joined
                      </div>
                    </div>
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