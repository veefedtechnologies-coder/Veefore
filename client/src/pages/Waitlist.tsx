import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
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
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WaitlistFormData {
  name: string;
  email: string;
  referredBy?: string;
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
  const [currentStats, setCurrentStats] = useState({
    totalUsers: 2547,
    earlyAccessSpots: 500,
    averageWaitTime: '2-3 weeks'
  });

  useEffect(() => {
    // Check if user came via referral
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

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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
        // Parse the API response - the user object contains the relevant data
        const userData = data.user;
        const position = await fetch('/api/early-access/stats').then(res => res.json()).then(stats => stats.stats?.totalUsers || 0);
        
        setWaitlistData({
          success: true,
          message: data.message,
          referralCode: userData.referralCode,
          position: position,
          estimatedAccess: '2-3 weeks'
        });
        setIsSubmitted(true);
        toast({
          title: "Welcome to VeeFore!",
          description: "You've successfully joined our exclusive waitlist.",
        });
      } else {
        toast({
          title: "Something went wrong",
          description: data.message || "Please try again later.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Connection error",
        description: "Please check your internet connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferralCode = () => {
    if (waitlistData?.referralCode) {
      navigator.clipboard.writeText(`${window.location.origin}/waitlist?ref=${waitlistData.referralCode}`);
      setCopiedReferral(true);
      toast({
        title: "Referral link copied!",
        description: "Share this link to move up in the waitlist.",
      });
      setTimeout(() => setCopiedReferral(false), 2000);
    }
  };

  if (isSubmitted && waitlistData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-white mb-4"
          >
            You're In!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-white/80 mb-8"
          >
            Welcome to the VeeFore exclusive waitlist. You're in position{' '}
            <span className="font-bold text-blue-300">#{waitlistData.position || '---'}</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-white mb-1">{waitlistData.position || '---'}</div>
              <div className="text-white/60">Your Position</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-white mb-1">{waitlistData.estimatedAccess || '2-3 weeks'}</div>
              <div className="text-white/60">Estimated Access</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-white mb-1">50%</div>
              <div className="text-white/60">Early Bird Discount</div>
            </div>
          </motion.div>

          {waitlistData.referralCode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6"
            >
              <h3 className="text-xl font-bold text-white mb-3">Skip the Line</h3>
              <p className="text-white/70 mb-4">
                Share your referral link and move up for each friend who joins
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={`${window.location.origin}/waitlist?ref=${waitlistData.referralCode}`}
                  readOnly
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm"
                />
                <button
                  onClick={copyReferralCode}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl transition-colors"
                >
                  {copiedReferral ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
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
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105"
            >
              Continue to App
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </button>
            <p className="text-white/60 text-sm">
              Check your email for updates and early access notifications
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">VeeFore</span>
        </motion.div>
        
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setLocation('/signin')}
          className="text-white/80 hover:text-white transition-colors font-medium"
        >
          Sign In
        </motion.button>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] p-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20"
              >
                <Star className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-white/90 text-sm font-medium">Join {currentStats.totalUsers.toLocaleString()}+ creators</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl lg:text-7xl font-bold text-white leading-tight"
              >
                The Future of
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block">
                  Social Media
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-white/80 leading-relaxed max-w-lg"
              >
                Join the exclusive waitlist for VeeFore - the AI-powered platform that's revolutionizing how creators and businesses manage their social media presence.
              </motion.p>
            </div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 gap-4"
            >
              {[
                { icon: Zap, title: 'AI-Powered Content', desc: 'Generate viral content in seconds' },
                { icon: Globe, title: 'Multi-Platform', desc: 'Manage all your accounts in one place' },
                { icon: Rocket, title: 'Advanced Analytics', desc: 'Deep insights to grow your audience' },
                { icon: Shield, title: 'Enterprise Security', desc: 'Bank-level security for your data' }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center space-x-3 text-white/90"
                >
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold">{feature.title}</span>
                    <span className="text-white/60 ml-2">— {feature.desc}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex items-center space-x-8 pt-4"
            >
              <div>
                <div className="text-2xl font-bold text-white">{currentStats.totalUsers.toLocaleString()}</div>
                <div className="text-white/60 text-sm">On Waitlist</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{currentStats.earlyAccessSpots}</div>
                <div className="text-white/60 text-sm">Early Access Spots</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{currentStats.averageWaitTime}</div>
                <div className="text-white/60 text-sm">Average Wait</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Join the Waitlist</h2>
                <p className="text-white/70">Be among the first to experience the future</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-white/5 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-white/5 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  {formData.referredBy && (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Referral Code
                      </label>
                      <input
                        type="text"
                        name="referredBy"
                        value={formData.referredBy}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Referral code (optional)"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Join Waitlist</span>
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <p className="text-white/60 text-sm">
                    By joining, you agree to our{' '}
                    <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </form>

              {/* Social Proof */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-white/20 flex items-center justify-center text-white text-xs font-semibold"
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-white/70 text-sm">
                    <span className="font-medium text-white">2,547+</span> creators already joined
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Waitlist;