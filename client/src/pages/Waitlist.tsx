import { useState, useEffect } from 'react';
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
  Star,
  Shield,
  ChevronRight,
  Award,
  CheckCircle,
  Flame
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
          description: "You've been added to the waitlist.",
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-900 mb-3"
          >
            You're on the list!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-8"
          >
            Welcome to VeeFore! Your position is{' '}
            <span className="font-semibold text-blue-600">#{waitlistData.position || '---'}</span>
          </motion.p>

          {/* Status cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <Crown className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">#{waitlistData.position || '---'}</div>
              <div className="text-blue-600/70 text-sm">Position</div>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <Zap className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{waitlistData.estimatedAccess || '2-3 weeks'}</div>
              <div className="text-purple-600/70 text-sm">Estimated Access</div>
            </div>
            
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <Gift className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">50%</div>
              <div className="text-green-600/70 text-sm">Early Discount</div>
            </div>
          </motion.div>

          {/* Referral section */}
          {waitlistData.referralCode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-orange-50 rounded-xl p-6 border border-orange-100 mb-6"
            >
              <div className="flex items-center justify-center mb-3">
                <Flame className="w-5 h-5 text-orange-500 mr-2" />
                <h3 className="font-semibold text-orange-800">Skip the Line</h3>
              </div>
              <p className="text-orange-700 mb-4 text-sm">
                Share your referral link to move up for each friend who joins.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`${window.location.origin}/waitlist?ref=${waitlistData.referralCode}`}
                  readOnly
                  className="flex-1 bg-white border border-orange-200 rounded-lg px-3 py-2 text-sm text-gray-700"
                />
                <button
                  onClick={copyReferralCode}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  {copiedReferral ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedReferral ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </motion.div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <button
              onClick={() => setLocation('/signin')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 mx-auto"
            >
              <Sparkles className="w-5 h-5" />
              Continue to Dashboard
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-gray-500 mt-4 text-sm">
              We'll email you when your access is ready
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">VeeFore</span>
                <div className="text-xs text-gray-500">Social Media Management</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-700 font-medium text-sm">2,547+ joined</span>
              </div>
              
              <button
                onClick={() => setLocation('/signin')}
                className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main waitlist form */}
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"
        >
          {/* Form header */}
          <div className="text-center mb-8">
            <motion.div
              className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
              animate={{ 
                rotate: [0, 2, -2, 0],
                scale: [1, 1.02, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Crown className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Join the Waitlist
            </h1>
            <p className="text-gray-600">
              Get early access to VeeFore and secure your spot
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {formData.referredBy && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <label className="block text-gray-700 font-medium mb-2">
                  Referral Code
                </label>
                <div className="relative">
                  <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-400" />
                  <input
                    type="text"
                    name="referredBy"
                    value={formData.referredBy}
                    onChange={handleInputChange}
                    className="w-full bg-orange-50 border border-orange-200 rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="Referral code"
                  />
                </div>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Join Waitlist</span>
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-gray-500 text-sm mb-4">
                By joining, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700">Terms</a> and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
              </p>

              {/* Benefits */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center justify-center mb-3">
                  <Award className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-green-700 font-medium text-sm">Early Access Benefits:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-green-600">
                  <div className="flex items-center justify-center">
                    <Heart className="w-3 h-3 mr-1" />
                    <span>50% Discount</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Crown className="w-3 h-3 mr-1" />
                    <span>Priority Access</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Zap className="w-3 h-3 mr-1" />
                    <span>Beta Features</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Shield className="w-3 h-3 mr-1" />
                    <span>Premium Support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social proof */}
            <div className="flex items-center justify-center space-x-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="text-gray-600 text-sm">
                <span className="font-semibold text-gray-800">2,547+</span> professionals joined
              </div>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default Waitlist;