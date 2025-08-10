import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { 
  Crown, Clock, Gift, Share2, Copy, Check, Users, TrendingUp, 
  Star, Award, Calendar, ArrowRight, Mail, Trophy, Zap, 
  Target, ChevronRight, ExternalLink, Sparkles, ChartBar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WaitlistUser {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  credits: number;
  status: string;
  joinedAt: string;
  position?: number;
  metadata?: {
    questionnaire?: any;
  };
}

const WaitlistStatus = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<WaitlistUser | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(true);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 1247,
    avgWaitTime: '2-3 weeks',
    launchProgress: 78
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user');
    
    if (userId) {
      fetchUserData(userId);
    } else {
      // Try to get from localStorage or redirect to waitlist
      setLocation('/waitlist');
    }
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      const response = await fetch(`/api/early-access/status/user/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        // Show success modal for 3 seconds
        setTimeout(() => setShowSuccessModal(false), 3000);
      } else {
        toast({
          title: "Error",
          description: "Could not load your waitlist status.",
          variant: "destructive",
        });
        setLocation('/waitlist');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLocation('/waitlist');
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    if (user?.referralCode) {
      const referralUrl = `${window.location.origin}/waitlist?ref=${user.referralCode}`;
      navigator.clipboard.writeText(referralUrl);
      setCopiedReferral(true);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard.",
      });
      setTimeout(() => setCopiedReferral(false), 2000);
    }
  };

  const calculatePosition = () => {
    return user?.id ? parseInt(user.id.slice(-3)) || Math.floor(Math.random() * 999) + 1 : 1;
  };

  // Success Modal Component
  const SuccessModal = () => (
    <AnimatePresence>
      {showSuccessModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Check className="w-8 h-8 text-white" strokeWidth={3} />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-gray-900 mb-2"
            >
              🎉 Welcome to VeeFore!
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 mb-4"
            >
              You've successfully joined our exclusive waitlist! Check out your status below.
            </motion.p>
            
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => setShowSuccessModal(false)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
            >
              View My Status
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  const position = calculatePosition();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <SuccessModal />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">VeeFore</h1>
                <p className="text-sm text-gray-600">Waitlist Status</p>
              </div>
            </div>
            
            <button
              onClick={() => setLocation('/waitlist')}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">Back to Waitlist</span>
              <ExternalLink className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Welcome, {user.name}!</h2>
                <p className="text-blue-100">You're part of something revolutionary</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white/10 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-medium text-blue-100">Your Position</span>
                </div>
                <div className="text-3xl font-bold text-white">#{position}</div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-green-300" />
                  <span className="text-sm font-medium text-blue-100">Est. Wait Time</span>
                </div>
                <div className="text-3xl font-bold text-white">{stats.avgWaitTime}</div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="w-5 h-5 text-purple-300" />
                  <span className="text-sm font-medium text-blue-100">Referrals</span>
                </div>
                <div className="text-3xl font-bold text-white">{user.referralCount}</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Position Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Your Progress</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Queue Position</span>
                  <span className="font-bold text-gray-900">#{position} of {stats.totalUsers}</span>
                </div>
                
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(10, 100 - (position / stats.totalUsers) * 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Joined {new Date(user.joinedAt).toLocaleDateString()}</span>
                  <span className="text-blue-600 font-medium">{Math.max(10, 100 - (position / stats.totalUsers) * 100).toFixed(0)}% ahead</span>
                </div>
              </div>
            </motion.div>

            {/* Referral System */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Skip the Line</h3>
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {user.referralCount} referrals
                </div>
              </div>

              <p className="text-gray-600 mb-6">
                Share your referral link and move up the waitlist for every friend who joins. 
                Each referral moves you up 3 positions!
              </p>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={`${window.location.origin}/waitlist?ref=${user.referralCode}`}
                    readOnly
                    className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700"
                  />
                  <motion.button
                    onClick={copyReferralCode}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    {copiedReferral ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedReferral ? 'Copied!' : 'Copy'}</span>
                  </motion.button>
                </div>
              </div>

              {/* Referral Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">{user.referralCount}</div>
                  <div className="text-sm text-gray-600">Referrals</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{user.referralCount * 3}</div>
                  <div className="text-sm text-gray-600">Positions Up</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">{user.credits}</div>
                  <div className="text-sm text-gray-600">Bonus Credits</div>
                </div>
              </div>
            </motion.div>

            {/* Launch Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Launch Timeline</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Development Progress</span>
                  <span className="font-bold text-purple-600">{stats.launchProgress}%</span>
                </div>
                
                <div className="bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.launchProgress}%` }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {[
                    { phase: "Beta Testing", status: "completed", date: "Dec 2024" },
                    { phase: "Early Access", status: "current", date: "Jan 2025" },
                    { phase: "Public Launch", status: "upcoming", date: "Mar 2025" },
                    { phase: "Mobile App", status: "upcoming", date: "Q2 2025" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === 'completed' ? 'bg-green-500' :
                        item.status === 'current' ? 'bg-blue-500' : 'bg-gray-300'
                      }`} />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.phase}</div>
                        <div className="text-sm text-gray-500">{item.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Benefits</h3>
              
              <div className="space-y-4">
                {[
                  { icon: Gift, title: "50% Launch Discount", desc: "Early bird pricing", color: "green" },
                  { icon: Zap, title: "Priority Support", desc: "24/7 dedicated help", color: "blue" },
                  { icon: Star, title: "Exclusive Features", desc: "Beta access to new tools", color: "purple" },
                  { icon: Trophy, title: "Founder Status", desc: "Special recognition", color: "yellow" }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      benefit.color === 'green' ? 'bg-green-100' :
                      benefit.color === 'blue' ? 'bg-blue-100' :
                      benefit.color === 'purple' ? 'bg-purple-100' : 'bg-yellow-100'
                    }`}>
                      <benefit.icon className={`w-4 h-4 ${
                        benefit.color === 'green' ? 'text-green-600' :
                        benefit.color === 'blue' ? 'text-blue-600' :
                        benefit.color === 'purple' ? 'text-purple-600' : 'text-yellow-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{benefit.title}</div>
                      <div className="text-sm text-gray-600">{benefit.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Community Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Community Stats</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Members</span>
                  <span className="font-bold text-indigo-600">{stats.totalUsers.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Today</span>
                  <span className="font-bold text-green-600">847</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Countries</span>
                  <span className="font-bold text-purple-600">67</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Avg. Referrals</span>
                  <span className="font-bold text-orange-600">2.3</span>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <button
                onClick={() => setLocation('/signin')}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Access Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => {
                  const subject = encodeURIComponent("Check out VeeFore - Revolutionary Social Media Platform!");
                  const body = encodeURIComponent(`Hey! I just joined the waitlist for VeeFore, an amazing new social media management platform. Join me and skip the line with my referral link: ${window.location.origin}/waitlist?ref=${user.referralCode}`);
                  window.open(`mailto:?subject=${subject}&body=${body}`);
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Mail className="w-4 h-4" />
                <span>Share via Email</span>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center py-8"
        >
          <p className="text-gray-600 mb-2">
            Have questions? We're here to help!
          </p>
          <div className="flex items-center justify-center space-x-4">
            <a href="mailto:support@veefore.com" className="text-blue-600 hover:underline">
              Contact Support
            </a>
            <span className="text-gray-300">•</span>
            <a href="/faq" className="text-blue-600 hover:underline">
              FAQ
            </a>
            <span className="text-gray-300">•</span>
            <a href="/updates" className="text-blue-600 hover:underline">
              Latest Updates
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WaitlistStatus;