import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
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
  Calendar,
  Clock,
  CheckCircle,
  Flame,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Eye,
  Layers,
  Globe,
  Target,
  Lightbulb,
  Rocket,
  Brain,
  Wand2,
  Smartphone,
  Tablet,
  Monitor,
  ChevronDown,
  ChevronUp,
  ArrowDown,
  MousePointer,
  Fingerprint,
  QrCode,
  Wifi,
  Signal
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WaitlistFormData {
  name: string;
  email: string;
  referredBy: string;
  role: string;
  company: string;
  interest: string;
}

interface WaitlistResponse {
  success: boolean;
  message: string;
  referralCode?: string;
  position?: number;
  estimatedAccess?: string;
}

interface JourneyStep {
  id: number;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  bgColor: string;
  completed: boolean;
}

const Waitlist = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState<WaitlistFormData>({
    name: '',
    email: '',
    referredBy: '',
    role: '',
    company: '',
    interest: ''
  });
  
  // Journey state
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [showPersonalization, setShowPersonalization] = useState(false);
  
  // Interactive elements
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [waitlistData, setWaitlistData] = useState<WaitlistResponse | null>(null);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);
  const [interactionCount, setInteractionCount] = useState(0);
  const [userPreferences, setUserPreferences] = useState({
    theme: 'light',
    animations: true,
    notifications: true
  });

  // Refs for animations
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const formRef = useRef(null);
  
  const heroInView = useInView(heroRef);
  const statsInView = useInView(statsRef);
  const featuresInView = useInView(featuresRef);
  const formInView = useInView(formRef);

  // Journey steps
  const journeySteps: JourneyStep[] = [
    {
      id: 0,
      title: "Discover VeeFore",
      subtitle: "Learn about our innovative platform",
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      completed: completedSteps.includes(0)
    },
    {
      id: 1,
      title: "Explore Features",
      subtitle: "See what makes us different",
      icon: Layers,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      completed: completedSteps.includes(1)
    },
    {
      id: 2,
      title: "Personalize Experience",
      subtitle: "Tell us about your needs",
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50",
      completed: completedSteps.includes(2)
    },
    {
      id: 3,
      title: "Join Community",
      subtitle: "Secure your exclusive spot",
      icon: Crown,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      completed: completedSteps.includes(3)
    }
  ];

  // Advanced features with expansion
  const innovativeFeatures = [
    {
      title: "AI-Powered Content Studio",
      subtitle: "Next-gen creation tools",
      description: "Advanced AI algorithms that understand your brand voice and create content that resonates with your audience across all platforms.",
      icon: Brain,
      color: "from-purple-500 to-pink-500",
      metrics: ["300% faster creation", "98% brand consistency", "45% higher engagement"],
      preview: "Generate, optimize, and schedule content with unprecedented intelligence"
    },
    {
      title: "Predictive Analytics Engine",
      subtitle: "Future-focused insights",
      description: "Machine learning models that predict trends, optimal posting times, and content performance before you publish.",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
      metrics: ["89% accuracy rate", "2-week trend prediction", "Real-time optimization"],
      preview: "Know what will work before it happens"
    },
    {
      title: "Collaborative Workspace Hub",
      subtitle: "Team synergy redefined",
      description: "Unified workspace where teams collaborate in real-time with advanced approval workflows and creative version control.",
      icon: Users,
      color: "from-green-500 to-emerald-500",
      metrics: ["50% faster approvals", "Zero version conflicts", "Seamless handoffs"],
      preview: "Where creativity meets productivity"
    },
    {
      title: "Cross-Platform Automation",
      subtitle: "Intelligent distribution",
      description: "Smart automation that adapts content format, timing, and messaging for each platform while maintaining brand consistency.",
      icon: Zap,
      color: "from-orange-500 to-red-500",
      metrics: ["12 platforms supported", "Auto-format conversion", "Smart scheduling"],
      preview: "One click, everywhere optimized"
    }
  ];

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      setScrollProgress(scrollPercent);
      setIsScrolled(scrollTop > 50);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Journey progression
  useEffect(() => {
    const progressJourney = () => {
      if (heroInView && !completedSteps.includes(0)) {
        setCompletedSteps(prev => [...prev, 0]);
        setCurrentStep(1);
      }
      if (featuresInView && !completedSteps.includes(1)) {
        setCompletedSteps(prev => [...prev, 1]);
        setCurrentStep(2);
      }
      if (interactionCount >= 3 && !completedSteps.includes(2)) {
        setCompletedSteps(prev => [...prev, 2]);
        setCurrentStep(3);
        setShowPersonalization(true);
      }
    };
    
    progressJourney();
  }, [heroInView, featuresInView, interactionCount, completedSteps]);

  // Get referral code
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('ref');
    if (referralCode) {
      setFormData(prev => ({ ...prev, referredBy: referralCode }));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setInteractionCount(prev => prev + 1);
  };

  const handleFeatureExpand = (index: number) => {
    setExpandedFeature(expandedFeature === index ? null : index);
    setInteractionCount(prev => prev + 1);
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
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          referredBy: formData.referredBy
        }),
      });

      const data = await response.json();

      if (data.success) {
        setWaitlistData(data);
        setIsSubmitted(true);
        setCompletedSteps(prev => [...prev, 3]);
        toast({
          title: "Welcome to VeeFore!",
          description: "You've successfully joined our exclusive community.",
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl p-12 text-center relative overflow-hidden"
        >
          {/* Success celebration */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30 rounded-3xl" />
          
          {/* Animated success particles */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                x: [0, (Math.random() - 0.5) * 600],
                y: [0, (Math.random() - 0.5) * 400],
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 3,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 5
              }}
              style={{
                left: '50%',
                top: '40%'
              }}
            />
          ))}

          {/* Success icon with pulsing animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
            className="relative w-32 h-32 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
          >
            <CheckCircle className="w-16 h-16 text-white" />
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-green-300"
              animate={{ 
                scale: [1, 1.4, 1], 
                opacity: [0.8, 0, 0.8],
                rotate: [0, 180, 360] 
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-6xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-6"
          >
            Journey Complete!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto"
          >
            Welcome to VeeFore's exclusive community! You're now member{' '}
            <span className="font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl">#{waitlistData.position || '---'}</span>
          </motion.p>

          {/* Achievement cards */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-300/20 rounded-full -mr-12 -mt-12" />
              <Crown className="w-10 h-10 text-blue-600 mb-4 mx-auto" />
              <div className="text-4xl font-bold text-blue-600 mb-2">{waitlistData.position || '---'}</div>
              <div className="text-blue-600/80 font-medium text-lg">Priority Access</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border border-purple-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-300/20 rounded-full -mr-12 -mt-12" />
              <Clock className="w-10 h-10 text-purple-600 mb-4 mx-auto" />
              <div className="text-4xl font-bold text-purple-600 mb-2">{waitlistData.estimatedAccess || '2-3 weeks'}</div>
              <div className="text-purple-600/80 font-medium text-lg">Launch Window</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-300/20 rounded-full -mr-12 -mt-12" />
              <Gift className="w-10 h-10 text-green-600 mb-4 mx-auto" />
              <div className="text-4xl font-bold text-green-600 mb-2">50%</div>
              <div className="text-green-600/80 font-medium text-lg">Launch Discount</div>
            </div>
          </motion.div>

          {/* Referral section */}
          {waitlistData.referralCode && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200 mb-8"
            >
              <div className="flex items-center justify-center mb-6">
                <Flame className="w-8 h-8 text-orange-500 mr-3" />
                <h3 className="text-3xl font-bold text-gray-800">Accelerate Your Access</h3>
              </div>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
                Share your unique referral link to skip ahead in line. Each successful referral moves you closer to early access!
              </p>
              <div className="flex items-center gap-4 max-w-lg mx-auto">
                <input
                  type="text"
                  value={`${window.location.origin}/waitlist?ref=${waitlistData.referralCode}`}
                  readOnly
                  className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  onClick={copyReferralCode}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 shadow-lg font-semibold"
                >
                  {copiedReferral ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                  {copiedReferral ? 'Copied!' : 'Share Link'}
                </button>
              </div>
            </motion.div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
          >
            <button
              onClick={() => setLocation('/signup')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center gap-4 mx-auto text-xl"
            >
              <Sparkles className="w-6 h-6" />
              Access Your Dashboard
              <ArrowRight className="w-6 h-6" />
            </button>
            <p className="text-gray-500 mt-6 text-lg">
              We'll notify you as soon as your exclusive access is ready
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Advanced progress indicator */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 z-50"
        style={{ width: `${scrollProgress * 100}%` }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Journey progress sidebar */}
      <motion.div
        className={`fixed right-8 top-1/2 transform -translate-y-1/2 z-40 transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: isScrolled ? 1 : 0 }}
      >
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-gray-200">
          <div className="space-y-4">
            {journeySteps.map((step, index) => (
              <motion.div
                key={step.id}
                className={`relative flex items-center space-x-3 p-3 rounded-xl transition-all cursor-pointer ${
                  currentStep === index ? 'bg-blue-50 border-2 border-blue-200' : 
                  step.completed ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50 border-2 border-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed ? 'bg-green-500' : currentStep === index ? 'bg-blue-500' : 'bg-gray-400'
                }`}>
                  {step.completed ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <step.icon className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="hidden lg:block">
                  <div className={`font-medium text-sm ${
                    step.completed ? 'text-green-700' : currentStep === index ? 'text-blue-700' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Enhanced navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">VeeFore</span>
                <div className="text-xs text-gray-500 font-medium">Next-Gen Social Media</div>
              </div>
            </motion.div>
            
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full border border-green-200">
                <Signal className="w-4 h-4 text-green-600 animate-pulse" />
                <span className="text-green-700 font-medium text-sm">2,547+ creators joined</span>
              </div>
              
              <button
                onClick={() => setLocation('/signin')}
                className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Interactive Elements */}
      <section ref={heroRef} className="relative pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center bg-blue-50 rounded-full px-8 py-4 border border-blue-200 shadow-sm"
            >
              <Lightbulb className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-blue-700 font-semibold text-lg">Revolutionary Social Media Management</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-7xl lg:text-9xl font-bold leading-tight"
            >
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Create.
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Connect.
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                Conquer.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto"
            >
              Experience the next evolution of social media management. AI-powered, team-optimized, 
              and designed for the future of digital creativity.
            </motion.p>

            {/* Interactive scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col items-center space-y-4 pt-8"
            >
              <p className="text-gray-500 font-medium">Begin your journey</p>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-8 h-8 border-2 border-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors"
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  setInteractionCount(prev => prev + 1);
                }}
              >
                <ArrowDown className="w-4 h-4 text-blue-500" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Features Section */}
      <section id="features" ref={featuresRef} className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-6">
              Innovation Meets Excellence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover features that redefine what's possible in social media management
            </p>
          </motion.div>

          <div className="space-y-8">
            {innovativeFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const isExpanded = expandedFeature === index;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ delay: index * 0.2 }}
                  className={`relative bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-lg transition-all duration-500 cursor-pointer overflow-hidden ${
                    isExpanded ? 'shadow-2xl scale-[1.02]' : 'hover:shadow-xl hover:scale-[1.01]'
                  }`}
                  onClick={() => handleFeatureExpand(index)}
                  whileHover={{ y: -2 }}
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-5 rounded-3xl`} />
                  
                  <div className="relative p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{feature.title}</h3>
                          <p className="text-gray-600 font-medium">{feature.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <div className="text-sm text-gray-500 mb-1">Click to explore</div>
                          <div className="flex space-x-1">
                            {feature.metrics.slice(0, 3).map((_, i) => (
                              <div key={i} className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                            ))}
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-6 h-6 text-gray-400" />
                        </motion.div>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-6 border-t border-gray-200">
                            <p className="text-gray-700 text-lg mb-6 leading-relaxed">{feature.description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                              {feature.metrics.map((metric, i) => (
                                <div key={i} className="bg-gray-50 rounded-xl p-4 text-center">
                                  <div className="font-bold text-gray-900">{metric}</div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                              <p className="text-blue-800 font-medium italic">"{feature.preview}"</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Advanced Form Section */}
      <section ref={formRef} className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatePresence>
            {showPersonalization && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="bg-white/90 backdrop-blur-2xl rounded-3xl border border-gray-200 shadow-2xl p-12 relative overflow-hidden"
              >
                {/* Interactive background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-3xl" />
                
                {/* Form header */}
                <div className="text-center mb-12 relative">
                  <motion.div
                    className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
                    animate={{
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Crown className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-4">
                    Claim Your Exclusive Access
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Join an elite community of creators who are shaping the future of social media
                  </p>
                </div>

                {/* Multi-step form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-gray-700 font-semibold mb-3 text-lg">Full Name *</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-white border-2 border-gray-200 rounded-2xl pl-14 pr-4 py-4 text-gray-800 text-lg placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                          placeholder="Your full name"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-gray-700 font-semibold mb-3 text-lg">Email Address *</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-white border-2 border-gray-200 rounded-2xl pl-14 pr-4 py-4 text-gray-800 text-lg placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                          placeholder="your@email.com"
                        />
                      </div>
                    </motion.div>

                    {/* Professional Details */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="block text-gray-700 font-semibold mb-3 text-lg">Role</label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full bg-white border-2 border-gray-200 rounded-2xl px-4 py-4 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <option value="">Select your role</option>
                        <option value="content-creator">Content Creator</option>
                        <option value="marketing-manager">Marketing Manager</option>
                        <option value="social-media-manager">Social Media Manager</option>
                        <option value="business-owner">Business Owner</option>
                        <option value="agency-owner">Agency Owner</option>
                        <option value="other">Other</option>
                      </select>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <label className="block text-gray-700 font-semibold mb-3 text-lg">Company</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full bg-white border-2 border-gray-200 rounded-2xl px-4 py-4 text-gray-800 text-lg placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                        placeholder="Your company (optional)"
                      />
                    </motion.div>
                  </div>

                  {/* Interest area */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="block text-gray-700 font-semibold mb-3 text-lg">Primary Interest</label>
                    <select
                      name="interest"
                      value={formData.interest}
                      onChange={handleInputChange}
                      className="w-full bg-white border-2 border-gray-200 rounded-2xl px-4 py-4 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <option value="">What interests you most?</option>
                      <option value="ai-content">AI Content Generation</option>
                      <option value="analytics">Advanced Analytics</option>
                      <option value="automation">Smart Automation</option>
                      <option value="collaboration">Team Collaboration</option>
                      <option value="all">All Features</option>
                    </select>
                  </motion.div>

                  {/* Referral code */}
                  {formData.referredBy && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                    >
                      <label className="block text-gray-700 font-semibold mb-3 text-lg">Referral Code</label>
                      <div className="relative group">
                        <Gift className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-orange-400 group-focus-within:text-orange-500 transition-colors" />
                        <input
                          type="text"
                          name="referredBy"
                          value={formData.referredBy}
                          onChange={handleInputChange}
                          className="w-full bg-orange-50 border-2 border-orange-200 rounded-2xl pl-14 pr-4 py-4 text-gray-800 text-lg placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 shadow-sm hover:shadow-md"
                          placeholder="Referral code"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Submit button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:shadow-2xl text-xl relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Button shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                      animate={{
                        x: ["-100%", "100%"]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    
                    {isLoading ? (
                      <div className="w-7 h-7 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Rocket className="w-6 h-6" />
                        <span>Secure My Exclusive Access</span>
                        <ChevronRight className="w-6 h-6" />
                      </>
                    )}
                  </motion.button>

                  {/* Form footer */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center space-y-6"
                  >
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

                    {/* Exclusive benefits */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                      <div className="flex items-center justify-center mb-4">
                        <Award className="w-6 h-6 text-green-600 mr-3" />
                        <span className="text-green-700 font-bold text-lg">Exclusive Member Benefits:</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-green-600">
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 mr-2" />
                          <span>50% Launch Discount</span>
                        </div>
                        <div className="flex items-center">
                          <Crown className="w-4 h-4 mr-2" />
                          <span>Priority Support</span>
                        </div>
                        <div className="flex items-center">
                          <Zap className="w-4 h-4 mr-2" />
                          <span>Beta Features</span>
                        </div>
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 mr-2" />
                          <span>Lifetime Updates</span>
                        </div>
                      </div>
                    </div>

                    {/* Social proof */}
                    <div className="flex items-center justify-center space-x-6">
                      <div className="flex -space-x-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <motion.div
                            key={i}
                            className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-3 border-white flex items-center justify-center text-white text-sm font-bold shadow-lg"
                            whileHover={{ scale: 1.2, zIndex: 10 }}
                          >
                            {String.fromCharCode(65 + i)}
                          </motion.div>
                        ))}
                      </div>
                      <div className="text-gray-600">
                        <span className="font-bold text-gray-800">2,547+</span> visionaries already joined
                      </div>
                    </div>
                  </motion.div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default Waitlist;